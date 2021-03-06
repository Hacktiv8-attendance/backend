const { Employee, Absence, PaidLeave } = require('../models')
const { comparePassword } = require ('../helpers/bcrypt')
const { Op } = require('sequelize')
const moment = require('moment')
const { verify, getToken } = require('../helpers/jwt')
const { hashPassword } = require('../helpers/bcrypt')
const emailSend = require('../helpers/email')

class EmployeeController {
  static login(req, res, next) {
    const { email, password } = req.body
    Employee.findOne({
      where: {
        email: email.toLowerCase()
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
      // if(payload) {
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
                // worktime >= 9 ? status = true : status = false 
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
                  in: new Date()
                })
                  .then(response => {
                    res.status(201).json({ message: "Absence Submitted" })
                  })
              }
            })
        } else res.status(400).json({ message: "Invalid QR CODE" })
      // }
    } catch (error) {
      
    }
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
        return Employee.findOne({
          where: {
            id: +response.EmployeeId
          },
          include: [{
            model: Employee,
            as: "Superior"
          }]
        })
      })
      .then(response => {
        const body = {
          from: '"HRQ Company" <hacktiv8company@gmail.com',
          to: response.Superior.email,
          subject: 'Request Paid Leave',
          html: `
          <p>Dear, ${response.Superior.name}</p><br/>

          <p>${response.name} is requesting paid leave because of ${reason} at ${moment(leaveDate).format("L")} for ${duration} day(s) </p><br/>
          
          <p>Please confirm the paid leave at HRQ Application immediately.</p>

          Sincerely,<br/><br/><br/><br/>

          HRD Team<br/><br/>
          
          <img alt="HRQ Company Logo" src="https://photos-hrq-upload.s3-ap-southeast-1.amazonaws.com/upload/HRQ_100.png"/>
          `
        }
        emailSend.sendMail(body, (error, info) => {
          /*istanbul ignore next */
          if(error) throw new Error(error)
        })
        
        res.status(201).json({ message: "PaidLeave Created"})
      })
      .catch(next)
    }

  static findAbsence(req, res, next) {
    Absence.findAll({
      where: {
        EmployeeId: +req.decoded.id,
        in: {
          [Op.gte]: moment(moment(new Date()).format('YYYY-MM')).toDate()
        }
      },
    })
      .then(response => {
        res.status(200).json(response)
      })
      .catch(next)
  }

  static findOne (req, res, next) {
    const { email } = req.body
    Employee
      .findOne({
        where: {
          email
        }
      })
      .then(employee => {
        if (employee) {
          res.status(200).json(employee)
        } else {
          next({
              status: 404,
              message: "Employee not found"
          })
        }
      })
      .catch( err => {
          next({
            status: 404,
            message: "Employee not found"
          })
      })
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
            // const found = payload.findIndex(item => item.label === el.Employee.name)
            // if(found  !== -1) {
            //   payload[found]['y'] += 1
            // }
            // else payload.push({
            //     label: el.Employee.name,
            //     y: 1
            // })
        })
        res.status(200).json(payload)
      })
  }

  static findPaidLeave(req, res, next) {
    PaidLeave.findAll({
      where: {
        SuperiorId: +req.decoded.id
      },
      include: [Employee]
    })
      .then(response => {
        res.status(200).json(response)
      })
      .catch(next)
  }

  static updatePaidLeave(req, res, next) {
    const { status } = req.body
    let duration;
    let EmployeeId;
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
        /*istanbul ignore next */
        if(response[1][0]) {
          response = response[1][0]
          duration = response.duration
          EmployeeId = response.EmployeeId
          let inTime = moment(response.leaveDate).toISOString()
          let outTime = moment(inTime).add(9, 'hours').toISOString()
          const payload = []
          for(let i = 0; i < duration; i ++) {
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
              return Employee.decrement('paidLeave', { by: duration, where: { id: +EmployeeId } })
            })
            .then(response => {
              Employee.findOne({
                where: {
                  id: +EmployeeId
                }
              })
                .then(response => {
                  const body = {
                    from: '"HRQ Company" <hacktiv8company@gmail.com',
                    to: response.email,
                    subject: 'Paid Leave Approved',
                    html: `
                    <p>Dear, ${response.name}</p><br/>
          
                    <p>Your Paid Leave request has been approved by your Superior</p><br/>
      
                    <p>Please back in time if your leave ended.</p>
          
                    Sincerely,<br/><br/><br/><br/>
          
                    HRD Team<br/><br/>
                    
                    <img alt="HRQ Company Logo" src="https://photos-hrq-upload.s3-ap-southeast-1.amazonaws.com/upload/HRQ_100.png"/>
                    `
                  }
                  emailSend.sendMail(body, (error, info) => {
                    /*istanbul ignore next */
                    if(error) throw new Error(error)
                  })
                  res.status(200).json({ message: "PaidLeave Approved" })
                })
            })
          } else {
            Employee.findOne({
              where: {
                id: +EmployeeId
              }
            })
              .then(response => {
                const body = {
                  from: '"HRQ Company" <hacktiv8company@gmail.com',
                  to: response.email,
                  subject: 'Paid Leave Rejected',
                  html: `
                  <p>Dear, ${response.name}</p><br/>
        
                  <p>Your Paid Leave request has been rejected by your Superior</p><br/>

                  <p>Please contact your Superior for the reason immediately.</p>
        
                  Sincerely,<br/><br/><br/><br/>
        
                  HRD Team<br/><br/>
                  
                  <img alt="HRQ Company Logo" src="https://photos-hrq-upload.s3-ap-southeast-1.amazonaws.com/upload/HRQ_100.png"/>
                  `
                }
                emailSend.sendMail(body, (error, info) => {
                  /*istanbul ignore next */
                  if(error) throw new Error(error)
                })
                res.status(200).json({ message: "PaidLeave Rejected" })
              })
          }
        } 
        // else next ({ status: 404, message: "Paid Leave Not Found" })
      })
      .catch(next)
  }
  
  static requestResetPassword(req, res, next) {
    const { email } = req.body
    Employee.findOne({
      where: {
        email
      }
    })
      .then(response => {
        // if(response) {
          const randomNumber = Math.floor(Math.random() * (999999 - 100000) ) + 100000;
          const body = {
            from: '"HRQ Company" <hacktiv8company@gmail.com',
            to: response.email,
            subject: 'Reset Password',
            html: `
            
            <h1>Reset Password?</h1><br/><br/>
  
            If you requested a password reset for your account in HRQ Company please input code below to application!<br/><br/>

            <b>${randomNumber}</b><br/>
            
            If you didn't make this request, ignore this email.<br/><br/>
  
            Sincerely,<br/><br/><br/><br/>
  
            HRD Team<br/><br/>
  
            <img alt="HRQ Company Logo" src="https://photos-hrq-upload.s3-ap-southeast-1.amazonaws.com/upload/HRQ_100.png"/>
            `
          }
          // emailSend.sendMail(body, (error, info) => {
          //   if(error) throw new Error(error)
          // })
          res.status(200).json({ code: randomNumber })
        // }
      })
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
      .catch(next)
    }
}

module.exports = EmployeeController