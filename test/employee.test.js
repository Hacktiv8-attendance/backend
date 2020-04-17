const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');
const { queryInterface } = sequelize;

const registerForm = {
    name: "Andreas Anggara",
    password: '123456',
    email: 'andreas.anggara@email.com',
    birthDate: new Date(),
    address: 'Bogor',
    phoneNumber: '123124124',
    role: 'Staff',
    superior: 1,
    authLevel: 5
}

describe("Employee Routes", () => {
    // beforeAll((done) => {
    //     queryInterface.bulkInsert('Employee', [registerForm])
    //       .then(_ => {
    //         done()
    //       })
    //       .catch(err => done(err))
    // })
    afterAll((done) => {
        queryInterface.bulkDelete('Employees', {})
          .then(_ => {
            done()
          })
          .catch(err => done(err))
    })

// REGISTER =================================================================================

    describe('Register Employee', () => {
        describe('Register Success', () => {
            test('Send object replied with status 201 and json data about new user', (done) => {
                request(app)
                    .post('/register')
                    .send(registerForm)
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(201)
                        expect(res.body).toHaveProperty('name', registerForm.name)
                        expect(res.body).toHaveProperty('id', expect.any(Number))
                        expect(res.body).toHaveProperty('email', registerForm.email)
                        done()
                    })
            })
        })
        describe('Register Employee Error', () => {
            test('Send wrong form replied with status 400 because required column is empty', (done) => {
                let invalidForm = { ...registerForm }
                delete invalidForm.password
                delete invalidForm.name
                delete invalidForm.email
                request(app)
                    .post('/register')
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

        describe('Register Employee Error', () => {
            test('Send wrong form replied with status 400 because invalid format email', (done) => {
                let invalidForm = { ...registerForm }
                delete invalidForm.password
                delete invalidForm.name
                delete invalidForm.email
                request(app)
                    .post('/register')
                    .send({
                        name: "Andreas Anggara",
                        password: 'test',
                        email: 'andreas.anggara@emaom',
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

// LOGIN =============================================================================s

    describe('Login Employee', () => {
        describe('Login Success', () => {
            test('Send object replied with status 200 and token', (done) => {
                request(app)
                    .post('/login')
                    .send({
                        email: 'andreas.anggara@email.com',
                        password: '123456'
                    })
                    .end((err, res) => {
                        expect(err).toBe(null)
                        expect(res.status).toBe(200)
                        expect(res.body).toHaveProperty('access_token', expect.any(String))
                        done()
                    })
            })
        })
        // describe('Login Employee Error', () => {
        //     test('Send wrong form replied with status 400 because required column is empty', (done) => {
        //         let invalidForm = { ...registerForm }
        //         delete invalidForm.password
        //         delete invalidForm.name
        //         delete invalidForm.email
        //         request(app)
        //             .post('/login')
        //             .send({
        //                 email: "",
        //                 password: ""
        //             })
        //             .end((err, res) => {
        //                 expect(err).toBe(null)
        //                 expect(res.status).toBe(400)
        //                 expect(res.body).toHaveProperty('message', expect.any(String))
        //                 expect(res.body).toHaveProperty('errors', expect.any(Array))
        //                 expect(res.body.errors.length).toBeGreaterThan(0)
        //                 expect(res.body.errors).toContain("Email is required")
        //                 expect(res.body.errors).toContain("Password is required")
        //                 done()
        //             })
        //     })
        // })

        describe('Login Employee Error', () => {
            test('Send wrong form replied with status 400 because wrong password or wrong email', (done) => {
                request(app)
                    .post('/login')
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

