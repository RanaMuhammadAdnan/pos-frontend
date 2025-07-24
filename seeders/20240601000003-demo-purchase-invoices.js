'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Insert sample purchase invoices
    await queryInterface.bulkInsert('purchase_invoices', [
      {
        invoiceNumber: 'PI-1001',
        vendorId: 1,
        date: new Date('2024-06-01'),
        total: 540.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        invoiceNumber: 'PI-1002',
        vendorId: 2,
        date: new Date('2024-06-02'),
        total: 224.99,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        invoiceNumber: 'PI-1003',
        vendorId: 3,
        date: new Date('2024-06-03'),
        total: 24.99,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    // Get inserted invoice IDs
    const invoices = await queryInterface.sequelize.query(
      "SELECT id, \"invoiceNumber\" FROM purchase_invoices WHERE \"invoiceNumber\" IN ('PI-1001', 'PI-1002', 'PI-1003')",
      { type: Sequelize.QueryTypes.SELECT }
    );
    const invoiceMap = {};
    invoices.forEach(inv => { invoiceMap[inv.invoiceNumber] = inv.id; });

    // Insert sample purchase invoice items
    await queryInterface.bulkInsert('purchase_invoice_items', [
      // PI-1001
      {
        purchaseInvoiceId: invoiceMap['PI-1001'],
        itemId: 1,
        quantity: 1,
        price: 450.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        purchaseInvoiceId: invoiceMap['PI-1001'],
        itemId: 2,
        quantity: 10,
        price: 8.50 * 10,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // PI-1002
      {
        purchaseInvoiceId: invoiceMap['PI-1002'],
        itemId: 3,
        quantity: 1,
        price: 120.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        purchaseInvoiceId: invoiceMap['PI-1002'],
        itemId: 5,
        quantity: 10,
        price: 10 * 5.99,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // PI-1003
      {
        purchaseInvoiceId: invoiceMap['PI-1003'],
        itemId: 4,
        quantity: 1,
        price: 24.99,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('purchase_invoice_items', null, {});
    await queryInterface.bulkDelete('purchase_invoices', null, {});
  }
}; 