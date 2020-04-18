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
    superior:1,
    createdAt: new Date(),
    updatedAt: new Date()
}

describe("Admin Routes", () => {
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
                    expect(res.status).toBe(401)
                    expect(res.body).toHaveProperty('message')
                    expect(res.status.message).toContain('Email/Password invalid')
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
                    .post('/admin/employee')
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
                request(app)
                    .post('/admin/employee')
                    .set('token', tokenAdmin)
                    .send({})                    
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(400)
                        expect(res.body).toHaveProperty('message', expect.any(String))
                        expect(res.body).toHaveProperty('errors', expect.any(Array))
                        expect(res.body.errors.length).toBeGreaterThan(0)
                        expect(res.body.errors).toContain("Name is required")
                        expect(res.body.errors).toContain("Email is required")
                        expect(res.body.errors).toContain("Password is required")
                        expect(res.body.errors).toContain("BirthDate is Required")
                        expect(res.body.errors).toContain("Address is Required")
                        expect(res.body.errors).toContain("Phone Number is Required")
                        expect(res.body.errors).toContain("Paid Leave is Required")
                        expect(res.body.errors).toContain("Superior is Required")
                        done()
                    })
            })
        })

        describe('Add Employee Error', () => {
            test('Send wrong form replied with status 400 because invalid format email and password less than 6 character', (done) => {
                request(app)
                    .post('/admin/employee')
                    .set('token', tokenAdmin)
                    .send({
                        name: "Student Hacktiv8",
                        password: '1',
                        email: 'mail@mai',
                        birthDate: new Date(21-01-96),
                        address: 'Bogor',
                        phoneNumber: '0812121212',
                        role: 'staff',
                        authLevel: 3,
                        superior:1,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    })
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(400)
                        expect(res.body).toHaveProperty('message', expect.any(String))
                        expect(res.body).toHaveProperty('errors', expect.any(Array))
                        expect(res.body.errors.length).toBeGreaterThan(0)
                        expect(res.body.errors).toContain('Invalid Email Format')
                        expect(res.body.errors).toContain('Password At least 6 characters')
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
                    .get('/admin/employee')
                    .set('token', tokenAdmin)
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(200)
                        expect(res.body.length).toBeGreaterThan(0)
                        expect(res.body).toEqual(expect.any(Array))
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

// UPDATE EMPLOYEE =================================================================================

    describe('Update Employee', () => {
        describe('Update Employee Success', () => {
            test('Send object replied with status 200 and json data about employee', (done) => {
                request(app)
                    .put(`/admin/employees/${userId}`)
                    .set('token', tokenAdmin)
                    .send({
                        name: 'Nama Baru',
                        address: 'Depok',
                        paidLeave: 9
                    })
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(200)
                        expect(res.body).toHaveProperty('id', expect.any(Number))
                        expect(res.body).toHaveProperty('name', expect.any(String))
                        expect(res.body).toHaveProperty('email', expect.any(String))
                        expect(res.body).toHaveProperty('birthDate', expect.any(Date))
                        expect(res.body).toHaveProperty('address', expect.any(String))
                        expect(res.body).toHaveProperty('phoneNumber', expect.any(String))
                        expect(res.body).toHaveProperty('role', expect.any(String))
                        expect(res.body).toHaveProperty('paidLeave', expect.any(Number))
                        done()
                    })
            })
        })

        describe('Update Employee Error', () => {
            test('Send object replied with status 500 Internal Server Error', (done) => {
                request(app)
                    .put('/admin/employees/0')
                    .set('token', tokenAdmin)
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(404)
                        expect(res.body).toHaveProperty('error')
                        expect(res.body.error).toContain('Employee not found')
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
                    .delete(`/admin/employee/${userId}`)
                    .set('token', tokenAdmin)
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(201)
                        expect(res.body).toHaveProperty('message')
                        expect(res.body.message).toContain("Employee Deleted")
                        done()
                    })
            })
        })

        describe('Delete Employee Error', () => {
            test('Send object replied with status 500 Internal Server Error', (done) => {
                request(app)
                    .delete('/admin/employees/0')
                    .set('token', tokenAdmin)
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(404)
                        expect(res.body).toHaveProperty('error')
                        expect(res.body.error).toContain('Employee not found')
                        done()
                    })
            })
        })
    })


// GENERATE QR =================================================================================

    describe('Generate QR', () => {
        describe('Generate QR Success', () => {
            test('Send object replied with status 200 and token', (done) => {
                request(app)
                    .get(`/admin/QR`)
                    .set('token', tokenAdmin)
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(200)
                        expect(res.body).toHaveProperty('payload')
                        expect(res.body.payload).toContain(expect.any(String))
                        done()
                    })
            })
        })

        describe('Generate QR Error', () => {
            test('Send object replied with status 500 Internal Server Error', (done) => {
                request(app)
                    .post('/admin/employees/0')
                    .set('token', tokenAdmin)
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(404)
                        expect(res.body).toHaveProperty('error')
                        expect(res.body.error).toContain('Employee not found')
                        done()
                    })
            })
        })
    })
})