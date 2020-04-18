require('dotenv').config()
const app = require('../app')
const htpp = require('http')
const server = htpp.createServer(app)
server.listen(process.env.PORT, () => console.log('Listening to port: '+process.env.PORT))

module.exports = server