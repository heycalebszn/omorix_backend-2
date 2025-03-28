import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const OrderItem = sequelize.define(
    'OrderItem',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        orderId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Orders',
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
            allowNull: true,
            references: {
                model: 'ProductVariants',
                key: 'id'
            }
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1
            }
        },
        unitPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        subtotal: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        discount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            defaultValue: 0.0
        },

        productSnapshot: {
            type: DataTypes.JSON,
            allowNull: true
        },
        // Added properties for handling returns/refunds
        isRefunded: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        refundAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },
        refundedAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        refundReason: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },
    {
        timestamps: true,
        indexes: [
            { name: 'order_item_order_index', fields: ['orderId'] },
            { name: 'order_item_product_index', fields: ['productId'] },
            { name: 'order_item_variant_index', fields: ['variantId'] }
        ],
        hooks: {
            beforeCreate: (item) => {
                if (!item.subtotal && item.unitPrice && item.quantity) {
                    item.subtotal = parseFloat(item.unitPrice) * item.quantity
                }
            }
        }
    }
)

export default OrderItem