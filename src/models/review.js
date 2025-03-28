import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const Review = sequelize.define(
  'Review',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
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
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isVerifiedPurchase: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    timestamps: true,
    paranoid: true,
    indexes: [
      { name: 'review_user_product_index', fields: ['userId', 'productId'], unique: true },
      { name: 'review_product_index', fields: ['productId'] }
    ]
  }
)

export default Review
