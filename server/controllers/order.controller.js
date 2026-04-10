import mongoose from "mongoose";
import Order from "../models/order.model.js";
import Invoice from "../models/invoice.model.js";
import Product from "../models/product.model.js";
import Company from "../models/company.model.js";

/** 
 * @description Create a new order
 * @route POST /api/orders
 * @access Protected
 */
export const createOrder = async (req, res) => {
    try {
        const {
            items,
            subtotal,
            tax,
            discount = 0,
            total,
            paymentMethod,
            paymentStatus = 'pending',
            transactionId,
            customerName,
            customerEmail,
            customerPhone,
            notes
        } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Order must have at least one item" });
        }
        if (!paymentMethod) {
            return res.status(400).json({ message: "Payment method is required" });
        }
        if (!customerName || !customerPhone) {
            return res.status(400).json({ message: "Customer name and phone are required" });
        }
        const orderCount = await Order.countDocuments({ company: req.user.company });
        const orderNumber = `ORD-${Date.now()}-${orderCount + 1}`;
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Product ${item.product} not found` });
            }
            if (product.quantity < item.quantity) {
                return res.status(400).json({ 
                    message: `Insufficient stock for ${product.name}. Available: ${product.quantity}, Requested: ${item.quantity}` 
                });
            }
        }
        const order = new Order({
            company: req.user.company,
            user: req.user._id,
            orderNumber,
            items,
            subtotal,
            tax,
            discount,
            total,
            paymentMethod,
            paymentStatus,
            transactionId,
            customerName,
            customerEmail,
            customerPhone,
            notes,
            status: 'pending'
        });
        order.statusHistory.push({
            status: 'pending',
            changedAt: new Date(),
            reason: 'Order created'
        });
        await order.save();
        for (const item of items) {
            const product = await Product.findById(item.product);
            product.quantity -= item.quantity;
            order.stockAdjustments.push({
                productId: item.product,
                quantity: item.quantity,
                adjustedAt: new Date()
            });
            await product.save();
        }
        
        let invoice = null;
        if (paymentStatus === 'paid' || paymentMethod === 'online') {
            const invoiceCount = await Invoice.countDocuments({ company: req.user.company });
            const invoiceNumber = `INV-${Date.now()}-${invoiceCount + 1}`;

            invoice = new Invoice({
                company: req.user.company,
                user: req.user._id,
                invoiceNumber,
                order: order._id,
                subtotal,
                tax,
                discount,
                amount: total,
                status: paymentStatus === 'paid' ? 'paid' : 'unpaid',
                paymentMethod,
                transactionId,
                issueDate: new Date(),
                dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                paidDate: paymentStatus === 'paid' ? new Date() : null,
            });

            await invoice.save();
            order.invoiceId = invoice._id;
            await order.save();
        }

        res.status(201).json({
            message: "Order created successfully",
            order: await order.populate([
                { path: 'company' },
                { path: 'user' },
                { path: 'items.product' },
                { path: 'invoiceId' }
            ]),
            invoice
        });

    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ 
            message: "Error creating order", 
            error: error.message 
        });
    }
};

/** 
 * @description Get all orders for a company
 * @route GET /api/orders
 * @access Protected
 */
export const getOrders = async (req, res) => {
    try {
        const { status, paymentStatus, sortBy = '-createdAt', page = 1, limit = 10 } = req.query;

        const filters = { company: req.user.company };
        
        if (status) filters.status = status;
        if (paymentStatus) filters.paymentStatus = paymentStatus;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const orders = await Order.find(filters)
            .populate([
                { path: 'company', select: 'name' },
                { path: 'user', select: 'name email' },
                { path: 'items.product', select: 'name sku price' },
                { path: 'invoiceId' }
            ])
            .sort(sortBy)
            .skip(skip)
            .limit(parseInt(limit));

        const totalOrders = await Order.countDocuments(filters);

        res.status(200).json({
            message: "Orders retrieved successfully",
            orders,
            pagination: {
                total: totalOrders,
                page: parseInt(page),
                pages: Math.ceil(totalOrders / parseInt(limit)),
                limit: parseInt(limit)
            }
        });

    } catch (error) {
        console.error("Error retrieving orders:", error);
        res.status(500).json({ 
            message: "Error retrieving orders", 
            error: error.message 
        });
    }
};

/** 
 * @description Get order by ID
 * @route GET /api/orders/:id
 * @access Protected
 */
export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid order ID" });
        }

        const order = await Order.findById(id)
            .populate([
                { path: 'company', select: 'name' },
                { path: 'user', select: 'name email' },
                { path: 'items.product' },
                { path: 'invoiceId' }
            ]);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Authorization check - ensure user belongs to the company
        if (order.company._id.toString() !== req.user.company.toString()) {
            return res.status(403).json({ message: "Not authorized to access this order" });
        }

        res.status(200).json({
            message: "Order retrieved successfully",
            order
        });

    } catch (error) {
        console.error("Error retrieving order:", error);
        res.status(500).json({ 
            message: "Error retrieving order", 
            error: error.message 
        });
    }
};

/** 
 * @description Update order status or payment status
 * @route PUT /api/orders/:id
 * @access Protected
 */
export const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, paymentStatus, transactionId, notes } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid order ID" });
        }

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Authorization check - ensure user belongs to the company
        if (order.company.toString() !== req.user.company.toString()) {
            return res.status(403).json({ message: "Not authorized to update this order" });
        }

        // Update status if provided
        if (status) {
            const validStatuses = ['pending', 'processing', 'completed', 'cancelled', 'failed'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
            }

            order.status = status;
            order.statusHistory.push({
                status,
                changedAt: new Date(),
                reason: req.body.reason || 'Status updated'
            });
        }

        // Update payment status if provided
        if (paymentStatus) {
            const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded'];
            if (!validPaymentStatuses.includes(paymentStatus)) {
                return res.status(400).json({ message: `Invalid payment status. Must be one of: ${validPaymentStatuses.join(', ')}` });
            }

            const previousPaymentStatus = order.paymentStatus;
            order.paymentStatus = paymentStatus;

            // Mark as paid
            if (paymentStatus === 'paid' && previousPaymentStatus !== 'paid') {
                order.paidAt = new Date();

                // Update invoice status if exists
                if (order.invoiceId) {
                    await Invoice.findByIdAndUpdate(order.invoiceId, {
                        status: 'paid',
                        paidDate: new Date()
                    });
                }
            }
        }

        // Update transaction ID if provided
        if (transactionId) {
            order.transactionId = transactionId;
        }

        // Update notes if provided
        if (notes) {
            order.notes = notes;
        }

        await order.save();

        const updatedOrder = await order.populate([
            { path: 'company' },
            { path: 'user' },
            { path: 'items.product' },
            { path: 'invoiceId' }
        ]);

        res.status(200).json({
            message: "Order updated successfully",
            order: updatedOrder
        });

    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ 
            message: "Error updating order", 
            error: error.message 
        });
    }
};

/** 
 * @description Delete order (soft delete by marking as cancelled)
 * @route DELETE /api/orders/:id
 * @access Protected
 */
export const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid order ID" });
        }

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Authorization check
        if (order.company.toString() !== req.user.company.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this order" });
        }

        // Only allow deletion if order is pending or processing
        if (!['pending', 'processing'].includes(order.status)) {
            return res.status(400).json({ 
                message: "Cannot delete order. Only pending or processing orders can be deleted." 
            });
        }

        // Restore stock before deleting
        for (const item of order.items) {
            const product = await Product.findById(item.product);
            if (product) {
                product.quantity += item.quantity;
                await product.save();
            }
        }

        // Mark as cancelled instead of deleting
        order.status = 'cancelled';
        order.statusHistory.push({
            status: 'cancelled',
            changedAt: new Date(),
            reason: 'Order deleted/cancelled'
        });

        await order.save();

        res.status(200).json({
            message: "Order cancelled and deleted successfully",
            order
        });

    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({ 
            message: "Error deleting order", 
            error: error.message 
        });
    }
};

/** 
 * @description Get order statistics
 * @route GET /api/orders/stats/overview
 * @access Protected
 */
export const getOrderStats = async (req, res) => {
    try {
        const { dateFrom, dateTo } = req.query;

        const filters = { company: req.user.company };

        if (dateFrom || dateTo) {
            filters.createdAt = {};
            if (dateFrom) filters.createdAt.$gte = new Date(dateFrom);
            if (dateTo) filters.createdAt.$lte = new Date(dateTo);
        }

        const [
            totalOrders,
            totalRevenue,
            paidOrders,
            pendingOrders,
            completedOrders,
            cancelledOrders
        ] = await Promise.all([
            Order.countDocuments(filters),
            Order.aggregate([
                { $match: filters },
                { $group: { _id: null, total: { $sum: '$total' } } }
            ]),
            Order.countDocuments({ ...filters, paymentStatus: 'paid' }),
            Order.countDocuments({ ...filters, paymentStatus: 'pending' }),
            Order.countDocuments({ ...filters, status: 'completed' }),
            Order.countDocuments({ ...filters, status: 'cancelled' })
        ]);

        res.status(200).json({
            message: "Order statistics retrieved successfully",
            stats: {
                totalOrders,
                totalRevenue: totalRevenue[0]?.total || 0,
                paidOrders,
                pendingOrders,
                completedOrders,
                cancelledOrders,
                averageOrderValue: totalOrders > 0 ? (totalRevenue[0]?.total || 0) / totalOrders : 0
            }
        });

    } catch (error) {
        console.error("Error retrieving order stats:", error);
        res.status(500).json({ 
            message: "Error retrieving order stats", 
            error: error.message 
        });
    }
}