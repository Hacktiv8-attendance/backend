'use strict';
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.Sequelize.Model
  class Message extends Model {}
  Message.init({
    message: DataTypes.STRING
  }, {
    sequelize
  })
  Message.associate = function(models) {
    // associations can be defined here
  };
  return Message;
};