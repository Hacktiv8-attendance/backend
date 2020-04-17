const { verify } = require('../helpers/jwt')
const { Employee } = require('../models')
module.exports = function (req, res, next) {
    let token = req.headers.token
    if (token) {
        req.decoded = verify(token)
        console.log(token)
            Employee.findOne({
                    where: {
                        email: req.decoded.email
                    }
            })
                .then(response => {
                    if (response) {
                        next()
                        return null
                    } else {
                        throw ({
                            status: 401,
                            message: 'Please Login First!'
                        })
                    }
                })
                .catch(err => {
                    throw err
                })
    } else {
        next({
            status: 401,
            message: 'Please Login First!'
        })
    }
}