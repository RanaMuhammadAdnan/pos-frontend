'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('cities', [
      {
        name: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Delhi',
        state: 'Delhi',
        country: 'India',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Bangalore',
        state: 'Karnataka',
        country: 'India',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Hyderabad',
        state: 'Telangana',
        country: 'India',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Chennai',
        state: 'Tamil Nadu',
        country: 'India',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Kolkata',
        state: 'West Bengal',
        country: 'India',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Pune',
        state: 'Maharashtra',
        country: 'India',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Ahmedabad',
        state: 'Gujarat',
        country: 'India',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('cities', null, {});
  }
}; 