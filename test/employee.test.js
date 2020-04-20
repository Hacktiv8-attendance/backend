// const server = require('../server')
require('dotenv').config()
const server = require('../bin/http')
const request = require('supertest')
const { getToken } = require('../helpers/jwt')
const { Employee, Absence, PaidLeave } = require('../models')
const { sequelize } = require('../models');
const { queryInterface } = sequelize;
const axios = require('axios')

const registerForm = {
    name: "Andreas Anggara",
    password: '123456',
    email: 'mail@mail.com',
    birthDate: new Date('1996-07-20'),
    address: 'Bogor',
    phoneNumber: '123124124',
    role: 'Staff',
    // SuperiorId: 1,
    authLevel: 3
}
const registerFormTwo = {
    name: "Tamara Zulaika",
    password: '123456',
    email: 'email@email.com',
    birthDate: new Date('1996-07-20'),
    address: 'Bogor',
    phoneNumber: '123124124',
    role: 'Staff',
    // SuperiorId: 1,
    authLevel: 3
}

let tokenUser
let tokenUserTwo
let tokenGenerateQR
let fakeToken 
let userId
let paidLeaveId

describe("Employee Routes", () => {
    beforeAll((done) => {
        Employee
            .create(registerForm)
            .then(employee => {
                return Employee.findOne({
                    where: {
                        email: employee.email
                    }
                })
            })
            .then(employee => {
                let payload = {
                    id: employee.id,
                    email: employee.email
                }
                tokenUser = getToken(payload)
                tokenGenerateQR = getToken({
                    key: process.env.QRSECRET
                })
                fakeToken = getToken({
                    key: 'faketoken'
                }) 
                userId = employee.id
                return Employee.create(registerFormTwo)
                // done()
            })
            .then(employee => {
                let payload = {
                    id: employee.id,
                    email: employee.email
                }
                tokenUserTwo = getToken(payload)
                userIdTwo = employee.id
                return Absence.create({
                    EmployeeId: userIdTwo
                })
            })
            .then(absence => {
                return PaidLeave.create({
                    EmployeeId: userIdTwo,
                    SuperiorId: 1,
                    leaveDate: new Date('2020-04-20'),
                    reason: 'honeymoon',
                    duration: 4
                })
            })
            .then(paidLeave => {
                paidLeaveId = paidLeave.id
                console.log(paidLeaveId, 'INI ID PAID LEAVE')
                // console.log(absence)
                done()
            })
            // .then(employee => {
            //     done()
            // })
            .catch(err => done(err))
    })
    afterAll((done) => {
        queryInterface.bulkDelete('Employees', {})
          .then(_ => {
            // done()
            // app.close()
            return queryInterface.bulkDelete('PaidLeaves', {})
          })
          .then(_ => {
              done()
          })
          .catch(err => done(err))
    })
    // afterEach(() => app.close());

    describe('Login Employee', () => {
        describe('Login Success', () => {
            test('Send object replied with status 200 and token', (done) => {
                request(server)
                    .post('/employee/login')
                    .send({
                        email: 'mail@mail.com',
                        password: '123456'
                    })
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(200)
                        expect(res.body).toHaveProperty('token', expect.any(String))
                        expect(res.body).toHaveProperty('payload')
                        expect(res.body.payload).toHaveProperty('id', expect.any(Number))
                        expect(res.body.payload).toHaveProperty('email', expect.any(String))
                        expect(res.body.payload).toHaveProperty('authLevel', expect.any(Number))
                        done()
                    })
            })
        })
        
        describe('Login Employee Error', () => {
            test('Send wrong form replied with status 401 because wrong password or wrong email', (done) => {
                request(server)
                    .post('/employee/login')
                    .send({
                        email: 'andreas.anggara@email.com',
                        password: '12'
                    })
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(401)
                        expect(res.body).toHaveProperty('message', "Email/Password invalid")
                        done()
                    })
            })
        })

        describe('Login Employee Error', () => {
            test('Send wrong form replied with status 401 because wrong password or wrong email', (done) => {
                request(server)
                    .post('/employee/login')
                    .send({
                        email: 'mail@mail.com',
                        password: '12345678'
                    })
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(401)
                        expect(res.body).toHaveProperty('message', "Email/Password invalid")
                        done()
                    })
            })
        })
    })

    describe('Send QR Employee', () => {
        describe('Send QR for create absence success', () => {
            test('Send object replied with status 201 and message', (done) => {
                request(server)
                    .post('/employee/sendQR')
                    .set('token', tokenUser)
                    .send({
                        jwt: tokenGenerateQR,
                        EmployeeId: userId
                    })
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(201)
                        expect(res.body).toHaveProperty('message', "Absence Submitted")
                        done()
                    })
            })
        })

        describe('Send QR for update absence success', () => {
            test('Send object replied with status 200 and message', (done) => {
                request(server)
                    .post('/employee/sendQR')
                    .set('token', tokenUserTwo )
                    .send({
                        jwt: tokenGenerateQR,
                        EmployeeId: userIdTwo
                    })
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(200)
                        expect(res.body).toHaveProperty('message', "Absence Updated")
                        done()
                    })
            })
        })
        
        describe('Send QR  Error', () => {
            test('Send wrong invalid qr code and response status 400', (done) => {
                request(server)
                    .post('/employee/sendQR')
                    .set('token', tokenUser )
                    .send({
                        jwt: fakeToken,
                        EmployeeId: userId
                    })
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(400)
                        expect(res.body).toHaveProperty('message',  "Invalid QR CODE" )
                        done()
                    })
            })
        })
    })

    describe('Absence Employee', () => {
        describe('Absence Employee Success', () => {
            test('Send object replied with status 200 and array of employee', (done) => {
                request(server)
                    .get('/employee/absence')
                    .set('token', tokenUser)
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(200)
                        expect(res.body).toEqual(expect.any(Array))
                        done()
                    })
            })
        })
        
        describe('Absence Employee Error', () => {
            test('Send wrong form replied with status 401 because wrong password or wrong email', (done) => {
                request(server)
                    .post('/employee/absence')
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(401)
                        expect(res.body).toHaveProperty('message', "Please Login First!")
                        // expect(res.body).toHaveProperty('error', 'Email/Password invalid')
                        done()
                    })
            })
        })
    })

    describe('Paid Leave Create and Update', () => {
        describe('Paid Leave Created Success', () => {
            test('Send object replied with status 201 and array of employee', (done) => {
                request(server)
                    .post('/employee/paidLeave')
                    .set('token', tokenUser)
                    .send({
                        EmployeeId: userId,
                        SuperiorId: 1,
                        leaveDate: '2020-04-20',
                        reason: 'honey moon',
                        duration: 4
                    })
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(201)
                        expect(res.body).toHaveProperty('message')
                        expect(res.body.message).toEqual("PaidLeave Created")
                        done()
                    })
            })
        })

        describe('Paid Leave Updated Success', () => {
            test('Send wrong form replied with status 201 and submitted message', (done) => {
                request(server)
                    .put('/employee/paidLeave/' + paidLeaveId)
                    .set('token', tokenUserTwo)
                    .send({
                        status: true
                    })
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(201)
                        expect(res.body).toHaveProperty('message', "PaidLeave Submitted")
                        done()
                    })
            })
        })

        describe('Paid Leave Updated Success', () => {
            test('Send wrong form replied with status 200 because status is false', (done) => {
                request(server)
                    .put('/employee/paidLeave/' + paidLeaveId)
                    .set('token', tokenUserTwo)
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(200)
                        expect(res.body).toHaveProperty('message', "PaidLeave Rejected")
                        done()
                    })
            })
        })

        // describe('Paid Leave Updated Success', () => {
        //     test('Send wrong form replied with status 500 because data is null', (done) => {
        //         request(server)
        //             .post('/employee/paidLeave')
        //             .set('token', tokenUser)
        //             .send({
        //                 EmployeeId: 0,
        //                 SuperiorId: 0,
        //                 leaveDate: new Date(),
        //                 reason: '',
        //                 duration: 0
        //             })
        //             .end((err, res) => {
        //                 expect(err).toBe(null)
        //                 expect(res.status).toBe(201)
        //                 expect(res.body).toHaveProperty('message', "Please Login First!")
        //                 // expect(res.body).toHaveProperty('error', 'Email/Password invalid')
        //                 done()
        //             })
        //     })
        // })
        
        describe('Paid Leave Error', () => {
            test('Send wrong form replied with status 401 because user not login yet', (done) => {
                request(server)
                    .post('/employee/paidLeave')
                    .send({
                        EmployeeId: userId,
                        SuperiorId: 1,
                        leaveDate: new Date('2020-04-20'),
                        reason: 'honey moon',
                        duration: 4
                    })
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(401)
                        expect(res.body).toHaveProperty('message', "Please Login First!")
                        // expect(res.body).toHaveProperty('error', 'Email/Password invalid')
                        done()
                    })
            })
        })

    })

    describe('Staff Find Absence', () => {
        describe('Staff absence success', () => {
            test('Send object replied with status 200 and array of employee', (done) => {
                request(server)
                    .get('/employee/absence')
                    .set('token', tokenUser)
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(200)
                        expect(res.body).toEqual(expect.any(Array))
                        // expect(res.body.message).toEqual("PaidLeave Created")
                        // expect(res.body.payload).toHaveProperty('email', expect.any(String))
                        // expect(res.body.payload).toHaveProperty('authLevel', expect.any(Number))
                        done()
                    })
            })
        })


    })

    describe('Find Email Employee', () => {
        describe('Find Email Employee Success', () => {
            test('Send object replied with status 200 and array of employee', (done) => {
                request(server)
                    .post('/employee/findEmail')
                    .send({
                        email: 'mail@mail.com'
                    })
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(200)
                        // expect(res.body).toHaveProperty('nama')
                        // expect(res.body).toHaveProperty("SuperiorId")
                        done()
                    })
            })
        })

        describe('Find Email Employee Failed', () => {
            test('Send object replied with status 404 and error message', (done) => {
                request(server)
                    .post('/employee/findEmail')
                    .send({
                        email: 'mail@mail.co'
                    })
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(404)
                        expect(res.body).toHaveProperty("message", "Employee not found")
                        done()
                    })
            })
        })

        describe('Find Email Employee Failed', () => {
            test('Send object replied with status 404 and error message', (done) => {
                request(server)
                    .post('/employee/findEmail')
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(404)
                        expect(res.body).toHaveProperty("message", "Employee not found")
                        done()
                    })
            })
        })
    })

    describe('Find Staff Absence per Month', () => {
        describe('Find Staff Absence Success', () => {
            test('Replied with status 200', (done) => {
                request(server)
                    .get('/employee/staffabsence')
                    .set('token', tokenUser)
                    .query({ month: '2020-04-20'})
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(200)
                        expect(res.body).toEqual(expect.any(Object))
                        // expect(res.body).toHaveProperty("SuperiorId")
                        done()
                    })
            })
        })
    })

    describe('Reset Password Employee', () => {
        describe('Reset Password Success', () => {
            test('Replied with status 200', (done) => {
                request(server)
                    .post('/employee/resetPassword')
                    .send({
                        email: 'mail@mail.com',
                        password: '1234567890'
                    })
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(200)
                        expect(res.body).toEqual(expect.any(Object))
                        // expect(res.body).toHaveProperty("SuperiorId")
                        done()
                    })
            })
        })

        describe('Reset Password Error because wrong email', () => {
            test('Replied with status 200', (done) => {
                request(server)
                    .post('/employee/resetPassword')
                    .send({
                        email: 'mail@gmail.com',
                        password: '1234567890'
                    })
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(404)
                        expect(res.body).toHaveProperty("message", "Employee not found")
                        // expect(res.body).toHaveProperty("SuperiorId")
                        done()
                    })
            })
        })

        describe('Reset Password Error because wrong email', () => {
            test('Replied with status 200', (done) => {
                request(server)
                    .post('/employee/resetPassword')
                    .send({
                        email: '',
                        password: ''
                    })
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(404)
                        expect(res.body).toHaveProperty("message", "Employee not found")
                        // expect(res.body).toHaveProperty("SuperiorId")
                        done()
                    })
            })
        })
    })
})

