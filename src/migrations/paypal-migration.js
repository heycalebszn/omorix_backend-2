// Create a new migration file in your migrations folder
// e.g., migrations/20250327-add-paypal-fields-to-orders.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Orders', 'paypalOrderId', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Orders', 'paypalCaptureId', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Orders', 'paypalPayerId', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Orders', 'paypalTransactionFee', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    });

    await queryInterface.addColumn('Orders', 'paypalPaymentStatus', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Orders', 'paidAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Orders', 'paypalOrderId');
    await queryInterface.removeColumn('Orders', 'paypalCaptureId');
    await queryInterface.removeColumn('Orders', 'paypalPayerId');
    await queryInterface.removeColumn('Orders', 'paypalTransactionFee');
    await queryInterface.removeColumn('Orders', 'paypalPaymentStatus');
    await queryInterface.removeColumn('Orders', 'paidAt');
  },
};
