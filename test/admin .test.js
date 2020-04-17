const request = require('supertest');
const app = require('../app');
const { Employee } = require('../models')
// const { sequelize } = require('../models');
const { queryInterface } = sequelize;

const registerForm = {
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

describe("Employee Routes", () => {
    beforeAll((done) => {
        Employee
            .create(registerForm)
            .then(admin => {
                let tokenAdmin = admin.tokenAdmin
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

// REGISTER =================================================================================

    // describe('Register Employee', () => {
    //     describe('Register Success', () => {
    //         test('Send object replied with status 201 and json data about new user', (done) => {
    //             request(app)
    //                 .post('/register')
    //                 .send(registerForm)
    //                 .end((err, res) => {
    //                     expect(err).toBe(null)
    //                     expect(res.status).toBe(201)
    //                     expect(res.body).toHaveProperty('name', registerForm.name)
    //                     expect(res.body).toHaveProperty('id', expect.any(Number))
    //                     expect(res.body).toHaveProperty('email', registerForm.email)
    //                     done()
    //                 })
    //         })
    //     })
    //     describe('Register Employee Error', () => {
    //         test('Send wrong form replied with status 400 because required column is empty', (done) => {
    //             let invalidForm = { ...registerForm }
    //             delete invalidForm.password
    //             delete invalidForm.name
    //             delete invalidForm.email
    //             request(app)
    //                 .post('/register')
    //                 .send(invalidForm)
    //                 .end((err, res) => {
    //                     expect(err).toBe(null)
    //                     expect(res.status).toBe(400)
    //                     expect(res.body).toHaveProperty('message', expect.any(String))
    //                     expect(res.body).toHaveProperty('errors', expect.any(Array))
    //                     expect(res.body.errors.length).toBeGreaterThan(0)
    //                     expect(res.body.errors).toContain("Name is required")
    //                     expect(res.body.errors).toContain("Email is required")
    //                     expect(res.body.errors).toContain("Password is required")
    //                     done()
    //                 })
    //         })
    //     })

    //     describe('Register Employee Error', () => {
    //         test('Send wrong form replied with status 400 because invalid format email', (done) => {
    //             let invalidForm = { ...registerForm }
    //             delete invalidForm.password
    //             delete invalidForm.name
    //             delete invalidForm.email
    //             request(app)
    //                 .post('/register')
    //                 .send({
    //                     name: "Andreas Anggara",
    //                     password: 'test',
    //                     email: 'andreas.anggara@emaom',
    //                 })
    //                 .end((err, res) => {
    //                     expect(err).toBe(null)
    //                     expect(res.status).toBe(400)
    //                     expect(res.body).toHaveProperty('message', expect.any(String))
    //                     expect(res.body).toHaveProperty('errors', expect.any(Array))
    //                     expect(res.body.errors.length).toBeGreaterThan(0)
    //                     expect(res.body.errors).toContain("Invalid email format")
    //                     expect(res.body.errors).toContain("Password length must between 6 and 14")
    //                     done()
    //                 })
    //         })
    //     })
    // })

// LOGIN =============================================================================s

    describe('Login Employee', () => {
        describe('Login Success', () => {
            test('Send object replied with status 200 and token', (done) => {
                request(app)
                    .post('/employee/login')
                    .send({
                        email: 'andreas.anggara@email.com',
                        password: '123456'
                    })
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(200)
                        expect(res.body).toHaveProperty('token', expect.any(String))
                        done()
                    })
            })
        })
        
        describe('Login Employee Error', () => {
            test('Send wrong form replied with status 401 because wrong password or wrong email', (done) => {
                request(app)
                    .post('/employee/login')
                    .send({
                        email: 'andreas.anggara@email.com',
                        password: '12'
                    })
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(400)
                        expect(res.body).toHaveProperty('message', expect.any(String))
                        expect(res.body).toHaveProperty('error')
                        expect(res.status.error).toContain('Invalid email / password')
                        done()
                    })
            })
        })
    })
})

