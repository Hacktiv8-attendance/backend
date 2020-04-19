'use strict';
module.exports = (sequelize, DataTypes) => {

  const Model = sequelize.Sequelize.Model
  class PaidLeave extends Model {}
  PaidLeave.init({
    EmployeeId: DataTypes.INTEGER,
    SuperiorId: DataTypes.INTEGER,
    reason: DataTypes.STRING,
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    leaveDate: {
      type: DataTypes.DATE
    },
    duration: {
      type: DataTypes.INTEGER
    }
  }, {
    sequelize
  })
  PaidLeave.associate = function(models) {
    // associations can be defined here
  };
  return PaidLeave;
};