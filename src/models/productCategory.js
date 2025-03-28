import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const ProductCategory = sequelize.define(
  'ProductCategory',
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
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Categories',
        key: 'id'
      }
    },
    isPrimary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    timestamps: true,
    paranoid: true,
    indexes: [{ name: 'product_category_index', fields: ['productId', 'categoryId'], unique: true }]
  }
)

export default ProductCategory
