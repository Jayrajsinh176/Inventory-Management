import mongoose from 'mongoose';
import Product from '../models/product.model.js';
import Order from '../models/order.model.js';
import Invoice from '../models/invoice.model.js';
import { logActivity } from '../utils/logActivity.js';

/**
 * @description Search products for billing
 * @route GET /api/billing/products/search
 * @access Private
 */
export const searchProducts = async (req, res) => {
    try {
        const { query, limit = 5 } = req.query;
        const companyId = req.user.company;

        if (!query || query.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Search query cannot be empty'
            });
        }

        const searchRegex = new RegExp(query, 'i');
        const products = await Product.find({
            company: companyId,
            $or: [
                { name: searchRegex },
                { sku: searchRegex }
            ]
        })
            .select('name sku price stock category vendor')
            .populate('category', 'name')
            .populate('vendor', 'name')
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            message: 'Products fetched successfully',
            data: products,
            count: products.length
        });
    } catch (error) {
        console.log('Search Products Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to search products'
        });
    }
};

/**
 * @description Get all products for billing (with stock available)
 * @route GET /api/billing/products
 * @access Private
 */
export const getProducts = async (req, res) => {
    try {
        const companyId = req.user.company;
        const products = await Product.find({
            company: companyId,
            stock: { $gt: 0 }
        })
            .select('name sku price stock category vendor')
            .populate('category', 'name')
            .populate('vendor', 'name');

        res.status(200).json({
            success: true,
            message: 'Products fetched successfully',
            data: products,
            count: products.length
        });
    } catch (error) {
        console.log('Get Products Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch products'
        });
    }
};

/**
 * @description Create order/billing and reduce stock
 * @route POST /api/billing/complete
 * @access Private
 */
export const completeBilling = async (req, res) => {
    try {
        const { items, customerData, paymentMethod, subtotal, tax, discount, total } = req.body;
        const companyId = req.user.company;
        const userId = req.user._id;

        // Validation
        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cart is empty'
            });
        }

        if (!paymentMethod || !['online', 'cash'].includes(paymentMethod)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment method'
            });
        }

        if (!total || total <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid total amount'
            });
        }

        // Verify stock availability for all items
        const stockCheck = await Promise.all(
            items.map(async (item) => {
                const product = await Product.findById(item.productId);
                if (!product) {
                    throw new Error(`Product ${item.productId} not found`);
                }
                if (product.stock < item.quantity) {
                    throw new Error(`Insufficient stock for ${product.name}`);
                }
                return { product, item };
            })
        );

        // Start transaction-like operation
        // 1. Reduce stock for all products
        const stockUpdatePromises = stockCheck.map(({ product, item }) =>
            Product.findByIdAndUpdate(
                product._id,
                { $inc: { stock: -item.quantity } },
                { new: true }
            )
        );

        await Promise.all(stockUpdatePromises);

        // 2. Create order number
        const orderCount = await Order.countDocuments({ company: companyId });
        const orderNumber = `ORD-${Date.now()}-${orderCount + 1}`;

        // 3. Create Order
        const orderData = {
            company: companyId,
            user: userId,
            orderNumber,
            items: items.map(item => ({
                product: item.productId,
                productName: item.name,
                productSku: item.sku,
                quantity: item.quantity,
                unitPrice: item.price,
                subtotal: item.price * item.quantity
            })),
            subtotal: subtotal || 0,
            tax: tax || 0,
            discount: discount || 0,
            total,
            paymentMethod,
            status: 'completed',
            customerName: customerData?.name || 'Walk-in Customer',
            customerEmail: customerData?.email || '',
            customerPhone: customerData?.phone || '',
            customerAddress: customerData?.address || '',
            notes: customerData?.notes || ''
        };

        const order = await Order.create(orderData);

        // 4. Create Invoice
        const invoiceNumber = `INV-${Date.now()}-${orderCount + 1}`;
        const invoiceData = {
            company: companyId,
            order: order._id,
            invoiceNumber,
            amount: total,
            tax,
            subtotal,
            status: 'issued',
            paymentStatus: paymentMethod === 'online' ? 'completed' : 'pending',
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        };

        const invoice = await Invoice.create(invoiceData);

        // 5. Log activity
        await logActivity({
            userId,
            companyId,
            action: 'created_order',
            details: `Created order ${orderNumber} with total ₹${total}`,
            metadata: {
                orderId: order._id,
                invoiceId: invoice._id,
                itemCount: items.length
            }
        });

        res.status(201).json({
            success: true,
            message: 'Order completed successfully',
            data: {
                order,
                invoice,
                orderNumber,
                invoiceNumber
            }
        });
    } catch (error) {
        console.log('Complete Billing Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to complete billing'
        });
    }
};

/**
 * @description Get billing summary (revenue, orders count, etc.)
 * @route GET /api/billing/summary
 * @access Private
 */
export const getBillingSummary = async (req, res) => {
    try {
        const companyId = req.user.company;

        // Total revenue from completed orders
        const revenue = await Order.aggregate([
            { $match: { company: new mongoose.Types.ObjectId(companyId), status: 'completed' } },
            { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
        ]);

        // Total orders
        const totalOrders = await Order.countDocuments({
            company: companyId,
            status: 'completed'
        });

        // Average order value
        const avgOrder = revenue[0]?.totalRevenue / totalOrders || 0;

        res.status(200).json({
            success: true,
            data: {
                totalRevenue: revenue[0]?.totalRevenue || 0,
                totalOrders,
                averageOrderValue: avgOrder
            }
        });
    } catch (error) {
        console.log('Get Billing Summary Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch billing summary'
        });
    }
};
