const request = require('supertest');
const app = require('../app');
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

// LOGIN =============================================================================s

    describe('Login Employee', () => {
        describe('Login Success', () => {
            test('Send object replied with status 200 and token', (done) => {
                request(app)
                    .post('/employee/login')
                    .send({
                        email: 'mail@mail.com',
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

