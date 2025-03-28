import { Address } from '../models/index.js';
import ApiResponse from '../utils/ApiResponse.js';
import { HTTP_STATUS_CODES, ERROR_MESSAGES } from '../constants/constant.js';
import sequelize from '../config/database.js';

// Create a new address
export const createAddress = async (req, res, next) => {
    const {
        firstName,
        lastName,
        streetAddress,
        city,
        postCode,
        country,
        phone,
        isDefault
    } = req.body;

    const t = await sequelize.transaction();
    try {
        if (!req.user) {
            throw new Error('User must be authenticated to create an address');
        }


        if (isDefault) {
            await Address.update(
                { isDefault: false },
                { where: { userId: req.user.id, isDefault: true }, transaction: t }
            );
        }

        const address = await Address.create({
            userId: req.user.id,
            firstName,
            lastName,
            streetAddress,
            companyName: req.body.companyName || null,
            city,
            postCode,
            country,
            phone,
            email: req.user.email,
            isDefault: isDefault || false
        }, { transaction: t });

        await t.commit();
        return ApiResponse.success(res, 'Address created successfully', address, HTTP_STATUS_CODES.CREATED);
    } catch (error) {
        await t.rollback();
        next(error);
    }
};

// Get all addresses for a user
export const getAddresses = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new Error('User must be authenticated to view addresses');
        }

        const addresses = await Address.findAll({
            where: { userId: req.user.id }
        });

        return ApiResponse.success(res, 'Addresses retrieved successfully', addresses);
    } catch (error) {
        next(error);
    }
};

// Update an address
export const updateAddress = async (req, res, next) => {
    const { addressId } = req.params;
    const {
        firstName,
        lastName,
        streetAddress,
        city,
        postCode,
        country,
        phone,
        isDefault
    } = req.body;

    const t = await sequelize.transaction();
    try {
        if (!req.user) {
            throw new Error('User must be authenticated to update an address');
        }

        const address = await Address.findOne({
            where: { id: addressId, userId: req.user.id },
            transaction: t
        });

        if (!address) {
            throw new Error(ERROR_MESSAGES.ADDRESS_NOT_FOUND);
        }

        // If setting as default, unset other default addresses
        if (isDefault) {
            await Address.update(
                { isDefault: false },
                { where: { userId: req.user.id, isDefault: true }, transaction: t }
            );
        }

        await address.update({
            firstName,
            lastName,
            streetAddress,
            city,
            postCode,
            country,
            phone,
            isDefault: isDefault || false
        }, { transaction: t });

        await t.commit();
        return ApiResponse.success(res, 'Address updated successfully', address);
    } catch (error) {
        await t.rollback();
        next(error);
    }
};


// Delete an address
export const deleteAddress = async (req, res, next) => {
    const { addressId } = req.params;

    try {
        if (!req.user) {
            throw new Error('User must be authenticated to delete an address');
        }

        const address = await Address.findOne({
            where: { id: addressId, userId: req.user.id }
        });

        if (!address) {
            throw new Error(ERROR_MESSAGES.ADDRESS_NOT_FOUND);
        }

        await address.destroy();
        return ApiResponse.success(res, 'Address deleted successfully', {});
    } catch (error) {
        next(error);
    }
};

// Set an address as default
export const setDefaultAddress = async (req, res, next) => {
    const { addressId } = req.params;

    const t = await sequelize.transaction();
    try {
        if (!req.user) {
            throw new Error('User must be authenticated to set a default address');
        }

        const address = await Address.findOne({
            where: { id: addressId, userId: req.user.id },
            transaction: t
        });

        if (!address) {
            throw new Error(ERROR_MESSAGES.ADDRESS_NOT_FOUND);
        }

        // Unset other default addresses
        await Address.update(
            { isDefault: false },
            { where: { userId: req.user.id, isDefault: true }, transaction: t }
        );

        await address.update({ isDefault: true }, { transaction: t });

        await t.commit();
        return ApiResponse.success(res, 'Default address set successfully', address);
    } catch (error) {
        await t.rollback();
        next(error);
    }
};