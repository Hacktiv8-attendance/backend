const jwt = require('jsonwebtoken')

const getToken = (payload) => {
    return jwt.sign(payload, "SECRET")
}

const verify = (token) => {
    return jwt.verify(token, "SECRET")
}

module.exports = {
    getToken,
    verify
}