import express from 'express';
import { authenticateToken, optionalAuthenticateToken } from '../utils/authMiddleware.js';
import { 
    createPaymentOrder, 
    capturePayment, 
    handlePayPalWebhook,
    getPaymentStatus
} from '../controllers/paypalController.js';

const router = express.Router();

/**
 * @route   POST /api/payments/paypal/create/:orderId
 * @desc    Create a PayPal order for an existing order
 * @access  Private/Public (with optional authentication for guest checkout)
 */
router.post('/paypal/create/:orderId', optionalAuthenticateToken, createPaymentOrder);

/**
 * @route   POST /api/payments/paypal/capture/:paypalOrderId
 * @desc    Capture a PayPal payment
 * @access  Public
 */
router.post('/paypal/capture/:paypalOrderId', capturePayment);

/**
 * @route   POST /api/payments/paypal/webhook
 * @desc    Handle PayPal webhook events
 * @access  Public
 */
router.post('/paypal/webhook', handlePayPalWebhook);

/**
 * @route   GET /api/payments/status/:orderId
 * @desc    Get payment status for an order
 * @access  Private/Public (with optional authentication for guest checkout)
 */
router.get('/status/:orderId', optionalAuthenticateToken, getPaymentStatus);

export default router;