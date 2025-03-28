import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const ProductImage = sequelize.define(
  'ProductImage',
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
    imageData: {
      type: DataTypes.TEXT('long'),
      allowNull: true
    },
    mimeType: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    timestamps: true,
    paranoid: true,
    indexes: [  // Added indexes for better query performance
      {
        fields: ['productId']
      }
    ]
  }
)

export default ProductImage
