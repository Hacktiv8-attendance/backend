'use strict';
module.exports = (sequelize, DataTypes) => {
  const Absence = sequelize.define('Absence', {
    EmployeeId: DataTypes.INTEGER,
    in : {
      type: DataTypes.DATE,
      defaultValue: new Date()
    },
    out: DataTypes.DATE,
    worktime: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {});
  Absence.associate = function(models) {
    Absence.belongsTo(models.Employee)
  };
  return Absence;
};