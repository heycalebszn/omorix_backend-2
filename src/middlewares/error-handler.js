import { HTTP_STATUS_CODES, ERROR_MESSAGES, ERROR_TYPES } from '../constants/constant.js'
import logger from '../utils/logger.js'

export const errorHandler = (err, req, res, next) => {
    // Make sure we haven't already sent a response
    if (res.headersSent) {
        return next(err)
    }

    let statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
    let message = ERROR_MESSAGES.INTERNAL_SERVER_ERROR
    let errorType = ERROR_TYPES.SERVER

    // Check if error has a custom status code or message
    if (err.statusCode) {
        statusCode = err.statusCode
    }

    if (err.customMessage) {
        message = err.customMessage
    }

    // Handle specific error types
    switch (err.name) {
        case 'ValidationError':
            statusCode = HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY
            message = err.message || ERROR_MESSAGES.VALIDATION_ERROR
            errorType = ERROR_TYPES.VALIDATION
            break
        case 'SequelizeUniqueConstraintError': {
            statusCode = HTTP_STATUS_CODES.CONFLICT

            // Specifically check for email uniqueness violation
            const emailError = err.errors &&
                Array.isArray(err.errors) &&
                err.errors.find(e => e.path === 'email' && e.type === 'unique violation')

            if (emailError) {
                message = ERROR_MESSAGES.EMAIL_ALREADY_EXISTS
            } else {
                message = ERROR_MESSAGES.RESOURCE_ALREADY_EXISTS
            }
            errorType = ERROR_TYPES.VALIDATION
            break
        }
        case 'UnauthorizedError':
            statusCode = HTTP_STATUS_CODES.UNAUTHORIZED
            message = ERROR_MESSAGES.UNAUTHORIZED
            errorType = ERROR_TYPES.AUTHENTICATION
            break
        case 'JsonWebTokenError':
            statusCode = HTTP_STATUS_CODES.UNAUTHORIZED
            message = ERROR_MESSAGES.INVALID_TOKEN
            errorType = ERROR_TYPES.AUTHENTICATION
            break
        case 'TokenExpiredError':
            statusCode = HTTP_STATUS_CODES.UNAUTHORIZED
            message = ERROR_MESSAGES.EXPIRED_TOKEN
            errorType = ERROR_TYPES.AUTHENTICATION
            break
        case 'OtpVerificationError':
            statusCode = HTTP_STATUS_CODES.BAD_REQUEST
            message = err.message || ERROR_MESSAGES.INVALID_OTP
            errorType = ERROR_TYPES.VALIDATION
            break
        case 'OtpExpiredError':
            statusCode = HTTP_STATUS_CODES.BAD_REQUEST
            message = ERROR_MESSAGES.EXPIRED_TOKEN
            errorType = ERROR_TYPES.VALIDATION
            break
        case 'EmailSendingError':
            statusCode = HTTP_STATUS_CODES.SERVICE_UNAVAILABLE
            message = ERROR_MESSAGES.EMAIL_SENDING_FAILED
            errorType = ERROR_TYPES.SERVER
            break
        case 'RateLimitError':
            statusCode = HTTP_STATUS_CODES.TOO_MANY_REQUESTS
            message = ERROR_MESSAGES.RESOURCE_ALREADY_EXISTS
            errorType = ERROR_TYPES.CLIENT
            break
    }

    // Log the error with appropriate level based on severity
    if (statusCode >= 500) {
        logger.error(`[${errorType}] ${message}:`, err)
    } else {
        logger.warn(`[${errorType}] ${message}:`, err)
    }

    // Clean up the error object for safer serialization
    const safeError = process.env.NODE_ENV === 'development' ? {
        name: err.name,
        message: err.message,
        stack: err.stack
    } : undefined

    // Format the errors array for response
    const formattedErrors = err.errors && Array.isArray(err.errors)
        ? err.errors.map(e => ({
            message: e.message,
            path: e.path,
            value: e.value
        }))
        : null

    // Send the response
    return res.status(statusCode).json({
        success: false,
        message,
        errorType,
        errors: formattedErrors,
        ...(process.env.NODE_ENV === 'development' && { error: safeError })
    })
}

// Helper function to create custom errors
export const createError = (message, statusCode, errorType, name = 'ApplicationError') => {
    const error = new Error(message)
    error.name = name
    error.statusCode = statusCode
    error.errorType = errorType
    error.customMessage = message
    return error
}