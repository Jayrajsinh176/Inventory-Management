# � Backend README - Inventory Management System

## 📌 Overview

This is the backend API for the **Inventory Management System** - a comprehensive Node.js/Express REST API for managing inventory, users, categories, products, and subscriptions for architectural firms.

**Base URL**: `http://localhost:5000/api`  
**Authentication**: Bearer Token (JWT)  
**API Version**: v1  
**Node Version**: 14+  
**Package Manager**: npm  

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js |
| **Framework** | Express 5.2+ |
| **Database** | MongoDB + Mongoose |
| **Authentication** | JWT (jsonwebtoken) |
| **Password Hashing** |
 bcryptjs |
| **Validation** | express-validator |
| **Security** | Helmet, CORS, Rate Limiting |
| **Email** | Nodemailer |
| **Payments** | Stripe |
| **Caching** | Redis, ioredis |
| **Scheduling** | node-cron |
| **File Upload** | Multer |
| **Reporting** | jsPDF, pdfkit |
| **Logging** | Morgan |
| **Environment** | dotenv |

---

## 📂 Project Structure

```
server/
├── config/
│   └── db.js                          # MongoDB connection
├── controllers/
│   ├── auth.controller.js             # Authentication logic
│   ├── product.controller.js          # Product CRUD + analytics
│   ├── category.controller.js         # Category management
│   ├── users.controller.js            # User management
│   ├── plan.controller.js             # Subscription plans
│   └── alert.controller.js            # Low stock alerts
├── middleware/
│   └── auth.middleware.js             # JWT protection
├── models/
│   ├── users.model.js                 # User schema
│   ├── product.model.js               # Product schema
│   ├── category.model.js              # Category schema
│   ├── company.model.js               # Company schema
│   └── activity.model.js              # Activity logging
├── routes/
│   ├── auth.routes.js                 # Auth endpoints
│   ├── product.routes.js              # Product endpoints
│   ├── category.routes.js             # Category endpoints
│   ├── users.routes.js                # User endpoints
│   ├── plan.routes.js                 # Plan endpoints
│   └── alert.routes.js                # Alert endpoints
├── utils/
│   ├── validateEnv.js                 # Environment validation
│   └── subscription.js                # Subscription utilities
├── seed.js                            # Database seeding script
├── index.js                           # Main entry point
└── package.json                       # Dependencies

```

---

## ⚙️ Setup & Installation

### 1. Setup Environment Variables

Create a `.env` file in the `server` folder:

```env
# Database
MONGO_URI=mongodb://localhost:27017/inventory_db

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_change_this
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development

# Redis (optional)
REDIS_URL=redis://localhost:6379

# Email Service (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Stripe (optional)
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx

# Frontend URL
ALLOWED_ORIGIN=http://localhost:3000
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

### 4. Generate Seed Data (Optional)

```bash
npm run seed
```

This creates:
- 1 Company (Pro plan)
- 4 Users (1 admin + 3 staff)
- 18 Products across 6 categories
- 11+ Activity logs

### 5. Start Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will run on: **http://localhost:5000**

---

## 🔐 Authentication

### How It Works

1. User registers or logs in
2. Server validates credentials and generates JWT token
3. Token is sent to client
4. Client includes token in `Authorization: Bearer <token>` header
5. Server middleware verifies token before allowing access

### Login to Get Token

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sarah.mitchell@elegantarch.com",
    "password": "Admin@123"
  }'
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "Sarah Mitchell",
    "email": "sarah.mitchell@elegantarch.com",
    "role": "admin"
  },
  "company": {
    "id": "company_id",
    "company_name": "Elegant Architecture Studios",
    "plan": "pro"
  }
}
```

### Use Token in Requests

```bash
curl -X GET http://localhost:5000/api/products \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 📚 Complete API Endpoints

### 1️⃣ AUTHENTICATION ENDPOINTS

#### Register User
```
POST /api/auth/register
```

**Request Body:**
```json
{
  "company_name": "Acme Architecture",
  "name": "John Doe",
  "email": "john@acme.com",
  "phone": "9876543210",
  "password": "securePassword123",
  "address": "123 Design Street, NYC"
}
```

**Response (201):**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": { "id": "...", "name": "...", "email": "...", "role": "admin" },
  "company": { "id": "...", "company_name": "...", "plan": "trial" }
}
```

**Status Codes:**
- `201` - Registration successful
- `400` - Invalid input or existing email/phone
- `500` - Server error

---

#### Login User
```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@acme.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {...},
  "company": {...}
}
```

---

### 2️⃣ PRODUCT ENDPOINTS

#### Get All Products
```
GET /api/products?page=0&limit=10&category=categoryId&search=productName
```

**Query Parameters:**
- `page` (number): Page number (default: 0)
- `limit` (number): Items per page (default: 10)
- `category` (string): Filter by category ID
- `search` (string): Search by name or SKU

**Response (200):**
```json
{
  "success": true,
  "products": [
    {
      "_id": "product_id",
      "name": "Brutalist Column",
      "sku": "BC-2024-001",
      "category": "category_id",
      "price": 1500,
      "stock": 45,
      "lowStockThreshold": 10,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "count": 10,
  "total": 250
}
```

---

#### Get Product by ID
```
GET /api/products/:id
```

**Response (200):**
```json
{
  "success": true,
  "product": {
    "_id": "product_id",
    "name": "Brutalist Column",
    "sku": "BC-2024-001",
    "category": "category_id",
    "price": 1500,
    "stock": 45,
    "lowStockThreshold": 10,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-03-20T14:22:00Z"
  }
}
```

---

#### Create Product
```
POST /api/products
```

**Request Body:**
```json
{
  "name": "Minimalist Oak Chair",
  "sku": "MOC-2024-001",
  "category": "category_id",
  "price": 399.99,
  "stock": 50,
  "lowStockThreshold": 10
}
```

**Response (201):**
```json
{
  "success": true,
  "product": {...}
}
```

---

#### Update Product
```
PUT /api/products/:id
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "price": 450,
  "stock": 75
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "product": {...}
}
```

---

#### Delete Product
```
DELETE /api/products/:id
```

**Response (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

#### Get Product Stats
```
GET /api/products/stats
```

**Response (200):**
```json
{
  "success": true,
  "stats": {
    "totalProducts": 18,
    "totalValue": 150000,
    "averagePrice": 500,
    "totalStock": 4600
  }
}
```

---

#### Get Low Stock Products
```
GET /api/products/low-stock
```

**Response (200):**
```json
{
  "success": true,
  "products": [
    {
      "_id": "product_id",
      "name": "Low Stock Item",
      "stock": 3,
      "lowStockThreshold": 10,
      "reorderQuantity": 50
    }
  ]
}
```

---

#### Get Products by Category
```
GET /api/products/by-category/:categoryId
```

**Response (200):**
```json
{
  "success": true,
  "products": [...]
}
```

---

#### Stock Movement Analysis
```
GET /api/products/analytics/stock-movement
```

**Response:** Historical stock movement data

---

#### Category Performance Analysis
```
GET /api/products/analytics/category-performance
```

**Response:** Performance metrics by category

---

#### Reorder Patterns Analysis
```
GET /api/products/analytics/reorder-patterns
```

**Response:** Reorder pattern analysis

---

### 3️⃣ CATEGORY ENDPOINTS

#### Get All Categories
```
GET /api/categories
```

**Response (200):**
```json
{
  "success": true,
  "categories": [
    {
      "_id": "category_id",
      "name": "Structural Materials",
      "company": "company_id",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

#### Create Category
```
POST /api/categories
```

**Request Body:**
```json
{
  "name": "New Category"
}
```

**Response (201):**
```json
{
  "success": true,
  "category": {...}
}
```

---

#### Update Category
```
PUT /api/categories/:id
```

**Request Body:**
```json
{
  "name": "Updated Category Name"
}
```

**Response (200):**
```json
{
  "success": true,
  "category": {...}
}
```

---

#### Delete Category
```
DELETE /api/categories/:id
```

**Response (200):**
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

---

### 4️⃣ USER ENDPOINTS

#### Get All Users
```
GET /api/users
```

**Response (200):**
```json
{
  "success": true,
  "users": [
    {
      "_id": "user_id",
      "name": "Sarah Mitchell",
      "email": "sarah.mitchell@elegantarch.com",
      "phone": "9876543211",
      "role": "admin",
      "status": { "value": "active" },
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

#### Get User by ID
```
GET /api/users/:id
```

**Response (200):**
```json
{
  "success": true,
  "user": {...}
}
```

---

#### Add User
```
POST /api/users
```

**Request Body:**
```json
{
  "name": "New Staff Member",
  "email": "staff@elegantarch.com",
  "phone": "9876543215",
  "password": "SecurePassword123",
  "role": "staff"
}
```

**Response (201):**
```json
{
  "success": true,
  "user": {...}
}
```

---

#### Update User
```
PUT /api/users/:id
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "phone": "9876543220"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "user": {...}
}
```

---

#### Delete User
```
DELETE /api/users/:id
```

**Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

#### Activate User
```
PATCH /api/users/:id/activate
```

**Response (200):**
```json
{
  "success": true,
  "message": "User activated successfully",
  "user": {...}
}
```

---

#### Deactivate User
```
PATCH /api/users/:id/deactivate
```

**Response (200):**
```json
{
  "success": true,
  "message": "User deactivated successfully",
  "user": {...}
}
```

---

#### Get User Activity
```
GET /api/users/:id/activity
```

**Response (200):**
```json
{
  "success": true,
  "activities": [
    {
      "_id": "activity_id",
      "user": "user_id",
      "action": "created_product",
      "details": "Created product: Product Name",
      "createdAt": "2024-03-20T14:22:00Z"
    }
  ]
}
```

---

### 5️⃣ ALERTS ENDPOINT

#### Get Low Stock Alerts
```
GET /api/alerts/low-stock
```

**Response (200):**
```json
{
  "success": true,
  "alerts": [
    {
      "productId": "product_id",
      "name": "Low Stock Item",
      "stock": 3,
      "threshold": 10,
      "severity": "high"
    }
  ]
}
```

---

### 6️⃣ PLANS ENDPOINT

#### Get All Plans
```
GET /api/plans
```

**Response (200):**
```json
{
  "success": true,
  "plans": [
    {
      "_id": "plan_id",
      "name": "Basic",
      "price": 29,
      "features": ["50 products", "2 users", "Basic support"]
    }
  ]
}
```

---

## 🔄 Activity Logging

All user actions are automatically logged for audit trails:

**Logged Actions:**
- `created_product` - Product creation
- `updated_product` - Product modification
- `deleted_product` - Product deletion
- `added_user` - New user added
- `updated_user` - User details changed
- `deactivated_user` - User deactivated
- `reactivated_user` - User reactivated

**Access Activity Logs:**
```
GET /api/users/:userId/activity
```

---

## ✅ Currently Implemented Features

✅ **Authentication**
- User registration & login
- JWT token-based auth
- Password hashing with bcrypt

✅ **Products**
- Full CRUD operations
- Stock management
- Low stock alerts
- Product analytics (stats, movement, performance)

✅ **Categories**
- Full CRUD operations
- Product categorization
- Category filtering

✅ **Users**
- User management (CRUD)
- Role-based access (admin/staff)
- User activation/deactivation
- Activity tracking

✅ **Security**
- Rate limiting on auth routes
- CORS protection
- Helmet security headers
- Environment validation

✅ **Activity Logging**
- Event tracking
- User action logging
- Audit trail

---

## 🚧 To-Do / Future Features

❌ **Subscription & Billing**
- Stripe integration for payments
- Subscription plan management
- Invoice generation

❌ **Advanced Analytics**
- Revenue reports
- Sales trends
- Inventory forecasting
- ROI analysis

❌ **Export Functionality**
- PDF export
- CSV export
- Excel reports

❌ **Notifications**
- Email alerts for low stock
- User notifications
- Webhook support

❌ **Advanced Search**
- Elasticsearch integration
- Advanced filtering
- Full-text search

❌ **Caching**
- Redis caching
- Query optimization
- Performance improvements

❌ **File Upload**
- Product images
- Document uploads
- Bulk import

❌ **Multi-company**
- Support for multiple companies (SaaS)
- Company isolation
- Cross-company analytics

---

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URI` | MongoDB connection string | ✅ |
| `JWT_SECRET` | Secret key for JWT | ✅ |
| `JWT_EXPIRES_IN` | Token expiration time | ✅ |
| `PORT` | Server port | ✅ |
| `NODE_ENV` | Environment (dev/prod) | ✅ |
| `ALLOWED_ORIGIN` | Frontend URL for CORS | ⚠️ |
| `REDIS_URL` | Redis connection (optional) | ❌ |
| `STRIPE_SECRET_KEY` | Stripe API key (optional) | ❌ |
| `SMTP_HOST` | Email SMTP server (optional) | ❌ |

---

## 🧪 Testing with cURL

### Test Authentication
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "Test Company",
    "name": "Test User",
    "email": "test@example.com",
    "phone": "9876543210",
    "password": "TestPass123",
    "address": "123 Test St"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

### Test Products
```bash
# Get all products
curl -X GET http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create product
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "sku": "TEST-001",
    "category": "category_id",
    "price": 99.99,
    "stock": 100
  }'
```

---

## 📊 Database Schema

### User Model
```javascript
{
  company: ObjectId,
  name: String,
  email: String (unique, lowercase),
  phone: String (unique, Indian format),
  password: String (hashed),
  role: String (admin/staff),
  status: { value: String, deactivatedAt: Date },
  createdAt: Date,
  updatedAt: Date
}
```

### Product Model
```javascript
{
  company: ObjectId,
  name: String,
  sku: String (unique),
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
  plan: String (trial/basic/pro),
  subscription_start_date: Date,
  subscription_end_date: Date,
  createdAt: Date
}
```

### Activity Model
```javascript
{
  user: ObjectId,
  company: ObjectId,
  action: String,
  details: String,
  metadata: Object,
  createdAt: Date
}
```

---

## 🐛 Error Handling

All endpoints return standard error responses:

```json
{
  "success": false,
  "message": "Error description here",
  "errors": []
}
```

**Common Status Codes:**
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## 📝 Notes

- All timestamps are in UTC ISO 8601 format
- Pagination is 0-indexed
- Phone numbers must be valid Indian format (10 digits, starting with 6-9)
- Passwords must be at least 6 characters
- Rate limiting: 10 requests per 15 minutes on auth routes

---

**Last Updated**: April 4, 2026  
**Status**: ✅ Production Ready  
**Contributors**: Development Team
  "product": {...}
}
```

---

### ✅ Update Product (Already Implemented)
```
PUT /products/:id
```

**Request Body:**
```json
{
  "name": "Updated Product Name",
  "price": 459.99,
  "stock": 35
}
```

**Response (200):**
```json
{
  "success": true,
  "product": {...}
}
```

---

### ✅ Delete Product (Already Implemented)
```
DELETE /products/:id
```

**Response (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

### ✅ NEW: Get Product Statistics
```
GET /products/stats
```
**Priority**: PHASE 1 (CRITICAL)

**Description**: Returns aggregated product statistics for dashboard

**Response (200):**
```json
{
  "success": true,
  "stats": {
    "inventoryValue": 125400.50,
    "lowStockAlerts": 12,
    "recentMovement": 34,
    "totalProducts": 250,
    "averagePrice": 501.60,
    "outOfStockCount": 8
  }
}
```

---

### ✅ NEW: Get Low Stock Products
```
GET /products/low-stock
```
**Priority**: PHASE 1 (CRITICAL)

**Query Parameters:**
- `threshold` (number): Custom threshold (default: 10)
- `limit` (number): Max results (default: 20)

**Response (200):**
```json
{
  "success": true,
  "products": [
    {
      "id": "product_id",
      "name": "Brutalist Column",
      "sku": "BC-992-WHITE",
      "stock": 3,
      "threshold": 5,
      "status": "CRITICAL"
    }
  ],
  "count": 12
}
```

---

### ✅ NEW: Get Products by Category
```
GET /products/by-category/:categoryId
```
**Priority**: PHASE 2

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page

**Response (200):**
```json
{
  "success": true,
  "products": [...],
  "count": 45,
  "category": "category_name"
}
```

---

### ❌ NEW: Advanced Search
```
GET /products/search
```
**Priority**: PHASE 2

**Query Parameters:**
- `query` (string): Search term
- `category` (string): Category ID
- `minPrice` (number): Minimum price
- `maxPrice` (number): Maximum price
- `inStock` (boolean): Only in-stock items

**Response (200):**
```json
{
  "success": true,
  "results": [...],
  "count": 15,
  "filters": {
    "applied": ["inStock", "category"],
    "available": [...]
  }
}
```


## 3️⃣ CATEGORY ENDPOINTS

### ✅ Get All Categories (Already Implemented)
```
GET /category
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "category_id",
      "name": "Structural Materials",
      "createdAt": "2024-01-10T10:00:00Z"
    }
  ]
}
```

---

### ✅ Create Category (Already Implemented)
```
POST /category
```

**Request Body:**
```json
{
  "name": "Acoustic Panels"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {...}
}
```

---

### ✅ Update Category (Already Implemented)
```
PUT /category/:id
```

**Response (200):**
```json
{
  "success": true,
  "data": {...}
}
```

---

### ✅ Delete Category (Already Implemented)
```
DELETE /category/:id
```

**Response (200):**
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

---

## 4️⃣ USER ENDPOINTS

### ✅ Get All Users (Already Implemented)
```
GET /users
```

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `search` (string): Search by name/email

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@company.com",
      "phone": "9876543210",
      "role": "admin",
      "status": "active",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 10
  }
}
```

---

### ✅ Add User (Already Implemented)
```
POST /users
```

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@company.com",
  "phone": "9876543211",
  "role": "staff",
  "password": "securePassword123"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {...}
}
```

---

### ✅ Update User (Already Implemented)
```
PUT /users/:id
```

**Response (200):**
```json
{
  "success": true,
  "data": {...}
}
```

---

### ✅ Delete User (Already Implemented)
```
DELETE /users/:id
```

**Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

### ✅ NEW: Get User Activity
```
GET /users/:id/activity
```
**Priority**: PHASE 2

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page

**Response (200):**
```json
{
  "success": true,
  "activities": [
    {
      "id": "activity_id",
      "action": "created_product",
      "details": "Created product: Brutal Column",
      "timestamp": "2024-03-20T14:22:00Z"
    }
  ],
  "count": 45
}
```

---

###  ✅ NEW: Deactivate User
```
PUT /users/:id/deactivate
```
**Priority**: PHASE 2

**Response (200):**
```json
{
  "success": true,
  "user": {...},
  "status": "inactive",
  "deactivatedAt": "2024-03-20T14:22:00Z"
}
```

---

### ✅ NEW: Reactivate User
```
PUT /users/:id/reactivate
```
**Priority**: PHASE 2

**Response (200):**
```json
{
  "success": true,
  "user": {...},
  "status": "active",
  "reactivatedAt": "2024-03-20T14:22:00Z"
}
```


## 5️⃣ DASHBOARD & ANALYTICS ENDPOINTS

### ❌ NEW: Get Dashboard Statistics
```
GET /dashboard/stats
```
**Priority**: PHASE 1 (CRITICAL)

**Description**: Returns all KPI data for dashboard overview

**Response (200):**
```json
{
  "success": true,
  "stats": {
    "totalProducts": 2450,
    "totalCategories": 18,
    "lowStockItems": 12,
    "totalInventoryValue": 1240000,
    "activeUsers": 5,
    "companyPlan": "pro",
    "subscriptionEndDate": "2025-03-01T00:00:00Z"
  }
}
```

---

### ❌ NEW: Get Inventory Trend
```
GET /dashboard/inventory-trend
```
**Priority**: PHASE 1 (CRITICAL)

**Query Parameters:**
- `months` (number): Number of months to fetch (default: 6)

**Response (200):**
```json
{
  "success": true,
  "trends": [
    {
      "month": "January",
      "value": 65,
      "fulfillmentRate": 78,
      "productsMoved": 120
    },
    {
      "month": "February",
      "value": 72,
      "fulfillmentRate": 82,
      "productsMoved": 145
    }
  ]
}
```

---

### ❌ NEW: Get Low Stock Alerts
```
GET /dashboard/low-stock-alerts
```
**Priority**: PHASE 1 (CRITICAL)

**Query Parameters:**
- `priority` (string): critical, warning, all (default: all)

**Response (200):**
```json
{
  "success": true,
  "alerts": [
    {
      "id": "alert_id",
      "productId": "product_id",
      "productName": "Brutalist Column",
      "sku": "BC-992-WHITE",
      "currentStock": 3,
      "threshold": 5,
      "priority": "CRITICAL",
      "createdAt": "2024-03-20T14:22:00Z"
    }
  ],
  "count": 12
}
```

---

### ❌ NEW: Get Inventory Health Feed
```
GET /dashboard/inventory-health
```
**Priority**: PHASE 1 (CRITICAL)

**Query Parameters:**
- `limit` (number): Max events to return (default: 10)

**Response (200):**
```json
{
  "success": true,
  "events": [
    {
      "type": "arrival",
      "title": "Bulk Arrival",
      "description": "Section A12",
      "detail": "+450 Units",
      "timestamp": "2024-03-20T14:22:00Z"
    },
    {
      "type": "pending",
      "title": "Reorder Pending",
      "description": "SKU-902",
      "detail": "Waiting Approval",
      "timestamp": "2024-03-20T13:15:00Z"
    }
  ]
}
```

---

## 6️⃣ ALERTS & NOTIFICATIONS ENDPOINTS

### ❌ NEW: Get Low Stock Alerts
```
GET /alerts/low-stock
```
**Priority**: PHASE 2

**Query Parameters:**
- `priority` (string): critical, warning, info
- `limit` (number): Max results

**Response (200):**
```json
{
  "success": true,
  "alerts": [
    {
      "id": "alert_id",
      "productId": "product_id",
      "productName": "Product Name",
      "stock": 3,
      "threshold": 5,
      "priority": "CRITICAL",
      "createdAt": "2024-03-20T14:22:00Z",
      "acknowledged": false
    }
  ],
  "count": 5
}
```

---

### ❌ NEW: Acknowledge Alert
```
PUT /alerts/:alertId/acknowledge
```
**Priority**: PHASE 2

**Request Body:**
```json
{
  "acknowledgedBy": "user_id",
  "note": "Will reorder soon"
}
```

**Response (200):**
```json
{
  "success": true,
  "alert": {...},
  "acknowledged": true,
  "acknowledgedAt": "2024-03-20T14:22:00Z"
}
```

---

### ❌ NEW: Get Alert Summary
```
GET /alerts/summary
```
**Priority**: PHASE 2

**Response (200):**
```json
{
  "success": true,
  "summary": {
    "critical": 5,
    "warning": 12,
    "info": 28,
    "total": 45,
    "acknowledged": 20
  }
}
```

---

## 7️⃣ SUBSCRIPTION & PLAN ENDPOINTS

### ❌ NEW: Get Current Subscription
```
GET /subscription/current
```
**Priority**: PHASE 1 (CRITICAL)

**Response (200):**
```json
{
  "success": true,
  "subscription": {
    "planName": "Pro",
    "planId": "pro",
    "status": "active",
    "maxProducts": 50,
    "maxUsers": 10,
    "nextBillingDate": "2024-04-12T00:00:00Z",
    "renewalDate": "2025-04-12T00:00:00Z",
    "monthlyPrice": 79,
    "features": ["Advanced analytics", "Priority support"]
  }
}
```

---

### ❌ NEW: Get Subscription Usage
```
GET /subscription/usage
```
**Priority**: PHASE 1 (CRITICAL)

**Response (200):**
```json
{
  "success": true,
  "usage": {
    "products": {
      "used": 45,
      "max": 50,
      "percentage": 90,
      "status": "warning"
    },
    "users": {
      "used": 8,
      "max": 10,
      "percentage": 80,
      "status": "healthy"
    },
    "storage": {
      "used": "2.5 GB",
      "max": "10 GB",
      "percentage": 25,
      "status": "healthy"
    }
  }
}
```

---

### ❌ NEW: Upgrade Subscription
```
POST /subscription/upgrade
```
**Priority**: PHASE 1 (CRITICAL)

**Request Body:**
```json
{
  "planName": "business"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Plan upgraded successfully",
  "oldPlan": "pro",
  "newPlan": "business",
  "effectiveDate": "2024-03-20T00:00:00Z",
  "amountProrated": 25.50
}
```

---

### ❌ NEW: Downgrade Subscription
```
POST /subscription/downgrade
```
**Priority**: PHASE 2

**Request Body:**
```json
{
  "planName": "basic"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Plan downgraded successfully",
  "oldPlan": "pro",
  "newPlan": "basic",
  "effectiveFrom": "2025-04-12T00:00:00Z",
  "refund": 15.75
}
```

---

### ❌ NEW: Cancel Subscription
```
POST /subscription/cancel
```
**Priority**: PHASE 2

**Request Body:**
```json
{
  "reason": "Too expensive",
  "feedback": "Pricing doesn't match our needs"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Subscription cancelled successfully",
  "cancellationDate": "2024-03-20T00:00:00Z",
  "refundInfo": {
    "amount": 50.00,
    "status": "processed",
    "processedDate": "2024-03-25T00:00:00Z"
  }
}
```

---

### ✅ Get Plans (Already Implemented - Partial)
```
GET /company/plan
```

---

## 8️⃣ BILLING & INVOICING ENDPOINTS

### ❌ NEW: Get Billing Transactions
```
GET /billing/transactions
```
**Priority**: PHASE 1 (CRITICAL)

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page (default: 20)
- `status` (string): completed, pending, failed

**Response (200):**
```json
{
  "success": true,
  "transactions": [
    {
      "id": "txn_id",
      "amount": 79.00,
      "currency": "USD",
      "date": "2024-03-12T00:00:00Z",
      "status": "completed",
      "plan": "Pro",
      "description": "Pro Plan Monthly Subscription",
      "invoiceId": "invoice_id"
    }
  ],
  "total": 474.00,
  "count": 6,
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 6
  }
}
```

---

### ❌ NEW: Get Invoices
```
GET /billing/invoices
```
**Priority**: PHASE 1 (CRITICAL)

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page

**Response (200):**
```json
{
  "success": true,
  "invoices": [
    {
      "id": "invoice_id",
      "invoiceNumber": "INV-2024-001",
      "date": "2024-03-12T00:00:00Z",
      "amount": 79.00,
      "currency": "USD",
      "status": "paid",
      "plan": "Pro",
      "description": "Pro Plan Monthly",
      "downloadUrl": "/invoices/invoice_id/download",
      "dueDate": "2024-04-12T00:00:00Z"
    }
  ],
  "count": 6
}
```

---

### ❌ NEW: Download Invoice
```
GET /billing/invoices/:invoiceId/download
```
**Priority**: PHASE 2

**Response**: PDF file download

---

---

## 9️⃣ COMPANY & PROFILE ENDPOINTS

### ❌ NEW: Get Company Profile
```
GET /company/profile
```
**Priority**: PHASE 2

**Response (200):**
```json
{
  "success": true,
  "company": {
    "id": "company_id",
    "company_name": "Acme Architecture",
    "email": "contact@acme.com",
    "phone": "9876543210",
    "address": "123 Design Street, NYC",
    "websiteUrl": "https://acme.com",
    "plan": "pro",
    "subscriptionStartDate": "2024-01-12T00:00:00Z",
    "subscriptionEndDate": "2025-04-12T00:00:00Z",
    "createdAt": "2024-01-12T00:00:00Z"
  }
}
```

---

### ❌ NEW: Update Company Profile
```
PUT /company/profile
```
**Priority**: PHASE 2

**Request Body:**
```json
{
  "company_name": "Acme Architecture Studio",
  "email": "newemail@acme.com",
  "phone": "9876543211",
  "address": "456 New Studio, NYC",
  "websiteUrl": "https://new-acme.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "company": {...},
  "updated": true
}
```

---

### ❌ NEW: Get Company Dashboard Stats
```
GET /company/dashboard-stats
```
**Priority**: PHASE 2

**Response (200):**
```json
{
  "success": true,
  "stats": {
    "totalProducts": 2450,
    "totalUsers": 8,
    "totalCategories": 18,
    "inventoryValue": 1240000,
    "activeUsersThisMonth": 6,
    "ordersThisMonth": 145,
    "lastUpdated": "2024-03-20T14:22:00Z"
  }
}
```

---

## 🔟 REPORTING & EXPORT ENDPOINTS

### ❌ NEW: Generate Inventory Report
```
GET /reports/inventory
```
**Priority**: PHASE 3

**Query Parameters:**
- `format` (string): pdf, csv, excel (default: pdf)
- `period` (string): monthly, quarterly, annual

**Response**: PDF/CSV/Excel file download

---

### ❌ NEW: Export Data
```
POST /reports/export
```
**Priority**: PHASE 3

**Request Body:**
```json
{
  "dataType": "products",
  "format": "csv",
  "filters": {
    "category": "category_id",
    "priceRange": {"min": 0, "max": 1000},
    "stockStatus": "low"
  }
}
```

**Response**: File download

---

### ❌ NEW: Generate Low Stock Report
```
GET /reports/low-stock
```
**Priority**: PHASE 3

**Query Parameters:**
- `format` (string): pdf, csv, excel
- `period` (string): 7days, 30days, custom

**Response**: Report file download

---

## 1️⃣1️⃣ SEARCH & FILTER ENDPOINTS

### ❌ NEW: Global Search
```
GET /search
```
**Priority**: PHASE 2

**Query Parameters:**
- `q` (string): Search query
- `type` (string): products, users, categories, all

**Response (200):**
```json
{
  "success": true,
  "results": {
    "products": [...],
    "users": [...],
    "categories": [...]
  },
  "count": 25
}
```

---

### ❌ NEW: Get Filter Options
```
GET /filters/available
```
**Priority**: PHASE 2

**Response (200):**
```json
{
  "success": true,
  "filters": {
    "categories": [
      {"id": "cat_1", "name": "Structural"},
      {"id": "cat_2", "name": "Materials"}
    ],
    "priceRanges": [
      {"min": 0, "max": 100},
      {"min": 100, "max": 500},
      {"min": 500, "max": 1000}
    ],
    "stockStatus": ["in_stock", "low_stock", "out_of_stock"],
    "sortOptions": ["name", "price", "stock", "newest"]
  }
}
```

---

## 1️⃣2️⃣ AUDIT & LOGGING ENDPOINTS (Optional)

### ❌ NEW: Get Audit Logs
```
GET /audit-logs
```
**Priority**: PHASE 3

**Query Parameters:**
- `entity` (string): products, users, categories
- `action` (string): create, update, delete
- `page` (number): Page number

**Response (200):**
```json
{
  "success": true,
  "logs": [
    {
      "id": "log_id",
      "entity": "products",
      "entityId": "product_id",
      "action": "update",
      "userId": "user_id",
      "userName": "John Doe",
      "changes": {
        "before": {"price": 399.99},
        "after": {"price": 459.99}
      },
      "timestamp": "2024-03-20T14:22:00Z"
    }
  ],
  "count": 150
}
```

---

## 📊 Error Handling

All endpoints follow consistent error response format:

**Error Response (400, 401, 404, 500):**
```json
{
  "success": false,
  "message": "Descriptive error message",
  "code": "ERROR_CODE",
  "statusCode": 400,
  "details": {
    "field": "fieldName",
    "reason": "Detailed reason"
  }
}
```

### Common Error Codes:
- `INVALID_INPUT`: Input validation failed
- `UNAUTHORIZED`: Missing/invalid token
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `CONFLICT`: Resource already exists
- `RATE_LIMITED`: Too many requests
- `SERVER_ERROR`: Internal server error

---

## 🎯 Implementation Priority Roadmap

### ✅ Phase 1 - MVP (CRITICAL - Must Have)
1. **Dashboard Stats** `GET /dashboard/stats`
2. **Inventory Trend** `GET /dashboard/inventory-trend`
3. **Low Stock Alerts** `GET /dashboard/low-stock-alerts`
4. **Inventory Health** `GET /dashboard/inventory-health`
5. **Product Stats** `GET /products/stats`
6. **Current Subscription** `GET /subscription/current`
7. **Subscription Usage** `GET /subscription/usage`
8. **Billing Transactions** `GET /billing/transactions`
9. **Invoices** `GET /billing/invoices`

### ⚠️ Phase 2 - Enhanced Features (SHOULD Have)
1. Low Stock Products `GET /products/low-stock`
2. Categories with Count `GET /category/with-count`
3. User Role Management
4. Advanced Search
5. Alerts Management
6. Company Profile Endpoints
7. Global Search

### 📅 Phase 3 - Nice to Have
1. Reports & Export
2. Audit Logs
3. Advanced Analytics
4. Bulk Operations

---

## 🔗 Quick Reference Table

| Endpoint | Method | Status | Priority |
|----------|--------|--------|----------|
| `/auth/login` | POST | ✅ | - |
| `/auth/register` | POST | ✅ | - |
| `/products` | GET, POST | ✅ | - |
| `/products/:id` | GET, PUT, DELETE | ✅ | - |
| `/products/stats` | GET | ✅ | P1 |
| `/products/low-stock` | GET | ✅ | P1 |
| `/products/by-category/:categoryId` | GET | ✅ | P1 |
| `/products/` | GET | ✅ | P2 | it will handle search
| `/category` | GET, POST, PUT, DELETE | ✅ | - |
| `/category/with-count` | GET | ❌ | P2 |
| `/users` | GET, POST, PUT, DELETE | ✅ | - |
| `/dashboard/stats` | GET | ❌ | P1 |
| `/dashboard/inventory-trend` | GET | ❌ | P1 |
| `/dashboard/low-stock-alerts` | GET | ❌ | P1 |
| `/subscription/current` | GET | ❌ | P1 |
| `/subscription/usage` | GET | ❌ | P1 |
| `/subscription/upgrade` | POST | ❌ | P1 |
| `/billing/transactions` | GET | ❌ | P1 |
| `/billing/invoices` | GET | ❌ | P1 |
| `/alerts/low-stock` | GET | ❌ | P2 |
| `/reports/inventory` | GET | ❌ | P3 |

---

## 📝 Notes

- All timestamps are ISO 8601 format (UTC)
- Pagination uses 0-based page indexing
- All monetary values are in the company's default currency
- Authentication token expires in 24 hours
- Rate limiting: 100 requests per minute per IP

---

## 📞 Support

For API issues or questions:
- Email: support@inventoryapp.com
- Slack: #api-support
- Documentation: https://docs.inventoryapp.com

---

**Last Updated**: April 3, 2026  
**API Version**: v1  
**Status**: In Development