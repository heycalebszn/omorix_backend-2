import dotenv from 'dotenv'
dotenv.config()

export const HTTP_STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503
}

export const ERROR_MESSAGES = {
    // Server Errors
    INTERNAL_SERVER_ERROR: 'Internal server error',
    SERVICE_UNAVAILABLE: 'Service temporarily unavailable',
    DATABASE_ERROR: 'Database operation failed',

    // Authentication Errors
    INVALID_CREDENTIALS: 'Invalid email or password',
    EMAIL_ALREADY_EXISTS: 'Email already exists',
    USER_NOT_FOUND: 'User not found',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Forbidden access',
    INVALID_TOKEN: 'Invalid token',
    EXPIRED_TOKEN: 'Expired token',
    INVALID_OTP: 'Invalid or expired OTP',
    ACCOUNT_LOCKED: 'Account has been locked due to too many failed attempts',
    EMAIL_NOT_VERIFIED: 'Email is not verified',
    PASSWORD_RESET_REQUIRED: 'Password reset required',
    SESSION_EXPIRED: 'Your session has expired, please login again',

    // Resource Errors
    RESOURCE_NOT_FOUND: 'Resource not found',
    VALIDATION_ERROR: 'Validation error',
    RESOURCE_ALREADY_EXISTS: 'Resource already exists',
    RESOURCE_LIMIT_EXCEEDED: 'Resource limit exceeded',

    // User Related Errors
    INVALID_USER_DATA: 'Invalid user data provided',
    PASSWORD_TOO_WEAK: 'Password does not meet security requirements',
    PASSWORD_MISMATCH: 'Passwords do not match',

    // Order Related Errors
    ORDER_NOT_FOUND: 'Order not found',
    ORDER_ALREADY_SHIPPED: 'Order already shipped and cannot be canceled',
    ORDER_ALREADY_CANCELED: 'Order has already been canceled',
    ORDER_ALREADY_DELIVERED: 'Order has already been delivered',
    ORDER_STATUS_CHANGE_NOT_ALLOWED: 'Order status change not allowed',
    ORDER_PAYMENT_FAILED: 'Order payment failed',

    // Product Related Errors
    PRODUCT_NOT_FOUND: 'Product not found',
    PRODUCT_OUT_OF_STOCK: 'Product is out of stock',
    PRODUCT_INSUFFICIENT_STOCK: 'Insufficient product stock available',
    PRODUCT_NOT_ACTIVE: 'Product is not currently active',
    PRODUCT_VARIANT_NOT_FOUND: 'Product variant not found',

    // Category Related Errors
    CATEGORY_NOT_FOUND: 'Category not found',
    CATEGORY_CONTAINS_PRODUCTS: 'Category contains products and cannot be deleted',
    PARENT_CATEGORY_NOT_FOUND: 'Parent category not found',

    // Review Related Errors
    ALREADY_REVIEWED: 'You have already reviewed this product',
    REVIEW_NOT_FOUND: 'Review not found',
    REVIEW_NOT_ALLOWED: 'Cannot review this product (purchase verification failed)',

    // Cart Related Errors
    CART_NOT_FOUND: 'Shopping cart not found',
    CART_ITEM_NOT_FOUND: 'Item not found in cart',
    CART_EMPTY: 'Shopping cart is empty',
    CART_ITEM_OUT_OF_STOCK: 'Item in your cart is no longer available',
    MAXIMUM_CART_QUANTITY_REACHED: 'Maximum allowed quantity reached for product',

    // Payment Related Errors
    PAYMENT_FAILED: 'Payment processing failed',
    PAYMENT_GATEWAY_ERROR: 'Payment gateway error',
    PAYMENT_METHOD_NOT_SUPPORTED: 'Payment method not supported',
    PAYMENT_ALREADY_PROCESSED: 'Payment has already been processed',
    PAYMENT_REFUND_FAILED: 'Payment refund failed',
    INVALID_COUPON: 'Invalid or expired coupon code',
    COUPON_ALREADY_USED: 'Coupon has already been used',
    PAYMENT_METHODS_REQUIRED: 'Payment method is required',

    // Shipping Related Errors
    SHIPPING_METHOD_NOT_AVAILABLE: 'Shipping method not available for your location',
    INVALID_SHIPPING_ADDRESS: 'Invalid shipping address',
    ADDRESS_VALIDATION_FAILED: 'Address validation failed',
    SHIPPING_DETAILS_REQUIRED: 'Shipping details are required',

    // Rate Limiting
    TOO_MANY_REQUESTS: 'Too many requests, please try again later',

    // File Upload Errors
    FILE_UPLOAD_FAILED: 'File upload failed',
    FILE_TYPE_NOT_ALLOWED: 'File type not allowed',
    FILE_SIZE_TOO_LARGE: 'File size exceeds the maximum limit',

    // Inventory Related Errors
    INVENTORY_ADJUSTMENT_FAILED: 'Inventory adjustment failed',
    NEGATIVE_INVENTORY_NOT_ALLOWED: 'Negative inventory is not allowed',

    // Customer Related Errors
    CUSTOMER_PROFILE_NOT_FOUND: 'Customer profile not found',

    // Wish List Errors
    WISHLIST_ITEM_ALREADY_EXISTS: 'Item already exists in wishlist',
    WISHLIST_ITEM_NOT_FOUND: 'Item not found in wishlist',

    // Email Errors
    EMAIL_SENDING_FAILED: 'Failed to send verification email'
}


// User Roles
export const ROLES = {
    ADMIN: 'admin',
    CUSTOMER: 'customer',
    SELLER: 'seller'
}

// User Status
export const USER_STATUS = {
    PENDING: 'pending',
    ACTIVE: 'active',
    SUSPENDED: 'suspended',
    DELETED: 'deleted',
    BANNED: 'banned'
}

// Order Status
export const ORDER_STATUS = {
    PENDING: 'pending',
    PROCESSING: 'processing',

    PACKED: 'packed',
    SHIPPED: 'shipped',
    ACCEPTED: 'accepted',
    IN_PROGRESS: 'inProgress',
    ON_THE_WAY: 'onTheWay',
    OUT_FOR_DELIVERY: 'out_for_delivery',
    DELIVERED: 'delivered',
    CANCELED: 'canceled',
    RETURNED: 'returned',
    REFUNDED: 'refunded',
    ON_HOLD: 'on_hold'
}

// Payment Status
export const PAYMENT_STATUS = {
    PENDING: 'pending',
    PAID: 'paid',
    FAILED: 'failed',
    REFUNDED: 'refunded',
    PARTIALLY_REFUNDED: 'partially_refunded',
    AUTHORIZED: 'authorized',
    VOIDED: 'voided'
}

// Payment Methods
export const PAYMENT_METHODS = {
    CREDIT_CARD: 'credit_card',
    DEBIT_CARD: 'debit_card',
    PAYSTACK: 'paystack',
    BANK_TRANSFER: 'bank_transfer',
    CASH_ON_DELIVERY: 'cash_on_delivery',
    DIGITAL_WALLET: 'digital_wallet',
    CRYPTO: 'cryptocurrency',
    PAYPAL: 'paypal'
}

// Cart Status
export const CART_STATUS = {
    ACTIVE: 'active',
    CONVERTED: 'converted',
    ABANDONED: 'abandoned',
    MERGED: 'merged'
}

// Product Status
export const PRODUCT_STATUS = {
    DRAFT: 'draft',
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    ARCHIEVED: 'archieved',
    OUT_OF_STOCK: 'out_of_stock',
    DISCONTINUED: 'discontinued',
    COMING_SOON: 'coming_soon'
}

// Review Status
export const REVIEW_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    FLAGGED: 'flagged'
}

// Shipping Methods
export const SHIPPING_METHODS = {
    STANDARD: 'standard',
    EXPRESS: 'express',
    OVERNIGHT: 'overnight',
    LOCAL_PICKUP: 'local_pickup',
    FREE_SHIPPING: 'free_shipping',
    INTERNATIONAL: 'international'
}

// Notification Types
export const NOTIFICATION_TYPES = {
    ORDER_STATUS_CHANGE: 'order_status_change',
    PAYMENT_RECEIVED: 'payment_received',
    PAYMENT_FAILED: 'payment_failed',
    SHIPMENT_CREATED: 'shipment_created',
    DELIVERY_COMPLETED: 'delivery_completed',
    PASSWORD_RESET: 'password_reset',
    EMAIL_VERIFICATION: 'email_verification',
    PRODUCT_BACK_IN_STOCK: 'product_back_in_stock',
    PRICE_DROP: 'price_drop',
    REVIEW_APPROVED: 'review_approved',
    ACCOUNT_LOCKED: 'account_locked'
}

// Validation Constants
export const VALIDATION = {
    PASSWORD_MIN_LENGTH: 8,
    PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    EMAIL_REGEX: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    PHONE_REGEX: /^(0\d{10})$/,
    USERNAME_REGEX: /^[a-zA-Z0-9._-]{3,20}$/,
    MAX_CART_ITEMS: 50,
    MAX_WISHLIST_ITEMS: 100,
    MAX_FILE_SIZE_MB: 5,
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    MAX_REVIEW_LENGTH: 1000,
    MIN_REVIEW_LENGTH: 10,
    OTP_EXPIRY_MINUTES: 10
}

// Cache Control Constants
export const CACHE_CONTROL = {
    PRODUCTS: 'max-age=3600',
    CATEGORIES: 'max-age=7200',
    USER_PROFILE: 'no-cache',
    CART: 'no-store',
    ORDERS: 'no-cache',
    STATIC_ASSETS: 'max-age=31536000'
}

// Log Levels
export const LOG_LEVELS = {
    ERROR: 'error',
    WARN: 'warn',
    INFO: 'info',
    DEBUG: 'debug',
    TRACE: 'trace'
}

// Feature Flags
export const FEATURE_FLAGS = {
    GUEST_CHECKOUT: true,
    WISHLIST: true,
    PRODUCT_REVIEWS: true,
    PRODUCT_COMPARISON: true,
    COUPON_CODES: true,
    ABANDONED_CART_EMAILS: true,
    USER_TRACKING: true,
    MULTI_CURRENCY: false,
    MULTI_LANGUAGE: false,
    INVENTORY_ALERTS: true
}

// API Rate Limits
export const RATE_LIMITS = {
    LOGIN_ATTEMPTS: 5,
    PASSWORD_RESET: 3,
    PRODUCT_REVIEWS: 10,
    API_REQUESTS_PER_MINUTE: 60,

}

export const CURRENCIES = {
    NGN: {
        code: 'NGN',
        symbol: '₦',
        name: 'Nigerian Naira'
    }
}

// Sorting and Filtering Constants
export const PRODUCT_SORT_OPTIONS = {
    PRICE_LOW_TO_HIGH: 'price_asc',
    PRICE_HIGH_TO_LOW: 'price_desc',
    NEWEST: 'created_at_desc',
    OLDEST: 'created_at_asc',
    BEST_SELLING: 'sales_desc',
    TOP_RATED: 'rating_desc',
    RELEVANCE: 'relevance'
}

// Error Types
export const ERROR_TYPES = {
    VALIDATION: 'validation_error',
    AUTHENTICATION: 'authentication_error',
    AUTHORIZATION: 'authorization_error',
    RESOURCE: 'resource_error',
    SERVER: 'server_error',
    NETWORK: 'network_error',
    BUSINESS_LOGIC: 'business_logic_error',
    THIRD_PARTY: 'third_party_error',
    CLIENT: 'client_error'
}

export const SHIPPING_FEES = {
    [SHIPPING_METHODS.STANDARD]: 70.00, // £70 for standard shipping
    [SHIPPING_METHODS.EXPRESS]: 120.00, // £120 for express shipping
    [SHIPPING_METHODS.FREE_SHIPPING]: 0.00 // £0 for free shipping
};

const VALID_COUPONS = {
    'SAVE10': 0.10, // 10% discount
    'FREESHIP': 0.00 // Could be used to set shipping to free, but we'll handle via shippingMethod
};

export const validateCoupon = (couponCode) => {
    if (!couponCode) return { valid: false, discountRate: 0 };
    const discountRate = VALID_COUPONS[couponCode.toUpperCase()];
    if (discountRate === undefined) return { valid: false, discountRate: 0 };
    return { valid: true, discountRate };
};

export const EMAIL_CONFIG = {
    SMTP_HOST: 'smtp.gmail.com',
    SMTP_PORT: 587,
    SMTP_SECURE: false,
    SMTP_USER: process.env.GMAIL_USER,
    SMTP_PASSWORD: process.env.GMAIL_PASS,
    SENDER_NAME: process.env.SENDER_NAME,
    SENDER_EMAIL: process.env.GMAIL_USER,
    SUPPORT_EMAIL: process.env.SUPPORT_EMAIL,
    COMPANY_NAME: process.env.COMPANY_NAME,
    LOGO_URL: process.env.LOGO_URL
}




