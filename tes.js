const moment = require('moment')


const date = new Date()
const NDate = new Date("2020-04-17T10:27:54.708Z")

const duration = moment.duration(moment(date).diff(moment(NDate)))
console.log(duration.hours())