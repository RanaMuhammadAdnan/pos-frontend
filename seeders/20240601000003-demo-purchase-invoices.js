'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Fetch vendors by name
    const vendors = await queryInterface.sequelize.query(
      "SELECT id, name FROM vendors;"
    );
    const vendorMap = {};
    vendors[0].forEach(v => { vendorMap[v.name] = v.id; });

    await queryInterface.bulkInsert('purchase_invoices', [
      {
        invoiceNumber: 'PI-001',
        vendorId: vendorMap['Vendor 1'],
        date: new Date(),
        total: 1000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        invoiceNumber: 'PI-002',
        vendorId: vendorMap['Vendor 2'],
        date: new Date(),
        total: 2000,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      // ...add more purchase invoices, using vendorMap['Vendor 1'] or vendorMap['Vendor 2'] as needed
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('purchase_invoices', null, {});
  }
}; 