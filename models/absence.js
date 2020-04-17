'use strict';
module.exports = (sequelize, DataTypes) => {
  const Absence = sequelize.define('Absence', {
    EmployeeId: DataTypes.INTEGER,
    in : DataTypes.DATE,
    out: DataTypes.DATE,
    worktime: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN
  }, {});
  Absence.associate = function(models) {
    Absence.belongsTo(models.Employee)
  };
  return Absence;
};