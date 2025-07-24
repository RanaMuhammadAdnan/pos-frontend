'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add status column if it doesn't exist
    try {
      await queryInterface.addColumn('sale_invoices', 'status', {
        type: Sequelize.ENUM('complete', 'pending', 'returned'),
        allowNull: false,
        defaultValue: 'pending',
      });
    } catch (error) {
      console.log('Status column might already exist:', error.message);
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.removeColumn('sale_invoices', 'status');
    } catch (error) {
      console.log('Error removing status column:', error.message);
    }
  }
};
