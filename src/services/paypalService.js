import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

// PayPal API configurations
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || 'AQhH1Ijs2T-CJw-GCY-PC4SVuD1tciUVriV32iZlf-5f8oIRV3gXLmFkIGNTLJM_s_7Cfgg8M0a_o3Ro';
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || 'EE5T3rFKAb4g0SEtaW3YPaRXj-g5B2dzWwrlqneNWTP3isDQAlnOaPd6XgChzYD8AsPvlrO2Db3JXP-E';
const PAYPAL_API_BASE = process.env.PAYPAL_API_BASE || 'https://api-m.sandbox.paypal.com';

/**
 * Generate an access token for PayPal API
 * @returns {Promise<string>} The access token
 */
async function generateAccessToken() {
    try {
        const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
        const response = await axios({
            method: 'post',
            url: `${PAYPAL_API_BASE}/v1/oauth2/token`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${auth}`
            },
            data: 'grant_type=client_credentials'
        });
        
        return response.data.access_token;
    } catch (error) {
        console.error('Failed to generate PayPal access token:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
        throw new Error('Failed to generate PayPal access token');
    }
}

/**
 * Create a PayPal order
 * @param {Object} orderData The order data
 * @returns {Promise<Object>} The created PayPal order
 */
export async function createPayPalOrder(orderData) {
    try {
        const accessToken = await generateAccessToken();
        
        const payload = {
            intent: 'CAPTURE',
            purchase_units: [
                {
                    reference_id: orderData.orderNumber,
                    description: `Order #${orderData.orderNumber}`,
                    custom_id: orderData.id,
                    amount: {
                        currency_code: 'USD',
                        value: orderData.totalAmount.toFixed(2),
                        breakdown: {
                            item_total: {
                                currency_code: 'USD',
                                value: orderData.subtotal.toFixed(2)
                            },
                            shipping: {
                                currency_code: 'USD',
                                value: (orderData.deliveryFee || 0).toFixed(2)
                            },
                            tax_total: {
                                currency_code: 'USD',
                                value: (orderData.tax || 0).toFixed(2)
                            },
                            discount: {
                                currency_code: 'USD',
                                value: (orderData.discount || 0).toFixed(2)
                            }
                        }
                    },
                    items: orderData.items.map(item => ({
                        name: item.name || `Product ID: ${item.productId}`,
                        unit_amount: {
                            currency_code: 'USD',
                            value: item.unitPrice.toFixed(2)
                        },
                        quantity: item.quantity.toString(),
                        sku: item.productId
                    })),
                    shipping: {
                        name: {
                            full_name: `${orderData.firstName} ${orderData.lastName}`
                        },
                        address: {
                            address_line_1: orderData.deliveryAddress,
                            admin_area_2: orderData.city,
                            postal_code: orderData.postCode,
                            country_code: 'US' // Default to US for sandbox
                        }
                    }
                }
            ],
            application_context: {
                brand_name: process.env.COMPANY_NAME || 'Your E-Commerce Store',
                landing_page: 'BILLING',
                shipping_preference: 'SET_PROVIDED_ADDRESS',
                user_action: 'PAY_NOW',
                return_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout/success`,
                cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout/cancel`
            }
        };

        const response = await axios({
            method: 'post',
            url: `${PAYPAL_API_BASE}/v2/checkout/orders`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            data: payload
        });
        
        return response.data;
    } catch (error) {
        console.error('Failed to create PayPal order:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
        throw new Error('Failed to create PayPal order');
    }
}

/**
 * Capture a PayPal payment
 * @param {string} orderId The PayPal order ID
 * @returns {Promise<Object>} The captured payment details
 */
export async function capturePayPalPayment(orderId) {
    try {
        const accessToken = await generateAccessToken();
        
        const response = await axios({
            method: 'post',
            url: `${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        return response.data;
    } catch (error) {
        console.error('Failed to capture PayPal payment:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
        throw new Error('Failed to capture PayPal payment');
    }
}

/**
 * Get PayPal order details
 * @param {string} orderId The PayPal order ID
 * @returns {Promise<Object>} The order details
 */
export async function getPayPalOrderDetails(orderId) {
    try {
        const accessToken = await generateAccessToken();
        
        const response = await axios({
            method: 'get',
            url: `${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        return response.data;
    } catch (error) {
        console.error('Failed to get PayPal order details:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
        throw new Error('Failed to get PayPal order details');
    }
}

/**
 * Refund a PayPal payment
 * @param {string} captureId The PayPal capture ID
 * @param {number} amount The amount to refund
 * @returns {Promise<Object>} The refund details
 */
export async function refundPayPalPayment(captureId, amount) {
    try {
        const accessToken = await generateAccessToken();
        
        const payload = {
            amount: {
                currency_code: 'USD',
                value: amount.toFixed(2)
            }
        };
        
        const response = await axios({
            method: 'post',
            url: `${PAYPAL_API_BASE}/v2/payments/captures/${captureId}/refund`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            data: payload
        });
        
        return response.data;
    } catch (error) {
        console.error('Failed to refund PayPal payment:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
        throw new Error('Failed to refund PayPal payment');
    }
}

export default {
    createPayPalOrder,
    capturePayPalPayment,
    getPayPalOrderDetails,
    refundPayPalPayment
};