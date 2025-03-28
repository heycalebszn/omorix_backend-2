// migrations/[timestamp]-fix-paypal-fields.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if columns exist first
    const tableInfo = await queryInterface.describeTable('Orders');

    const columns = {
      paypalOrderId: { type: Sequelize.STRING, allowNull: true },
      paypalCaptureId: { type: Sequelize.STRING, allowNull: true },
      paypalPayerId: { type: Sequelize.STRING, allowNull: true },
      paypalTransactionFee: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
      paypalPaymentStatus: { type: Sequelize.STRING, allowNull: true },
      paidAt: { type: Sequelize.DATE, allowNull: true },
    };

    for (const [columnName, definition] of Object.entries(columns)) {
      if (!tableInfo[columnName]) {
        await queryInterface.addColumn('Orders', columnName, definition);
      }
    }
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Orders', 'paypalOrderId');
    await queryInterface.removeColumn('Orders', 'paypalCaptureId');
    await queryInterface.removeColumn('Orders', 'paypalPayerId');
    await queryInterface.removeColumn('Orders', 'paypalTransactionFee');
    await queryInterface.removeColumn('Orders', 'paypalPaymentStatus');
    await queryInterface.removeColumn('Orders', 'paidAt');
  },
};
