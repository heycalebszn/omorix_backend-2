import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const ProductVariant = sequelize.define(
  'ProductVariant',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'id'
      }
    },
    size: {
      type: DataTypes.STRING,
      allowNull: true
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true
    },
    material: {
      type: DataTypes.STRING,
      allowNull: true
    },
    additionalAttributes: {
      type: DataTypes.JSON,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
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
      unique: true
    }
  },
  {
    timestamps: true,
    paranoid: true,
    indexes: [
      { name: 'variant_sku_index', fields: ['sku'], unique: true },
      { name: 'variant_product_index', fields: ['productId'] }
    ]
  }
)

export default ProductVariant
