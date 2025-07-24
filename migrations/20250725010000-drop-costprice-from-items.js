'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove the costPrice column if it exists
    await queryInterface.removeColumn('items', 'costPrice');
  },

  down: async (queryInterface, Sequelize) => {
    // Re-add the costPrice column if rolling back
    await queryInterface.addColumn('items', 'costPrice', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    });
  }
}; 