const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');
const { queryInterface } = sequelize;

const registerForm = {
    name: "Andreas Anggara",
    password: 'test',
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
    describe('Register Employee', () => {
        describe('Success', () => {
            test('Send object replied with status 200 and token', (done) => {
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
        describe('Error', () => {
            test('Send wrong form replied with status 400 because missing name', (done) => {
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
                        done()
                    })
            })
        })
    })
})