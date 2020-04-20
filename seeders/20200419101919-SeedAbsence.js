'use strict';
const moment = require('moment')
const absence = []
for(let k = 1; k < 5; k++) {
  if(k === 4) {
    if(k < 10) k = `0${k}`
    for(let j = 1; j < 20; j++) {
      if(j < 10) j = `0${j}`
      for(let i = 5; i < 100; i++) {
        absence.push({
          EmployeeId: i,
          in: moment(`2020-${k}-${j} 08:30:00`).toISOString(),
          out: moment(`2020-${k}-${j} 18:00:00`).toISOString(),
          worktime: 9,
          status: true,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
      if(typeof j === 'string') j = Number(j.slice(1))
    }
    if(typeof k === 'string') k = Number(k.slice(1))
  } else {
    if(k < 10) k = `0${k}`
    for(let j = 1; j < 29; j++) {
      if(j < 10) j = `0${j}`
      for(let i = 5; i < 100; i++) {
        absence.push({
          EmployeeId: i,
          in: moment(`2020-${k}-${j} 08:30:00`).toISOString(),
          out: moment(`2020-${k}-${j} 18:00:00`).toISOString(),
          worktime: 9,
          status: true,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
      if(typeof j === 'string') j = Number(j.slice(1))
    }
    if(typeof k === 'string') k = Number(k.slice(1))
  }
}

for(let i = 0; i < 2000; i++) {
  absence.splice(Math.ceil(Math.random()*18899), 1)
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Absences', absence, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('People', null, {});
  }
};
