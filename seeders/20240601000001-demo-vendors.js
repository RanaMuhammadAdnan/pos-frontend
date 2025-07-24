'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('vendors', [
      {
        id: 1,
        name: 'ABC Electronics',
        phone: '+1-555-0101',
        address: '123 Tech Street, Silicon Valley, CA 94025',
        email: 'contact@abcelectronics.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'Global Supplies Co.',
        phone: '+1-555-0202',
        address: '456 Business Ave, New York, NY 10001',
        email: 'info@globalsupplies.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: 'Premium Parts Ltd.',
        phone: '+1-555-0303',
        address: '789 Industrial Blvd, Chicago, IL 60601',
        email: 'sales@premiumparts.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        name: 'Quick Solutions Inc.',
        phone: '+1-555-0404',
        address: '321 Fast Lane, Dallas, TX 75201',
        email: 'hello@quicksolutions.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        name: 'Reliable Resources',
        phone: '+1-555-0505',
        address: '654 Trust Way, Seattle, WA 98101',
        email: 'support@reliableresources.com',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('vendors', null, {});
  }
}; 