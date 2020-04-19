const { Employee } = require('../models')
const { comparePassword, hashPassword } = require('../helpers/bcrypt')
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
                  authLevel: response.authLevel,
                  name: response.name
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
    .catch(err => {
      next(err)
    })
  }

  static findAll(req, res, next) {
    Employee.findAll({
      order: ["id"]
    })
      .then(response => {
        res.status(200).json(response)
      })
      .catch(next)
  }


  static addEmployee(req, res, next) {
    const { name, email, password, birthDate, address, phoneNumber, role, paidLeave, SuperiorId, authLevel, image_url} = req.body
    const newbirthDate = new Date(birthDate)
    Employee.create({
      name, email, password, birthDate: newbirthDate, address, phoneNumber, role, paidLeave, SuperiorId, authLevel, image_url
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
    const { name, email, birthDate, address, phoneNumber, role, paidLeave, SuperiorId, authLevel, image_url} = req.body
    const password = hashPassword(req.body.password)
    Employee.update({
      name, email, password, birthDate, address, phoneNumber, role, paidLeave, SuperiorId, authLevel, image_url
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
    let payload;
    Employee.findOne({
      where: {
        id: +req.params.id
      }
    })
      .then(response => {
        if(response) {
          payload = response
          return Employee.destroy({
            where: {
              id: +req.params.id
            }
          })
        }
      })
      .then(response => {
        if(payload) res.status(200).json(payload)
        else res.status(404).json({message: "Employee Not Found"})
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

  static uploadImage(req, res, next) {
    res.status(201).json({fileName: req.file})
  }
}

module.exports = AdminController