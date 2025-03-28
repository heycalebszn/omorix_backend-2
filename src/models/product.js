import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { PRODUCT_STATUS } from '../constants/constant.js';

const Product = sequelize.define(
  'Product',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    discountPercentage: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
        max: 100,
      },
    },
    stockQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,

      field: 'stockQuantity'


    },
    sku: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    isActive: {
      type: DataTypes.ENUM(...Object.values(PRODUCT_STATUS)),
      defaultValue: PRODUCT_STATUS.ACTIVE,
    },
    featuredImage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    indexes: [
      { name: 'product_slug_index', fields: ['slug'], unique: true },
      { name: 'product_sku_index', fields: ['sku'], unique: true },
    ],
  },
);

export default Product;
