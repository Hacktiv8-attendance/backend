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
            console.log('PASSWORDNYA SALAH')
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
    .catch(err => {
      console.log(err)
      next(err)
    })
  }

  static findAll(req, res, next) {
    Employee.findAll({
      order: ["authLevel"]
    })
      .then(response => {
        res.status(200).json(response)
      })
      .catch(next)
  }


  static addEmployee(req, res, next) {
    const { name, email, password, birthDate, address, phoneNumber, role, paidLeave, superior, authLevel} = req.body
    const newbirthDate = new Date(birthDate)
    Employee.create({
      name, email, password, birthDate: newbirthDate, address, phoneNumber, role, paidLeave, superior, authLevel
    })
      .then(response => {
        const payload = {
          id: response.id,
          name: response.name
        }
        res.status(201).json(payload)
      })
      .catch(next)
  }

  static updateEmployee(req, res, next) {
    const { name, email, password, birthDate, address, phoneNumber, role, paidLeave, superior, authLevel} = req.body

    Employee.update({
      name, email, password, birthDate, address, phoneNumber, role, paidLeave, superior, authLevel
    }, {
      where: {
        id: +req.params.id
      },
      returning: true
    })
      .then(response => {
        if(response) res.status(200).json(response[1][0])
        else {
          next({
            status: 404,
            message: "Employee not found"
          })
        }
      })
      .catch(err => {
        next({
          status: 404,
          message: "Employee not found"
        })
      })
  }

  static deleteEmployee(req, res, next) {
    Employee.destroy({
      where: {
        id: +req.params.id
      }
    })
      .then(response => {
        if(response) res.status(200).json({ message: "Employee Deleted" })
        else next({ status: 404, message: "Employee not found" })
      })
      .catch(next)
  }

  static generateQR(req, res, next) {
    const payload = {
      key: process.env.QRSECRET
    }
    const token = getToken(payload)
    res.status(200).json({token})
  }


}

module.exports = AdminController