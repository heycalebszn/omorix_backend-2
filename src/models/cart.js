import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'
import { CART_STATUS } from '../constants/constant.js'

const Cart = sequelize.define(
  'Cart',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    sessionId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM(...Object.values(CART_STATUS)),
      defaultValue: CART_STATUS.ACTIVE
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    timestamps: true,
    indexes: [
      { name: 'cart_user_index', fields: ['userId'] },
      { name: 'cart_session_index', fields: ['sessionId'] }
    ]
  }
)

export default Cart
