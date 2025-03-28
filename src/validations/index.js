import Joi from 'joi'
import { ERROR_MESSAGES, VALIDATION, PAYMENT_METHODS, SHIPPING_METHODS } from '../constants/constant.js'
import { PRODUCT_STATUS } from '../constants/constant.js'

// User Registration Validation Schema
export const registerSchema = Joi.object({
    email: Joi.string().pattern(VALIDATION.EMAIL_REGEX).required().messages({
        'string.pattern.base': ERROR_MESSAGES.INVALID_USER_DATA,
        'any.required': ERROR_MESSAGES.VALIDATION_ERROR
    }),
    password: Joi.string()
        .min(VALIDATION.PASSWORD_MIN_LENGTH)
        .pattern(VALIDATION.PASSWORD_REGEX)
        .required()
        .messages({
            'string.min': `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters long.`,
            'string.pattern.base': 'Password must include at least one uppercase letter, one number, and one special character.',
            'any.required': ERROR_MESSAGES.VALIDATION_ERROR
        }),

    firstName: Joi.string().min(2).max(50).required().messages({
        'string.min': ERROR_MESSAGES.INVALID_USER_DATA,
        'string.max': ERROR_MESSAGES.INVALID_USER_DATA,
        'any.required': ERROR_MESSAGES.VALIDATION_ERROR
    }),
    lastName: Joi.string().min(2).max(50).required().messages({
        'string.min': ERROR_MESSAGES.INVALID_USER_DATA,
        'string.max': ERROR_MESSAGES.INVALID_USER_DATA,
        'any.required': ERROR_MESSAGES.VALIDATION_ERROR
    }),
    phone: Joi.string().pattern(VALIDATION.PHONE_REGEX).required().messages({
        'string.pattern.base': 'Phone number must be in a valid format (e.g., +1234567890)',
        'any.required': 'Phone number is required'
    }),
    role: Joi.string().valid('admin', 'customer').optional()
})

// Login Validation Schema
export const loginSchema = Joi.object({
    email: Joi.string().pattern(VALIDATION.EMAIL_REGEX).required().messages({
        'string.pattern.base': ERROR_MESSAGES.INVALID_CREDENTIALS,
        'any.required': ERROR_MESSAGES.VALIDATION_ERROR
    }),
    password: Joi.string().required().messages({
        'any.required': ERROR_MESSAGES.VALIDATION_ERROR
    })
})

// OTP Verification Schema
export const otpVerificationSchema = Joi.object({
    userId: Joi.string().required().messages({ 'any.required': ERROR_MESSAGES.VALIDATION_ERROR }),
    otp: Joi.string().length(6).required().messages({
        'string.length': ERROR_MESSAGES.INVALID_OTP,
        'any.required': ERROR_MESSAGES.VALIDATION_ERROR
    })
})

// Forgot Password Schema
export const forgotPasswordSchema = Joi.object({
    email: Joi.string().pattern(VALIDATION.EMAIL_REGEX).required().messages({
        'string.pattern.base': ERROR_MESSAGES.USER_NOT_FOUND,
        'any.required': ERROR_MESSAGES.VALIDATION_ERROR
    })
})

// Reset Password Schema
export const resetPasswordSchema = Joi.object({
    userId: Joi.string().required().messages({ 'any.required': ERROR_MESSAGES.VALIDATION_ERROR }),
    otp: Joi.string().length(6).required().messages({
        'string.length': ERROR_MESSAGES.INVALID_OTP,
        'any.required': ERROR_MESSAGES.VALIDATION_ERROR
    }),
    newPassword: Joi.string()
        .pattern(VALIDATION.PASSWORD_REGEX)
        .min(VALIDATION.PASSWORD_MIN_LENGTH)
        .required()
        .messages({
            'string.pattern.base': ERROR_MESSAGES.PASSWORD_TOO_WEAK,
            'string.min': ERROR_MESSAGES.PASSWORD_TOO_WEAK,
            'any.required': ERROR_MESSAGES.VALIDATION_ERROR
        })
})

// Change Password Schema
export const changePasswordSchema = Joi.object({
    oldPassword: Joi.string()
        .required()
        .messages({ 'any.required': ERROR_MESSAGES.VALIDATION_ERROR }),
    newPassword: Joi.string()
        .pattern(VALIDATION.PASSWORD_REGEX)
        .min(VALIDATION.PASSWORD_MIN_LENGTH)
        .required()
        .messages({
            'string.pattern.base': ERROR_MESSAGES.PASSWORD_TOO_WEAK,
            'string.min': ERROR_MESSAGES.PASSWORD_TOO_WEAK,
            'any.required': ERROR_MESSAGES.VALIDATION_ERROR
        })
})

export const productSchema = Joi.object({
    name: Joi.string().required(),
    slug: Joi.string().required(),
    description: Joi.string().optional(),
    price: Joi.number().precision(2).positive().required(),
    discountPercentage: Joi.number().integer().min(0).max(100).optional(),
    stockQuantity: Joi.number().integer().min(0).optional(), // Optional since variants handle stock
    sku: Joi.string().required(),
    isActive: Joi.string()
        .valid(...Object.values(PRODUCT_STATUS))
        .optional(),
    featuredImage: Joi.string().uri().optional(),
    categoryIds: Joi.array()
        .items(Joi.string().uuid().required())
        .min(1)
        .required(),
    variants: Joi.array()
        .items(
            Joi.object({
                size: Joi.string().optional(),
                color: Joi.string().optional(),
                material: Joi.string().optional(),
                price: Joi.number().precision(2).positive().optional(),
                stockQuantity: Joi.number().integer().min(0).required()
            })
        )
        .min(1) // At least one variant is required
        .required() // Make variants mandatory
}).unknown(false); // Disallow unknown fields

export const updateProductSchema = Joi.object({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    price: Joi.number().precision(2).positive().optional(),
    discountPercentage: Joi.number().integer().min(0).max(100).optional(),
    stockQuantity: Joi.number().integer().min(0).optional(),
    sku: Joi.string().optional(),
    isActive: Joi.string()
        .valid(...Object.values(PRODUCT_STATUS))
        .optional(),
    featuredImage: Joi.string().uri().optional(),
});

export const categorySchema = Joi.object({
    name: Joi.string().required(),
    slug: Joi.string().required(),
    description: Joi.string().optional(),
    image: Joi.string().uri().optional(),
    isActive: Joi.boolean().optional(),
    displayOrder: Joi.number().integer().optional(),
    parentId: Joi.string().uuid().optional()
});

export const orderSchema = Joi.object({
    items: Joi.array().items(Joi.object({
        productId: Joi.string().uuid().required(),
        variantId: Joi.string().uuid().optional(),
        quantity: Joi.number().integer().min(1).required(),
        unitPrice: Joi.number().precision(2).required()
    })).min(1).required(),
    shippingFirstName: Joi.string().optional(),
    shippingLastName: Joi.string().optional(),
    shippingAddress: Joi.string().required(),
    shippingCity: Joi.string().optional(),
    shippingState: Joi.string().optional(),
    shippingZip: Joi.string().optional(),
    shippingCountry: Joi.string().optional(),
    shippingPhone: Joi.string().optional(),
    shippingMethod: Joi.string().valid(...Object.values(SHIPPING_METHODS)).required(),
    email: Joi.string().email().optional(),
    paymentMethod: Joi.string().valid(...Object.values(PAYMENT_METHODS)).required(),
    paystackReference: Joi.string().optional()
});

export const cartItemSchema = Joi.object({
    productId: Joi.string().uuid().required(),
    variantId: Joi.string().uuid().optional(),
    quantity: Joi.number().integer().min(1).required()
});

export const cartUpdateSchema = Joi.object({
    items: Joi.array().items(cartItemSchema).min(1).required()
});

