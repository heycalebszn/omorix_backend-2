import { createPayPalOrder, capturePayPalPayment, getPayPalOrderDetails } from '../services/paypalService.js';
import { Order, OrderItem, Product, ProductVariant } from '../models/index.js';
import ApiResponse from '../utils/ApiResponse.js';
import { HTTP_STATUS_CODES, ERROR_MESSAGES, ORDER_STATUS, PAYMENT_STATUS } from '../constants/constant.js';
import { sendOrderConfirmationEmail } from '../services/emailService.js';
import sequelize from '../config/database.js';

/**
 * Create a PayPal order for an existing order
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const createPaymentOrder = async (req, res, next) => {
    const { orderId } = req.params;
    
    try {
        // Find the order
        const order = await Order.findByPk(orderId, {
            include: [
                {
                    model: OrderItem,
                    as: 'items',
                    include: [
                        {
                            model: Product,
                            as: 'product',
                            attributes: ['name']
                        },
                        {
                            model: ProductVariant,
                            as: 'variant',
                            attributes: ['size', 'color']
                        }
                    ]
                }
            ]
        });
        
        if (!order) {
            return ApiResponse.error(res, ERROR_MESSAGES.ORDER_NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND);
        }
        
        // Check if the order belongs to the user or is a guest order
        if (order.userId && req.user && order.userId !== req.user.id) {
            return ApiResponse.error(res, ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS_CODES.FORBIDDEN);
        }
        
        // Prepare the order for PayPal
        const orderData = {
            id: order.id,
            orderNumber: order.orderNumber,
            totalAmount: parseFloat(order.totalAmount),
            subtotal: parseFloat(order.subtotal),
            tax: parseFloat(order.tax || 0),
            deliveryFee: parseFloat(order.deliveryFee || order.shippingCost || 0),
            discount: parseFloat(order.discount || 0),
            firstName: order.firstName || order.shippingFirstName,
            lastName: order.lastName || order.shippingLastName,
            deliveryAddress: order.deliveryAddress || order.shippingAddress,
            city: order.city || order.shippingCity,
            postCode: order.postCode || order.shippingZip,
            items: order.items.map(item => ({
                productId: item.productId,
                name: item.product?.name || `Product ID: ${item.productId}`,
                unitPrice: parseFloat(item.unitPrice),
                quantity: item.quantity
            }))
        };
        
        // Create the PayPal order
        const paypalOrder = await createPayPalOrder(orderData);
        
        // Update the order with the PayPal order ID
        await order.update({
            paypalOrderId: paypalOrder.id
        });
        
        return ApiResponse.success(res, 'PayPal order created', {
            paypalOrderId: paypalOrder.id,
            approvalUrl: paypalOrder.links.find(link => link.rel === 'approve').href
        });
    } catch (error) {
        console.error('Error creating PayPal order:', error);
        next(error);
    }
};

/**
 * Capture a PayPal payment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const capturePayment = async (req, res, next) => {
    const { paypalOrderId } = req.params;
    
    let transaction;
    try {
        transaction = await sequelize.transaction();
        
        // Find the order by PayPal order ID
        const order = await Order.findOne({
            where: { paypalOrderId },
            include: [{ model: OrderItem, as: 'items' }],
            transaction
        });
        
        if (!order) {
            if (transaction) await transaction.rollback();
            return ApiResponse.error(res, ERROR_MESSAGES.ORDER_NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND);
        }
        
        // Capture the payment
        const captureData = await capturePayPalPayment(paypalOrderId);
        
        // Update the order with payment details
        const captureId = captureData.purchase_units[0].payments.captures[0].id;
        const paymentStatus = captureData.status === 'COMPLETED' ? PAYMENT_STATUS.PAID : PAYMENT_STATUS.PENDING;
        
        await order.update({
            status: ORDER_STATUS.PROCESSING,
            paymentStatus,
            paypalCaptureId: captureId,
            paidAt: new Date()
        }, { transaction });
        
        // If payment is successful, send confirmation email
        if (paymentStatus === PAYMENT_STATUS.PAID) {
            await sendOrderConfirmationEmail(order.email, order, order.items);
        }
        
        await transaction.commit();
        
        return ApiResponse.success(res, 'Payment captured successfully', {
            orderId: order.id,
            orderNumber: order.orderNumber,
            status: order.status,
            paymentStatus,
            captureId
        });
    } catch (error) {
        if (transaction) await transaction.rollback();
        console.error('Error capturing PayPal payment:', error);
        next(error);
    }
};

/**
 * Webhook handler for PayPal payment events
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const handlePayPalWebhook = async (req, res, next) => {
    const { event_type, resource } = req.body;
    
    let transaction;
    try {
        // Verify webhook signature if needed
        
        // Process different event types
        switch (event_type) {
            case 'PAYMENT.CAPTURE.COMPLETED':
                transaction = await sequelize.transaction();
                
                // Get the PayPal order ID from the resource
                const paypalOrderId = resource.supplementary_data.related_ids.order_id;
                
                // Find the order by PayPal order ID
                const order = await Order.findOne({
                    where: { paypalOrderId },
                    transaction
                });
                
                if (order) {
                    // Update the order status
                    await order.update({
                        status: ORDER_STATUS.PROCESSING,
                        paymentStatus: PAYMENT_STATUS.PAID,
                        paidAt: new Date()
                    }, { transaction });
                    
                    // Send confirmation email
                    const orderWithItems = await Order.findByPk(order.id, {
                        include: [{ model: OrderItem, as: 'items' }],
                        transaction
                    });
                    
                    await sendOrderConfirmationEmail(orderWithItems.email, orderWithItems, orderWithItems.items);
                }
                
                await transaction.commit();
                break;
                
            case 'PAYMENT.CAPTURE.REFUNDED':
                transaction = await sequelize.transaction();
                
                // Get the capture ID from the resource
                const captureId = resource.id;
                
                // Find the order by PayPal capture ID
                const refundedOrder = await Order.findOne({
                    where: { paypalCaptureId: captureId },
                    transaction
                });
                
                if (refundedOrder) {
                    // Update the order status
                    await refundedOrder.update({
                        status: ORDER_STATUS.REFUNDED,
                        paymentStatus: PAYMENT_STATUS.REFUNDED,
                        refundedAt: new Date()
                    }, { transaction });
                }
                
                await transaction.commit();
                break;
                
            // Add more event types as needed
        }
        
        return ApiResponse.success(res, 'Webhook processed', {}, HTTP_STATUS_CODES.OK);
    } catch (error) {
        if (transaction) await transaction.rollback();
        console.error('Error processing PayPal webhook:', error);
        next(error);
    }
};

/**
 * Get payment status for an order
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getPaymentStatus = async (req, res, next) => {
    const { orderId } = req.params;
    
    try {
        const order = await Order.findByPk(orderId, {
            attributes: ['id', 'orderNumber', 'status', 'paymentStatus', 'paypalOrderId', 'paypalCaptureId']
        });
        
        if (!order) {
            return ApiResponse.error(res, ERROR_MESSAGES.ORDER_NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND);
        }
        
        // If the order has a PayPal order ID, get the payment details
        let paypalDetails = null;
        if (order.paypalOrderId) {
            paypalDetails = await getPayPalOrderDetails(order.paypalOrderId);
        }
        
        return ApiResponse.success(res, 'Payment status retrieved', {
            orderId: order.id,
            orderNumber: order.orderNumber,
            status: order.status,
            paymentStatus: order.paymentStatus,
            paypalDetails: paypalDetails ? {
                id: paypalDetails.id,
                status: paypalDetails.status,
                payer: paypalDetails.payer
            } : null
        });
    } catch (error) {
        console.error('Error getting payment status:', error);
        next(error);
    }
};