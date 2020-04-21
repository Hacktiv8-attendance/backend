'use strict';
module.exports = (sequelize, DataTypes) => {

  const Model = sequelize.Sequelize.Model
  class PaidLeave extends Model {}
  PaidLeave.init({
    EmployeeId: DataTypes.INTEGER,
    SuperiorId: DataTypes.INTEGER,
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Reason is Required'
        },
        notEmpty: {
          args: true,
          msg: "Reason is Required"
        }
      }
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    leaveDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Leave Date is Required'
        },
        notEmpty: {
          args: true,
          msg: "Leave Date is Required"
        }
      }
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Duration is Required'
        },
        notEmpty: {
          args: true,
          msg: "Duration is Required"
        }
      }
    }
  }, {
    sequelize
  })
  PaidLeave.associate = function(models) {
    PaidLeave.belongsTo(models.Employee)
  };
  return PaidLeave;
};