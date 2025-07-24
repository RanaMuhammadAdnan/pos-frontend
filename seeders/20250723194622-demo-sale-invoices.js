'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // First, let's get some existing customers and items
    const customers = await queryInterface.sequelize.query(
      'SELECT id FROM customers LIMIT 3',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const items = await queryInterface.sequelize.query(
      'SELECT id, "sellingPrice" FROM items LIMIT 5',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (customers.length === 0 || items.length === 0) {
      console.log('No customers or items found. Skipping sale invoice seeding.');
      return;
    }

    // Create demo sale invoices
    const saleInvoices = [
      {
        invoiceNumber: 'SI-2024-001',
        customerId: customers[0].id,
        invoiceDate: new Date('2024-01-15'),
        subtotal: 1500.00,
        discountAmount: 150.00,
        totalAmount: 1350.00,
        remainingAmount: 1350.00,
        netAmount: 1200.00,
        profit: 150.00,
        notes: 'Demo sale invoice 1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        invoiceNumber: 'SI-2024-002',
        customerId: customers[1]?.id || customers[0].id,
        invoiceDate: new Date('2024-01-20'),
        subtotal: 2200.00,
        discountAmount: 200.00,
        totalAmount: 2000.00,
        remainingAmount: 0.00,
        netAmount: 1800.00,
        profit: 200.00,
        notes: 'Demo sale invoice 2',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        invoiceNumber: 'SI-2024-003',
        customerId: customers[2]?.id || customers[0].id,
        invoiceDate: new Date('2024-01-25'),
        subtotal: 800.00,
        discountAmount: 50.00,
        totalAmount: 750.00,
        remainingAmount: 500.00,
        netAmount: 650.00,
        profit: 100.00,
        notes: 'Demo sale invoice 3',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('sale_invoices', saleInvoices, {});

    // Get the created sale invoices
    const createdInvoices = await queryInterface.sequelize.query(
      'SELECT id FROM sale_invoices WHERE "invoiceNumber" IN (\'SI-2024-001\', \'SI-2024-002\', \'SI-2024-003\')',
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Create sale invoice items
    const saleInvoiceItems = [];

    // Items for first invoice
    saleInvoiceItems.push({
      saleInvoiceId: createdInvoices[0].id,
      itemId: items[0].id,
      quantity: 2,
      unitPrice: items[0].sellingPrice,
      discount: 100.00,
      total: (items[0].sellingPrice * 2) - 100.00,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    saleInvoiceItems.push({
      saleInvoiceId: createdInvoices[0].id,
      itemId: items[1]?.id || items[0].id,
      quantity: 1,
      unitPrice: items[1]?.sellingPrice || items[0].sellingPrice,
      discount: 50.00,
      total: ((items[1]?.sellingPrice || items[0].sellingPrice) * 1) - 50.00,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Items for second invoice
    saleInvoiceItems.push({
      saleInvoiceId: createdInvoices[1].id,
      itemId: items[2]?.id || items[0].id,
      quantity: 3,
      unitPrice: items[2]?.sellingPrice || items[0].sellingPrice,
      discount: 150.00,
      total: ((items[2]?.sellingPrice || items[0].sellingPrice) * 3) - 150.00,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    saleInvoiceItems.push({
      saleInvoiceId: createdInvoices[1].id,
      itemId: items[3]?.id || items[0].id,
      quantity: 1,
      unitPrice: items[3]?.sellingPrice || items[0].sellingPrice,
      discount: 50.00,
      total: ((items[3]?.sellingPrice || items[0].sellingPrice) * 1) - 50.00,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Items for third invoice
    saleInvoiceItems.push({
      saleInvoiceId: createdInvoices[2].id,
      itemId: items[4]?.id || items[0].id,
      quantity: 1,
      unitPrice: items[4]?.sellingPrice || items[0].sellingPrice,
      discount: 50.00,
      total: ((items[4]?.sellingPrice || items[0].sellingPrice) * 1) - 50.00,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await queryInterface.bulkInsert('sale_invoice_items', saleInvoiceItems, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('sale_invoice_items', null, {});
    await queryInterface.bulkDelete('sale_invoices', null, {});
  }
};
