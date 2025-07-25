'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Fetch vendors by name
    const vendors = await queryInterface.sequelize.query(
      "SELECT id, name FROM vendors;"
    );
    const vendorMap = {};
    vendors[0].forEach(v => { vendorMap[v.name] = v.id; });

    await queryInterface.bulkInsert('items', [
      {
        name: 'Laptop',
        sku: 'LAP-DELL-001',
        description: '15.6-inch Full HD laptop with Intel Core i5 processor',
        vendorId: vendorMap['Vendor 1'],
        grossPrice: 120,
        netPrice: 110,
        sellingPrice: 130,
        tax: 30.00,
        discount: 25.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Wireless Mouse',
        sku: 'MOU-LOG-001',
        description: 'Compact wireless mouse with 12-month battery life',
        vendorId: vendorMap['Vendor 2'],
        grossPrice: 10,
        netPrice: 9,
        sellingPrice: 11,
        tax: 1.00,
        discount: 0.00,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      // ...add more items, using vendorMap['Vendor 1'] or vendorMap['Vendor 2'] as needed
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('items', null, {});
  }
}; 