import express from 'express';
import { authenticateToken } from '../utils/authMiddleware.js';
import { placeOrder, getOrderDetails, getOrderStatus, cancelOrder, getCustomerOrders } from '../controllers/orderController.js';
import { getCart, addToCart, updateCart, removeFromCart, checkout } from '../controllers/cartController.js';
import { validateRequest } from '../middlewares/authValidate.js';
import { cartItemSchema, cartUpdateSchema, orderSchema } from '../validations/index.js';
import Joi from 'joi';


const router = express.Router();

router.get('/cart/:cartId', authenticateToken, getCart);
router.post('/cart', authenticateToken, validateRequest(cartItemSchema), addToCart);
router.patch('/cart', authenticateToken, validateRequest(cartUpdateSchema), updateCart);
router.delete('/cart', authenticateToken, validateRequest(cartItemSchema), removeFromCart);
router.post('/cart/checkout', checkout);
router.post('/', authenticateToken, validateRequest(orderSchema), placeOrder);
router.get('/', authenticateToken, getCustomerOrders);
router.get('/:orderId', authenticateToken, getOrderDetails);
router.get('/status/:orderId', getOrderStatus);
router.post('/cancel/:orderId', authenticateToken, validateRequest(Joi.object({ cancelReason: Joi.string().optional() })), cancelOrder);

export default router;


