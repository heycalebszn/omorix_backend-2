import express from 'express';
import { createAddress, getAddresses, updateAddress, deleteAddress, setDefaultAddress } from '../controllers/addressController.js';
import { authenticateToken } from '../utils/authMiddleware.js';

const router = express.Router();

// Address management routes (authenticated users only)
router.post('/', authenticateToken, createAddress); // Create a new address
router.get('/', authenticateToken, getAddresses); // Get all addresses
router.put('/:addressId', authenticateToken, updateAddress); // Update an address
router.delete('/:addressId', authenticateToken, deleteAddress); // Delete an address
router.patch('/:addressId/default', authenticateToken, setDefaultAddress); // Set an address as default

export default router;