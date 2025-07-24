module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('expenses', [
      {
        description: 'Office Rent',
        amount: 15000,
        date: new Date('2024-07-01'),
      },
      {
        description: 'Internet Bill',
        amount: 1200,
        date: new Date('2024-07-02'),
      },
      {
        description: 'Stationery',
        amount: 800,
        date: new Date('2024-07-03'),
      },
      {
        description: 'Electricity Bill',
        amount: 3500,
        date: new Date('2024-07-04'),
      },
    ]);
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('expenses', null, {});
  },
}; 