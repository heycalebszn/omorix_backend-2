// 'use strict';

// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up(queryInterface, Sequelize) {
//     try {
//       // Check if columns already exist before adding
//       const tableInfo = await queryInterface.describeTable('Orders');

//       if (!tableInfo.paypalOrderId) {
//         await queryInterface.addColumn('Orders', 'paypalOrderId', {
//           type: Sequelize.STRING,
//           allowNull: true,
//         });
//       }

//       if (!tableInfo.paypalCaptureId) {
//         await queryInterface.addColumn('Orders', 'paypalCaptureId', {
//           type: Sequelize.STRING,
//           allowNull: true,
//         });
//       }

//       if (!tableInfo.paypalPayerId) {
//         await queryInterface.addColumn('Orders', 'paypalPayerId', {
//           type: Sequelize.STRING,
//           allowNull: true,
//         });
//       }

//       if (!tableInfo.paypalTransactionFee) {
//         await queryInterface.addColumn('Orders', 'paypalTransactionFee', {
//           type: Sequelize.DECIMAL(10, 2),
//           allowNull: true,
//         });
//       }

//       if (!tableInfo.paypalPaymentStatus) {
//         await queryInterface.addColumn('Orders', 'paypalPaymentStatus', {
//           type: Sequelize.STRING,
//           allowNull: true,
//         });
//       }

//       if (!tableInfo.paidAt) {
//         await queryInterface.addColumn('Orders', 'paidAt', {
//           type: Sequelize.DATE,
//           allowNull: true,
//         });
//       }
//     } catch (error) {
//       console.error('Migration error:', error);
//       throw error;
//     }
//   },

//   async down(queryInterface, Sequelize) {
//     try {
//       await queryInterface.removeColumn('Orders', 'paypalOrderId');
//       await queryInterface.removeColumn('Orders', 'paypalCaptureId');
//       await queryInterface.removeColumn('Orders', 'paypalPayerId');
//       await queryInterface.removeColumn('Orders', 'paypalTransactionFee');
//       await queryInterface.removeColumn('Orders', 'paypalPaymentStatus');
//       await queryInterface.removeColumn('Orders', 'paidAt');
//     } catch (error) {
//       console.error('Migration error:', error);
//       throw error;
//     }
//   },
// };

// migrations/20250327000001-add-paypal-fields.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('Orders');

    const columnsToAdd = [
      { name: 'paypalOrderId', type: Sequelize.STRING, allowNull: true },
      { name: 'paypalCaptureId', type: Sequelize.STRING, allowNull: true },
      { name: 'paypalPayerId', type: Sequelize.STRING, allowNull: true },
      { name: 'paypalTransactionFee', type: Sequelize.DECIMAL(10, 2), allowNull: true },
      { name: 'paypalPaymentStatus', type: Sequelize.STRING, allowNull: true },
      { name: 'paidAt', type: Sequelize.DATE, allowNull: true },
    ];

    for (const column of columnsToAdd) {
      if (!tableInfo[column.name]) {
        await queryInterface.addColumn('Orders', column.name, {
          type: column.type,
          allowNull: column.allowNull,
        });
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
