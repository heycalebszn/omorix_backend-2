import express from 'express';
import { authenticateToken, optionalAuthenticateToken } from '../utils/authMiddleware.js';
import { placeOrder, getOrderDetails, getOrderStatus, cancelOrder, getCustomerOrders } from '../controllers/orderController.js';
import { getCart, addToCart, updateCart, removeFromCart, checkout } from '../controllers/cartController.js';
import { validateRequest } from '../middlewares/authValidate.js';
import { cartItemSchema, cartUpdateSchema, orderSchema } from '../validations/index.js';
import Joi from 'joi';

const router = express.Router();

// Routes that support both authenticated users and guests
router.get('/cart/:cartId', optionalAuthenticateToken, getCart);
router.post('/cart', optionalAuthenticateToken, validateRequest(cartItemSchema), addToCart);
router.post('/cart/checkout', optionalAuthenticateToken, checkout);

// Routes that require authentication
router.patch('/cart', authenticateToken, validateRequest(cartUpdateSchema), updateCart);
router.delete('/cart', authenticateToken, validateRequest(cartItemSchema), removeFromCart);
router.post('/', authenticateToken, validateRequest(orderSchema), placeOrder);
router.get('/', authenticateToken, getCustomerOrders);
router.get('/:orderId', authenticateToken, getOrderDetails);
router.get('/status/:orderId', getOrderStatus);
router.post('/cancel/:orderId', authenticateToken, validateRequest(Joi.object({ cancelReason: Joi.string().optional() })), cancelOrder);

export default router;