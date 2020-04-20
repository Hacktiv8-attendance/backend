const { Employee, Absence, PaidLeave } = require('../models')
const { comparePassword } = require ('../helpers/bcrypt')
const { Op } = require('sequelize')
const moment = require('moment')
const { verify, getToken } = require('../helpers/jwt')
const { hashPassword } = require('../helpers/bcrypt')
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

  static findEmployee(req, res, next) {
    Employee.findAll({
      where: {
        SuperiorId: +req.params.id
      }
    })
      .then(response => res.status(200).json(response))
      .catch(next)
  }
  static requestPaidLeave(req, res, next) {
    const { SuperiorId, reason, leaveDate, duration } = req.body
    PaidLeave.create({
      EmployeeId: +req.decoded.id,
      SuperiorId,
      leaveDate,
      reason,
      duration
    })
      .then(response => {
        res.status(201).json({ message: "PaidLeave Created"})
      })
      .catch(next)
    }

  static findAbsence(req, res, next) {
    Absence.findAll({
      where: {
        EmployeeId: +req.decoded.id,
        in: {
          [Op.gte]: moment().subtract(1, 'month').toDate()
        }
      },
    })
      .then(response => {
        res.status(200).json(response)
      })
      .catch(next)
  }

  static findAbsencePerMonth(req, res, next) {
    const { month } = req.query
    Absence.findAll({
      where: {
        in: {
          [Op.gte]: moment(month).toDate(),
          [Op.lte]: moment(month).add(1, 'month').toDate()
        },
      },
      include: [{
        model: Employee,
        where: {
          SuperiorId: req.decoded.id
        }
      }]
    })
      .then(response => {
        const payload = []
        response.map(el => {
            const found = payload.findIndex(item => item.label === el.Employee.name)
            if(found  !== -1) {
              payload[found]['y'] += 1
            }
            else payload.push({
                label: el.Employee.name,
                y: 1
            })
        })
        res.status(200).json(payload)
      })
  }

  static findPaidLeave(req, res, next) {
    PaidLeave.findAll({
      where: {
        SuperiorId: +req.decoded.id,
        completed: false
      }
    })
      .then(response => {
        res.status(200).json(response)
      })
      .catch(next)
  }
  static updatePaidLeave(req, res, next) {
    const { status } = req.body
    PaidLeave.update({
      status,
      completed: true
    }, {
      where: {
        id: +req.params.id
      },
      returning: true
    })
      .then(response => {
        response = response[1][0]
        let inTime = moment(response.leaveDate).add(9, 'hours').toISOString()
        let outTime = moment(inTime).add(9, 'hours').toISOString()
        const payload = []
        for(let i = 0; i < 4; i ++) {
          payload.push({
            EmployeeId: response.EmployeeId,
            in: inTime,
            out: outTime,
            status: true,
            worktime: 9
          })
          inTime = moment(inTime).add(1, 'day').toISOString()
          outTime = moment(inTime).add(9, 'hours').toISOString()
        }
        if(status) {
          Absence.bulkCreate(payload)
            .then(response => {
              res.status(201).json({ message: "PaidLeave Submitted" })
            })
        } else {
          res.status(200).json({ message: "PaidLeave Rejected" })
        }
      })
      .catch(next)
  }
  
  static resetPassword(req, res, next) {
    const { email, password } = req.body
    const passwordHashed = hashPassword(password)
    Employee
      .findOne({
        where: {
          email
        }
      })
      .then(employee => {
        if (employee) {
          return Employee.update({
            password: passwordHashed
          }, {
            where: {
              id: employee.id
            }, 
            returning: true
          })
        } else {
          next({
            status: 404,
            message: "Employee not found"
          })
        }
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
}

module.exports = EmployeeController