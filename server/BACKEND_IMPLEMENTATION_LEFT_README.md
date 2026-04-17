# Backend Implementation Left - TODO

**Last Updated**: April 15, 2026  
**Current Status**: ~60% Complete  
**Next Sprint Target**: Cart System + Complete Orders/Invoices

---

## 📊 Implementation Status Overview

| Feature | Completion | Priority | Status |
|---------|-----------|----------|--------|
| Authentication & Authorization | ✅ 95% | HIGH | Nearly Complete |
| Product Management | ✅ 90% | HIGH | Nearly Complete |
| User Management | ✅ 85% | HIGH | Mostly Complete |
| **Orders System** | ⚠️ 40% | **HIGH** | CREATE works, CRUD incomplete |
| **Cart System** | ❌ 0% | **HIGH** | Not Started - CRITICAL |
| **Invoice System** | ⚠️ 50% | **HIGH** | List/Get works, PDF missing |
| Vendor Management | ⚠️ 60% | MEDIUM | Basic CRUD done |
| Email Notifications | ⚠️ 20% | MEDIUM | Framework exists |
| Scheduled Tasks | ❌ 0% | MEDIUM | Not Started |
| Payment Processing (Stripe) | ❌ 5% | LOW | Not Started - DEFERRED |
| Reports & Export | ❌ 0% | LOW | Not Started - PHASE 2 |
| Real-Time Updates (Socket.IO) | ❌ 0% | LOW | Not Started - DEFERRED |

---

## 🚀 PHASE 1: HIGH PRIORITY (Next 2 Weeks)

### TASK 1: Create Cart System (NEW - 0% Complete)
**🎯 Goal**: Enable users to add products to cart before checkout  
**⏱️ Effort**: 1-2 days  
**📁 Files**: Create 3 new files  

#### 1.1 Create Cart Model
**File**: `server/models/cart.model.js`

```javascript
import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        productName: String,
        productSku: String,
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1
        },
        unitPrice: {
          type: Number,
          required: true,
          min: 0
        },
        subtotal: Number, // quantity * unitPrice
        addedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    subtotal: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      index: { expireAfterSeconds: 0 } // TTL index
    }
  },
  { timestamps: true }
);

// Compound unique index to ensure one cart per user per company
cartSchema.index({ user: 1, company: 1 }, { unique: true });

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
```

#### 1.2 Create Cart Controller
**File**: `server/controllers/cart.controller.js`

```javascript
import mongoose from 'mongoose';
import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';

/**
 * @description Get user's cart
 * @route GET /api/cart
 * @access Protected
 */
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id, company: req.user.company })
      .populate('items.product', 'name sku price quantity');
    
    if (!cart) {
      return res.status(200).json({ message: 'Cart is empty', cart: null });
    }
    
    res.status(200).json({ message: 'Cart retrieved successfully', cart });
  } catch (error) {
    console.error('Error retrieving cart:', error);
    res.status(500).json({ message: 'Error retrieving cart', error: error.message });
  }
};

/**
 * @description Add product to cart
 * @route POST /api/cart
 * @access Protected
 */
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    // Check product exists and has stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({ 
        message: `Insufficient stock. Available: ${product.quantity}, Requested: ${quantity}` 
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user.id, company: req.user.company });
    
    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        company: req.user.company,
        items: []
      });
    }

    // Check if product already in cart
    const existingItem = cart.items.find(item => item.product.toString() === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.subtotal = existingItem.quantity * existingItem.unitPrice;
    } else {
      cart.items.push({
        product: productId,
        productName: product.name,
        productSku: product.sku,
        quantity,
        unitPrice: product.price,
        subtotal: quantity * product.price
      });
    }

    // Recalculate totals
    cart.subtotal = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
    cart.tax = Math.round(cart.subtotal * 0.18 * 100) / 100; // 18% GST
    cart.total = cart.subtotal + cart.tax;

    await cart.save();
    
    res.status(200).json({ message: 'Product added to cart', cart });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Error adding to cart', error: error.message });
  }
};

/**
 * @description Update cart item quantity
 * @route PUT /api/cart/items/:itemId
 * @access Protected
 */
export const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ message: 'Invalid item ID' });
    }

    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const cart = await Cart.findOne({ user: req.user.id, company: req.user.company });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Verify stock availability
    const product = await Product.findById(item.product);
    if (product.quantity < quantity) {
      return res.status(400).json({ 
        message: `Insufficient stock. Available: ${product.quantity}, Requested: ${quantity}` 
      });
    }

    item.quantity = quantity;
    item.subtotal = quantity * item.unitPrice;

    // Recalculate totals
    cart.subtotal = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
    cart.tax = Math.round(cart.subtotal * 0.18 * 100) / 100;
    cart.total = cart.subtotal + cart.tax;

    await cart.save();
    
    res.status(200).json({ message: 'Cart item updated', cart });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ message: 'Error updating cart item', error: error.message });
  }
};

/**
 * @description Remove item from cart
 * @route DELETE /api/cart/items/:itemId
 * @access Protected
 */
export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ message: 'Invalid item ID' });
    }

    const cart = await Cart.findOne({ user: req.user.id, company: req.user.company });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    item.deleteOne();

    // Recalculate totals
    cart.subtotal = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
    cart.tax = Math.round(cart.subtotal * 0.18 * 100) / 100;
    cart.total = cart.subtotal + cart.tax;

    await cart.save();
    
    res.status(200).json({ message: 'Item removed from cart', cart });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ message: 'Error removing from cart', error: error.message });
  }
};

/**
 * @description Clear entire cart
 * @route DELETE /api/cart
 * @access Protected
 */
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id, company: req.user.company });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    cart.subtotal = 0;
    cart.tax = 0;
    cart.total = 0;

    await cart.save();
    
    res.status(200).json({ message: 'Cart cleared', cart });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Error clearing cart', error: error.message });
  }
};

/**
 * @description Convert cart to order (checkout)
 * @route POST /api/cart/checkout
 * @access Protected
 */
export const checkoutCart = async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, paymentMethod, notes } = req.body;

    if (!customerName || !customerPhone) {
      return res.status(400).json({ message: 'Customer name and phone are required' });
    }

    if (!paymentMethod) {
      return res.status(400).json({ message: 'Payment method is required' });
    }

    const cart = await Cart.findOne({ user: req.user.id, company: req.user.company });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // TODO: Call createOrder function with cart data
    // For now, return success message
    res.status(200).json({ 
      message: 'Cart ready for checkout',
      orderData: {
        items: cart.items,
        subtotal: cart.subtotal,
        tax: cart.tax,
        total: cart.total,
        customerName,
        customerEmail,
        customerPhone,
        paymentMethod,
        notes
      }
    });
  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(500).json({ message: 'Error during checkout', error: error.message });
  }
};
```

#### 1.3 Create Cart Routes
**File**: `server/routes/cart.routes.js`

```javascript
import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  checkoutCart
} from '../controllers/cart.controller.js';

const router = express.Router();

// Cart routes
router.get('/', protect, getCart);
router.post('/', protect, addToCart);
router.put('/items/:itemId', protect, updateCartItem);
router.delete('/items/:itemId', protect, removeFromCart);
router.delete('/', protect, clearCart);
router.post('/checkout', protect, checkoutCart);

export default router;
```

#### 1.4 Register Cart Routes in index.js
**Add to**: `server/index.js`

```javascript
// Add this import at the top with other route imports
import cartRoutes from './routes/cart.routes.js';

// Add this line before app.listen() with other route registrations
app.use('/api/cart', cartRoutes);
```

**✅ Completion Tasks**:
- [ ] Create `server/models/cart.model.js`
- [ ] Create `server/controllers/cart.controller.js`
- [ ] Create `server/routes/cart.routes.js`
- [ ] Register cart routes in `server/index.js`
- [ ] Test with Postman: POST /api/cart, GET /api/cart, PUT, DELETE
- [ ] Verify stock validation works correctly

---

### TASK 2: Complete Order Management System (40% → 90%)
**🎯 Goal**: Implement full CRUD operations for orders  
**⏱️ Effort**: 1-2 days  
**📁 Files**: Modify `server/controllers/order.controller.js`

#### 2.1 What's Already Done
✅ `createOrder()` - Create order with stock validation  
✅ Order routes registered  
✅ Order model created  

#### 2.2 What Needs Implementation

**File**: `server/controllers/order.controller.js`

Replace/add these functions:

```javascript
/**
 * @description Get all orders for company
 * @route GET /api/orders
 * @access Protected
 */
export const getOrders = async (req, res) => {
  try {
    const { status, fromDate, toDate, page = 1, limit = 10, sortBy = '-createdAt' } = req.query;

    const filters = { company: req.user.company };
    
    if (status) filters.status = status;
    
    if (fromDate || toDate) {
      filters.createdAt = {};
      if (fromDate) filters.createdAt.$gte = new Date(fromDate);
      if (toDate) filters.createdAt.$lte = new Date(toDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find(filters)
      .populate('user', 'name email')
      .populate('items.product', 'name sku price')
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
    res.status(500).json({ message: "Error retrieving orders", error: error.message });
  }
};

/**
 * @description Get order by ID
 * @route GET /api/orders/:id
 * @access Protected
 */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('company', 'name email')
      .populate('user', 'name email')
      .populate('items.product', 'name sku price category');

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.company.toString() !== req.user.company.toString()) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    res.status(200).json({ message: "Order retrieved successfully", order });
  } catch (error) {
    console.error("Error retrieving order:", error);
    res.status(500).json({ message: "Error retrieving order", error: error.message });
  }
};

/**
 * @description Update order status
 * @route PUT /api/orders/:id
 * @access Protected
 */
export const updateOrder = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.company.toString() !== req.user.company.toString()) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // Valid status transitions
    const validTransitions = {
      pending: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered'],
      delivered: [],
      cancelled: []
    };

    if (!validTransitions[order.status]?.includes(status)) {
      return res.status(400).json({ 
        message: `Cannot transition from ${order.status} to ${status}` 
      });
    }

    // Add to status history
    if (!order.statusHistory) order.statusHistory = [];
    order.statusHistory.push({
      status,
      timestamp: new Date(),
      notes
    });

    // Restore stock if cancelling
    if (status === 'cancelled' && order.status !== 'cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { quantity: item.quantity } }
        );
      }
    }

    order.status = status;
    await order.save();

    res.status(200).json({ 
      message: "Order updated successfully", 
      order 
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Error updating order", error: error.message });
  }
};

/**
 * @description Delete/Cancel order
 * @route DELETE /api/orders/:id
 * @access Protected
 */
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.company.toString() !== req.user.company.toString()) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // Only allow deletion of pending/processing orders
    if (!['pending', 'processing'].includes(order.status)) {
      return res.status(400).json({ 
        message: "Can only delete pending or processing orders" 
      });
    }

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { quantity: item.quantity } }
      );
    }

    // Soft delete
    order.status = 'cancelled';
    order.cancelledAt = new Date();
    await order.save();

    res.status(200).json({ message: "Order cancelled successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Error deleting order", error: error.message });
  }
};

/**
 * @description Get order statistics
 * @route GET /api/orders/stats/overview
 * @access Protected
 */
export const getOrderStats = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;

    const filters = { company: req.user.company };
    
    if (fromDate || toDate) {
      filters.createdAt = {};
      if (fromDate) filters.createdAt.$gte = new Date(fromDate);
      if (toDate) filters.createdAt.$lte = new Date(toDate);
    }

    const totalOrders = await Order.countDocuments(filters);
    const pendingOrders = await Order.countDocuments({ ...filters, status: 'pending' });
    const processingOrders = await Order.countDocuments({ ...filters, status: 'processing' });
    const shippedOrders = await Order.countDocuments({ ...filters, status: 'shipped' });
    const deliveredOrders = await Order.countDocuments({ ...filters, status: 'delivered' });

    const orders = await Order.find(filters);
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    res.status(200).json({
      message: "Order statistics retrieved",
      stats: {
        totalOrders,
        totalRevenue,
        avgOrderValue,
        byStatus: {
          pending: pendingOrders,
          processing: processingOrders,
          shipped: shippedOrders,
          delivered: deliveredOrders
        }
      }
    });
  } catch (error) {
    console.error("Error retrieving order stats:", error);
    res.status(500).json({ message: "Error retrieving stats", error: error.message });
  }
};
```

**✅ Completion Tasks**:
- [ ] Implement `getOrders()` with filtering, pagination, sorting
- [ ] Implement `getOrderById()` with full population
- [ ] Implement `updateOrder()` with status transitions
- [ ] Implement `deleteOrder()` with soft delete & stock restoration
- [ ] Implement `getOrderStats()` with KPI calculations
- [ ] Add `statusHistory` field to Order model (if missing)
- [ ] Add `cancelledAt` field to Order model (if missing)
- [ ] Test all endpoints with Postman
- [ ] Add email notifications for status changes

---

### TASK 3: Complete Invoice System (50% → 100%)
**🎯 Goal**: Implement PDF generation and invoice workflows  
**⏱️ Effort**: 1-2 days  
**📁 Files**: Modify `server/controllers/invoice.controller.js`

#### 3.1 What's Already Done
✅ `getInvoices()` - List invoices  
✅ `getInvoiceById()` - Get single invoice  
✅ `getInvoiceByOrderId()` - Get invoice by order  
✅ Invoice routes registered  

#### 3.2 What Needs Implementation

**Add these functions to**: `server/controllers/invoice.controller.js`

```javascript
import PDFDocument from 'pdfkit';

/**
 * @description Download invoice as PDF
 * @route GET /api/invoices/:id/download
 * @access Protected
 */
export const downloadInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('company')
      .populate('order');

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    if (invoice.company._id.toString() !== req.user.company.toString()) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const doc = new PDFDocument();
    const filename = `invoice-${invoice.invoiceNumber}.pdf`;

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    doc.pipe(res);

    // Header
    doc.fontSize(16).font('Helvetica-Bold').text(invoice.company.name);
    doc.fontSize(10).font('Helvetica');
    doc.text(invoice.company.address || '');
    doc.text(`Email: ${invoice.company.email || 'N/A'}`);
    doc.text(`Phone: ${invoice.company.phone || 'N/A'}`);

    // Title
    doc.moveDown().fontSize(14).font('Helvetica-Bold').text('INVOICE');

    // Invoice details
    doc.fontSize(10).font('Helvetica');
    doc.text(`Invoice #: ${invoice.invoiceNumber}`, 350);
    doc.text(`Date: ${new Date(invoice.issueDate).toLocaleDateString()}`, 350);
    doc.text(`Due: ${new Date(invoice.dueDate).toLocaleDateString()}`, 350);

    // Customer section
    doc.moveDown().text('Bill To:', { underline: true });
    doc.text(`Name: ${invoice.order.customerName}`);
    doc.text(`Email: ${invoice.order.customerEmail}`);
    doc.text(`Phone: ${invoice.order.customerPhone}`);

    // Items table
    doc.moveDown().fontSize(12).font('Helvetica-Bold').text('Items');
    doc.fontSize(10).font('Helvetica');

    const itemsStartY = doc.y;
    const col1 = 50, col2 = 280, col3 = 380, col4 = 480;

    doc.text('Item', col1, itemsStartY);
    doc.text('Qty', col2, itemsStartY);
    doc.text('Unit Price', col3, itemsStartY);
    doc.text('Total', col4, itemsStartY);

    // Line separator
    doc.moveTo(50, itemsStartY + 15).lineTo(550, itemsStartY + 15).stroke();

    let currentY = itemsStartY + 25;
    let subtotal = 0;

    // Add items
    invoice.order.items.forEach(item => {
      doc.text(item.productName, col1, currentY);
      doc.text(item.quantity.toString(), col2, currentY);
      doc.text(`$${item.unitPrice.toFixed(2)}`, col3, currentY);
      const itemTotal = item.quantity * item.unitPrice;
      doc.text(`$${itemTotal.toFixed(2)}`, col4, currentY);
      subtotal += itemTotal;
      currentY += 20;
    });

    // Totals section
    doc.moveDown();
    const totalsX = 350;
    doc.font('Helvetica').text(`Subtotal: $${invoice.subtotal.toFixed(2)}`, totalsX);
    doc.text(`Tax (${invoice.taxRate}%): $${invoice.tax.toFixed(2)}`, totalsX);
    doc.font('Helvetica-Bold').fontSize(12).text(`Total: $${invoice.total.toFixed(2)}`, totalsX);

    // Status
    doc.moveDown().fontSize(10).font('Helvetica');
    doc.text(`Status: ${invoice.status.toUpperCase()}`);

    // Footer
    doc.moveDown().fontSize(9).text('Thank you for your business!', { align: 'center' });

    doc.end();
  } catch (error) {
    console.error('Error downloading invoice:', error);
    res.status(500).json({ message: 'Error downloading invoice', error: error.message });
  }
};

/**
 * @description Update invoice status
 * @route PUT /api/invoices/:id
 * @access Protected
 */
export const updateInvoiceStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['pending', 'paid', 'overdue', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    if (invoice.company.toString() !== req.user.company.toString()) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    invoice.status = status;
    if (status === 'paid') {
      invoice.paidAt = new Date();
    }

    await invoice.save();

    res.status(200).json({ 
      message: 'Invoice status updated', 
      invoice 
    });
  } catch (error) {
    console.error('Error updating invoice:', error);
    res.status(500).json({ message: 'Error updating invoice', error: error.message });
  }
};

/**
 * @description Get invoice statistics
 * @route GET /api/invoices/stats/overview
 * @access Protected
 */
export const getInvoiceStats = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;

    const filters = { company: req.user.company };

    if (fromDate || toDate) {
      filters.issueDate = {};
      if (fromDate) filters.issueDate.$gte = new Date(fromDate);
      if (toDate) filters.issueDate.$lte = new Date(toDate);
    }

    const totalInvoices = await Invoice.countDocuments(filters);
    const pendingInvoices = await Invoice.countDocuments({ ...filters, status: 'pending' });
    const paidInvoices = await Invoice.countDocuments({ ...filters, status: 'paid' });
    const overdueInvoices = await Invoice.countDocuments({ ...filters, status: 'overdue' });

    const invoices = await Invoice.find(filters);
    const totalAmount = invoices.reduce((sum, inv) => sum + inv.total, 0);

    res.status(200).json({
      message: 'Invoice statistics retrieved',
      stats: {
        totalInvoices,
        totalAmount,
        byStatus: {
          pending: pendingInvoices,
          paid: paidInvoices,
          overdue: overdueInvoices
        }
      }
    });
  } catch (error) {
    console.error('Error retrieving invoice stats:', error);
    res.status(500).json({ message: 'Error retrieving stats', error: error.message });
  }
};

/**
 * @description Get pending invoices
 * @route GET /api/invoices/pending/list
 * @access Protected
 */
export const getPendingInvoices = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const invoices = await Invoice.find({ 
      company: req.user.company, 
      status: 'pending' 
    })
      .populate('order', 'orderNumber customerName')
      .sort('-issueDate')
      .limit(parseInt(limit));

    res.status(200).json({
      message: 'Pending invoices retrieved',
      invoices,
      count: invoices.length
    });
  } catch (error) {
    console.error('Error retrieving pending invoices:', error);
    res.status(500).json({ message: 'Error retrieving pending invoices', error: error.message });
  }
};
```

**Also add auto-generation to Order Controller**:

In `server/controllers/order.controller.js`, after order is successfully created, add:

```javascript
// Auto-generate invoice if order status is processing
if (order.status === 'processing') {
  const invoiceCount = await Invoice.countDocuments({ company: order.company });
  const invoiceNumber = `INV-${new Date().toISOString().slice(0,7).replace('-','')}-${String(invoiceCount + 1).padStart(5, '0')}`;
  
  await Invoice.create({
    company: order.company,
    order: order._id,
    invoiceNumber,
    issueDate: new Date(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    subtotal: order.subtotal,
    tax: order.tax,
    total: order.total,
    status: 'pending',
    taxRate: 18
  });
}
```

**✅ Completion Tasks**:
- [ ] Implement `downloadInvoice()` with PDF generation
- [ ] Implement `updateInvoiceStatus()`
- [ ] Implement `getInvoiceStats()`
- [ ] Implement `getPendingInvoices()`
- [ ] Add auto-invoice creation in `createOrder()`
- [ ] Add `paidAt` field to Invoice model (if missing)
- [ ] Test PDF download functionality
- [ ] Verify invoice format looks professional

---

## 📋 PHASE 2: MEDIUM PRIORITY (Following Week)

### TASK 4: Complete Vendor Management
- [ ] Implement `updateVendor()` with validation
- [ ] Implement `deleteVendor()` with soft delete
- [ ] Add vendor-product association endpoints
- [ ] Add supply request system

### TASK 5: Email Notifications
- [ ] Create HTML email templates
- [ ] Setup order confirmation emails
- [ ] Setup invoice delivery emails
- [ ] Setup low stock alert emails

### TASK 6: Scheduled Tasks (Cron Jobs)
- [ ] Daily low stock alert checks
- [ ] Invoice overdue notifications
- [ ] Subscription renewal reminders

---

## 🔧 QUICK REFERENCE: API Endpoints

### Cart Endpoints
```
POST   /api/cart              Add product to cart
GET    /api/cart              Get user's cart
PUT    /api/cart/items/:id    Update cart item
DELETE /api/cart/items/:id    Remove item
DELETE /api/cart              Clear cart
POST   /api/cart/checkout     Checkout (convert to order)
```

### Order Endpoints
```
POST   /api/orders            Create order
GET    /api/orders            List orders (with filters)
GET    /api/orders/:id        Get order details
PUT    /api/orders/:id        Update order status
DELETE /api/orders/:id        Cancel order
GET    /api/orders/stats/overview  Get order statistics
```

### Invoice Endpoints
```
GET    /api/invoices          List invoices
GET    /api/invoices/:id      Get invoice
GET    /api/invoices/:id/download  Download PDF
PUT    /api/invoices/:id      Update status
GET    /api/invoices/stats/overview  Get statistics
GET    /api/invoices/pending/list    Get pending invoices
```

---

## ✅ TESTING CHECKLIST

- [ ] All cart endpoints work with Postman
- [ ] All order endpoints work with Postman
- [ ] All invoice endpoints work with Postman
- [ ] PDF download generates valid PDF
- [ ] Stock is properly deducted on order creation
- [ ] Stock is properly restored on order cancellation
- [ ] Tax calculations are correct
- [ ] Status transitions follow valid workflows
- [ ] Unauthorized users cannot access other company's data
- [ ] Pagination works correctly
- [ ] Filtering by date range works
- [ ] Email notifications trigger correctly (when implemented)

---

**Note**: Socket.IO (real-time updates), Payment Processing (Stripe), and Reports are deferred to Phase 3 and beyond.
# Backend Implementation Left - TODO

Last Updated: April 15, 2026

---

## 📊 Implementation Status Overview

| Category | Completion | Status | Notes |
|----------|------------|--------|-------|
| Authentication & Authorization | ✅ 95% | Nearly Complete | Only password reset refinement needed |
| Product Management | ✅ 90% | Nearly Complete | Core features done, analytics pending |
| User Management | ✅ 85% | Mostly Complete | Invite system needs testing |
| Orders & Billing | ⚠️ 40% | **IN PROGRESS** | CREATE order works, CRUD endpoints incomplete |
| Cart System | ❌ 0% | **NOT STARTED** | Need to create 6 new endpoints + model |
| Vendor Management | ⚠️ 60% | Partially Complete | Basic CRUD done, update/delete incomplete |
| Invoice Management | ⚠️ 50% | **IN PROGRESS** | List/get works, PDF generation missing |
| Email & Notifications | ⚠️ 20% | In Progress | Framework exists, triggers incomplete |
| Payment Processing (Stripe) | ❌ 5% | Not Started | Keys configured, workflows missing |
| Real-Time Updates (Socket.IO) | ❌ 0% | Not Started | **Deferred for now** |
| Reports & Export | ❌ 0% | Not Started | Scheduled for Phase 2 |
| Advanced Features (2FA, etc) | ❌ 10% | Minimal | Scheduled for Phase 2 |

---

## 🎯 HIGH PRIORITY - IMPLEMENT IMMEDIATELY (Next 2 Weeks)

### 1. 🛒 Create Cart System (MISSING - 0% Done)
**Why Critical**: Orders require a cart system for users to add products before checkout.  
**Effort**: 1-2 days  
**Status**: Not Started

#### A. Create Cart Model
**File**: `server/models/cart.model.js` (NEW)
```javascript
const cartSchema = {
  user: ObjectId (required, indexed),
  company: ObjectId (required, indexed),
  items: [{
    product: ObjectId (required),
    quantity: Number (required, min: 1),
    unitPrice: Number (required),
    addedAt: Date (timestamp)
  }],
  subtotal: Number,
  tax: Number,
  total: Number,
  expiresAt: Date (TTL: 7 days),
  createdAt: Date,
  updatedAt: Date
}
```

#### B. Create Cart Controller
**File**: `server/controllers/cart.controller.js` (NEW)
```javascript
✅ getCart(req, res) - GET /api/cart
✅ addToCart(req, res) - POST /api/cart/add
✅ updateCartItem(req, res) - PUT /api/cart/items/:itemId
✅ removeFromCart(req, res) - DELETE /api/cart/items/:itemId
✅ clearCart(req, res) - DELETE /api/cart
✅ checkoutCart(req, res) - POST /api/cart/checkout (convert to order)
```

#### C. Create Cart Routes
**File**: `server/routes/cart.routes.js` (NEW)
```javascript
GET /api/cart - Get user's current cart
POST /api/cart/add - Add product to cart
PUT /api/cart/items/:itemId - Update item quantity
DELETE /api/cart/items/:itemId - Remove item from cart
DELETE /api/cart - Clear entire cart
POST /api/cart/checkout - Convert cart to order
```

#### D. Register Routes in `index.js`
```javascript
import cartRoutes from './routes/cart.routes.js';
app.use('/api/cart', cartRoutes);
```

**Checklist**:
- [ ] Create cart model with all fields
- [ ] Create cart controller with CRUD operations
- [ ] Create cart routes file
- [ ] Register cart routes in index.js
- [ ] Test all endpoints with Postman/REST Client
- [ ] Add validation for product existence and stock

---

### 2. ⚠️ Complete Order Management System (40% Done → 90%)
**Why Critical**: Core business feature - users need full order functionality.  
**Effort**: 1-2 days  
**Status**: CREATE works, CRUD incomplete

#### What's Already Done:
✅ `createOrder()` - Implemented with stock validation  
✅ Order routes registered in `index.js`  
✅ Order model created with all fields  

#### What Needs Completion:
**File**: `server/controllers/order.controller.js`

```javascript
❌ getOrders() - INCOMPLETE
   - Add filtering: status, dateRange, customer
   - Add pagination: page, limit
   - Add sorting: by date, by total
   - Populate company, user, product details
   
❌ getOrderById(orderId) - NOT IMPLEMENTED
   - Return full order with populated items
   - Include customer details
   - Include invoice information
   
❌ updateOrder(orderId, updateData) - NOT IMPLEMENTED
   - Handle status transitions: pending → processing → shipped → delivered
   - Track status history with timestamps
   - Send email notifications on status change
   - Prevent invalid transitions
   
❌ deleteOrder(orderId) - NOT IMPLEMENTED
   - Implement soft delete (mark as cancelled)
   - Restore stock quantities
   - Archive order data
   - Send cancellation email to customer

❌ getOrderStats() - NOT IMPLEMENTED
   - Total orders this month
   - Total revenue
   - Average order value
   - Top customers
```

#### Detailed Implementation Requirements:

**getOrders() Implementation:**
```javascript
export const getOrders = async (req, res) => {
  const { status, fromDate, toDate, page = 1, limit = 10, sortBy = '-createdAt' } = req.query;
  
  const filters = { company: req.user.company };
  if (status) filters.status = status;
  if (fromDate || toDate) {
    filters.createdAt = {};
    if (fromDate) filters.createdAt.$gte = new Date(fromDate);
    if (toDate) filters.createdAt.$lte = new Date(toDate);
  }
  
  const skip = (page - 1) * limit;
  const orders = await Order.find(filters)
    .populate('user', 'name email')
    .populate('items.product', 'name sku price')
    .sort(sortBy)
    .skip(skip)
    .limit(limit);
  
  const total = await Order.countDocuments(filters);
  res.json({ orders, pagination: { total, page, pages: Math.ceil(total/limit) } });
};
```

**updateOrder() Implementation (Status Workflow):**
```javascript
const validTransitions = {
  pending: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: []
};

export const updateOrder = async (req, res) => {
  const { status, notes } = req.body;
  const order = await Order.findById(req.params.id);
  
  if (!validTransitions[order.status].includes(status)) {
    return res.status(400).json({ message: 'Invalid status transition' });
  }
  
  // Add to status history
  order.statusHistory.push({
    status,
    timestamp: new Date(),
    notes
  });
  
  // If cancelling, restore stock
  if (status === 'cancelled') {
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { quantity: item.quantity } }
      );
    }
  }
  
  order.status = status;
  await order.save();
  
  // Send email notification
  // await sendOrderStatusEmail(order.customerEmail, order.orderNumber, status);
  
  res.json({ message: 'Order updated', order });
};
```

**Checklist**:
- [ ] Implement `getOrders()` with filtering, pagination, sorting
- [ ] Implement `getOrderById()` with full population
- [ ] Implement `updateOrder()` with status workflow
- [ ] Implement `deleteOrder()` with soft delete & stock restoration
- [ ] Implement `getOrderStats()` with KPI calculations
- [ ] Add `statusHistory` field to Order model if missing
- [ ] Test all endpoints with various scenarios
- [ ] Add email notifications for status changes

---

### 3. 📄 Complete Invoice & PDF Generation (50% Done → 100%)
**Why Critical**: Businesses need invoices for accounting and customer records.  
**Effort**: 1-2 days  
**Status**: List/Get works, PDF generation missing

#### What's Already Done:
✅ `getInvoices()` - Implemented with filtering & pagination  
✅ `getInvoiceById()` - Implemented  
✅ `getInvoiceByOrderId()` - Implemented  
✅ Invoice routes registered  

#### What Needs Completion:
**File**: `server/controllers/invoice.controller.js`

```javascript
❌ downloadInvoice(invoiceId) - NOT IMPLEMENTED
   - Generate PDF using pdfkit
   - Include company branding
   - Format invoice professionally
   - Send as download response
   
❌ updateInvoiceStatus(invoiceId) - NOT IMPLEMENTED
   - Update payment status: pending → paid → overdue
   - Record payment date
   - Send payment confirmation email
   
❌ Auto-generate invoice on order creation - MISSING TRIGGER
   - Create invoice automatically when order status → processing
   - Link invoice to order
   - Generate invoice number (INV-YYYYMM-00001 format)
```

#### Detailed Implementation Requirements:

**downloadInvoice() Implementation (using pdfkit):**
```javascript
import PDFDocument from 'pdfkit';
import fs from 'fs';

export const downloadInvoice = async (req, res) => {
  const invoice = await Invoice.findById(req.params.id)
    .populate('company')
    .populate('order');
  
  if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
  
  const doc = new PDFDocument();
  const filename = `invoice-${invoice.invoiceNumber}.pdf`;
  
  // Set response headers
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  doc.pipe(res);
  
  // Header: Company details
  doc.fontSize(16).font('Helvetica-Bold').text(invoice.company.name);
  doc.fontSize(10).font('Helvetica').text(invoice.company.address);
  doc.text(invoice.company.email);
  doc.text(invoice.company.phone);
  
  // Invoice title
  doc.moveDown().fontSize(14).font('Helvetica-Bold').text('INVOICE');
  
  // Invoice details (right aligned)
  doc.fontSize(10).font('Helvetica');
  doc.text(`Invoice #: ${invoice.invoiceNumber}`, 350);
  doc.text(`Date: ${new Date(invoice.issueDate).toLocaleDateString()}`, 350);
  doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, 350);
  
  // Customer details
  doc.moveDown().text('Bill To:', { underline: true });
  doc.text(`Customer: ${invoice.order.customerName}`);
  doc.text(`Email: ${invoice.order.customerEmail}`);
  doc.text(`Phone: ${invoice.order.customerPhone}`);
  
  // Line items table
  doc.moveDown().fontSize(12).font('Helvetica-Bold').text('Items');
  doc.fontSize(10).font('Helvetica');
  
  // Table header
  const itemsTopY = doc.y;
  const tableWidth = 500;
  const col1 = 50, col2 = 250, col3 = 350, col4 = 430;
  
  doc.text('Item', col1, itemsTopY);
  doc.text('Qty', col2, itemsTopY);
  doc.text('Unit Price', col3, itemsTopY);
  doc.text('Total', col4, itemsTopY);
  
  // Draw line
  doc.moveTo(50, itemsTopY + 15).lineTo(550, itemsTopY + 15).stroke();
  
  let currentY = itemsTopY + 20;
  let subtotal = 0;
  
  // Add items
  invoice.order.items.forEach(item => {
    doc.text(item.productName, col1, currentY);
    doc.text(item.quantity.toString(), col2, currentY);
    doc.text(`$${item.unitPrice.toFixed(2)}`, col3, currentY);
    const itemTotal = item.quantity * item.unitPrice;
    doc.text(`$${itemTotal.toFixed(2)}`, col4, currentY);
    subtotal += itemTotal;
    currentY += 20;
  });
  
  // Totals
  doc.moveDown();
  doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 350);
  doc.text(`Tax (${invoice.taxRate}%): $${invoice.tax.toFixed(2)}`, 350);
  doc.font('Helvetica-Bold').text(`Total: $${invoice.total.toFixed(2)}`, 350);
  
  // Status
  doc.moveDown().fontSize(10).font('Helvetica');
  doc.text(`Status: ${invoice.status.toUpperCase()}`);
  
  // Footer
  doc.moveDown().fontSize(9).text('Thank you for your business!', { align: 'center' });
  
  doc.end();
};
```

**Auto-generate Invoice on Order Creation:**
```javascript
// In createOrder() function, after order is saved:
if (order.status === 'processing') {
  const invoiceCount = await Invoice.countDocuments({ company: order.company });
  const invoiceNumber = `INV-${new Date().toISOString().slice(0,7).replace('-','')}-${String(invoiceCount + 1).padStart(5, '0')}`;
  
  const invoice = await Invoice.create({
    company: order.company,
    order: order._id,
    invoiceNumber,
    issueDate: new Date(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    subtotal: order.subtotal,
    tax: order.tax,
    total: order.total,
    status: 'pending',
    taxRate: 18 // Based on company settings
  });
}
```

**Checklist**:
- [ ] Implement `downloadInvoice()` with PDF generation using pdfkit
- [ ] Create professional PDF template
- [ ] Implement `updateInvoiceStatus()` for payment tracking
- [ ] Add auto-invoice creation trigger in createOrder()
- [ ] Generate invoice numbers in format INV-YYYYMM-00001
- [ ] Test PDF download with various invoice data
- [ ] Add invoice email sending capability

---

## 🔄 MEDIUM PRIORITY - COMPLETE AFTER HIGH PRIORITY (Following Week)

### 4. ⚠️ Complete Vendor Management System (60% → 100%)
**Status**: Basic CRUD done, update/delete incomplete  
**Effort**: 1-2 days

#### What's Already Done:
✅ `createVendor()` - Implemented  
✅ `getVendors()` - Implemented  
✅ `getVendorById()` - Implemented  
✅ Vendor routes registered  
✅ SupplyRequest model created  

#### What Needs Completion:
**File**: `server/controllers/vendor.controller.js`

```javascript
❌ updateVendor() - SKELETON EXISTS, NOT COMPLETE
   - Update vendor details (name, contact, email, etc.)
   - Update vendor metrics (rating, deliveryTime, etc.)
   - Validate email not duplicated
   - Log update activity
   
❌ deleteVendor() - NOT IMPLEMENTED
   - Implement soft delete (mark as inactive)
   - Archive vendor data
   - Prevent deletion if active supply requests exist
   - Clean up vendor-product associations
```

**Implementation Requirements:**

```javascript
export const updateVendor = async (req, res) => {
  try {
    const { name, email, contactPerson, phone, address, city, state, zipCode, rating, deliveryTime, minOrderValue } = req.body;
    
    // Check if email already exists (for another vendor)
    if (email) {
      const existing = await Vendor.findOne({ 
        email, 
        _id: { $ne: req.params.id },
        company: req.user.company 
      });
      if (existing) return res.status(400).json({ message: 'Email already in use' });
    }
    
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { name, email, contactPerson, phone, address, city, state, zipCode, rating, deliveryTime, minOrderValue, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    
    res.json({ message: 'Vendor updated successfully', vendor });
  } catch (error) {
    res.status(500).json({ message: 'Error updating vendor', error: error.message });
  }
};

export const deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    
    // Check for active supply requests
    const activeRequests = await SupplyRequest.countDocuments({
      vendor: req.params.id,
      $or: [
        { status: 'pending' },
        { status: 'processing' }
      ]
    });
    
    if (activeRequests > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete vendor with active supply requests' 
      });
    }
    
    // Soft delete
    vendor.isActive = false;
    vendor.deletedAt = new Date();
    await vendor.save();
    
    res.json({ message: 'Vendor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting vendor', error: error.message });
  }
};
```

**Checklist**:
- [ ] Implement `updateVendor()` with validation
- [ ] Implement `deleteVendor()` with soft delete
- [ ] Add `isActive` field to Vendor model if missing
- [ ] Test update/delete endpoints
- [ ] Ensure vendor-product links are handled correctly

---

### 5. 📧 Email Notifications & Triggers
**Status**: Framework exists, triggers incomplete

**Missing:**
- [ ] Low stock alert emails
- [ ] Order confirmation emails
- [ ] Invoice delivery emails
- [ ] User invitation emails
- [ ] Subscription renewal reminder emails
- [ ] Payment failure notification emails
- [ ] Email templates (HTML emails instead of plain text)

**Implementation Requirements:**
```javascript
// Add email triggers in controllers:

// In product.controller.js - when stock drops below threshold
if (product.stock <= product.lowStockThreshold) {
  sendLowStockAlert(product, req.user.email);
}

// In order.controller.js - when order created
sendOrderConfirmationEmail(order, customer.email);

// In subscription.controller.js - renewal reminders
sendSubscriptionRenewalEmail(company.email);
```

**Files to Create/Modify:**
- `utils/emailTemplates.js` - HTML email templates
- `utils/emailTriggers.js` - Trigger functions for each event
- Modify all controllers to call email functions

**Estimated Time**: 3-4 days

---

### 6. ⏱️ Scheduled Tasks (node-cron)
**Status**: Dependency installed, not implemented

**Missing:**
- [ ] Daily low stock alert check at 9 AM
- [ ] Nightly inventory reconciliation
- [ ] Weekly report generation
- [ ] Subscription renewal checks
- [ ] Automatic alert acknowledgment after 30 days
- [ ] Email digest sending

**Implementation:**
```javascript
// Create server/services/scheduler.js
import cron from 'node-cron';

// Check low stock at 9 AM daily
cron.schedule('0 9 * * *', async () => {
  // Find products with low stock
  // Email alerts to company admins
});

// Run daily at 2 AM
cron.schedule('0 2 * * *', async () => {
  // Reconciliation logic
});
```

**Files to Create:**
- `services/scheduler.js` - Cron job definitions
- `jobs/lowStockCheck.js` - Low stock job handler
- `jobs/reconciliation.js` - Reconciliation job handler
- `jobs/reportGeneration.js` - Report generation job

**Estimated Time**: 2-3 days

---

## 📋 LOWER PRIORITY - IMPLEMENT LATER

### 7. 💰 Payment Processing (Stripe)
**Status**: Keys configured, no workflow

**Missing:**
- [ ] `POST /api/payments/create-checkout-session` - Create Stripe checkout
- [ ] `POST /api/payments/webhook` - Handle Stripe webhooks
- [ ] `GET /api/payments/status/:sessionId` - Check payment status
- [ ] `POST /api/subscription/checkout` - Subscription payment flow
- [ ] Validate webhook signature from Stripe
- [ ] Update subscription status after successful payment

**Implementation Details:**
```javascript
// Stripe webhook events to handle:
// - invoice.paid
// - invoice.payment_failed
// - invoice.upcoming
// - subscription.updated
// - subscription.deleted
```

**Estimated Time**: 3-4 days

---

### 8. 📊 Reports & Export System
**Status**: Not Started

**Missing:**
- [ ] `GET /api/reports/revenue` - Revenue report
- [ ] `GET /api/reports/stock-overview` - Inventory report
- [ ] `GET /api/reports/activity` - User activity report
- [ ] `GET /api/reports/vendor-performance` - Vendor metrics
- [ ] `POST /api/reports/export` - Export to CSV/PDF
- [ ] Date range filtering for all reports
- [ ] Customizable report fields

**Implementation:**
```javascript
// Reports to generate:
// 1. Revenue Report - Total sales by date/product/category
// 2. Stock Report - Current inventory, value, reorder needed
// 3. Activity Report - User actions, changes made
// 4. Vendor Report - Delivery times, quality, costs
```

**Files to Create:**
- `controllers/report.controller.js`
- `routes/report.routes.js`
- `services/reportGenerator.js`
- `utils/csvExporter.js`

**Estimated Time**: 4-5 days

---

### 9. 📤 CSV Import/Export Products
**Status**: Dependencies installed, not implemented

**Missing:**
- [ ] `POST /api/products/import` - Bulk import products from CSV
- [ ] `GET /api/products/export` - Export products to CSV
- [ ] CSV validation (check required columns)
- [ ] Duplicate product detection
- [ ] Transaction rollback on error
- [ ] Import progress tracking
- [ ] Import history logs

**CSV Format Expected:**
```csv
SKU,Name,Category,Price,Stock,Vendor,LowStockThreshold
PROD001,Widget,Electronics,29.99,100,Vendor A,5
PROD002,Gadget,Electronics,49.99,50,Vendor B,10
```

**Files to Create:**
- `controllers/import.controller.js`
- `routes/import.routes.js`
- `services/csvParser.js`
- `utils/csvValidator.js`

**Estimated Time**: 2-3 days

---

### 10. 📱 Barcode/QR Code System
**Status**: Not Started

**Missing:**
- [ ] `GET /api/products/barcode/:sku` - Get product by barcode/SKU
- [ ] `POST /api/products/:id/generate-barcode` - Generate barcode image
- [ ] Barcode scanning endpoint for POS
- [ ] QR code generation for products
- [ ] Store barcode images in file system

**Implementation:**
```javascript
// Use: npm install jsbarcode qrcode
// Generate EAN-13 or Code128 barcodes
// Quick inventory lookup from barcode scan
```

**Estimated Time**: 1-2 days

---

### 11. 🔐 Advanced Security Features
**Status**: Minimal Implementation

**Missing:**
- [ ] Two-Factor Authentication (2FA) with TOTP
- [ ] IP whitelist/blacklist for companies
- [ ] Comprehensive audit trail
- [ ] Data encryption at rest
- [ ] API key management for integrations
- [ ] Request signature verification
- [ ] Anti-DDoS measures

**Files to Create:**
- `services/twoFactor.js` - 2FA setup & verification
- `services/auditTrail.js` - Detailed event logging
- `models/apiKey.model.js` - API key schema
- `middleware/apiKeyAuth.js` - API key authentication

**Estimated Time**: 3-4 days

---

### 12. 📢 Notification Routes (Notification Model exists but routes are missing)
**Status**: Model exists, routes not implemented

**Missing:**
- [ ] `GET /api/notifications` - Get all notifications for user
- [ ] `GET /api/notifications/unread` - Get unread notifications
- [ ] `POST /api/notifications/:id/read` - Mark notification as read
- [ ] `POST /api/notifications/mark-all-read` - Mark all as read
- [ ] `DELETE /api/notifications/:id` - Delete notification
- [ ] `DELETE /api/notifications` - Clear all notifications

**Files to Create:**
- `controllers/notification.controller.js`
- `routes/notification.routes.js`

**Estimated Time**: 1 day

---

### 13. 🎓 Admin Analytics & Business Intelligence
**Status**: Basic dashboard exists

**Missing:**
- [ ] Sales trend analysis (last 7/30/90 days)
- [ ] Product performance ranking
- [ ] Customer purchase patterns
- [ ] Predictive reorder quantities based on history
- [ ] Seasonal analysis
- [ ] Supplier performance metrics
- [ ] Margin analysis by product/category
- [ ] Dashboard widgets for at-a-glance metrics

**Endpoints to Add:**
```
GET /api/analytics/sales-trends
GET /api/analytics/product-performance
GET /api/analytics/customer-behavior
GET /api/analytics/supplier-metrics
GET /api/analytics/margin-analysis
GET /api/analytics/forecast-demand
```

**Estimated Time**: 5-7 days

---

## 🔧 INCOMPLETE CONTROLLER FUNCTIONS

### `order.controller.js`
```javascript
✅ createOrder() - Implemented but needs testing
❌ getOrders() - Schema exists, function incomplete
❌ getOrderById() - Not implemented
❌ updateOrder() - Not implemented (needed for status updates)
❌ deleteOrder() - Not implemented (need soft delete or cancellation)
❌ getOrderStats() - Not implemented
```

### `vendor.controller.js`
```javascript
✅ createVendor() - Implemented
✅ getVendors() - Implemented
✅ getVendorById() - Implemented
❌ updateVendor() - Skeleton exists, not complete
❌ deleteVendor() - Not implemented
❌ getVendorSupplyRequests() - Not implemented
❌ createSupplyRequest() - Not implemented
```

### `invoice.controller.js`
```javascript
✅ getInvoices() - Implemented
✅ getInvoiceById() - Implemented  
✅ getInvoiceByOrderId() - Implemented
❌ generateInvoicePDF() - Not implemented
❌ emailInvoice() - Not implemented
❌ updateInvoiceStatus() - Not implemented
❌ createInvoice() - Might need additional logic
```

### Missing Controllers Entirely:
```javascript
❌ controllers/cart.controller.js - Cart operations
❌ controllers/report.controller.js - Report generation
❌ controllers/import.controller.js - CSV import
❌ controllers/notification.controller.js - Notifications
❌ controllers/payment.controller.js - Stripe payments
```

---

## 🔄 INCOMPLETE ROUTES

### `order.routes.js`
```javascript
✅ POST / - createOrder
✅ GET /stats/overview - getOrderStats
❌ GET / - getOrders (route exists but controller incomplete)
❌ GET /:id - getOrderById
❌ PUT /:id - updateOrder
❌ DELETE /:id - deleteOrder
❌ GET /:id/invoice - getOrderInvoice (endpoint missing)
```

### Missing Route Files Entirely:
```javascript
❌ routes/cart.routes.js
❌ routes/report.routes.js
❌ routes/import.routes.js
❌ routes/notification.routes.js
❌ routes/payment.routes.js
```

---

## 📦 Models That Need Updates

### `product.model.js`
**Current Issues:**
- `quantity` field is called but model uses `stock` - inconsistent naming
- Missing barcode field
- Missing vendor field (or should be in separate association)
- Missing image URL field

**Suggested Additions:**
```javascript
barcode: String,          // EAN-13, Code128, etc
image: String,            // Product image URL
description: String,      // Product description
unit: String,             // Unit of measurement (kg, liter, piece, etc)
reorderLevel: Number,     // Auto-reorder when below this
supplierCost: Number,     // Cost to replenish
isActive: Boolean,        // Soft delete support
tags: [String],           // For filtering/search
```

### `order.model.js`
**Needs Addition:**
- Ensure all fields match what's in controller
- Add order cancelation timestamp
- Add refund tracking

### New Models Needed:
```javascript
❌ models/cart.model.js         - Shopping cart schema
❌ models/payment.model.js      - Payment records
❌ models/notification.model.js - Notification details (model exists but unused)
❌ models/import.model.js       - CSV import tracking
```

---

## 🧪 Testing Requirements

**Missing Test Coverage:**
- [ ] Unit tests for all controllers
- [ ] Integration tests for API endpoints
- [ ] Authentication tests
- [ ] Authorization/RBAC tests
- [ ] Edge cases for stock management
- [ ] Email trigger tests

**Suggested Testing Stack:**
```json
{
  "devDependencies": {
    "jest": "^29.0.0",
    "supertest": "^6.0.0",
    "mongodb-memory-server": "^8.0.0"
  }
}
```

---

## 📝 Environment Variables Needed

**Additional Variables to Add to `.env`:**
```env
# Socket.IO
SOCKET_IO_PATH=/socket.io
SOCKET_IO_ENABLED=true

# Payments
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# File Upload
MAX_FILE_SIZE=10485760  # 10MB
UPLOAD_DIR=./uploads

# Email
EMAIL_FROM_NAME=Inventory Management
EMAIL_TEMPLATE_DIR=./templates

# Redis (for caching)
REDIS_URL=redis://localhost:6379
REDIS_ENABLED=false

# Logging
LOG_DIR=./logs
LOG_LEVEL=info

# Frontend URLs for emails
FRONTEND_FORGOT_PASSWORD_URL=http://localhost:3000/auth/reset-password
FRONTEND_ORDER_TRACKING_URL=http://localhost:3000/orders

# Report Settings
REPORT_GENERATION_TIME=02:00  # 2 AM
```

---

## 📊 Database Indexes Missing

**Recommended Indexes to Add:**
```javascript
// In schema definitions or migration:
db.orders.createIndex({ company: 1, createdAt: -1 })
db.orders.createIndex({ company: 1, status: 1 })
db.invoices.createIndex({ company: 1, createdAt: -1 })
db.invoices.createIndex({ company: 1, status: 1 })
db.vendors.createIndex({ company: 1, email: 1 })
db.notifications.createIndex({ userId: 1, createdAt: -1 })
db.notifications.createIndex({ userId: 1, read: 1 })
```

---

## 🚀 RECOMMENDED IMPLEMENTATION ORDER

### Phase 1: Core Functionality (1-2 weeks)
1. ✅ Complete Orders & Billing System
   - CRUD endpoints
   - Stock deduction on order
   - Order status workflow
2. ✅ Complete Invoice System  
   - PDF generation
   - Email delivery
   - Payment tracking
3. ✅ Cart System
   - Add/remove items
   - Checkout flow

### Phase 2: Real-Time & Notifications (1-2 weeks)
1. ✅ Socket.IO Implementation
   - Real-time product updates
   - Order status broadcasting
   - Stock alerts
2. ✅ Email Notifications
   - Triggers for all events
   - HTML templates
3. ✅ Scheduled Tasks
   - Cron jobs setup
   - Low stock checks

### Phase 3: Advanced Vendor Features (1 week)
1. ✅ Complete Vendor Management
   - Supply requests
   - Performance metrics
   - Dashboard

### Phase 4: Payments & Reporting (1-2 weeks)
1. ✅ Stripe Integration
   - Checkout flow
   - Webhook handling
2. ✅ Reports & Analytics
   - Revenue reports
   - Stock overview
   - Export to CSV/PDF

### Phase 5: Polish & Optimization (1+ week)
1. ✅ CSV Import/Export
2. ✅ Barcode System
3. ✅ Advanced Security (2FA)
4. ✅ Comprehensive Audit Trail
5. ✅ Performance optimization

---

## ✅ IMPLEMENTATION CHECKLIST

Use this checklist to track implementation progress:

### Orders & Billing
- [ ] Create order with stock deduction
- [ ] List orders with filters & pagination
- [ ] Get order by ID
- [ ] Update order status
- [ ] Cancel order with stock restoration
- [ ] Get order statistics

### Invoices
- [ ] Generate invoice from order
- [ ] List invoices
- [ ] Get invoice details
- [ ] Generate PDF invoice
- [ ] Email invoice to customer
- [ ] Track payment status

### Cart
- [ ] Create/get cart
- [ ] Add items to cart
- [ ] Update item quantity
- [ ] Remove item from cart
- [ ] Clear entire cart
- [ ] Checkout from cart

### Socket.IO
- [ ] Server initialization
- [ ] Product update events
- [ ] Order status events
- [ ] Alert events
- [ ] User activity events

### Emails
- [ ] Low stock alerts
- [ ] Order confirmation
- [ ] Invoice delivery
- [ ] Payment confirmation
- [ ] Subscription renewal reminder
- [ ] HTML email templates

### Vendors
- [ ] Update vendor
- [ ] Delete vendor
- [ ] Vendor-product association
- [ ] Supply requests
- [ ] Performance metrics

### Scheduled Tasks
- [ ] Low stock check (daily)
- [ ] Reconciliation (nightly)
- [ ] Report generation (weekly)
- [ ] Subscription renewal check

### Payments
- [ ] Stripe checkout session
- [ ] Webhook handling
- [ ] Payment status tracking

### Reports
- [ ] Revenue report
- [ ] Stock overview
- [ ] Activity report
- [ ] CSV export
- [ ] PDF export

---

## 📞 Additional Notes

- **Database**: Ensure MongoDB connection is stable and indexes are created
- **Environment**: All `.env` variables must be configured before running
- **Security**: Review JWT token expiration and refresh logic
- **Rate Limiting**: Consider adjusting limits based on actual usage
- **Logging**: Implement proper logging for debugging and monitoring
- **Error Handling**: Add comprehensive error handling and user-friendly messages
- **Validation**: Validate all user inputs on both frontend and backend

---

## 🎯 Success Criteria

Backend will be considered "complete" when:
1. ✅ All core CRUD operations work
2. ✅ Orders can be created, processed, and invoiced
3. ✅ Real-time updates work across multiple users
4. ✅ Customers receive email notifications
5. ✅ Payments are processed via Stripe
6. ✅ Comprehensive reports can be generated
7. ✅ All tests pass (90%+ coverage recommended)
8. ✅ API documentation is complete
9. ✅ Performance meets requirements (< 200ms response time)
10. ✅ Security best practices implemented

---

**Last Review**: April 13, 2026  
**Next Update**: After completing core billing system
