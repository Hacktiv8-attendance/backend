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
      image_url: "https://lh3.googleusercontent.com/Ci-Xhw2LdecxewYi7VBy9Z2LYtWXIYk_av3jvj8H8efF8eQXc6-NFZ_yuvRPDov9GWC8SCuIkU6V7wV4lvJK=w1299-h639",
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
      image_url: "https://lh6.googleusercontent.com/8MSFOtFk30Eto5q7BSDuExiBdXgkq2a_fX10h0yzP4Qr9-q_DUDL86D4v0lw-DAecw2yTxJObc9kGX9BO-H5=w1299-h639",
      paidLeave: 12,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: "Abdul Basith K",
      password: hashPassword('abdul123'),
      email: 'abdul.basith@gmail.com',
      birthDate: new Date("1997-01-21"),
      address: 'Depok',
      phoneNumber: '0812121212',
      role: 'CEO',
      authLevel: 1,
      superior: 1,
      image_url: "https://lh5.googleusercontent.com/UC9JgxU6wa4X5Evev-zTUvUeuzx03n9aNB0SeXCQLDLuU2jVnfzZJaqW7rRNuHNwR0ngZzw8kwv35hSwgbw1=w1299-h639",
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
      image_url: "https://lh3.googleusercontent.com/YJyd9RkCOmVQAxyyXPWBL-DyWoaC3CH8B1KJwdqnVYWBui6YUuiSRmrN12ZV1wUBMj2fVO_VVtlrXRjV84Bo=w1299-h639",
      paidLeave: 12,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Employees', null, {});
  }
};
