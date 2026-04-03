# 📚 Inventory Management System - Complete API Endpoints Guide

## 📌 Overview

This document provides a comprehensive guide to all API endpoints required for the Inventory Management System. The system manages inventory, users, subscriptions, and billing for architectural firms.

**Project**: Exotic Inventory Management System  
**Base URL**: `http://localhost:5000/api`  
**Authentication**: Bearer Token (JWT)  
**API Version**: v1

---

## 🔐 Authentication

All endpoints (except login/register) require Bearer token authentication.

### Headers Required:
```
Authorization: Bearer <token>
Content-Type: application/json
```

### Login to Get Token:
```bash
POST /api/auth/login
```

---

## ✅ Current Status

### ✔️ Already Implemented (Basic CRUD):
- ✅ Authentication (Register/Login)
- ✅ Products CRUD (Create, Read, Update, Delete)
- ✅ Categories CRUD
- ✅ Users CRUD
- ✅ Basic Plan Details

### ⚠️ Missing/To-Do:
- ❌ Dashboard Analytics
- ❌ Advanced Product Features
- ❌ Subscription Management
- ❌ Billing & Invoicing
- ❌ Alerts & Notifications
- ❌ Reports & Export
- ❌ User Role Management

---

## 📋 API Endpoints by Category

---

## 1️⃣ AUTHENTICATION ENDPOINTS

### ✅ Register User (Already Implemented)
```
POST /auth/register
```
**Description**: Create a new company and user account

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
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@acme.com",
    "role": "admin"
  },
  "company": {
    "id": "company_id",
    "company_name": "Acme Architecture",
    "plan": "trial"
  }
}
```

---

### ✅ Login User (Already Implemented)
```
POST /auth/login
```
**Description**: Authenticate user and get JWT token

**Request Body:**
```json
{
  "email": "john@acme.com",
  "phone": "9876543210",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {...},
  "company": {...}
}
```

---

## 2️⃣ PRODUCT ENDPOINTS

### ✅ Get All Products (Already Implemented)
```
GET /products
```
**Query Parameters:**
- `page` (number): Page number (default: 0)
- `limit` (number): Items per page (default: 10)
- `category` (string): Filter by category ID
- `search` (string): Search by product name or SKU

**Response (200):**
```json
{
  "success": true,
  "products": [
    {
      "id": "product_id",
      "name": "Brutalist Column",
      "sku": "BC-992-WHITE",
      "category": "category_id",
      "price": 1500,
      "stock": 45,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "count": 5,
  "total": 250
}
```

---

### ✅ Get Product by ID (Already Implemented)
```
GET /products/:id
```

**Response (200):**
```json
{
  "success": true,
  "product": {
    "id": "product_id",
    "name": "Brutalist Column",
    "sku": "BC-992-WHITE",
    "category": "category_id",
    "price": 1500,
    "stock": 45,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-03-20T14:22:00Z"
  }
}
```

---

### ✅ Create Product (Already Implemented)
```
POST /products
```

**Request Body:**
```json
{
  "name": "Minimalist Oak Chair",
  "sku": "MOC-2024-001",
  "category": "category_id",
  "price": 399.99,
  "stock": 50
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

---

### ❌ NEW: Bulk Update Stock
```
POST /products/bulk-update-stock
```
**Priority**: PHASE 2

**Request Body:**
```json
{
  "updates": [
    {"productId": "id1", "quantity": 50},
    {"productId": "id2", "quantity": -10},
    {"productId": "id3", "quantity": 25}
  ]
}
```

**Response (200):**
```json
{
  "success": true,
  "updated": 3,
  "failed": 0,
  "results": [...]
}
```

---

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

### ❌ NEW: Get Categories with Product Count
```
GET /category/with-count
```
**Priority**: PHASE 2

**Response (200):**
```json
{
  "success": true,
  "categories": [
    {
      "id": "category_id",
      "name": "Structural Materials",
      "productCount": 45,
      "lastUpdated": "2024-03-20T14:22:00Z"
    }
  ]
}
```

---

### ❌ NEW: Bulk Delete Categories
```
POST /category/bulk-delete
```
**Priority**: PHASE 2

**Request Body:**
```json
{
  "categoryIds": ["id1", "id2", "id3"]
}
```

**Response (200):**
```json
{
  "success": true,
  "deleted": 3,
  "failed": 0
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

---

### ❌ NEW: Get Available Roles
```
GET /users/roles
```
**Priority**: PHASE 2

**Response (200):**
```json
{
  "success": true,
  "roles": [
    {
      "id": "admin",
      "name": "Administrator",
      "permissions": ["all"]
    },
    {
      "id": "staff",
      "name": "Staff Member",
      "permissions": ["view", "edit", "delete"]
    }
  ]
}
```

---

### ❌ NEW: Change User Role
```
POST /users/:id/change-role
```
**Priority**: PHASE 2

**Request Body:**
```json
{
  "role": "admin"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {...},
  "newRole": "admin",
  "updatedAt": "2024-03-20T14:22:00Z"
}
```

---

### ❌ NEW: Get User Activity
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

### ❌ NEW: Deactivate User
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

### ❌ NEW: Reactivate User
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

---

### ❌ NEW: Export Users
```
GET /users/export
```
**Priority**: PHASE 3

**Query Parameters:**
- `format` (string): csv, excel, pdf (default: csv)

**Response**: File download (CSV/Excel/PDF)

---

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