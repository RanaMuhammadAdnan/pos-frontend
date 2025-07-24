'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, get the city IDs
    const cities = await queryInterface.sequelize.query(
      'SELECT id FROM cities LIMIT 8',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (cities.length === 0) {
      console.log('No cities found. Please run the cities seeder first.');
      return;
    }

    const cityIds = cities.map(city => city.id);

    await queryInterface.bulkInsert('customers', [
      {
        name: 'John Doe',
        phone: '+91-9876543210',
        address: '123 Main Street, Andheri West',
        email: 'john.doe@email.com',
        cityId: cityIds[0],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Jane Smith',
        phone: '+91-8765432109',
        address: '456 Park Avenue, Bandra East',
        email: 'jane.smith@email.com',
        cityId: cityIds[1],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Mike Johnson',
        phone: '+91-7654321098',
        address: '789 Oak Road, Worli',
        email: 'mike.johnson@email.com',
        cityId: cityIds[2],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Sarah Wilson',
        phone: '+91-6543210987',
        address: '321 Pine Street, Dadar',
        email: 'sarah.wilson@email.com',
        cityId: cityIds[3],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'David Brown',
        phone: '+91-5432109876',
        address: '654 Elm Avenue, Powai',
        email: 'david.brown@email.com',
        cityId: cityIds[4],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Lisa Davis',
        phone: '+91-4321098765',
        address: '987 Maple Drive, Vashi',
        email: 'lisa.davis@email.com',
        cityId: cityIds[5],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Robert Miller',
        phone: '+91-3210987654',
        address: '147 Cedar Lane, Thane',
        email: 'robert.miller@email.com',
        cityId: cityIds[6],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Emily Taylor',
        phone: '+91-2109876543',
        address: '258 Birch Street, Navi Mumbai',
        email: 'emily.taylor@email.com',
        cityId: cityIds[7],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('customers', null, {});
  }
}; 