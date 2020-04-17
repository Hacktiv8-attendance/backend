const { hashPassword } = require('../helpers/bcrypt')
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Employees', [{
      name: "Andreas Anggara",
      password: hashPassword('admin123'),
      email: 'andreas.anggara@email.com',
      birthDate: new Date(21-01-96),
      address: 'Bogor',
      phoneNumber: '0812121212',
      role: 'HRD',
      authLevel: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: "Xavier Thufail",
      password: hashPassword('xavier123'),
      email: 'xavier.thufail@email.com',
      birthDate: new Date(21-01-90),
      address: 'Depok',
      phoneNumber: '0812121212',
      role: 'Manager',
      authLevel: 2,
      superior: 1,
      paidLeave: 12,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Employees', null, {});
  }
};
