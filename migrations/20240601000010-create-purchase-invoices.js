'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('purchase_invoices', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      invoiceNumber: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      vendorId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'vendors', key: 'id' } },
      date: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      total: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('purchase_invoices');
  }
}; 