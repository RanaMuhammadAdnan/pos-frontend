'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add remainingAmount column if it does not exist
    await queryInterface.addColumn('sale_invoices', 'remainingAmount', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    });
    // Check if status column already exists
    const [columns] = await queryInterface.sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'sale_invoices' 
      AND column_name = 'status'
    `);

    if (columns.length === 0) {
      // Add status column as string first (avoiding enum issues)
      await queryInterface.addColumn('sale_invoices', 'status', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'pending',
      });

      // Update existing records to set status based on remainingAmount
      await queryInterface.sequelize.query(`
        UPDATE sale_invoices 
        SET status = CASE 
          WHEN "remainingAmount" = 0 THEN 'complete'
          ELSE 'pending'
        END
      `);
      
      console.log('Status column added successfully as string');
    } else {
      console.log('Status column already exists');
    }
  },

  async down(queryInterface, Sequelize) {
    // Check if status column exists before trying to remove it
    const [columns] = await queryInterface.sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'sale_invoices' 
      AND column_name = 'status'
    `);

    if (columns.length > 0) {
      await queryInterface.removeColumn('sale_invoices', 'status');
    }
  }
}; 