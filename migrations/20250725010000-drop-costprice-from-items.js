'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Only drop the column if it exists
    const table = await queryInterface.describeTable('items');
    if (table.costPrice) {
      await queryInterface.removeColumn('items', 'costPrice');
    }
  },
  down: async (queryInterface, Sequelize) => {
    // Only add the column if it does not exist
    const table = await queryInterface.describeTable('items');
    if (!table.costPrice) {
      await queryInterface.addColumn('items', 'costPrice', {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      });
    }
  }
}; 