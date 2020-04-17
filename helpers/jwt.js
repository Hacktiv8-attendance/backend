const jwt = require('jsonwebtoken')

const getToken = (payload) => {
    return jwt.sign(payload, process.env.SECRET)
}

const verify = (token) => {
    return jwt.verify(token, process.env.SECRET)
}

module.exports = {
    getToken,
    verify
}