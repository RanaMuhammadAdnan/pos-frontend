'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('vendors', [
      {
        name: 'Vendor 1',
        phone: '1234567890',
        address: '123 Main St',
        email: 'vendor1@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Vendor 2',
        phone: '9876543210',
        address: '456 Market St',
        email: 'vendor2@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      // ...add more vendors as needed, but do not specify 'id'
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('vendors', null, {});
  }
}; 