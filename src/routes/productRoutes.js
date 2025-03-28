import express from 'express';
import { authenticateToken, requireRole } from '../utils/authMiddleware.js';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  archiveProduct,
  restoreProduct,
  addProductImages,
} from '../controllers/productController.js';
import { productSchema, updateProductSchema } from '../validations/index.js';
import { validateRequest } from '../middlewares/authValidate.js';
//import {uploadImage} from '../middlewares/authValidate.js';
import { Product, Category, ProductVariant, ProductImage } from '../models/index.js';
import ApiResponse from '../utils/ApiResponse.js';

import { HTTP_STATUS_CODES, ERROR_MESSAGES, ROLES, PRODUCT_STATUS } from '../constants/constant.js';
import { Op } from 'sequelize';
import Joi from 'joi';
import multer from 'multer';
import { getProductImage } from '../controllers/productController.js';
import { parseMultipartArrays } from '../utils/helper.js';


const router = express.Router();





const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 10 // Max 10 files
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only JPEG, PNG, and GIF images are allowed'));
    }
    cb(null, true);
  }
});




// Add this route
router.post(
  '/admin/products/:productId/images',
  authenticateToken,
  requireRole(ROLES.ADMIN),
  upload.array('images', 10), // Allow up to 10 images per upload
  addProductImages
);


router.get('/products/images/:imageId', getProductImage);


router.post(
  '/admin/products',
  authenticateToken,
  requireRole(ROLES.ADMIN),
  upload.array('images', 10),
  parseMultipartArrays,
  validateRequest(productSchema),
  createProduct,
);
router.patch(
  '/admin/products/:id',
  authenticateToken,
  requireRole(ROLES.ADMIN),
  upload.array('images', 10),
  parseMultipartArrays,
  validateRequest(updateProductSchema),
  updateProduct,
);
router.delete('/admin/products/:id', authenticateToken, requireRole(ROLES.ADMIN), deleteProduct);
router.patch(
  '/admin/products/:id/stock',
  authenticateToken,
  requireRole(ROLES.ADMIN),
  validateRequest(Joi.object({ stockQuantity: Joi.number().integer().min(0).required() })),
  updateStock,
);
router.patch(
  '/admin/products/:id/archive',
  authenticateToken,
  requireRole(ROLES.ADMIN),
  archiveProduct,
);
router.patch(
  '/admin/products/:id/restore',
  authenticateToken,
  requireRole(ROLES.ADMIN),
  restoreProduct,
);

// Public product endpoints with pagination and filters
// router.get('/products', async (req, res, next) => {
//   try {
//     const {
//       limit = 10,
//       offset = 0,
//       categoriesId,
//       isActive = PRODUCT_STATUS.ACTIVE,
//       minPrice,
//       maxPrice,
//       sort = 'createdAt_desc',
//     } = req.query;
//     const where = {};
//     if (minPrice || maxPrice) {
//       where.price = {};
//       if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
//       if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
//     }

//     let order = [['createdAt', 'DESC']];
//     if (sort === 'price_asc') order = [['price', 'ASC']];
//     if (sort === 'price_desc') order = [['price', 'DESC']];

//     const products = await Product.findAll({
//       where,
//       include: [
//         { model: Category, as: 'categories', through: { attributes: [] } },
//         { model: ProductVariant, as: 'variants' },
//       ],
//       limit: parseInt(limit),
//       offset: parseInt(offset),
//       order,
//       paranoid: false,
//     });
//     const total = await Product.count({ where });
//     return ApiResponse.success(res, 'Products retrieved', {
//       products,
//       pagination: { limit, offset, total },
//     });
//   } catch (error) {
//     next(error);
//   }
// });

router.get('/products', async (req, res, next) => {
  try {
    const {
      limit = 10,
      offset = 0,
      categoriesId,
      isActive = PRODUCT_STATUS.ACTIVE,
      minPrice,
      maxPrice,
      sort = 'createdAt_desc',
    } = req.query;
    const where = {};
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }

    let order = [['createdAt', 'DESC']];
    if (sort === 'price_asc') order = [['price', 'ASC']];
    if (sort === 'price_desc') order = [['price', 'DESC']];

    const products = await Product.findAll({
      where,
      include: [
        { model: Category, as: 'categories', through: { attributes: [] } },
        { model: ProductVariant, as: 'variants' },
        {
          model: ProductImage,
          as: 'images',
          attributes: ['id', 'displayOrder', 'isDefault', 'mimeType'], // Exclude imageData
          order: [['displayOrder', 'ASC']]
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order,
      paranoid: false,
    });
    const total = await Product.count({ where });
    return ApiResponse.success(res, 'Products retrieved', {
      products,
      pagination: { limit, offset, total },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/products/:id', async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Category, as: 'categories', through: { attributes: [] } },
        { model: ProductVariant, as: 'variants' },
        {
          model: ProductImage,
          as: 'images',
          attributes: ['id', 'displayOrder', 'isDefault', 'mimeType'],
          order: [['displayOrder', 'ASC']]
        }
      ],
      paranoid: false,
    });
    if (!product) {
      return ApiResponse.error(res, ERROR_MESSAGES.PRODUCT_NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND);
    }
    return ApiResponse.success(res, 'Product details', product);
  } catch (error) {
    next(error);
  }
});

// router.get('/products/category/:id', async (req, res, next) => {
//   try {
//     const { limit = 10, offset = 0, isActive = true, sort = 'createdAt_desc' } = req.query;
//     let order = [['createdAt', 'DESC']];
//     if (sort === 'price_asc') order = [['price', 'ASC']];
//     if (sort === 'price_desc') order = [['price', 'DESC']];

//     const products = await Product.findAll({
//       include: [
//         {
//           model: Category,
//           as: 'categories',
//           where: { id: req.params.id, ...(isActive ? { isActive } : {}) },
//           through: { attributes: [] },
//           paranoid: false,
//         },
//         { model: ProductVariant, as: 'variants' },
//       ],
//       limit: parseInt(limit),
//       offset: parseInt(offset),
//       order,
//     });
//     const total = await Product.count({
//       include: [
//         {
//           model: Category,
//           as: 'categories',
//           where: { id: req.params.id, ...(isActive ? { isActive } : {}) },
//           paranoid: false,
//         },
//       ],
//     });
//     return ApiResponse.success(res, 'Products by category', {
//       products,
//       pagination: { limit, offset, total },
//     });
//   } catch (error) {
//     next(error);
//   }
// });

router.get('/products/category/:id', async (req, res, next) => {
  try {
    const { limit = 10, offset = 0, isActive = true, sort = 'createdAt_desc' } = req.query;
    let order = [['createdAt', 'DESC']];
    if (sort === 'price_asc') order = [['price', 'ASC']];
    if (sort === 'price_desc') order = [['price', 'DESC']];

    const products = await Product.findAll({
      include: [
        {
          model: Category,
          as: 'categories',
          where: { id: req.params.id, ...(isActive ? { isActive } : {}) },
          through: { attributes: [] },
          paranoid: false,
        },
        { model: ProductVariant, as: 'variants' },
        {
          model: ProductImage,
          as: 'images',
          attributes: ['id', 'displayOrder', 'isDefault', 'mimeType'],
          order: [['displayOrder', 'ASC']]
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order,
    });
    const total = await Product.count({
      include: [
        {
          model: Category,
          as: 'categories',
          where: { id: req.params.id, ...(isActive ? { isActive } : {}) },
          paranoid: false,
        },
      ],
    });
    return ApiResponse.success(res, 'Products by category', {
      products,
      pagination: { limit, offset, total },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
