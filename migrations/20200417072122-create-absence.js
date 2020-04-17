'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Absences', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      EmployeeId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Employees",
          key: "id"
        },
        onDelete: "cascade",
        onUpdate: "cascade"
      },
      in : {
        type: Sequelize.DATE
      },
      out: {
        type: Sequelize.DATE
      },
      worktime: {
        type: Sequelize.NUMBER
      },
      status: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Absences');
  }
};