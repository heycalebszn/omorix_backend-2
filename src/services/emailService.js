import nodemailer from 'nodemailer';
import { EMAIL_CONFIG, VALIDATION, ERROR_MESSAGES } from '../constants/constant.js';

const transporter = nodemailer.createTransport({
  host: EMAIL_CONFIG.SMTP_HOST,
  port: EMAIL_CONFIG.SMTP_PORT,
  secure: EMAIL_CONFIG.SMTP_SECURE,
  auth: {
    user: EMAIL_CONFIG.SMTP_USER,
    pass: EMAIL_CONFIG.SMTP_PASSWORD
  }
});

export const sendOtpEmail = async (email, otp, firstName) => {
  const mailOptions = {
    from: `"${EMAIL_CONFIG.SENDER_NAME}" <${EMAIL_CONFIG.SENDER_EMAIL}>`,
    to: email,
    subject: 'Your Verification Code',
    html: generateOtpEmailTemplate(firstName, otp)
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error(ERROR_MESSAGES.EMAIL_SENDING_FAILED);
  }
};

const generateOtpEmailTemplate = (userName, otp) => {
  return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Account</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                .container { background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); padding: 30px; }
                .header { text-align: center; margin-bottom: 30px; }
                .header img { max-width: 150px; height: auto; }
                h1 { color: #2c3e50; font-size: 24px; font-weight: 600; margin-bottom: 20px; text-align: center; }
                .otp-container { background-color: #f8f9fa; border-radius: 6px; padding: 20px; text-align: center; margin: 25px 0; border-left: 4px solid #3498db; }
                .otp-code { font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #3498db; margin: 10px 0; }
                .expiry { font-size: 14px; color: #e74c3c; margin-top: 10px; }
                .support { background-color: #f8f9fa; border-radius: 6px; padding: 15px; margin-top: 30px; }
                .support h2 { font-size: 18px; margin-top: 0; }
                .footer { margin-top: 30px; font-size: 12px; color: #7f8c8d; text-align: center; border-top: 1px solid #ecf0f1; padding-top: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="${EMAIL_CONFIG.LOGO_URL}" alt="Omorix Logo">
                </div>
                <h1>Verify Your Account</h1>
                <p>Dear ${userName || 'Valued Customer'},</p>
                <p>Thank you for joining Omorix! Please verify your email by entering the code below:</p>
                <div class="otp-container">
                    <div class="otp-code">${otp}</div>
                    <div class="expiry">Expires in ${VALIDATION.OTP_EXPIRY_MINUTES} minutes</div>
                </div>
                <p>If you didn't request this, please ignore this email or contact support.</p>
                <div class="support">
                    <h2>Need Help?</h2>
                    <p>Contact us at <a href="mailto:${EMAIL_CONFIG.SUPPORT_EMAIL}">${EMAIL_CONFIG.SUPPORT_EMAIL}</a>.</p>
                </div>
                <div class="footer">
                    <p>© ${new Date().getFullYear()} ${EMAIL_CONFIG.COMPANY_NAME}. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};

// Updated to include payment information
export const sendOrderConfirmationEmail = async (toEmail, order, orderItems) => {
  const mailOptions = {
    from: `"${EMAIL_CONFIG.SENDER_NAME}" <${EMAIL_CONFIG.SENDER_EMAIL}>`,
    to: toEmail,
    subject: `Order Confirmation - ${order.orderNumber}`,
    html: generateOrderConfirmationEmailTemplate(toEmail, order, orderItems)
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email sent to ${toEmail}`);
    return { success: true, message: 'Order confirmation email sent successfully' };
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    throw new Error(ERROR_MESSAGES.EMAIL_SENDING_FAILED);
  }
};

const generateOrderConfirmationEmailTemplate = (toEmail, order, orderItems) => {
  // Format payment method for display
  const paymentMethodDisplay = order.paymentMethod
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Add payment instructions based on payment method
  let paymentInstructions = '';
  if (order.paymentMethod === 'paypal' && order.paypalOrderId) {
    paymentInstructions = `
      <div style="margin: 20px 0; padding: 15px; background-color: #fff7e6; border-left: 4px solid #f5a623; border-radius: 4px;">
        <p><strong>Payment Status:</strong> ${order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}</p>
        <p>You've chosen to pay with PayPal. ${order.paymentStatus === 'paid' ? 'Your payment has been completed.' : 'Please complete your payment by clicking the PayPal checkout link in your browser.'}</p>
        <p>PayPal Reference: ${order.paypalOrderId}</p>
      </div>
    `;
  } else if (order.paymentMethod === 'cash_on_delivery') {
    paymentInstructions = `
      <div style="margin: 20px 0; padding: 15px; background-color: #e6f7ff; border-left: 4px solid #3498db; border-radius: 4px;">
        <p><strong>Payment Method:</strong> Cash On Delivery</p>
        <p>Please have the exact amount ready when your order is delivered.</p>
        <p>Total amount to be paid: £${order.totalAmount.toFixed(2)}</p>
      </div>
    `;
  }

  return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Confirmation</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                .container { background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); padding: 30px; }
                .header { text-align: center; margin-bottom: 30px; }
                .header img { max-width: 150px; height: auto; }
                h1 { color: #2c3e50; font-size: 24px; font-weight: 600; margin-bottom: 20px; text-align: center; }
                h2 { color: #2c3e50; font-size: 20px; font-weight: 600; margin-top: 20px; }
                .order-details { background-color: #f8f9fa; border-radius: 6px; padding: 20px; margin: 25px 0; border-left: 4px solid #3498db; }
                .order-details p { margin: 5px 0; }
                .order-items { margin: 25px 0; }
                .order-items ul { list-style-type: none; padding: 0; }
                .order-items li { background-color: #f8f9fa; border-radius: 6px; padding: 15px; margin-bottom: 10px; }
                .shipping-details { background-color: #f8f9fa; border-radius: 6px; padding: 20px; margin: 25px 0; border-left: 4px solid #3498db; }
                .support { background-color: #f8f9fa; border-radius: 6px; padding: 15px; margin-top: 30px; }
                .support h2 { font-size: 18px; margin-top: 0; }
                .footer { margin-top: 30px; font-size: 12px; color: #7f8c8d; text-align: center; border-top: 1px solid #ecf0f1; padding-top: 20px; }
                .payment-info { background-color: #f0f8ff; border-radius: 6px; padding: 20px; margin: 25px 0; border-left: 4px solid #3498db; }
                .button { display: inline-block; background-color: #3498db; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-weight: bold; margin-top: 15px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="${EMAIL_CONFIG.LOGO_URL}" alt="Omorix Logo">
                </div>
                <h1>Order Confirmation</h1>
                <p>Dear ${order.firstName || 'Valued Customer'},</p>
                <p>Thank you for your order! We're excited to let you know that your order has been successfully placed. Below are the details of your purchase:</p>
                
                <div class="order-details">
                    <h2>Order Details</h2>
                    <p><strong>Order Number:</strong> ${order.orderNumber}</p>
                    <p><strong>Total Amount:</strong> £${order.totalAmount.toFixed(2)}</p>
                    <p><strong>Subtotal:</strong> £${order.subtotal.toFixed(2)}</p>
                    <p><strong>Delivery Fee:</strong> £${order.deliveryFee.toFixed(2)}</p>
                    <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                    <p><strong>Payment Method:</strong> ${paymentMethodDisplay}</p>
                </div>

                ${paymentInstructions}

                <div class="order-items">
                    <h2>Order Items</h2>
                    <ul>
                        ${orderItems.map(item => `
                            <li>
                                <p><strong>Product:</strong> ${item.productSnapshot?.name || `Product ID: ${item.productId}`}</p>
                                <p><strong>Variant:</strong> ${item.productSnapshot?.variant ? 
                                    `${item.productSnapshot.variant.size || ''} ${item.productSnapshot.variant.color || ''}`.trim() : 
                                    'Standard'}</p>
                                <p><strong>Quantity:</strong> ${item.quantity}</p>
                                <p><strong>Unit Price:</strong> £${item.unitPrice.toFixed(2)}</p>
                                <p><strong>Subtotal:</strong> £${item.subtotal.toFixed(2)}</p>
                            </li>
                        `).join('')}
                    </ul>
                </div>

                <div class="shipping-details">
                    <h2>Shipping Details</h2>
                    <p><strong>Name:</strong> ${order.firstName} ${order.lastName}</p>
                    <p><strong>Address:</strong> ${order.deliveryAddress}, ${order.city}, ${order.postCode}, ${order.country}</p>
                    <p><strong>Phone:</strong> ${order.phone}</p>
                    <p><strong>Email:</strong> ${order.email}</p>
                </div>

                <p>We will notify you once your order is shipped. If you have any questions, feel free to reach out to us.</p>

                <div class="support">
                    <h2>Need Help?</h2>
                    <p>Contact us at <a href="mailto:${EMAIL_CONFIG.SUPPORT_EMAIL}">${EMAIL_CONFIG.SUPPORT_EMAIL}</a>.</p>
                </div>

                <div class="footer">
                    <p>© ${new Date().getFullYear()} ${EMAIL_CONFIG.COMPANY_NAME}. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};

// New function to send payment confirmation email
export const sendPaymentConfirmationEmail = async (toEmail, order) => {
  const mailOptions = {
    from: `"${EMAIL_CONFIG.SENDER_NAME}" <${EMAIL_CONFIG.SENDER_EMAIL}>`,
    to: toEmail,
    subject: `Payment Confirmation - Order #${order.orderNumber}`,
    html: generatePaymentConfirmationEmailTemplate(order)
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Payment confirmation email sent to ${toEmail}`);
    return { success: true, message: 'Payment confirmation email sent successfully' };
  } catch (error) {
    console.error('Error sending payment confirmation email:', error);
    throw new Error(ERROR_MESSAGES.EMAIL_SENDING_FAILED);
  }
};

const generatePaymentConfirmationEmailTemplate = (order) => {
  return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Payment Confirmation</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                .container { background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); padding: 30px; }
                .header { text-align: center; margin-bottom: 30px; }
                .header img { max-width: 150px; height: auto; }
                h1 { color: #2c3e50; font-size: 24px; font-weight: 600; margin-bottom: 20px; text-align: center; }
                h2 { color: #2c3e50; font-size: 20px; font-weight: 600; margin-top: 20px; }
                .success-icon { text-align: center; font-size: 48px; color: #2ecc71; margin: 20px 0; }
                .payment-details { background-color: #f8f9fa; border-radius: 6px; padding: 20px; margin: 25px 0; border-left: 4px solid #2ecc71; }
                .payment-details p { margin: 5px 0; }
                .order-summary { background-color: #f8f9fa; border-radius: 6px; padding: 20px; margin: 25px 0; }
                .button { display: inline-block; background-color: #3498db; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-weight: bold; margin-top: 15px; }
                .support { background-color: #f8f9fa; border-radius: 6px; padding: 15px; margin-top: 30px; }
                .support h2 { font-size: 18px; margin-top: 0; }
                .footer { margin-top: 30px; font-size: 12px; color: #7f8c8d; text-align: center; border-top: 1px solid #ecf0f1; padding-top: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="${EMAIL_CONFIG.LOGO_URL}" alt="Omorix Logo">
                </div>
                <h1>Payment Confirmed</h1>
                
                <div class="success-icon">✓</div>
                
                <p>Dear ${order.firstName || 'Valued Customer'},</p>
                <p>Great news! We've received your payment for order #${order.orderNumber}. Your order is now being processed.</p>
                
                <div class="payment-details">
                    <h2>Payment Details</h2>
                    <p><strong>Order Number:</strong> ${order.orderNumber}</p>
                    <p><strong>Amount Paid:</strong> £${order.totalAmount.toFixed(2)}</p>
                    <p><strong>Payment Method:</strong> ${order.paymentMethod.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p>
                    <p><strong>Payment Date:</strong> ${new Date(order.paidAt || order.updatedAt).toLocaleString()}</p>
                    ${order.paypalOrderId ? `<p><strong>PayPal Transaction ID:</strong> ${order.paypalOrderId}</p>` : ''}
                </div>
                
                <div class="order-summary">
                    <h2>Order Summary</h2>
                    <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                    <p><strong>Shipping Address:</strong> ${order.deliveryAddress}, ${order.city}, ${order.postCode}, ${order.country}</p>
                    <p><strong>Shipping Method:</strong> ${order.shippingMethod.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p>
                </div>
                
                <p>We'll notify you when your order has been shipped. You can track your order status by visiting our website.</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders/${order.id}" class="button">Track Your Order</a>
                </div>
                
                <div class="support">
                    <h2>Need Help?</h2>
                    <p>If you have any questions about your order or payment, please contact our customer support team at <a href="mailto:${EMAIL_CONFIG.SUPPORT_EMAIL}">${EMAIL_CONFIG.SUPPORT_EMAIL}</a>.</p>
                </div>
                
                <div class="footer">
                    <p>Thank you for shopping with us!</p>
                    <p>© ${new Date().getFullYear()} ${EMAIL_CONFIG.COMPANY_NAME}. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};

// New function to send order shipped email
export const sendOrderShippedEmail = async (toEmail, order) => {
  const mailOptions = {
    from: `"${EMAIL_CONFIG.SENDER_NAME}" <${EMAIL_CONFIG.SENDER_EMAIL}>`,
    to: toEmail,
    subject: `Your Order #${order.orderNumber} Has Been Shipped`,
    html: generateOrderShippedEmailTemplate(order)
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Order shipped email sent to ${toEmail}`);
    return { success: true, message: 'Order shipped email sent successfully' };
  } catch (error) {
    console.error('Error sending order shipped email:', error);
    throw new Error(ERROR_MESSAGES.EMAIL_SENDING_FAILED);
  }
};

const generateOrderShippedEmailTemplate = (order) => {
  return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Shipped</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                .container { background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); padding: 30px; }
                .header { text-align: center; margin-bottom: 30px; }
                .header img { max-width: 150px; height: auto; }
                h1 { color: #2c3e50; font-size: 24px; font-weight: 600; margin-bottom: 20px; text-align: center; }
                h2 { color: #2c3e50; font-size: 20px; font-weight: 600; margin-top: 20px; }
                .shipping-icon { text-align: center; font-size: 48px; color: #3498db; margin: 20px 0; }
                .shipping-details { background-color: #f8f9fa; border-radius: 6px; padding: 20px; margin: 25px 0; border-left: 4px solid #3498db; }
                .shipping-details p { margin: 5px 0; }
                .tracking-info { background-color: #e6f7ff; border-radius: 6px; padding: 20px; margin: 25px 0; border-left: 4px solid #3498db; }
                .button { display: inline-block; background-color: #3498db; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-weight: bold; margin-top: 15px; }
                .support { background-color: #f8f9fa; border-radius: 6px; padding: 15px; margin-top: 30px; }
                .support h2 { font-size: 18px; margin-top: 0; }
                .footer { margin-top: 30px; font-size: 12px; color: #7f8c8d; text-align: center; border-top: 1px solid #ecf0f1; padding-top: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="${EMAIL_CONFIG.LOGO_URL}" alt="Omorix Logo">
                </div>
                <h1>Your Order Has Been Shipped!</h1>
                
                <div class="shipping-icon">🚚</div>
                
                <p>Dear ${order.firstName || 'Valued Customer'},</p>
                <p>Great news! Your order #${order.orderNumber} has been shipped and is on its way to you.</p>
                
                ${order.trackingNumber ? `
                <div class="tracking-info">
                    <h2>Tracking Information</h2>
                    <p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>
                    ${order.trackingUrl ? `
                    <p style="text-align: center; margin-top: 15px;">
                        <a href="${order.trackingUrl}" class="button" target="_blank">Track Your Package</a>
                    </p>
                    ` : ''}
                </div>
                ` : ''}
                
                <div class="shipping-details">
                    <h2>Shipping Details</h2>
                    <p><strong>Shipping Address:</strong> ${order.deliveryAddress}, ${order.city}, ${order.postCode}, ${order.country}</p>
                    <p><strong>Shipping Method:</strong> ${order.shippingMethod.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p>
                    <p><strong>Estimated Delivery:</strong> ${new Date(new Date(order.shippedAt || new Date()).getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()} - ${new Date(new Date(order.shippedAt || new Date()).getTime() + 10 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                </div>
                
                <p>You can track your order status by visiting our website.</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders/${order.id}" class="button">View Order Details</a>
                </div>
                
                <div class="support">
                    <h2>Need Help?</h2>
                    <p>If you have any questions about your delivery, please contact our customer support team at <a href="mailto:${EMAIL_CONFIG.SUPPORT_EMAIL}">${EMAIL_CONFIG.SUPPORT_EMAIL}</a>.</p>
                </div>
                
                <div class="footer">
                    <p>Thank you for shopping with us!</p>
                    <p>© ${new Date().getFullYear()} ${EMAIL_CONFIG.COMPANY_NAME}. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};