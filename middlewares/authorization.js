const { Employee } = require('../models')

module.exports = function(req, res, next) {
    Employee.findOne({
        where: {
            id: +req.params.id
        }
    })
        .then(employee => {
            if(employee) {
                if(req.decoded.authLevel > employee.authLevel) {
                    if(req.decoded.id === employee.superior) {
                        next()
                    } else {
                        next({
                            status: 401,
                            message: 'You dont have authorization'
                        })
                    }
                } else {
                    next({
                        status: 401,
                        message: 'You dont have authorization'
                    })
                }
            } else {
                next({
                    status: 404,
                    message: 'Employee not found'
                })
            }
        })
        .catch(next)
}