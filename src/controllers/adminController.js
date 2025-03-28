import { Order, Product, User, Customer, OrderItem } from '../models/index.js';
import ApiResponse from '../utils/ApiResponse.js';
import { HTTP_STATUS_CODES, ERROR_MESSAGES, ORDER_STATUS } from '../constants/constant.js';

export const getDashboard = async (req, res, next) => {
    try {
        const [orderCount, productCount, customerCount] = await Promise.all([
            Order.count(),
            Product.count(),
            Customer.count()
        ]);
        return ApiResponse.success(res, 'Dashboard data', { orderCount, productCount, customerCount });
    } catch (error) {
        next(error);
    }
};

export const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.findAll({
            include: [{ model: OrderItem, as: 'items' }]
        });
        return ApiResponse.success(res, 'All orders', orders);
    } catch (error) {
        next(error);
    }
};

export const updateOrderStatus = async (req, res, next) => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (!order) {
            return ApiResponse.error(res, ERROR_MESSAGES.ORDER_NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND);
        }
        await order.update(req.body);
        return ApiResponse.success(res, 'Order status updated successfully', order);
    } catch (error) {
        next(error);
    }
};

export const cancelOrder = async (req, res, next) => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (!order) {
            return ApiResponse.error(res, ERROR_MESSAGES.ORDER_NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND);
        }
        await order.update({ status: ORDER_STATUS.CANCELED });
        return ApiResponse.success(res, 'Order canceled successfully', null, HTTP_STATUS_CODES.NO_CONTENT);
    } catch (error) {
        next(error);
    }
};

export const getAllCustomers = async (req, res, next) => {
    try {
        const customers = await Customer.findAll({
            include: [{ model: User, attributes: ['id', 'email', 'role', 'status'] }],
            paranoid: false
        });
        return ApiResponse.success(res, 'All customers retrieved', customers);
    } catch (error) {
        next(error);
    }
};

export const getCustomerDetails = async (req, res, next) => {
    try {
        const customer = await Customer.findByPk(req.params.id, {
            include: [{ model: User, attributes: ['id', 'email', 'role', 'status'] }],
            paranoid: false
        });

        if (!customer) {
            return ApiResponse.error(res, ERROR_MESSAGES.CUSTOMER_PROFILE_NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND);
        }

        return ApiResponse.success(res, 'Customer details retrieved', customer);
    } catch (error) {
        next(error);
    }
};

export const banCustomer = async (req, res, next) => {

    try {
        const customer = await Customer.findByPk(req.params.id, {
            include: [{ model: User, attributes: ['id', 'email', 'role', 'status'] }],
            paranoid: false
        });

        if (!customer) {
            return ApiResponse.error(res, ERROR_MESSAGES.CUSTOMER_PROFILE_NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND);
        }

        const { status } = req.body;
        await User.update({ status }, { where: { id: customer.userId } });

        // Fetch the updated user to return
        const updatedUser = await User.findByPk(customer.userId, {
            attributes: ['id', 'email', 'status']
        });

        return ApiResponse.success(res, 'Customer banned successfully', updatedUser);
    } catch (error) {
        next(error);
    }
};

export const deleteCustomer = async (req, res, next) => {
    try {
        const customer = await Customer.findByPk(req.params.id, {
            include: [{ model: User, attributes: ['id', 'email', 'role', 'status'] }],
            paranoid: false
        });

        if (!customer) {
            return ApiResponse.error(res, ERROR_MESSAGES.CUSTOMER_PROFILE_NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND);
        }

        // Check if customer has orders
        const hasOrders = await Order.count({ where: { userId: customer.userId } }) > 0;
        if (hasOrders) {
            return ApiResponse.error(res, 'Customer has linked orders and cannot be deleted', HTTP_STATUS_CODES.CONFLICT);
        }

        // Soft delete customer
        await customer.destroy({ force: true });

        return ApiResponse.success(res, 'Customer deleted successfully', null, HTTP_STATUS_CODES.NO_CONTENT);
    } catch (error) {
        next(error);
    }
};
