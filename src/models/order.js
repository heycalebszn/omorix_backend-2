import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import {
  ORDER_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHODS,
  SHIPPING_METHODS,
} from '../constants/constant.js';

const Order = sequelize.define(
  'Order',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    orderNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ORDER_STATUS)),
      defaultValue: ORDER_STATUS.PENDING,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    tax: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    deliveryFee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    shippingCost: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    discount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shippingFirstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shippingLastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    deliveryAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shippingAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shippingCity: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    postCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shippingZip: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shippingCountry: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shippingPhone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    paymentMethod: {
      type: DataTypes.ENUM(...Object.values(PAYMENT_METHODS)),
      allowNull: false,
    },
    paymentStatus: {
      type: DataTypes.ENUM(...Object.values(PAYMENT_STATUS)),
      defaultValue: PAYMENT_STATUS.PENDING,
    },
    shippingMethod: {
      type: DataTypes.ENUM(...Object.values(SHIPPING_METHODS)),
      defaultValue: SHIPPING_METHODS.STANDARD,
    },
    processedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    shippedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deliveredAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    cancelledAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    refundedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    cancelReason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    trackingNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    trackingUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // PayPal specific fields
    paypalOrderId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paypalCaptureId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paypalPayerId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paypalTransactionFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    paypalPaymentStatus: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    indexes: [
      { name: 'order_user_index', fields: ['userId'] },
      { name: 'order_number_index', fields: ['orderNumber'], unique: true },
      { name: 'order_status_index', fields: ['status'] },
      { name: 'order_payment_status_index', fields: ['paymentStatus'] },
      { name: 'order_created_at_index', fields: ['createdAt'] },
      { name: 'order_paypal_order_id_index', fields: ['paypalOrderId'] },
      { name: 'order_paypal_capture_id_index', fields: ['paypalCaptureId'] },
    ],
  },
);

export default Order;
