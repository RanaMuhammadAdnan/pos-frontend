'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('items', 'sku', {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true,
      defaultValue: 'SKU-TEMP', // Temporary default for existing rows
    });
    // Remove default after column is added
    await queryInterface.changeColumn('items', 'sku', {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('items', 'sku');
  }
};
