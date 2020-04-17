const request = require('supertest');
const app = require('../app');
const { Employee, Absence } = require('../models')
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
    SuperiorID: idAdmin,
    createdAt: new Date(),
    updatedAt: new Date()
}

describe("Absence Routes", () => {
    beforeAll((done) => {
        Employee
            .create(adminData)
            .then(admin => {
                let tokenAdmin = admin.tokenAdmin
                let idAdmin = admin.id
                return Absence.create({
                    EmployeeID: idAdmin,
                    timeStamp: new Date()
                })
            })
            .then(admin => {
                registerForm.SuperiorID = idAdmin
                return Employee.create(registerForm)
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

// GENERATE QR =============================================================================s

    describe('Generate QR', () => {
        describe('Generate QR Success', () => {
            test('Send object replied with status 200 and token', (done) => {
                request(app)
                    .get('/absence/generateQR')
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(200)
                        expect(res.body).toHaveProperty('token', expect.any(String))
                        done()
                    })
            })
        })
        
        describe('Generate QR Error', () => {
            test('Send object replied with status 500 and token', (done) => {
                request(app)
                    .get('/absence/generateQ')
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(500)
                        expect(res.body).toHaveProperty('error')
                        expect(res.body.error).toContain('Internal Server Error')
                        done()
                    })
            })
        })
    })

// ADD EMPLOYEE =================================================================================

    describe('Add Absence Employee', () => {
        describe('Add Absence Employee Success', () => {
            test('Send object replied with status 201 and json data about new employee', (done) => {
                request(app)
                    .post('/absence')
                    .send({
                        EmployeeId : userId,
                        timeStamp: new Date()
                    })
                    // .send(registerForm)
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(201)
                        expect(res.body).toHaveProperty('id', expect.any(Number))
                        expect(res.body).toHaveProperty('name', registerForm.name)
                        done()
                    })
            })
        })


        describe('Add Absence Employee Error', () => {
            test('Send wrong form replied with status 400 because required column is empty', (done) => {
                request(app)
                    .post('/absence')
                    .send({
                        EmployeeId : '',
                        timeStamp: ''
                    })                  
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(400)
                        expect(res.body).toHaveProperty('message', expect.any(String))
                        expect(res.body).toHaveProperty('errors', expect.any(Array))
                        expect(res.body.errors.length).toBeGreaterThan(0)
                        expect(res.body.errors).toContain("EmployeeId is required")
                        expect(res.body.errors).toContain("timeStamp is required")
                        done()
                    })
            })
        })
    })


// FIND ABSENCE  BY EMPLOYEE ID=================================================================================

    describe('Find Absence by Employee ID per month', () => {
        describe('Find Absence by Employee ID per month Success', () => {
            test('Send object replied with status 200 and json data employee', (done) => {
                const date = new Date();  // 2009-11-10
                const month = date.toLocaleString('default', { month: 'long' });
                request(app)
                    .get(`/absence/${idAdmin}/${month}`)
                    .set('token', tokenAdmin)
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(200)
                        expect(res.body).toHaveProperty('employees', expect.any(Array))
                        done()
                    })
            })
        })

        describe('Find Absence by Employee ID', () => {
            test('Send object replied with status 404 and json data about error', (done) => {
                request(app)
                    .get(`/absence/0/month`)
                    .set('token', tokenAdmin)
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(404)
                        expect(res.body).toHaveProperty('error')
                        expect(res.body.employee).toHaveProperty("error", "Data Not Found")
                        done()
                    })
            })
        })
    })


// FIND ABSENCE  BY SUPERIOR ID=================================================================================
    describe('Find Absence by SuperiorID per month', () => {
        describe('Find Absence by SuperiorID per month Success', () => {
            test('Send object replied with status 200 and json data employee', (done) => {
                const date = new Date();  // 2009-11-10
                const month = date.toLocaleString('default', { month: 'long' });
                request(app)
                    .get(`/absence/${idAdmin}/${month}`)
                    .set('token', tokenAdmin)
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(200)
                        expect(res.body).toHaveProperty('employees', expect.any(Array))
                        done()
                    })
            })
        })

        describe('Find Absence by SuperiorID per month', () => {
            describe('Find Absence by SuperiorID per month Success', () => {
                test('Send object replied with status 200 and json data employee', (done) => {
                    const date = new Date();  // 2009-11-10
                    const month = date.toLocaleString('default', { month: 'long' });
                    request(app)
                        .get(`/absence/0/${month}`)
                        .set('token', tokenAdmin)
                        .end((err, res) => {
                            expect(err).toBe(null)
                            expect(res.body).toHaveProperty('error')
                            expect(res.body.employee).toHaveProperty("error", "Data Not Found")
                            done()
                        })
                })
            })
        })
    })
})

