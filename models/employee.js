'use strict';
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.Sequelize.Model

  class Employee extends Model {}
  Employee.init({
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    birthDate: DataTypes.DATE,
    address: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    role: DataTypes.STRING,
    paidLeave: DataTypes.INTEGER,
    superior: DataTypes.INTEGER,
    authLevel: DataTypes.INTEGER
  }, 
  {
    sequelize
  })

  Employee.associate = function(models) {
    Employee.hasMany(models.AbsenceEmployee)
  };
  
  return Employee;
};