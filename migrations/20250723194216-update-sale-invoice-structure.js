'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove columns from sale_invoices table
    await queryInterface.removeColumn('sale_invoices', 'dueDate');
    await queryInterface.removeColumn('sale_invoices', 'taxAmount');
    await queryInterface.removeColumn('sale_invoices', 'status');
    await queryInterface.removeColumn('sale_invoices', 'paymentMethod');
    await queryInterface.removeColumn('sale_invoices', 'paymentStatus');

    // Remove tax column from sale_invoice_items table
    await queryInterface.removeColumn('sale_invoice_items', 'tax');
  },

  async down(queryInterface, Sequelize) {
    // Add back the columns to sale_invoices table
    await queryInterface.addColumn('sale_invoices', 'dueDate', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('sale_invoices', 'taxAmount', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    });
    await queryInterface.addColumn('sale_invoices', 'status', {
      type: Sequelize.ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled'),
      allowNull: false,
      defaultValue: 'draft',
    });
    await queryInterface.addColumn('sale_invoices', 'paymentMethod', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('sale_invoices', 'paymentStatus', {
      type: Sequelize.ENUM('pending', 'partial', 'paid'),
      allowNull: false,
      defaultValue: 'pending',
    });

    // Add back tax column to sale_invoice_items table
    await queryInterface.addColumn('sale_invoice_items', 'tax', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    });
  }
};
