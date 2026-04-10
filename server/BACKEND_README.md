# 🧾 INVENTORY MANAGEMENT SYSTEM — BACKEND DOCUMENTATION

---

## 📌 PROJECT OVERVIEW

A **real-time inventory and billing system** designed to manage products, stock, orders, and vendor supply with **role-based access control** and **live updates**.

**Tech Stack:**
- **Runtime**: Node.js
- **Framework**: Express.js 5.2+
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Real-time**: Socket.IO (⚠️ TODO)
- **Email**: Nodemailer
- **Payments**: Stripe
- **Caching**: Redis/ioredis
- **Scheduling**: node-cron
- **File Upload**: Multer
- **Reporting**: pdfkit
- **Security**: Helmet, CORS, Rate Limiting

**Base URL**: `http://localhost:5000/api`  
**Authentication**: Bearer Token (JWT)

---

## 📂 SERVER STRUCTURE

```
server/
├── config/
│   └── db.js                          # MongoDB connection setup
├── controllers/                       # Business logic per module
│   ├── auth.controller.js             # Login, register, password reset
│   ├── product.controller.js          # Product CRUD + analytics
│   ├── category.controller.js         # Category management
│   ├── users.controller.js            # User management & invitations
│   ├── plan.controller.js             # Subscription plans
│   ├── alert.controller.js            # Low stock alerts
│   ├── dashboard.controller.js        # Dashboard KPIs & stats
│   └── company.controller.js          # Company profile & billing
├── middleware/
│   └── auth.middleware.js             # JWT protection & authorization
├── models/                            # Mongoose schemas
│   ├── users.model.js                 # User schema
│   ├── product.model.js               # Product schema
│   ├── category.model.js              # Category schema
│   ├── company.model.js               # Company/organization schema
│   ├── activity.model.js              # Activity audit logs
│   ├── alert.model.js                 # Alert/notification logs
│   └── notification.model.js          # Notifications (unused routes)
├── routes/                            # API endpoint definitions
│   ├── auth.routes.js                 # Auth endpoints
│   ├── product.routes.js              # Product endpoints
│   ├── category.routes.js             # Category endpoints
│   ├── users.routes.js                # User endpoints
│   ├── plan.routes.js                 # Plan endpoints
│   ├── alert.routes.js                # Alert endpoints
│   ├── dashboard.routes.js            # Dashboard endpoints
│   └── company.routes.js              # Company endpoints
├── utils/
│   ├── validateEnv.js                 # Environment variable validation
│   ├── email.js                       # Email utility functions
│   ├── logActivity.js                 # Activity logging utility
│   ├── subscription.js                # Subscription helpers
│   └── [other utilities]
├── index.js                           # Server entry point
├── package.json                       # Dependencies
└── .env.example                       # Environment template
```

---

## ✅ IMPLEMENTED FEATURES

### 1. 🔐 Authentication & Authorization

**Implemented:**
- ✅ User registration with company auto-creation
- ✅ Email/password login
- ✅ JWT access & refresh tokens
- ✅ Password reset via email
- ✅ Email verification
- ✅ Password change
- ✅ User logout
- ✅ Role-based access control (RBAC)
- ✅ Token revocation & version tracking
- ✅ Rate limiting on auth endpoints

**Endpoints:**
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
POST   /api/auth/refresh-token
POST   /api/auth/send-verification-email
POST   /api/auth/verify-email
POST   /api/auth/change-password
POST   /api/auth/logout
```

**Response Contract Example:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt-access-token",
  "refreshToken": "jwt-refresh-token",
  "user": {
    "id": "userId",
    "company": "companyId",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "role": "admin",
    "status": "active",
    "isEmailVerified": true
  },
  "company": {
    "id": "companyId",
    "company_name": "Acme Inc",
    "plan": "pro"
  }
}
```

---

### 2. 📦 Product Management

**Implemented:**
- ✅ Create, read, update, delete products (CRUD)
- ✅ SKU-based identification with company-level uniqueness
- ✅ Product search & filtering
- ✅ Category association
- ✅ Stock level tracking
- ✅ Low stock threshold configuration
- ✅ Product statistics & analytics:
  - ✅ Stock movement analysis
  - ✅ Category performance analysis
  - ✅ Reorder pattern analysis
- ✅ Products by category filtering
- ✅ Low stock alerts

**Endpoints:**
```
GET    /api/products                                  # List all products (filtered)
POST   /api/products                                  # Create product
GET    /api/products/stats                            # Product statistics
GET    /api/products/analytics/stock-movement        # Stock movement analytics
GET    /api/products/analytics/category-performance  # Category performance
GET    /api/products/analytics/reorder-patterns      # Reorder patterns
GET    /api/products/low-stock                        # List low stock products
GET    /api/products/by-category/:categoryId          # Products in category
GET    /api/products/:id                              # Get product by ID
PUT    /api/products/:id                              # Update product
DELETE /api/products/:id                              # Delete product
```

**Response Contract Example:**
```json
{
  "success": true,
  "message": "Products retrieved",
  "data": [
    {
      "id": "productId",
      "company": "companyId",
      "name": "Laptop",
      "sku": "SKU-001",
      "category": {
        "id": "categoryId",
        "name": "Electronics"
      },
      "price": 999.99,
      "stock": 15,
      "lowStockThreshold": 5,
      "createdAt": "2026-04-06T00:00:00.000Z"
    }
  ]
}
```

---

### 3. 📂 Category Management

**Implemented:**
- ✅ Create, read, update, delete categories (CRUD)
- ✅ Category search & filtering
- ✅ Company-level category isolation
- ✅ Parent-child category relationships (if configured)

**Endpoints:**
```
GET    /api/category                  # List all categories
POST   /api/category                  # Create category
PUT    /api/category/:id              # Update category
DELETE /api/category/:id              # Delete category
```

---

### 4. 👥 Users Management

**Implemented:**
- ✅ List users in company
- ✅ Get user by ID with activity logs
- ✅ Add new users (with email invitation)
- ✅ Update user details
- ✅ Activate/deactivate users
- ✅ Delete users
- ✅ User activity tracking
- ✅ Role-based user filtering

**Endpoints:**
```
GET    /api/users                     # List all users
POST   /api/users                     # Add/invite new user
GET    /api/users/:id                 # Get user by ID
PUT    /api/users/:id                 # Update user
PATCH  /api/users/:id/activate        # Activate user
PATCH  /api/users/:id/deactivate      # Deactivate user
DELETE /api/users/:id                 # Delete user
GET    /api/users/:id/activity        # Get user activity logs
```

---

### 5. 🔔 Alert & Notification Management

**Implemented:**
- ✅ Get all alerts (with filtering)
- ✅ Get low stock alerts
- ✅ Mark alert as read
- ✅ Mark all alerts as read
- ✅ Acknowledge alerts
- ✅ Get alert preferences
- ✅ Update alert preferences
- ✅ Alert read/unread tracking

**Endpoints:**
```
GET    /api/alert                     # List all alerts
GET    /api/alert/low-stock           # Get low stock alerts
GET    /api/alert/preferences         # Get alert preferences
PUT    /api/alert/preferences         # Update alert preferences
PATCH  /api/alert/:id/read            # Mark alert as read
PATCH  /api/alert/:id/acknowledge     # Acknowledge alert
PATCH  /api/alert/read-all            # Mark all as read
```

---

### 6. 📊 Dashboard & Analytics

**Implemented:**
- ✅ Dashboard statistics (total products, low stock, users, etc.)
- ✅ Recent activity feed
- ✅ Low stock alerts summary

**Endpoints:**
```
GET    /api/dashboard                 # Dashboard stats & KPIs
GET    /api/dashboard/low-stock-alerts # Low stock alerts
```

---

### 7. 🏢 Company Management

**Implemented:**
- ✅ Get company profile
- ✅ Update company profile
- ✅ Get subscription details
- ✅ Update subscription
- ✅ Cancel subscription
- ✅ Get billing history
- ✅ Get invoice details

**Endpoints:**
```
GET    /api/company                   # Get profile
PUT    /api/company                   # Update profile
GET    /api/company/subscription      # Get subscription
PATCH  /api/company/subscription      # Update subscription
POST   /api/company/subscription/cancel # Cancel subscription
GET    /api/company/billing-history   # Billing history
GET    /api/company/billing-history/invoice/:id # Invoice details
```

---

### 8. 💳 Subscription Plans

**Implemented:**
- ✅ Get available plans
- ✅ Plan details with feature limits
- ✅ Product count validation per plan

**Endpoints:**
```
GET    /api/company/plan              # Get available plans
```

---

## 🚨 NOT IMPLEMENTED / TODO

### High Priority (Core Functionality)

1. **🔄 Real-Time Updates (WebSocket/Socket.IO)**
   - ❌ Socket.IO server setup
   - ❌ Real-time product update events
   - ❌ Real-time alert/notification events
   - ❌ Stock change broadcasting
   - ❌ User activity broadcasting
   - **Impact**: Without this, clients won't see live updates across multiple users
   - **Suggested Route**: `/socket.io` with events: `product_updated`, `stock_changed`, `alert_triggered`, `user_joined`

2. **📦 Orders/Billing System**
   - ❌ Order creation & management (routes exist but not fully implemented)
   - ❌ Cart system
   - ❌ Cart item management
   - ❌ Automatic stock deduction on order creation
   - ❌ Invoice generation endpoint
   - ❌ Order history/filtering
   - **Suggested Endpoints**:
     ```
     POST   /api/orders                # Create order
     GET    /api/orders                # List orders
     GET    /api/orders/:id            # Get order details
     POST   /api/orders/:id/invoice    # Generate invoice
     GET    /api/cart                  # Get cart
     POST   /api/cart/items            # Add to cart
     DELETE /api/cart/items/:itemId    # Remove from cart
     ```
<!-- 
3. **📋 Inventory Adjustment/Stock Movement**
   - ❌ Manual stock adjustment endpoint (needed for stock corrections)
   - ❌ Stock transfer between locations (if multi-location)
   - ❌ Inventory in/out log tracking
   - ❌ Stock reconciliation endpoints
   - **Suggested Endpoints**:
     ```
     POST   /api/inventory/adjust      # Manual stock adjustment
     POST   /api/inventory/transfer    # Transfer stock
     GET    /api/inventory/logs        # Movement history
     POST   /api/inventory/reconcile   # Reconciliation
     ``` -->

4. **🏪 Vendor/Supplier Management**
   - ❌ Vendor CRUD operations
   - ❌ Vendor-specific product associations
   - ❌ Vendor supply/replenishment requests
   - ❌ Vendor performance metrics
   - **Suggested Endpoints**:
     ```
     GET    /api/vendors              # List vendors
     POST   /api/vendors              # Add vendor
     GET    /api/vendors/:id          # Get vendor
     PUT    /api/vendors/:id          # Update vendor
     DELETE /api/vendors/:id          # Delete vendor
     POST   /api/vendors/:id/supply   # Request supply
     GET    /api/vendors/:id/orders   # Vendor orders
     ```

5. **📧 Email & Notification Service**
   - ⚠️ Partial implementation (Nodemailer setup exists but needs:)
   - ❌ Automated email triggers (low stock alerts, order confirmations)
   - ❌ Email template system
   - ❌ Notification scheduling
   - ❌ Bulk email sending
   - **Files to Update**: `utils/email.js` + add notification job handlers

6. **🎫 Barcode/QR Code Scanner Integration**
   - ❌ Scanner input handler
   - ❌ Quick product lookup by barcode
   - ❌ Barcode generation for products
   - **Suggested Endpoints**:
     ```
     GET    /api/products/barcode/:sku    # Get by barcode/SKU
     POST   /api/products/:id/barcode     # Generate barcode
     ```

### Medium Priority

7. **📄 Report Generation**
   - ❌ Revenue reports
   - ❌ Stock overview reports
   - ❌ User activity reports
   - ❌ PDF/CSV export functionality
   - **Suggested Endpoints**:
     ```
     GET    /api/reports/revenue         # Revenue report
     GET    /api/reports/stock-overview  # Stock report
     GET    /api/reports/activity        # Activity report
     POST   /api/reports/export          # Export to CSV/PDF
     ```

8. **📤 File Upload & Import**
   - ❌ CSV product import
   - ❌ Bulk product creation from upload
   - ❌ File validation
   - **Suggested Endpoints**:
     ```
     POST   /api/products/import         # Import products from CSV
     GET    /api/imports/:id             # Get import status
     ```

9. **⏱️ Scheduled Tasks**
   - ❌ Automatic low stock alerts (node-cron setup)
   - ❌ Nightly inventory reconciliation
   - ❌ Subscription renewal/billing
   - ❌ Email digest sending
   - **Implementation**: Use `node-cron` in a separate service/file

10. **💰 Payment/Stripe Integration**
    - ❌ Subscription payment processing
    - ❌ Invoice payment tracking
    - ❌ Payment webhook handling
    - **Suggested Endpoints**:
      ```
      POST   /api/payments/subscribe     # Create subscription
      POST   /api/payments/webhook       # Stripe webhook
      GET    /api/payments/status        # Payment status
      ```

### Low Priority (Enhancement)

11. **🔍 Advanced Search & Filtering**
    - ⚠️ Partial (basic filters exist, but missing:)
    - ❌ Full-text search
    - ❌ Complex filter combinations
    - ❌ Saved filters/searches

12. **📈 Advanced Analytics**
    - ⚠️ Some analytics exist (stock movement, category performance, reorder patterns)
    - ❌ Sales trend analysis
    - ❌ Predictive reorder quantities
    - ❌ Seasonal analysis
    - ❌ Supplier performance metrics

13. **🔐 Enhanced Security**
    - ❌ Two-factor authentication (2FA)
    - ❌ IP whitelist/lockdown
    - ❌ Audit trail for sensitive operations
    - ❌ Data encryption at rest
    - ❌ API key management for integrations

14. **🌐 Multi-Language/Localization**
    - ❌ i18n support
    - ❌ Timezone handling

---

## 🗄️ DATABASE MODELS SCHEMA

### Users Model
```javascript
{
  company: ObjectId,              // Reference to company
  name: String,
  email: String (unique per company),
  phone: String,
  password: String (hashed),
  role: String (admin, staff, vendor),
  status: { value: String, changedAt: Date },
  isEmailVerified: Boolean,
  emailVerificationToken: String,
  emailVerificationTokenExpires: Date,
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
  tokenVersion: Number,           // For token invalidation
  createdAt: Date,
  updatedAt: Date
}
```

### Product Model
```javascript
{
  company: ObjectId,
  name: String,
  sku: String (unique per company),
  category: ObjectId,
  price: Number,
  stock: Number,
  lowStockThreshold: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Category Model
```javascript
{
  company: ObjectId,
  name: String,
  description: String,
  parent: ObjectId (optional),    // For nested categories
  createdAt: Date,
  updatedAt: Date
}
```

### Company Model
```javascript
{
  company_name: String,
  email: String,
  phone: String,
  address: String,
  plan: String (trial, starter, pro, enterprise),
  subscription_start_date: Date,
  subscription_end_date: Date,
  planDetails: {
    maxUsers: Number,
    maxProducts: Number,
    features: [String]
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Alert Model
```javascript
{
  company: ObjectId,
  user: ObjectId,
  product: ObjectId,
  type: String (low_stock, order_created, etc),
  message: String,
  read: Boolean,
  acknowledged: Boolean,
  preferences: {
    emailNotification: Boolean,
    pushNotification: Boolean,
    inAppNotification: Boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Activity Model
```javascript
{
  company: ObjectId,
  user: ObjectId,
  action: String,
  entityType: String (product, order, user),
  entityId: ObjectId,
  details: Object,
  timestamp: Date
}
```

### Notification Model (⚠️ Schema exists but routes not implemented)
```javascript
{
  company: ObjectId,
  recipient: ObjectId,
  message: String,
  type: String,
  read: Boolean,
  actionUrl: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## ⚙️ SETUP & INSTALLATION

### 1. Environment Variables

Create a `.env` file in the `server` folder:

```env
# Database
MONGO_URI=mongodb://localhost:27017/inventory_db

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_change_this
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Server
PORT=5000
NODE_ENV=development

# Email Service (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@yourdomain.com

# Email Verification
REQUIRE_EMAIL_VERIFICATION=false

# Redis (optional)
REDIS_URL=redis://localhost:6379

# Stripe (optional, for payments)
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx

# Frontend URL
ALLOWED_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=debug
```

### 2. Install Dependencies

```bash
cd server
npm install
```

### 3. Start MongoDB

```bash
# Using local MongoDB
mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

### 4. Start Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

**Output:**
```
Server is running on port 5000
```

---

## 🧪 TESTING API ENDPOINTS

### Using cURL

**Register a new user:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "phone": "9876543210"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**Get Products (with Bearer token):**
```bash
curl -X GET http://localhost:5000/api/products \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Using Postman

1. Import the API endpoints from the provided Postman collection (or create manually)
2. Set `Base URL` to `http://localhost:5000/api`
3. After login, set `{{token}}` variable to the JWT token
4. Test each endpoint with proper headers

---

## 🔐 SECURITY FEATURES

- ✅ **JWT Authentication**: Stateless token-based auth
- ✅ **Password Hashing**: bcryptjs with salt rounds
- ✅ **Rate Limiting**: Authentication & API rate limits
- ✅ **CORS Protection**: Configurable allowed origins
- ✅ **Token Revocation**: Via tokenVersion tracking
- ✅ **Email Verification**: Optional verification flow
- ✅ **Protected Routes**: Auth middleware on all protected endpoints
- ✅ **Input Validation**: express-validator on request bodies
- ✅ **Helmet Security**: Security headers (ready but optional)

---

## 🎯 RECOMMENDED NEXT STEPS (PRIORITY ORDER)

### Phase 1: Core Billing System (1-2 weeks)
1. Implement Orders CRUD endpoints
2. Add stock deduction logic on order creation
3. Build invoice generation endpoint
4. Implement order status workflow (pending → processing → completed)

### Phase 2: Real-Time Updates (1-2 weeks)
1. Set up Socket.IO server
2. Implement real-time product update events
3. Broadcast low stock alerts in real-time
4. Sync inventory changes across connected clients

### Phase 3: Vendor Management (1 week)
1. Create Vendor model & routes
2. Implement vendor supply request workflow
3. Add vendor-specific dashboard
4. Track vendor performance metrics

### Phase 4: Advanced Features (2+ weeks)
1. Email notifications & scheduled tasks
2. Report generation & export
3. Barcode/QR code scanner integration
4. CSV bulk import functionality

### Phase 5: Polish & Optimization (1+ week)
1. Add 2FA for enhanced security
2. Implement comprehensive audit logging
3. Performance optimization (indexing, caching)
4. API documentation (Swagger/OpenAPI)

---

## 📊 CURRENT LIMITATIONS

| Feature | Status | Notes |
|---------|--------|-------|
| Real-time Updates | ❌ | No WebSocket/Socket.IO (clients need polling) |
| Orders/Billing | ⚠️ | Schema exists but no complete workflow |
| Inventory Adjustments | ❌ | No manual stock correction endpoint |
| Vendor Management | ❌ | No vendor-specific features |
| Email Notifications | ⚠️ | Setup exists, triggers incomplete |
| PDF Reports | ⚠️ | pdfkit installed but endpoints missing |
| Barcode Scanning | ❌ | Not implemented |
| Payment Processing | ❌ | Stripe keys configured but no webhook/flow |
| File Import | ❌ | Multer/CSV parser installed but unused |

---

## 🚀 PERFORMANCE TIPS

1. **Database Indexing**: Ensure indexes on:
   - `users.email`
   - `product.company + product.sku`
   - `activity.company + activity.user`
   - `alert.company + alert.read`

2. **Caching**: Use Redis for:
   - User sessions
   - Product catalog cache
   - Dashboard stats cache
   - Plan details

3. **Query Optimization**:
   - Use pagination on list endpoints
   - Select only required fields with `.select()`
   - Use lean() for read-only queries where possible

4. **Rate Limiting**:
   - Auth routes: 10 requests / 15 minutes
   - API routes: 200 requests / 1 minute

---

## 📞 SUPPORT & TROUBLESHOOTING

**MongoDB Connection Issues:**
- Ensure MongoDB is running
- Check `MONGO_URI` in `.env`
- Verify network connectivity

**JWT/Auth Errors:**
- Verify `JWT_SECRET` is set in `.env`
- Check token hasn't expired
- Ensure Bearer token format: `Authorization: Bearer <token>`

**Email Issues:**
- Configure SMTP credentials in `.env`
- For development: check email preview in response
- For production: ensure SMTP credentials are valid

**Rate Limiting:**
- If too many requests: wait for window to reset
- Adjust limits in `index.js` if needed

---

## 📝 API DOCUMENTATION

For detailed endpoint documentation, see:
- [API_ENDPOINTS_GUIDE.md](./API_ENDPOINTS_GUIDE.md) - Full endpoint reference
- [BACKEND_IMPLEMENTATION_LEFT_README.md](./BACKEND_IMPLEMENTATION_LEFT_README.md) - Current implementation details

---

## 👥 Architecture Overview

```
┌─────────────────────────────────────────────────┐
│         React Frontend (client/)                 │
│    (Vite + React Router + TailwindCSS)          │
└────────────────────┬────────────────────────────┘
                     │ HTTP/REST & WebSocket(TODO)
                     ▼
┌─────────────────────────────────────────────────┐
│      Express.js API Server (server/)            │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │  Routes (auth, products, users, etc)      │ │
│  └────────────┬─────────────────────────────┘ │
│               │                                │
│  ┌────────────▼─────────────────────────────┐ │
│  │  Controllers (business logic)           │ │
│  └────────────┬─────────────────────────────┘ │
│               │                                │
│  ┌────────────▼─────────────────────────────┐ │
│  │  Middleware (auth, validation)          │ │
│  └────────────┬─────────────────────────────┘ │
│               │                                │
│  ┌────────────▼─────────────────────────────┐ │
│  │  Models (Mongoose schemas)              │ │
│  └────────────┬─────────────────────────────┘ │
│               │                                │
└───────────────┼────────────────────────────────┘
                │
    ┌───────────┴──────────────────┬─────────────┐
    ▼                              ▼             ▼
┌─────────────┐           ┌──────────────┐   ┌──────────┐
│  MongoDB    │           │    Redis     │   │  Stripe  │
│  (Database) │           │  (Cache)     │   │ (Payment)│
└─────────────┘           └──────────────┘   └──────────┘
    │                          │
    └──────────────┬───────────┘
                   │
            ┌──────▼────────┐
            │  Nodemailer   │
            │   (Email)     │
            └───────────────┘
```

---

## 📜 LICENSE

This project is part of the Inventory Management System.

---

## ✍️ NOTES FOR DEVELOPERS

1. **Always use company-level isolation**: Ensure queries filter by `company` field to prevent data leakage
2. **Log important actions**: Use `logActivity()` utility for audit trails
3. **Validate requests**: Use express-validator before business logic
4. **Handle errors gracefully**: Return meaningful error messages (avoid stack traces in production)
5. **Test with Postman**: Before adding frontend integration
6. **Document new endpoints**: Update this README with new routes
7. **Follow naming conventions**: Controllers use present tense (e.g., `getProducts`, `createCategory`)

---

**Last Updated**: April 9, 2026  
**Backend Status**: Partially Complete (Core auth, products, users done; Orders & real-time pending)
