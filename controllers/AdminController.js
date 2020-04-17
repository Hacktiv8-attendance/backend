const { Employee } = require('../models')
const { comparePassword } = require('../helpers/bcrypt')
const { getToken } = require('../helpers/jwt')
class AdminController {
  static login(req, res, next) {
    const { email, password } = req.body
    Employee.findOne({
      where: {
        email
      }
    })
    .then(response => {
      if (response) {
          if (comparePassword(password, response.password)) {
              if(response.authLevel === 1) {
                let payload = {
                  id: response.id,
                  email: response.email,
                  authLevel: response.authLevel
                }
                let token = getToken(payload)
                res.status(200).json({
                    token,
                    payload
                })
              } else {
                next({
                  status: 401,
                  message: 'Email/Password invalid'
              })
              }
          } else {
              next({
                  status: 401,
                  message: 'Email/Password invalid'
              })
          }
      } else {
          next({
              status: 401,
              message: 'Email/Password invalid'
          })
      }
  })
  .catch(next)
  }
}

module.exports = AdminController