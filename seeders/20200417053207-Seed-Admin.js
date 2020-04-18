const { hashPassword } = require('../helpers/bcrypt')
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Employees', [{
      name: "Andreas Anggara",
      password: hashPassword('admin123'),
      email: 'andreas.anggara@email.com',
      birthDate: new Date("1996-01-01"),
      address: 'Bogor',
      phoneNumber: '0812121212',
      role: 'HRD',
      image_url: "https://drive.google.com/file/d/1kaW4lAGSRs3EjqPL9u_G3mRSw20je8y_/preview",
      authLevel: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: "Xavier Thufail",
      password: hashPassword('xavier123'),
      email: 'xavier.thufail@email.com',
      birthDate: new Date("1990-01-01"),
      address: 'Depok',
      phoneNumber: '0812121212',
      role: 'Manager',
      authLevel: 2,
      superior: 1,
      image_url: "https://drive.google.com/file/d/16gW6p-ucpJOoJsyCFXWEnZA5sH9y7CHP/preview",
      paidLeave: 12,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Employees', null, {});
  }
};
