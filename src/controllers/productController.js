import { Product, ProductCategory, Category, ProductVariant, ProductImage } from '../models/index.js';
import ApiResponse from '../utils/ApiResponse.js';
import { HTTP_STATUS_CODES, ERROR_MESSAGES, PRODUCT_STATUS } from '../constants/constant.js';
import slugify from 'slugify';
import sequelize from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';



export const addProductImages = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const { productId } = req.params;
        const product = await Product.findByPk(productId, { paranoid: false });

        if (!product) {
            return ApiResponse.error(res, 'Product not found', 404);
        }

        if (!req.files || req.files.length === 0) {
            return ApiResponse.error(res, 'No images uploaded', 400);
        }

        // Validate file size (e.g., max 5MB)
        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
        const imageData = req.files.map((file, index) => {
            if (file.size > MAX_FILE_SIZE) {
                throw new Error(`File ${file.originalname} exceeds maximum size of 5MB`);
            }

            return {
                id: uuidv4(),
                productId: product.id,
                imageData: file.buffer.toString('base64'),
                mimeType: file.mimetype,
                displayOrder: index,
                isDefault: index === 0
            };
        });

        await ProductImage.bulkCreate(imageData, {
            transaction: t,
            validate: true
        });
        await t.commit();

        const result = await ProductImage.findAll({
            where: { productId: product.id },
            attributes: ['id', 'displayOrder', 'isDefault', 'createdAt', 'mimeType']
        });

        return ApiResponse.success(res, 'Product images added successfully', result);
    } catch (error) {
        await t.rollback();
        next(error);
    }
};

export const createProduct = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const {
            name,
            description,
            price,
            discountPercentage,
            stockQuantity,
            sku,
            isActive,
            categoryIds = [],
            variants = []
        } = req.body;

        const slug = slugify(name, { lower: true, strict: true });

        // Create product
        const product = await Product.create(
            {
                name,
                slug,
                description,
                price,
                discountPercentage,
                stockQuantity: stockQuantity || 0,
                sku,
                isActive: PRODUCT_STATUS.ACTIVE,
                featuredImage: req.files && req.files.length > 0 ? req.files[0].buffer.toString('base64') : null
            },
            { transaction: t }
        );

        // Handle multiple images
        if (req.files && req.files.length > 0) {
            const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
            const imageData = req.files.map((file, index) => {
                if (file.size > MAX_FILE_SIZE) {
                    throw new Error(`File ${file.originalname} exceeds maximum size of 5MB`);
                }

                return {
                    id: uuidv4(),
                    productId: product.id,
                    imageData: file.buffer.toString('base64'),
                    mimeType: file.mimetype,
                    displayOrder: index,
                    isDefault: index === 0
                };
            });
            await ProductImage.bulkCreate(imageData, {
                transaction: t,
                validate: true
            });
        }

        if (categoryIds.length > 0) {
            const productCategories = categoryIds.map(categoryId => ({
                productId: product.id,
                categoryId,
                isPrimary: categoryId === categoryIds[0]
            }));
            await ProductCategory.bulkCreate(productCategories, { transaction: t });
        }

        if (variants.length > 0) {
            const variantData = variants.map((variant, index) => ({
                id: uuidv4(),
                productId: product.id,
                size: variant.size || 'N/A',
                color: variant.color || 'N/A',
                material: variant.material || 'N/A',
                price: variant.price || price,
                stockQuantity: variant.stockQuantity || 0,
                sku: `${slug}-${index + 1}`,
                createdAt: new Date(),
                updatedAt: new Date()
            }));
            await ProductVariant.bulkCreate(variantData, { transaction: t });
        }

        await t.commit();

        const result = await Product.findByPk(product.id, {
            include: [
                { model: Category, as: 'categories', through: { attributes: [] } },
                { model: ProductVariant, as: 'variants' },
                {
                    model: ProductImage,
                    as: 'images',
                    attributes: ['id', 'displayOrder', 'isDefault', 'mimeType']
                }
            ]
        });

        return ApiResponse.success(res, 'Product created successfully', result, 201);
    } catch (error) {
        await t.rollback();
        next(error);
    }
};

export const updateProduct = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const product = await Product.findByPk(req.params.id, { paranoid: false });
        if (!product) {
            return ApiResponse.error(res, ERROR_MESSAGES.PRODUCT_NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND);
        }

        const updatedData = { ...req.body };
        if (req.file) {
            updatedData.featuredImage = req.file.buffer.toString('base64');
        }
        if (updatedData.name) {
            updatedData.slug = slugify(updatedData.name, { lower: true, strict: true });
        }
        await product.update(updatedData, { transaction: t });

        if (req.body.categoryIds) {
            await ProductCategory.destroy({ where: { productId: product.id }, transaction: t });
            const productCategories = req.body.categoryIds.map(categoryId => ({
                productId: product.id,
                categoryId,
                isPrimary: categoryId === req.body.categoryIds[0]
            }));
            await ProductCategory.bulkCreate(productCategories, { transaction: t });
        }

        if (req.body.variants) {
            await ProductVariant.destroy({ where: { productId: product.id }, transaction: t });
            const variantData = req.body.variants.map((variant, index) => ({
                id: uuidv4(), // Generate UUID
                productId: product.id,
                size: variant.size || 'N/A',
                color: variant.color || 'N/A',
                material: variant.material || 'N/A',
                price: variant.price || product.price,
                stockQuantity: variant.stockQuantity || 0,
                sku: `${product.slug}-${index + 1}`,
                createdAt: new Date(),
                updatedAt: new Date()
            }));
            await ProductVariant.bulkCreate(variantData, { transaction: t });
        }

        await t.commit();

        const result = await Product.findByPk(product.id, {
            include: [
                { model: Category, as: 'categories', through: { attributes: [] } },
                { model: ProductVariant, as: 'variants' }
            ]
        });
        return ApiResponse.success(res, 'Product updated successfully', result);
    } catch (error) {
        await t.rollback();
        next(error);
    }
};

export const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.id, { paranoid: false });
        if (!product) {
            return ApiResponse.error(res, ERROR_MESSAGES.PRODUCT_NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND);
        }
        await product.destroy();
        return ApiResponse.success(res, 'Product deleted', null, HTTP_STATUS_CODES.NO_CONTENT);
    } catch (error) {
        next(error);
    }
};

export const updateStock = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const { variantId } = req.query;
        if (!variantId) {
            return ApiResponse.error(res, 'variantId is required', HTTP_STATUS_CODES.BAD_REQUEST);
        }
        const product = await Product.findByPk(req.params.id, { paranoid: false });
        if (!product) {
            return ApiResponse.error(res, ERROR_MESSAGES.PRODUCT_NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND);
        }
        const productVariant = await ProductVariant.findOne({ where: { id: variantId, productId: product.id }, transaction: t });
        if (!productVariant) {
            return ApiResponse.error(res, 'Product variant not found', HTTP_STATUS_CODES.NOT_FOUND);
        }
        const { stockQuantity } = req.body;
        await productVariant.update({ stockQuantity }, { transaction: t });
        await t.commit();
        return ApiResponse.success(res, 'Stock updated successfully', productVariant);
    } catch (error) {
        await t.rollback();
        next(error);
    }
};

export const archiveProduct = async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.id, { paranoid: false });
        if (!product) {
            return ApiResponse.error(res, ERROR_MESSAGES.PRODUCT_NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND);
        }
        await product.update({ isActive: PRODUCT_STATUS.ARCHIEVED });
        return ApiResponse.success(res, 'Product archived successfully', product);
    } catch (error) {
        next(error);
    }
};

export const restoreProduct = async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.id, { paranoid: false });
        if (!product) {
            return ApiResponse.error(res, ERROR_MESSAGES.PRODUCT_NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND);
        }
        await product.restore();
        return ApiResponse.success(res, 'Product restored successfully', product);
    } catch (error) {
        next(error);
    }
};



export const getProductImage = async (req, res, next) => {
    try {
        const { imageId } = req.params;
        const image = await ProductImage.findByPk(imageId);

        if (!image) {
            return ApiResponse.error(res, 'Image not found', 404);
        }

        const imageBuffer = Buffer.from(image.imageData, 'base64');
        res.set('Content-Type', image.mimeType);
        res.set('Cache-Control', 'public, max-age=31557600'); // Cache for 1 year
        return res.send(imageBuffer);
    } catch (error) {
        next(error);
    }
};


