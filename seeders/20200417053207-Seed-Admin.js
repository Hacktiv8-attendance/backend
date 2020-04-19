const { hashPassword } = require('../helpers/bcrypt')
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Employees', [{
      name: "Abdul Basith K",
      password: hashPassword('abdul123'),
      email: 'abdul.basith@gmail.com',
      birthDate: new Date("1997-01-21"),
      address: 'Depok',
      phoneNumber: '0812121212',
      role: 'CEO',
      authLevel: 1,
      superior: 1,
      image_url: "https://photos-hrq-upload.s3-ap-southeast-1.amazonaws.com/upload/abdul+basith.jpg",
      paidLeave: 12,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: "Andreas Anggara",
      password: hashPassword('admin123'),
      email: 'andreas.anggara@email.com',
      birthDate: new Date("1996-01-01"),
      address: 'Bogor',
      phoneNumber: '0812121212',
      role: 'HRD',
      image_url: "https://photos-hrq-upload.s3-ap-southeast-1.amazonaws.com/upload/Andreas+Anggara+Anindyajati.jpg",
      authLevel: 1,
      superior: 1,
      paidLeave: 12,
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
      image_url: "https://photos-hrq-upload.s3-ap-southeast-1.amazonaws.com/upload/XavierThufail.jpg",
      paidLeave: 12,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: "Tamara Zulaika",
      password: hashPassword('tamara123'),
      email: 'tamara.zulaika@gmail.com',
      birthDate: new Date("1996-01-01"),
      address: 'Tangerang',
      phoneNumber: '0812121212',
      role: 'Manager',
      authLevel: 2,
      superior: 1,
      image_url: "https://photos-hrq-upload.s3-ap-southeast-1.amazonaws.com/upload/Tamara+Zulaika+Utama.jpg",
      paidLeave: 12,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Employees', null, {});
  }
};
