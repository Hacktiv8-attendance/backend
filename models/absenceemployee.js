'use strict';
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.Sequelize.Model

  class AbsenceEmployee extends Model {}

  AbsenceEmployee.init({
    AbsenceId: DataTypes.INTEGER,
    EmployeeId: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN,
    in : DataTypes.DATE,
    out: DataTypes.DATE
  }, 
  {
    sequelize
  })

  AbsenceEmployee.associate = function(models) {
    AbsenceEmployee.belongsTo(models.Employee)
    AbsenceEmployee.belongsTo(models.Absence)
  };
  return AbsenceEmployee;
};