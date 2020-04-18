const { Employee, Absence } = require('../models')
const { comparePassword } = require ('../helpers/bcrypt')
const { Op } = require('sequelize')
const moment = require('moment')
const { verify, getToken } = require('../helpers/jwt')
class EmployeeController {
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
            delete response.password
            let payload = {
              id: response.id,
              email: response.email,
              authLevel: response.authLevel
            }
            let token = getToken(payload)
            res.status(200).json({
                token,
                payload: response
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
    })
    .catch(next)
  }
  
  static sendQR(req, res, next) {
    const { jwt, EmployeeId } = req.body
    try {
      const payload = verify(jwt)
      if(payload) {
        if(payload.key === process.env.QRSECRET) {
          Absence.findOne({
            where: {
              EmployeeId,
              in: {
                [Op.gte]: moment().subtract(1, 'days').toDate()
              }
            },
            include: [Employee]
          })
            .then(response => {
              if(response) {
                let status;
                const out = new Date()
                let worktime = moment.duration((moment(out)).diff(moment(response.in)));
                worktime = worktime.hours()
                worktime >= 9 ? status = true : status = false 
                Absence.update({
                  out,
                  worktime,
                  status
                }, {
                  where: {
                    id: response.id
                  },
                  returning: true
                })
                  .then(response => {
                    res.status(200).json({ message: "Absence Updated" })
                  })
              } else {
                Absence.create({
                  EmployeeId,
                })
                  .then(response => {
                    res.status(201).json({ message: "Absence Submitted" })
                  })
              }
            })
        } else res.status(400).json({ message: "Invalid QR CODE" })
      }
    } catch (error) {
      
    }
  }

}

module.exports = EmployeeController