'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Get existing customers and items for references
    const customers = await queryInterface.sequelize.query(
      'SELECT id FROM customers LIMIT 3',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const items = await queryInterface.sequelize.query(
      'SELECT id, "sellingPrice" FROM items LIMIT 5',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (customers.length === 0 || items.length === 0) {
      console.log('No customers or items found. Skipping sale invoice seeder.');
      return;
    }

    const saleInvoices = [
      {
        invoiceNumber: 'SI-202501-0001',
        customerId: customers[0].id,
        invoiceDate: new Date('2025-01-15'),
        dueDate: new Date('2025-01-30'),
        subtotal: 1500.00,
        taxAmount: 150.00,
        discountAmount: 100.00,
        totalAmount: 1550.00,
        notes: 'First sale invoice for customer',
        status: 'paid',
        paymentMethod: 'cash',
        paymentStatus: 'paid',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        invoiceNumber: 'SI-202501-0002',
        customerId: customers[1]?.id || customers[0].id,
        invoiceDate: new Date('2025-01-20'),
        dueDate: new Date('2025-02-05'),
        subtotal: 2500.00,
        taxAmount: 250.00,
        discountAmount: 0.00,
        totalAmount: 2750.00,
        notes: 'Bulk order for office supplies',
        status: 'sent',
        paymentMethod: 'bank_transfer',
        paymentStatus: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        invoiceNumber: 'SI-202501-0003',
        customerId: customers[2]?.id || customers[0].id,
        invoiceDate: new Date('2025-01-25'),
        dueDate: new Date('2025-02-10'),
        subtotal: 800.00,
        taxAmount: 80.00,
        discountAmount: 50.00,
        totalAmount: 830.00,
        notes: 'Regular customer order',
        status: 'draft',
        paymentMethod: null,
        paymentStatus: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('sale_invoices', saleInvoices, {});

    // Create sale invoice items
    const saleInvoiceItems = [];
    let itemIndex = 0;

    for (let i = 0; i < saleInvoices.length; i++) {
      const invoice = saleInvoices[i];
      const numItems = Math.min(3, items.length); // Max 3 items per invoice

      for (let j = 0; j < numItems; j++) {
        const item = items[itemIndex % items.length];
        const quantity = Math.floor(Math.random() * 5) + 1;
        const unitPrice = parseFloat(item.sellingPrice);
        const discount = Math.random() > 0.7 ? unitPrice * 0.1 : 0; // 10% discount sometimes
        const tax = unitPrice * 0.1; // 10% tax
        const total = (unitPrice * quantity) - discount + tax;

        saleInvoiceItems.push({
          saleInvoiceId: i + 1, // Assuming IDs start from 1
          itemId: item.id,
          quantity,
          unitPrice,
          discount,
          tax,
          total,
          createdAt: new Date(),
          updatedAt: new Date()
        });

        itemIndex++;
      }
    }

    await queryInterface.bulkInsert('sale_invoice_items', saleInvoiceItems, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('sale_invoice_items', null, {});
    await queryInterface.bulkDelete('sale_invoices', null, {});
  }
}; 