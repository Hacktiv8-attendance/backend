'use strict';
const moment = require('moment')
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Absences', [{
      EmployeeId: 5,
      in: moment('2020-04-19 08:30:00').toISOString(),
      out: moment('2020-04-19 18:00:00').toISOString(),
      worktime: 9,
      status: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      EmployeeId: 6,
      in: moment('2020-04-19 08:30:00').toISOString(),
      out: moment('2020-04-19 18:00:00').toISOString(),
      worktime: 9,
      status: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      EmployeeId: 7,
      in: moment('2020-04-19 08:30:00').toISOString(),
      out: moment('2020-04-19 18:00:00').toISOString(),
      worktime: 9,
      status: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      EmployeeId: 8,
      in: moment('2020-04-19 08:30:00').toISOString(),
      out: moment('2020-04-19 18:00:00').toISOString(),
      worktime: 9,
      status: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      EmployeeId: 5,
      in: moment('2020-04-20 08:30:00').toISOString(),
      out: moment('2020-04-20 18:00:00').toISOString(),
      worktime: 9,
      status: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      EmployeeId: 6,
      in: moment('2020-04-20 08:30:00').toISOString(),
      out: moment('2020-04-20 18:00:00').toISOString(),
      worktime: 9,
      status: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      EmployeeId: 7,
      in: moment('2020-04-20 08:30:00').toISOString(),
      out: moment('2020-04-20 18:00:00').toISOString(),
      worktime: 9,
      status: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      EmployeeId: 8,
      in: moment('2020-04-20 08:30:00').toISOString(),
      out: moment('2020-04-20 18:00:00').toISOString(),
      worktime: 9,
      status: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      EmployeeId: 5,
      in: moment('2020-04-21 08:30:00').toISOString(),
      out: moment('2020-04-21 18:00:00').toISOString(),
      worktime: 9,
      status: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      EmployeeId: 6,
      in: moment('2020-04-21 08:30:00').toISOString(),
      out: moment('2020-04-21 18:00:00').toISOString(),
      worktime: 9,
      status: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      EmployeeId: 7,
      in: moment('2020-04-21 08:30:00').toISOString(),
      out: moment('2020-04-21 18:00:00').toISOString(),
      worktime: 9,
      status: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      EmployeeId: 8,
      in: moment('2020-04-21 08:30:00').toISOString(),
      out: moment('2020-04-21 18:00:00').toISOString(),
      worktime: 9,
      status: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
