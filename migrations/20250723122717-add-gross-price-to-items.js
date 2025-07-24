'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('items', 'grossPrice', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('items', 'grossPrice');
  }
};
