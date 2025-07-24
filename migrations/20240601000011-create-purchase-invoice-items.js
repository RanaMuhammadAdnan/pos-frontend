'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('purchase_invoice_items', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      purchaseInvoiceId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'purchase_invoices', key: 'id' } },
      itemId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'items', key: 'id' } },
      quantity: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
      price: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('purchase_invoice_items');
  }
}; 