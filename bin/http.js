require('dotenv').config()
const job = require('../helpers/cron')
const app = require('../app')
const htpp = require('http')
const server = htpp.createServer(app)
job.start()
server.listen(process.env.PORT, () => console.log('Listening to port: '+process.env.PORT))

module.exports = server