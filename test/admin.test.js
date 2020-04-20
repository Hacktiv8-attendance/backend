const request = require('supertest');
const app = require('../app');
const server = require('../bin/http')
const { Employee } = require('../models')
const { getToken } = require('../helpers/jwt')
const { comparePassword } = require('../helpers/bcrypt')
// const { sequelize } = require('../models');
// const { queryInterface } = sequelize;
let tokenAdmin
let adminId
let userId
const dateBirth = new Date('1996-07-01')
const adminData = {
    name: "Andreas Anggara",
    password: 'admin123',
    email: 'andreas.anggara@email.com',
    birthDate: dateBirth,
    address: 'Bogor',
    phoneNumber: '0812121212',
    role: 'HRD',
    authLevel: 1,
    superior:1,
    authLevel: 1,
    createdAt: new Date(),
    updatedAt: new Date()
}
const registerForm = {
    name: "Student Hacktiv8",
    password: '123456',
    email: 'student@mail.com',
    birthDate: dateBirth,
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
                adminId = admin.id
                return Employee.create({
                    name: 'Staff Tauladan',
                    email: 'staff@email.com',
                    password: '123456',
                    authLevel: 2
                  })
            })
            .then(employee => {
                userId = employee.id
                return Employee.findOne({
                    where: {
                      email: adminData.email
                    }
                  })
            })
            .then(response => {
                if (response) {
                    if (comparePassword(adminData.password, response.password)) {
                        if(response.authLevel === 1) {
                                let payload = {
                                id: response.id,
                                email: response.email,
                                authLevel: response.authLevel
                            }
                            let token = getToken(payload)
                            tokenAdmin = token
                            done()
                        } else {
                            done({
                                status: 401,
                                message: 'Email/Password invalid'
                            })
                        }
                    } else {
                        console.log('PASSWORDNYA SALAH')
                        done({
                            status: 401,
                            message: 'Email/Password invalid'
                        })
                    }
                } else {
                    done({
                        status: 401,
                        message: 'Email/Password invalid'
                    })
                }
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
    // afterEach(() => app.close());

    describe('Login Admin', () => {
        describe('Login Success', () => {
            test('Send object replied with status 200 and token', (done) => {
                request(server)
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
        
        describe('Login Admin Error', () => {
            test('Send wrong form replied with status 401 because wrong password or wrong email', (done) => {
                request(server)
                    .post('/admin/login')
                    .send({
                        email: 'andreas.anggara@email.com',
                        password: '12'
                    })
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(401)
                        expect(res.body).toHaveProperty('message', 'Email/Password invalid')
                        // expect(res.status.message).toContain()
                        done()
                    })
            })
        })

        describe('Login Employee Error', () => {
            test('Send wrong form replied with status 401 because wrong email', (done) => {
                request(server)
                    .post('/admin/login')
                    .send({
                        email: 'staffy@email.com',
                        password: '123456'
                    })
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(401)
                        expect(res.body).toHaveProperty('message', 'Email/Password invalid')
                        // expect(res.status.message).toContain()
                        done()
                    })
            })
        })

        describe('Login Employee Error', () => {
            test('Send wrong form replied with status 401 because user not have access as administrator', (done) => {
                request(server)
                    .post('/admin/login')
                    .send({
                        email: 'staff@email.com',
                        password: '123456'
                    })
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(401)
                        expect(res.body).toHaveProperty('message', "You're not Administrator")
                        // expect(res.status.message).toContain()
                        done()
                    })
            })
        })

        describe('Login Employee Error', () => {
            test('Send wrong form replied with status 401 because wrong email', (done) => {
                request(server)
                    .post('/admin/login')
                    .send({})
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(500)
                        // expect(res.body).toHaveProperty('message', "You're not Administrator")
                        // expect(res.status.message).toContain()
                        done()
                    })
            })
        })
    })

    describe('Add Employee', () => {
        describe('Add Employee Success', () => {
            test('Send object replied with status 201 and json data about new employee', (done) => {
                request(server)
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
                request(server)
                    .post('/admin/employee')
                    .set('token', tokenAdmin)
                    .send({})                    
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(400)
                        expect(res.body).toHaveProperty('message', expect.any(String))
                        expect(res.body).toHaveProperty('errors', expect.any(Array))
                        expect(res.body.errors.length).toBeGreaterThan(0)
                        // expect(res.body.errors).toContain('Email is required')
                        // expect(res.body.errors).toContain('Password is Required')
                        // expect(res.body.errors).toContain('Email is required')
                        // expect(res.body.errors).toContain('Password is required')
                        // expect(res.body.errors).toContain("Email is required")
                        // expect(res.body.errors).toContain("Address is Required")
                        // expect(res.body.errors).toContain("Phone Number is Required")
                        // expect(res.body.errors).toContain("Paid Leave is Required")
                        // expect(res.body.errors).toContain("Superior is Required")
                        done()
                    })
            })
        })

        describe('Add Employee Error', () => {
            test('Send wrong form replied with status 400 because invalid format email and password less than 6 character', (done) => {
                request(server)
                    .post('/admin/employee')
                    .set('token', tokenAdmin)
                    .send({
                        name: "Student Hacktiv8",
                        password: '1',
                        email: 'mail@mai',
                        birthDate: new Date('21-01-96'),
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

    describe('Find All Employee', () => {
        describe('Find Employee Success', () => {
            test('Send object replied with status 200 and json data employee', (done) => {
                request(server)
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

        describe('Find All Employee Error', () => {
            test('Send object replied with status 500 Internal Server Error', (done) => {
                request(server)
                    .get('/admin/employe')
                    .set('token', tokenAdmin)
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(404)
                        // expect(res.body.error).toContain('Internal Server Error')
                        done()
                    })
            })
        })
    })

    describe('Update Employee', () => {
        describe('Update Employee Success', () => {
            test('Send object replied with status 200 and json data about employee', (done) => {
                request(server)
                    .put(`/admin/employee/${userId}`)
                    .set('token', tokenAdmin)
                    .send({
                        name: 'Nama Baru',
                        address: 'Depok',
                        paidLeave: 9,
                        birthDate: new Date()
                    })
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(200)
                        expect(res.body).toHaveProperty('id')
                        expect(res.body).toHaveProperty('name')
                        expect(res.body).toHaveProperty('email')
                        expect(res.body).toHaveProperty('birthDate')
                        expect(res.body).toHaveProperty('address')
                        expect(res.body).toHaveProperty('phoneNumber')
                        expect(res.body).toHaveProperty('role')
                        expect(res.body).toHaveProperty('paidLeave')
                        done()
                    })
            })
        })

        describe('Update Employee Error', () => {
            test('Send object replied with status 500 Internal Server Error', (done) => {
                request(server)
                    .put('/admin/employee/uyfiufi')
                    .set('token', tokenAdmin)
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(404)
                        expect(res.body).toHaveProperty('message')
                        expect(res.body.message).toContain('Employee not found')
                        done()
                    })
            })
        })


        // describe('Update Employee Error', () => {
        //     test('Send object replied with status 404 Line 95', (done) => {
        //         request(server)
        //             .put('/admin/employee/189')
        //             .set('token', tokenAdmin)
        //             .end((err, res) => {
        //                 expect(err).toBe(null)
        //                 expect(res.status).toBe(404)
        //                 expect(res.body).toHaveProperty('message')
        //                 expect(res.body.message).toContain('Employee not found')
        //                 done()
        //             })
        //     })
        // })
    })

    describe('Delete Employee', () => {
        describe('Delete Employee Success', () => {
            test('Send object replied with status 200 and json data about employee', (done) => {
                request(server)
                    .delete(`/admin/employee/${userId}`)
                    .set('token', tokenAdmin)
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(200)
                        // expect(res.body).toHaveProperty('message')
                        // expect(res.body.message).toContain("Employee Deleted")
                        done()
                    })
            })
        })

        // describe('Delete Employee Error', () => {
        //     test('Send object replied with status 500 Internal Server Error', (done) => {
        //         request(server)
        //             .delete('/admin/employees/0')
        //             .set('token', tokenAdmin)
        //             .end((err, res) => {
        //                 expect(err).toBe(null)
        //                 expect(res.status).toBe(404)
        //                 // expect(res.body).toHaveProperty('error')
        //                 // expect(res.body.error).toContain('Employee not found')
        //                 done()
        //             })
        //     })
        // })
    })

    describe('Generate QR', () => {
        describe('Generate QR Success', () => {
            test('Send object replied with status 200 and token', (done) => {
                request(server)
                    .get(`/admin/QR`)
                    .set('token', tokenAdmin)
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(200)
                        expect(res.body).toHaveProperty('token')
                        expect(res.body.token).toEqual(expect.any(String))
                        done()
                    })
            })
        })

        describe('Generate QR Error', () => {
            test('Send object replied with status 500 Internal Server Error', (done) => {
                request(server)
                    .post('/admin/Q')
                    .set('token', tokenAdmin)
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(404)
                        done()
                    })
            })
        })
    })

    describe('Get Absence per Month', () => {
        describe('Get Absence per Month Success', () => {
            test('Send object replied with status 200 and json data employee', (done) => {
                request(server)
                    .get('/admin/absence')
                    .set('token', tokenAdmin)
                    .query({month: ('2020-04-21')})
                    .query({SuperiorId : 1})
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(200)
                        expect(res.body).toEqual(expect.any(Array))
                        done()
                    })
            })
        })

        // describe('Find All Employee Error', () => {
        //     test('Send object replied with status 500 Internal Server Error', (done) => {
        //         request(server)
        //             .get('/admin/employe')
        //             .set('token', tokenAdmin)
        //             .end((err, res) => {
        //                 expect(err).toBe(null)
        //                 expect(res.status).toBe(404)
        //                 // expect(res.body.error).toContain('Internal Server Error')
        //                 done()
        //             })
        //     })
        // })
    })

    describe('Post Message', () => {
        describe('Post Message Success', () => {
            test('Send object replied with status 201 and json data employee', (done) => {
                request(server)
                    .post('/admin/message')
                    .set('token', tokenAdmin)
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(201)
                        expect(res.body).toEqual(expect.any(Array))
                        done()
                    })
            })
        })

        // describe('Find All Employee Error', () => {
        //     test('Send object replied with status 500 Internal Server Error', (done) => {
        //         request(server)
        //             .get('/admin/employe')
        //             .set('token', tokenAdmin)
        //             .end((err, res) => {
        //                 expect(err).toBe(null)
        //                 expect(res.status).toBe(404)
        //                 // expect(res.body.error).toContain('Internal Server Error')
        //                 done()
        //             })
        //     })
        // })
    })

})