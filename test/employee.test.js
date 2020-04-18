// const server = require('../server')
const server = require('../bin/http')
const request = require('supertest')
const { Employee } = require('../models')
const { sequelize } = require('../models');
const { queryInterface } = sequelize;

const registerForm = {
    name: "Andreas Anggara",
    password: '123456',
    email: 'mail@mail.com',
    birthDate: new Date(),
    address: 'Bogor',
    phoneNumber: '123124124',
    role: 'Staff',
    superior: 1,
    authLevel: 5
}

describe("Employee Routes", () => {
    beforeAll((done) => {
        Employee
            .create(registerForm)
            .then(employee => {
                done()
            })
            .catch(err => done(err))
    })
    afterAll((done) => {
        queryInterface.bulkDelete('Employees', {})
          .then(_ => {
            done()
          })
          .catch(err => done(err))
    })

// LOGIN =============================================================================s

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
                        // expect(res.body).toHaveProperty('error', 'Email/Password invalid')
                        done()
                    })
            })
        })
    })

// LOGIN =============================================================================s

    // describe('Send QR Employee', () => {
    //     describe('Send QR for second time Success', () => {
    //         test('Send object replied with status 200 and message', (done) => {
    //             request(server)
    //                 .post('/employee/QR')
    //                 .send({
    //                     email: 'mail@mail.com',
    //                     password: '123456'
    //                 })
    //                 .end((err, res) => {
    //                     expect(err).toBe(null)
    //                     expect(res.status).toBe(200)
    //                     expect(res.body).toHaveProperty('message', "Absence Updated")
    //                     done()
    //                 })
    //         })
    //     })

    //     describe('Send QR for first time Success', () => {
    //         test('Send object replied with status 200 and message', (done) => {
    //             request(server)
    //                 .post('/employee/QR')
    //                 .send({
    //                     email: 'mail@mail.com',
    //                     password: '123456'
    //                 })
    //                 .end((err, res) => {
    //                     expect(err).toBe(null)
    //                     expect(res.status).toBe(201)
    //                     expect(res.body).toHaveProperty('message', "Absence Submitted")
    //                     done()
    //                 })
    //         })
    //     })
        
    //     describe('Login Employee Error', () => {
    //         test('Send wrong form replied with status 401 because wrong password or wrong email', (done) => {
    //             request(server)
    //                 .post('/employee/login')
    //                 .send({
    //                     email: 'andreas.anggara@email.com',
    //                     password: '12'
    //                 })
    //                 .end((err, res) => {
    //                     expect(err).toBe(null)
    //                     expect(res.status).toBe(400)
    //                     expect(res.body).toHaveProperty('message', expect.any(String))
    //                     expect(res.body).toHaveProperty('error', 'Email/Password invalid')
    //                     done()
    //                 })
    //         })
    //     })
    // })
})

