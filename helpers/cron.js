const CronJob=require('cron').CronJob;
const { Absence, Employee } = require('../models')
const moment = require('moment')

const cronJob1 = new CronJob({
    cronTime: '0 0 * * * *',
    onTick: function () {
    //Your code that is to be executed on every midnight
    if(moment(new Date()).day() === 0 || moment(new Date()).day() === 6) {
      console.log('corn Started at: ' + moment(new Date()).format('L'))
      Employee.findAll()
        .then(response => {
          response.map(el => {
            Absence.create({
              EmployeeId: el.id,
              in: moment(new Date()).add(9, "hours").toDate(),
              out: moment(new Date()).add(18, "hours").toDate(),
              status: true
            })

          })
        })
    }
  },
  start: true,
  runOnInit: false
});

module.exports = cronJob1
