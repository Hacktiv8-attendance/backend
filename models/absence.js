'use strict';
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.Sequelize.Model
  
  class Absence extends Model {}

  Absence.init({
    key: DataTypes.STRING,
    timeStamp: DataTypes.DATE
  }, 
  { 
    sequlize 
  })
  
  Absence.associate = function(models) {
    Absence.hasMany(models.AbsenceEmployee)
  };
  return Absence;
};