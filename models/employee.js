'use strict';
const { hashPassword } = require('../helpers/bcrypt')
const email = require('../helpers/email')
let passwordAfter;
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.Sequelize.Model

  class Employee extends Model {}
  Employee.init({
    name: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Password is Required'
        },
        len: {
          args: [6],
          msg: 'Password At least 6 characters'
        },
        notEmpty: {
          args: true,
          msg: "Password is Required"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "Email has been registered"
      },
      validate: {
        notNull: {
          args: true,
          msg: 'Email is Required'
        },
        notEmpty: {
          args: true,
          msg: "Email is Required"
        },
        isEmail: {
          args: true,
          msg: 'Invalid Email Format'
        }
      }
    },
    birthDate: {
      type: DataTypes.DATE,
      // allowNull: false,
      // validate: {
      //   notNull: {
      //     args: true,
      //     msg: 'BirtDate is Required'
      //   },
      //   notEmpty: {
      //     args: true,
      //     msg: "BirthDate is Required"
      //   },
      // }
    },
    address: {
      type: DataTypes.STRING,
      // allowNull: false,
      // validate: {
      //   notNull: {
      //     args: true,
      //     msg: 'Address is Required'
      //   },
      //   notEmpty: {
      //     args: true,
      //     msg: "Address is Required"
      //   },
      // }
    },
    phoneNumber: {
      type: DataTypes.STRING,
      // allowNull: false,
      // validate: {
      //   notNull: {
      //     args: true,
      //     msg: 'Phone Number is Required'
      //   },
      //   notEmpty: {
      //     args: true,
      //     msg: "Phone Number is Required"
      //   },
      // }
    },
    role: {
      type: DataTypes.STRING,
      // allowNull: false,
      // validate: {
      //   notNull: {
      //     args: true,
      //     msg: 'Role is Required'
      //   },
      //   notEmpty: {
      //     args: true,
      //     msg: "Role is Required"
      //   },
      // }
    },
    paidLeave: {
      type: DataTypes.INTEGER,
      // allowNull: false,
      // validate: {
      //   notNull: {
      //     args: true,
      //     msg: 'Paid Leave is Required'
      //   },
      //   notEmpty: {
      //     args: true,
      //     msg: "Paid Leave is Required"
      //   },
      // },
      defaultValue: 12
    },
    SuperiorId: {
      type: DataTypes.INTEGER,
      // allowNull: false,
      // validate: {
      //   notNull: {
      //     args: true,
      //     msg: 'Superior is Required'
      //   },
      //   notEmpty: {
      //     args: true,
      //     msg: "Superior is Required"
      //   },
      // }
    },
    authLevel: {
      type: DataTypes.INTEGER,
      // allowNull: false,
      // validate: {
      //   notNull: {
      //     args: true,
      //     msg: 'Superior is Required'
      //   },
      //   notEmpty: {
      //     args: true,
      //     msg: "Superior is Required"
      //   },
      // }
    },
    image_url: {
      type: DataTypes.STRING
    }
  }, 
  {
    hooks: {
      beforeCreate: (employee, options) => {
        passwordAfter = employee.password
        employee.password = hashPassword(employee.password)
      },
      beforeUpdate: (employee, options) => {
        employee.password = hashPassword(employee.password)
      },
      afterCreate: (User, options) => {
        const body = {
          form: '"HRQ Company" <hacktiv8company@gmail.com',
          to: User.email,
          subject: 'Account Registeed',
          html: `
          
          Dear Mr/Mrs <b>${User.name}</b>,<br/>
          ${User.address}<br/><br/>

          I am writing to inform you that you have been accepted to work for our company as our ${User.role}.<br/>
          We expect to see you in the office. We would like to discuss your post and the duties that come with it. We will also answer any questions you may have then.<br/><br/>

          Congratulations on getting the post, and we look forward to working with you soon.<br/><br/>

          Here Your Account Credentials:<br/><br/>

          Email: ${User.email}<br/><br/>
          Password: ${passwordAfter}<br/>

          Sincerely,<br/><br/><br/>

          HRD Team<br/><br/>

          <img alt="HRQ Company Logo" src="https://photos-hrq-upload.s3-ap-southeast-1.amazonaws.com/upload/HRQ_100.png"/>
          `
        }
        email.sendMail(body, (error, info) => {
          if(error) throw new Error(error)
        })
      }
    },
    sequelize
  })

  Employee.associate = function(models) {
    Employee.hasMany(models.Absence)
    Employee.hasOne(models.Employee,  {as: "Superior"})
  };
  
  return Employee;
};