'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('AbsenceEmployees', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      AbsenceId: {
        type: Sequelize.INTEGER,
        references: {
          key: "id",
          model: "Absences"
        }
      },
      EmployeeId: {
        type: Sequelize.INTEGER,
        references: {
          key: "id",
          model: "Employees"
        }
      },
      status: {
        type: Sequelize.BOOLEAN
      },
      in : {
        type: Sequelize.DATE
      },
      out: {
        type: Sequelize.DATE
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
    return queryInterface.dropTable('AbsenceEmployees');
  }
};