# Backend Implementation Left - TODO

Last Updated: April 13, 2026

---

## 📊 Implementation Status Overview

| Category | Completion | Status |
|----------|------------|--------|
| Authentication & Authorization | 95% | Nearly Complete |
| Product Management | 90% | Nearly Complete |
| User Management | 85% | Mostly Complete |
| Orders & Billing | 40% | In Progress |
| Real-Time Updates | 0% | Not Started |
| Vendor Management | 60% | Partially Complete |
| Email & Notifications | 20% | In Progress |
| Reports & Export | 0% | Not Started |
| Payment Processing | 5% | Not Started |
| Advanced Features | 10% | Minimal |

---

## 🎯 HIGH PRIORITY - IMPLEMENT IMMEDIATELY

### 1. ❌ Real-Time Updates (Socket.IO)
**Status**: Not Started  
**Why Critical**: Without real-time updates, multiple users won't see live inventory changes, orders, or alerts.

**Missing:**
- [ ] Socket.IO server setup in `index.js`
- [ ] Real-time event emitters for:
  - Product stock updates
  - Order status changes
  - Low stock alerts
  - User activity
- [ ] WebSocket connection handling
- [ ] Room/namespace organization for company isolation
- [ ] Socket event listeners in controllers

**Files to Create:**
```
server/websocket/
├── events/
│   ├── productEvents.js
│   ├── orderEvents.js
│   ├── alertEvents.js
│   └── userEvents.js
└── handlers.js
```

**Suggested Implementation:**
```javascript
// In index.js
import { Server } from 'socket.io';
const io = new Server(app, { 
  cors: { origin: process.env.FRONTEND_URL }
});

// Event emitters in controllers when data changes
io.to(`company-${companyId}`).emit('product_updated', productData);
```

**Estimated Time**: 3-4 days

---

### 2. ⚠️ Complete Orders & Billing System
**Status**: Partially Implemented  
**Why Critical**: Core business feature - customers need to place orders and get invoices.

**What's Missing:**

#### A. Order Management Endpoints
- [ ] `POST /api/orders` - Create order (partially done, needs testing)
- [ ] `GET /api/orders` - List orders with filtering & pagination (incomplete)
- [ ] `GET /api/orders/:id` - Get order details (not implemented)
- [ ] `PUT /api/orders/:id` - Update order status (not implemented)
- [ ] `DELETE /api/orders/:id` - Cancel order (not implemented)
- [ ] `GET /api/orders/:id/invoice` - Get order invoice (not implemented)

#### B. Invoice Management Endpoints  
- [ ] `POST /api/invoices` - Generate invoice from order (partially exists)
- [ ] `GET /api/invoices` - List invoices (implemented but untested)
- [ ] `GET /api/invoices/:id` - Get invoice details (implemented)
- [ ] `GET /api/invoices/:id/pdf` - Download invoice as PDF (not implemented)
- [ ] `PUT /api/invoices/:id` - Update invoice (not implemented)

#### C. Cart System
- [ ] `GET /api/cart` - Get current user's cart
- [ ] `POST /api/cart/items` - Add product to cart
- [ ] `PUT /api/cart/items/:itemId` - Update cart item quantity
- [ ] `DELETE /api/cart/items/:itemId` - Remove item from cart
- [ ] `DELETE /api/cart` - Clear entire cart
- [ ] `POST /api/cart/checkout` - Convert cart to order

#### D. Order Status Workflow
- [ ] Implement order status transitions: `pending` → `processing` → `shipped` → `delivered`
- [ ] Add order cancellation logic with stock restoration
- [ ] Track order status history with timestamps
- [ ] Send email notifications on status changes

#### E. Stock Management on Orders
- [ ] Verify stock availability before order creation (partially done)
- [ ] Deduct stock from inventory when order is created (implemented)
- [ ] Restore stock if order is cancelled (not implemented)
- [ ] Prevent orders if stock is insufficient

**Files to Modify/Create:**
- `controllers/order.controller.js` - Complete all CRUD operations
- `controllers/invoice.controller.js` - Add PDF generation
- `controllers/cart.controller.js` - NEW FILE for cart operations
- `models/cart.model.js` - NEW MODEL for cart schema
- `routes/cart.routes.js` - NEW ROUTES for cart endpoints

**Estimated Time**: 5-7 days

---

### 3. ⚠️ Complete Invoice & PDF Generation
**Status**: Partially Implemented  
**Why Critical**: Businesses need invoices for accounting and customer records.

**Missing:**
- [ ] `GET /api/invoices/:id/pdf` - Generate and download PDF invoice
- [ ] PDF template design with company branding
- [ ] Invoice numbering system (format: INV-YYYYMM-00001)
- [ ] Include line items, tax calculations, totals
- [ ] Email invoice to customer
- [ ] Store PDF in file system or database
- [ ] Add invoice preview endpoint

**Implementation Details:**
```javascript
// Use pdfkit (already installed)
import PDFDocument from 'pdfkit';

// Generate professional invoice with:
// - Company logo & details
// - Invoice number & date
// - Customer information
// - Itemized products with prices
// - Tax & discount breakdown
// - Total amount due
// - Payment status
// - QR code for payment (optional)
```

**Estimated Time**: 2-3 days

---

## 🔄 MEDIUM PRIORITY - COMPLETE NEXT

### 4. ⚠️ Complete Vendor Management System
**Status**: Partially Implemented (50%)  
**Current**: Basic CRUD exists

**Missing:**
- [ ] Complete `updateVendor()` controller function
- [ ] Complete `deleteVendor()` controller function
- [ ] Add vendor-product association endpoints:
  - [ ] `POST /api/vendors/:id/products` - Assign products to vendor
  - [ ] `GET /api/vendors/:id/products` - Get vendor's products
  - [ ] `DELETE /api/vendors/:id/products/:productId` - Remove product from vendor
- [ ] Vendor supply request system:
  - [ ] `POST /api/vendors/:id/supply-requests` - Request supply from vendor
  - [ ] `GET /api/vendors/:id/supply-requests` - Get supply history
- [ ] Vendor performance metrics:
  - [ ] Average delivery time
  - [ ] Quality rating
  - [ ] On-time delivery percentage
- [ ] Vendor dashboard endpoint: `GET /api/vendors/:id/dashboard`

**Files to Complete:**
- `controllers/vendor.controller.js` - Add missing functions
- `routes/vendor.routes.js` - Add new endpoints
- `models/vendor.model.js` - May need schema updates

**Estimated Time**: 2-3 days

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
