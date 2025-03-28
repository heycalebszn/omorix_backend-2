import express from 'express';
import { authenticateToken, requireRole } from '../utils/authMiddleware.js';
import { getAllCategories, getCategoryDetails, createMainCategory, createSubCategory, createSubSubCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { categorySchema } from '../validations/index.js';
import { ROLES } from '../constants/constant.js';
import { validateRequest } from '../middlewares/authValidate.js';
import { uploadCategoryImage } from '../middlewares/authValidate.js';


const router = express.Router();

router.get('/categories', getAllCategories);
router.get('/categories/:id', getCategoryDetails);
router.post('/admin/categories', authenticateToken, requireRole(ROLES.ADMIN), uploadCategoryImage, validateRequest(categorySchema), createMainCategory);
router.post('/admin/categories/:categoryId/sub', authenticateToken, requireRole(ROLES.ADMIN), uploadCategoryImage, validateRequest(categorySchema), createSubCategory);
router.post('/admin/categories/:subCategoryId/sub', authenticateToken, requireRole(ROLES.ADMIN), uploadCategoryImage, validateRequest(categorySchema), createSubSubCategory);
router.patch('/admin/categories/:id', authenticateToken, requireRole(ROLES.ADMIN), uploadCategoryImage, validateRequest(categorySchema), updateCategory);
router.delete('/admin/categories/:id', authenticateToken, requireRole(ROLES.ADMIN), deleteCategory);

export default router;