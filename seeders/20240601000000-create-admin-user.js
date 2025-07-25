const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if admin user already exists
    const [admin] = await queryInterface.sequelize.query(
      "SELECT * FROM users WHERE username = 'admin';"
    );
    if (!admin.length) {
      const hash = await bcrypt.hash('admin@123', 10);
      await queryInterface.bulkInsert('users', [
        {
          username: 'admin',
          email: 'admin@example.com',
          password: hash,
          role: 'admin',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
    }
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', { username: 'admin' });
  }
}; 