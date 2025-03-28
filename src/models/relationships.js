import User from './user.js'
import Customer from './customer.js'
import Category from './category.js'
import Product from './product.js'
import ProductImage from './productImage.js'
import ProductCategory from './productCategory.js'
import ProductVariant from './productVariant.js'
import Review from './review.js'
import Order from './order.js'
import OrderItem from './orderItem.js'
import Cart from './cart.js'
import CartItem from './cartItem.js'
import AdminLog from './adminLog.js'
import Address from './address.js'

// Category self-referencing relationship
Category.belongsTo(Category, { as: 'parent', foreignKey: 'parentId' })
Category.hasMany(Category, { as: 'subcategories', foreignKey: 'parentId' })

// Product-Category relationship
Product.belongsToMany(Category, { through: ProductCategory, foreignKey: 'productId', as: 'categories' });
Category.belongsToMany(Product, { through: ProductCategory, foreignKey: 'categoryId', as: 'products' });


// Product relationships
Product.hasMany(ProductImage, { foreignKey: 'productId', as: 'images' })
ProductImage.belongsTo(Product, { foreignKey: 'productId' })

Product.hasMany(ProductVariant, { foreignKey: 'productId', as: 'variants' })
ProductVariant.belongsTo(Product, { foreignKey: 'productId' })

// User relationships
User.hasOne(Customer, { foreignKey: 'userId', as: 'customerProfile' })
Customer.belongsTo(User, { foreignKey: 'userId' })

User.hasMany(Order, { foreignKey: 'userId', as: 'orders' })
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' })

User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' })
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' })

// Product and Review relationships
Product.hasMany(Review, { foreignKey: 'productId', as: 'reviews' })
Review.belongsTo(Product, { foreignKey: 'productId', as: 'product' })

// Order and OrderItem relationships
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' })
OrderItem.belongsTo(Order, { foreignKey: 'orderId' })

// Product and OrderItem relationships
Product.hasMany(OrderItem, { foreignKey: 'productId' })
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' })

// ProductVariant and OrderItem relationships
ProductVariant.hasMany(OrderItem, { foreignKey: 'variantId' })
OrderItem.belongsTo(ProductVariant, { foreignKey: 'variantId', as: 'variant' })

// User and Cart relationships
User.hasMany(Cart, { foreignKey: 'userId', as: 'carts' })
Cart.belongsTo(User, { foreignKey: 'userId', as: 'user' })

// Cart and CartItem relationships
Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'items' })
CartItem.belongsTo(Cart, { foreignKey: 'cartId' })

// Product and CartItem relationships
Product.hasMany(CartItem, { foreignKey: 'productId' })
CartItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' })

// ProductVariant and CartItem relationships
ProductVariant.hasMany(CartItem, { foreignKey: 'variantId' })
CartItem.belongsTo(ProductVariant, { foreignKey: 'variantId', as: 'variant' })

// AdminLog and User relationships
User.hasMany(AdminLog, { foreignKey: 'userId', as: 'adminLogs' })
AdminLog.belongsTo(User, { foreignKey: 'userId' })

// Address 
// Address associations
User.hasMany(Address, { foreignKey: 'userId' });
Address.belongsTo(User, { foreignKey: 'userId' });

export {
    User,
    Customer,
    Category,
    Product,
    ProductImage,
    ProductCategory,
    ProductVariant,
    Review,
    Order,
    OrderItem,
    Cart,
    CartItem,
    AdminLog,
    Address
}
