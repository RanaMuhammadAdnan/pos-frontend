'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('items', 'netPrice', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('items', 'netPrice');
  }
};
