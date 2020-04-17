const request = require('supertest');
const app = require('../app');
const { Employee } = require('../models')
// const { sequelize } = require('../models');
const { queryInterface } = sequelize;

const adminData = {
    name: "Andreas Anggara",
    password: hashPassword('admin123'),
    email: 'andreas.anggara@email.com',
    birthDate: new Date(21-01-96),
    address: 'Bogor',
    phoneNumber: '0812121212',
    role: 'HRD',
    authLevel: 1,
    createdAt: new Date(),
    updatedAt: new Date()
}
const registerForm = {
    name: "Student Hacktiv8",
    password: '123456',
    email: 'student@mail.com',
    birthDate: new Date(21-01-96),
    address: 'Bogor',
    phoneNumber: '0812121212',
    role: 'staff',
    authLevel: 3,
    createdAt: new Date(),
    updatedAt: new Date()
}

describe("Employee Routes", () => {
    beforeAll((done) => {
        Employee
            .create(adminData)
            .then(admin => {
                let tokenAdmin = admin.tokenAdmin
                let idAdmin = admin.id
                return Employee.create({
                    name: 'Staff Tauladan',
                    email: 'staff@email.com',
                    password: '123456'
                })
            })
            .then(user => {
                let userId = user.id
                done()

            })
            .catch(err => done(err))
    })
    afterAll((done) => {
        Employee
            .destroy({
                where: {}
            })
            .then(response => {
                done()
            })
            .catch(err => done(err))
    })

// LOGIN =============================================================================s

describe('Login Admin', () => {
    describe('Login Success', () => {
        test('Send object replied with status 200 and token', (done) => {
            request(app)
                .post('/admin/login')
                .send({
                    email: 'andreas.anggara@email.com',
                    password: 'admin123'
                })
                .end((err, res) => {
                    expect(err).toBe(null)
                    expect(res.status).toBe(200)
                    expect(res.body).toHaveProperty('token', expect.any(String))
                    expect(res.body).toHaveProperty('payload')
                    expect(res.body.payload).toHaveProperty('id')
                    expect(res.body.payload).toHaveProperty('email')
                    expect(res.body.payload).toHaveProperty('authLevel')
                    done()
                })
        })
    })
    
    describe('Login Employee Error', () => {
        test('Send wrong form replied with status 401 because wrong password or wrong email', (done) => {
            request(app)
                .post('/admin/login')
                .send({
                    email: 'andreas.anggara@email.com',
                    password: '12'
                })
                .end((err, res) => {
                    expect(err).toBe(null)
                    expect(res.status).toBe(400)
                    expect(res.body).toHaveProperty('message', expect.any(String))
                    expect(res.body).toHaveProperty('error')
                    expect(res.status.error).toContain('Email/Password invalid')
                    done()
                })
        })
    })
})

// ADD EMPLOYEE =================================================================================

    describe('Add Employee', () => {
        describe('Add Employee Success', () => {
            test('Send object replied with status 201 and json data about new employee', (done) => {
                request(app)
                    .post('/admin/addEmployee')
                    .set('token', tokenAdmin)
                    .send(registerForm)
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(201)
                        expect(res.body).toHaveProperty('id', expect.any(Number))
                        expect(res.body).toHaveProperty('name', registerForm.name)
                        done()
                    })
            })
        })
        describe('Add Employee Error', () => {
            test('Send wrong form replied with status 400 because required column is empty', (done) => {
                let invalidForm = { ...registerForm }
                delete invalidForm.password
                delete invalidForm.name
                delete invalidForm.email
                request(app)
                    .post('/admin/addEmployee')
                    .set('token', tokenAdmin)
                    .send(invalidForm)                    
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(400)
                        expect(res.body).toHaveProperty('message', expect.any(String))
                        expect(res.body).toHaveProperty('errors', expect.any(Array))
                        expect(res.body.errors.length).toBeGreaterThan(0)
                        expect(res.body.errors).toContain("Name is required")
                        expect(res.body.errors).toContain("Email is required")
                        expect(res.body.errors).toContain("Password is required")
                        done()
                    })
            })
        })

        describe('Add Employee Error', () => {
            test('Send wrong form replied with status 400 because invalid format email', (done) => {
                request(app)
                    .post('/admin/addEmployee')
                    .set('token', tokenAdmin)
                    .send({
                        name: "Student Hacktiv8",
                        email: 'student@mail',
                        password: '156'
                    })
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(400)
                        expect(res.body).toHaveProperty('message', expect.any(String))
                        expect(res.body).toHaveProperty('errors', expect.any(Array))
                        expect(res.body.errors.length).toBeGreaterThan(0)
                        expect(res.body.errors).toContain("Invalid email format")
                        expect(res.body.errors).toContain("Password length must between 6 and 14")
                        done()
                    })
            })
        })
    })


// FIND ALL EMPLOYEE =================================================================================

    describe('Find All Employee', () => {
        describe('Find Employee Success', () => {
            test('Send object replied with status 200 and json data employee', (done) => {
                request(app)
                    .get('/admin/employees')
                    .set('token', tokenAdmin)
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(200)
                        expect(res.body).toHaveProperty('employees', expect.any(Array))
                        expect(res.body.employee.length).toBeGreaterThan(0)
                        done()
                    })
            })
        })

        describe('Find All Employee Success', () => {
            test('Send object replied with status 500 Internal Server Error', (done) => {
                request(app)
                    .get('/admin/employe')
                    .set('token', tokenAdmin)
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(500)
                        expect(res.body.error).toContain('Internal Server Error')
                        done()
                    })
            })
        })
    })

// FIND ONE EMPLOYEE =================================================================================

    describe('Find One Employee', () => {
        describe('Find One Employee Success', () => {
            test('Send object replied with status 200 and json data about employee', (done) => {
                request(app)
                    .get(`/admin/employees/${tokenAdmin}`)
                    .set('token', tokenAdmin)
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(201)
                        expect(res.body).toHaveProperty('id', expect.any(Number))
                        expect(res.body).toHaveProperty('name', expect.any(String))
                        expect(res.body).toHaveProperty('email', expect.any(String))
                        expect(res.body).toHaveProperty('birthDate', expect.any(Date))
                        expect(res.body).toHaveProperty('address', expect.any(String))
                        expect(res.body).toHaveProperty('phoneNumber', expect.any(String))
                        expect(res.body).toHaveProperty('role', expect.any(String))
                        expect(res.body).toHaveProperty('authLevel', expect.any(Number))
                        done()
                    })
            })
        })

        describe('Find One Employee Errpr', () => {
            test('Send object replied with status 500 Internal Server Error', (done) => {
                request(app)
                    .get('/admin/employees/0')
                    .set('token', tokenAdmin)
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(404)
                        expect(res.body).toHaveProperty('error')
                        expect(res.body.error).toContain('Data not found')
                        done()
                    })
            })
        })
    })

// UPDATE EMPLOYEE =================================================================================

    describe('Update Employee', () => {
        describe('Update Employee Success', () => {
            test('Send object replied with status 200 and json data about employee', (done) => {
                request(app)
                    .put(`/admin/employees/${tokenAdmin}`)
                    .set('token', tokenAdmin)
                    .send({
                        name: 'Nama Baru',
                        address: 'Depok'
                    })
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(201)
                        expect(res.body).toHaveProperty('id', expect.any(Number))
                        expect(res.body).toHaveProperty('name', expect.any(String))
                        expect(res.body).toHaveProperty('email', expect.any(String))
                        expect(res.body).toHaveProperty('birthDate', expect.any(Date))
                        expect(res.body).toHaveProperty('address', expect.any(String))
                        expect(res.body).toHaveProperty('phoneNumber', expect.any(String))
                        expect(res.body).toHaveProperty('role', expect.any(String))
                        expect(res.body).toHaveProperty('authLevel', expect.any(Number))
                        done()
                    })
            })
        })

        // describe('Update Employee Error', () => {
        //     test('Send object replied with status 500 Internal Server Error', (done) => {
        //         request(app)
        //         .put('/admin/employees/:id')
        //         .send({
        //             name: 'Nama Baru',
        //             address: 'Depok'
        //         })
        //         .set('token', tokenAdmin)
        //         .end((err, res) => {
        //             expect(err).toBe(null)
        //             expect(res.status).toBe(201)
        //             expect(res.body).toHaveProperty('id', expect.any(Number))
        //             expect(res.body).toHaveProperty('name', expect.any(String))
        //             expect(res.body).toHaveProperty('email', expect.any(String))
        //             expect(res.body).toHaveProperty('birthDate', expect.any(Date))
        //             expect(res.body).toHaveProperty('address', expect.any(String))
        //             expect(res.body).toHaveProperty('phoneNumber', expect.any(String))
        //             expect(res.body).toHaveProperty('role', expect.any(String))
        //             expect(res.body).toHaveProperty('authLevel', expect.any(Number))
        //             done()
        //         })
        //     })
        // })

        describe('Update Employee Error', () => {
            test('Send object replied with status 500 Internal Server Error', (done) => {
                request(app)
                    .post('/admin/employees/0')
                    .set('token', tokenAdmin)
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(404)
                        expect(res.body).toHaveProperty('error')
                        expect(res.body.error).toContain('Data not found')
                        done()
                    })
            })
        })
    })


// DELETE EMPLOYEE =================================================================================

    describe('Delete Employee', () => {
        describe('Delete Employee Success', () => {
            test('Send object replied with status 200 and json data about employee', (done) => {
                request(app)
                    .delete(`/admin/employees/${userId}`)
                    .set('token', tokenAdmin)
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(201)
                        expect(res.body).toHaveProperty('id', expect.any(Number))
                        expect(res.body).toHaveProperty('name', expect.any(String))
                        expect(res.body).toHaveProperty('email', expect.any(String))
                        expect(res.body).toHaveProperty('birthDate', expect.any(Date))
                        expect(res.body).toHaveProperty('address', expect.any(String))
                        expect(res.body).toHaveProperty('phoneNumber', expect.any(String))
                        expect(res.body).toHaveProperty('role', expect.any(String))
                        expect(res.body).toHaveProperty('authLevel', expect.any(Number))
                        done()
                    })
            })
        })
        
        describe('Delete Employee Error', () => {
            test('Send object replied with status 500 Internal Server Error', (done) => {
                request(app)
                    .post('/admin/employees/0')
                    .set('token', tokenAdmin)
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(404)
                        expect(res.body).toHaveProperty('error')
                        expect(res.body.error).toContain('Data not found')
                        done()
                    })
            })
        })
    })



})
