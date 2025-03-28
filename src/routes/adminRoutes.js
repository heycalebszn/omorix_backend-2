import express from 'express';
import { authenticateToken, requireRole } from '../utils/authMiddleware.js';
import { getDashboard, getAllOrders, updateOrderStatus, cancelOrder, getAllCustomers, getCustomerDetails, banCustomer, deleteCustomer } from '../controllers/adminController.js';
import { ROLES } from '../constants/constant.js';


const router = express.Router();

router.get('/dashboard', authenticateToken, requireRole(ROLES.ADMIN), getDashboard);
router.get('/orders', authenticateToken, requireRole(ROLES.ADMIN), getAllOrders);
router.patch('/orders/:id', authenticateToken, requireRole(ROLES.ADMIN), updateOrderStatus);
router.delete('/orders/:id', authenticateToken, requireRole(ROLES.ADMIN), cancelOrder);
router.get('/customers', authenticateToken, requireRole(ROLES.ADMIN), getAllCustomers);
router.get('/customers/:id', authenticateToken, requireRole(ROLES.ADMIN), getCustomerDetails);
router.patch('/customers/:id/ban', authenticateToken, requireRole(ROLES.ADMIN), banCustomer);
router.delete('/customers/:id', authenticateToken, requireRole(ROLES.ADMIN), deleteCustomer);

export default router;