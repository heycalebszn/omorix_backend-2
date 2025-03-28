import { DataTypes, Op } from 'sequelize'
import sequelize from '../config/database.js'

const CartItem = sequelize.define(
  'CartItem',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    cartId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Carts',
        key: 'id'
      }
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'id'
      }
    },
    variantId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'ProductVariants',
        key: 'id'
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1
      }
    },
    addedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    timestamps: true,
    indexes: [
      { name: 'cart_item_cart_index', fields: ['cartId'] },
      { name: 'cart_item_product_index', fields: ['productId'] },
      { name: 'cart_item_variant_index', fields: ['variantId'] },
      {
        name: 'cart_item_unique_index',
        fields: ['cartId', 'productId', 'variantId'],
        unique: true,
        where: {
          variantId: {
            [Op.ne]: null
          }
        }
      },
      {
        name: 'cart_item_unique_no_variant_index',
        fields: ['cartId', 'productId'],
        unique: true,
        where: {
          variantId: null
        }
      }
    ]
  }
)

export default CartItem
