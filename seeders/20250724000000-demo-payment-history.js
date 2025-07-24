'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Get existing sale invoices
    const saleInvoices = await queryInterface.sequelize.query(
      'SELECT id, "totalAmount", "remainingAmount" FROM sale_invoices WHERE "remainingAmount" < "totalAmount"',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (saleInvoices.length === 0) {
      console.log('No sale invoices found for payment history seeding');
      return;
    }

    const paymentHistoryData = [];

    for (const invoice of saleInvoices) {
      const totalPaid = invoice.totalAmount - invoice.remainingAmount;
      
      // Create 1-3 payment records for each invoice
      const numPayments = Math.floor(Math.random() * 3) + 1;
      const paymentMethods = ['Cash', 'Card', 'Bank Transfer', 'Check'];
      
      for (let i = 0; i < numPayments; i++) {
        const paymentAmount = i === numPayments - 1 
          ? totalPaid - (paymentHistoryData.filter(p => p.saleInvoiceId === invoice.id).reduce((sum, p) => sum + p.amount, 0))
          : Math.floor(totalPaid / numPayments * 100) / 100;
        
        if (paymentAmount > 0) {
          paymentHistoryData.push({
            saleInvoiceId: invoice.id,
            amount: paymentAmount,
            paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
            paymentDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
            notes: `Payment ${i + 1} of ${numPayments}`,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      }
    }

    if (paymentHistoryData.length > 0) {
      await queryInterface.bulkInsert('payment_history', paymentHistoryData);
      console.log(`Created ${paymentHistoryData.length} payment history records`);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('payment_history', null, {});
  }
}; 