'use strict';
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.Sequelize.Model
  class Message extends Model {}
  Message.init({
    message: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Message is Required"
        },
        notEmpty: {
          args: true,
          msg: "Message is Required"
        }
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Title is Required"
        },
        notEmpty: {
          args: true,
          msg: "Title is Required"
        },
        len: {
          args: [5, 25],
          msg: "Title length between 5 and 25 charachters"
        }
      }
    }
  }, {
    sequelize
  })
  Message.associate = function(models) {
    // associations can be defined here
  };
  return Message;
};