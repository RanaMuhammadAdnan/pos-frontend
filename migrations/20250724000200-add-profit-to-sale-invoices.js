'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('sale_invoices', 'profit', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('sale_invoices', 'profit');
  },
}; 