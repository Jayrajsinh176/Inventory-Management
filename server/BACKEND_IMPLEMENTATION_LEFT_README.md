# Backend Implementation Left README

## Scope

This document reviews the current backend implementation in `server/` and focuses on:

- routes that are already mounted
- current response shapes from those routes
- backend areas that are still missing, partial, or inconsistent
- recommended next routes to add, with suggested response contracts

This was written from the actual code in:

- `server/index.js`
- `server/routes/*.js`
- `server/controllers/*.js`
- `server/models/*.js`
- `server/middleware/auth.middleware.js`

## Current Mounted Route Surface

Mounted in `server/index.js`:

- `/api/auth`
- `/api/products`
- `/api/category`
- `/api/users`
- `/api/company/plan`
- `/api/alert`
- `/api/dashboard`
- `/api/company`

## Current Implemented Routes And Response Details

### 1. Auth

#### `POST /api/auth/register`

Controller: `registerUser`

Current success response:

```json
{
  "success": true,
  "message": "Account created successfully",
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
    "isEmailVerified": false,
    "createdAt": "2026-04-06T00:00:00.000Z"
  },
  "company": {
    "id": "companyId",
    "company_name": "Acme",
    "email": "john@example.com",
    "phone": "9876543210",
    "address": "Some address",
    "plan": "trial",
    "subscription_start_date": "2026-04-06T00:00:00.000Z",
    "subscription_end_date": "2026-04-13T00:00:00.000Z"
  },
  "emailVerificationRequired": true
}
```

Notes:

- creates both company and first admin user
- returns both access and refresh tokens
- creates and sends an email verification token on signup
- when SMTP is not configured, non-production responses include an email preview payload for local testing

#### `POST /api/auth/login`

Controller: `loginUser`

Current success response:

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
    "isEmailVerified": true,
    "createdAt": "2026-04-06T00:00:00.000Z"
  },
  "company": {
    "id": "companyId",
    "company_name": "Acme",
    "email": "john@example.com",
    "phone": "9876543210",
    "address": "Some address",
    "plan": "trial",
    "subscription_start_date": "2026-04-06T00:00:00.000Z",
    "subscription_end_date": "2026-04-13T00:00:00.000Z"
  }
}
```

Notes:

- supports login by email or phone
- returns both access and refresh tokens
- email verification can be enforced with `REQUIRE_EMAIL_VERIFICATION=true`
- inactive users are blocked from logging in

#### `POST /api/auth/forgot-password`

Controller: `forgotPassword`

Current success response:

```json
{
  "success": true,
  "message": "If an account with that email exists, password reset instructions have been sent."
}
```

Notes:

- enumeration-safe generic response
- stores a hashed password reset token with expiry
- when SMTP is not configured, non-production responses include the reset token inside the email preview payload

#### `POST /api/auth/reset-password`

Controller: `resetPassword`

Current success response:

```json
{
  "success": true,
  "message": "Password reset successful",
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
    "isEmailVerified": true,
    "createdAt": "2026-04-06T00:00:00.000Z"
  }
}
```

Notes:

- requires `token` and `newPassword`
- invalidates older access and refresh tokens by incrementing `tokenVersion`

#### `POST /api/auth/refresh-token`

Controller: `refreshAccessToken`

Current success response:

```json
{
  "success": true,
  "message": "Token refreshed successfully",
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
    "isEmailVerified": true,
    "createdAt": "2026-04-06T00:00:00.000Z"
  },
  "company": {
    "id": "companyId",
    "company_name": "Acme"
  }
}
```

Notes:

- requires `refreshToken`
- refresh tokens are verified separately using `JWT_REFRESH_SECRET` when provided
- revoked sessions are rejected by comparing `tokenVersion`

#### `POST /api/auth/send-verification-email`

Controller: `sendVerificationEmail`

Current success response:

```json
{
  "success": true,
  "message": "If an account with that email exists and is not verified, a verification email has been sent."
}
```

Notes:

- enumeration-safe generic response
- resends a fresh verification token for unverified users only

#### `GET /api/auth/verify-email`
#### `POST /api/auth/verify-email`

Controller: `verifyEmail`

Current success response:

```json
{
  "success": true,
  "message": "Email verified successfully",
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
    "isEmailVerified": true,
    "createdAt": "2026-04-06T00:00:00.000Z"
  },
  "company": {
    "id": "companyId",
    "company_name": "Acme"
  }
}
```

Notes:

- accepts token through query string or request body
- clears verification token after successful verification

#### `POST /api/auth/change-password`

Controller: `changePassword`

Current success response:

```json
{
  "success": true,
  "message": "Password changed successfully",
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
    "isEmailVerified": true,
    "createdAt": "2026-04-06T00:00:00.000Z"
  },
  "company": {
    "id": "companyId",
    "company_name": "Acme"
  }
}
```

Notes:

- protected route
- requires `oldPassword` and `newPassword`
- invalidates older access and refresh tokens by incrementing `tokenVersion`

#### `POST /api/auth/logout`

Controller: `logoutUser`

Current success response:

```json
{
  "success": true,
  "message": "Logout successful"
}
```

Notes:

- protected route
- performs server-side token invalidation by incrementing `tokenVersion`
- acts as logout-all-sessions for that user because previously issued tokens no longer match

### 2. Products

#### `GET /api/products`

Controller: `getProducts`

Accepted query params:

- `page`
- `limit`
- `category`
- `search`

Current success response:

```json
{
  "success": true,
  "message": "Products fetched successfully",
  "page": 1,
  "limit": 10,
  "totalPages": 3,
  "count": 27,
  "products": [
    {
      "id": "productId",
      "company": "companyId",
      "name": "Chair",
      "sku": "CHAIR-001",
      "category": {
        "id": "categoryId",
        "name": "Furniture"
      },
      "price": 1200,
      "stock": 8,
      "createdAt": "2026-04-06T00:00:00.000Z",
      "updatedAt": "2026-04-06T00:00:00.000Z"
    }
  ]
}
```

Notes:

- paginated
- search works on `name` and `sku`
- category filter works
- no sort query contract yet
- no stock-status filter in backend

#### `GET /api/products/:id`

Controller: `getProductById`

Current success response:

```json
{
  "success": true,
  "message": "Product fetched successfully",
  "product": {
    "id": "productId",
    "company": "companyId",
    "name": "Chair",
    "sku": "CHAIR-001",
    "category": {
      "id": "categoryId",
      "name": "Furniture"
    },
    "price": 1200,
    "stock": 8,
    "createdAt": "2026-04-06T00:00:00.000Z",
    "updatedAt": "2026-04-06T00:00:00.000Z"
  }
}
```

#### `POST /api/products`

Controller: `createProduct`

Current success response:

```json
{
  "success": true,
  "message": "Product created successfully",
  "product": {
    "id": "productId",
    "company": "companyId",
    "name": "Chair",
    "sku": "CHAIR-001",
    "category": {
      "id": "categoryId",
      "name": "Furniture"
    },
    "price": 1200,
    "stock": 8,
    "createdAt": "2026-04-06T00:00:00.000Z",
    "updatedAt": "2026-04-06T00:00:00.000Z"
  },
  "subscription": {
    "plan": "trial",
    "maxProducts": "500"
  }
}
```

Notes:

- enforces plan product limits
- validates category ownership
- does not currently accept `lowStockThreshold` from the request body

#### `PUT /api/products/:id`

Controller: `updateProduct`

Current success response:

```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "id": "productId",
    "company": "companyId",
    "name": "Chair",
    "sku": "CHAIR-001",
    "category": {
      "id": "categoryId",
      "name": "Furniture"
    },
    "price": 1200,
    "stock": 8,
    "createdAt": "2026-04-06T00:00:00.000Z",
    "updatedAt": "2026-04-06T00:00:00.000Z"
  }
}
```

Notes:

- supports updating `name`, `sku`, `category`, `price`, `stock`
- does not support updating `lowStockThreshold`
- response key is `data`, not `product`

#### `DELETE /api/products/:id`

Controller: `deleteProduct`

Current success response:

```json
{
  "message": "Product deleted successfully"
}
```

Notes:

- response does not include `success`
- response shape is inconsistent with most other controllers

#### `GET /api/products/stats`

Controller: `getProductStats`

Current success response:

```json
{
  "success": true,
  "stats": {
    "inventoryValue": 50000,
    "lowStocksAlerts": 4,
    "lowStockProduct": [],
    "totalProducts": 31,
    "averagePrice": "240.00",
    "outOfStockCount": 2
  }
}
```

Notes:

- route exists
- calculations need review
- `totalProducts` currently represents summed stock units, not product document count

#### `GET /api/products/low-stock`

Controller: `getLowStock`

Current success response:

```json
{
  "success": true,
  "low-stock-products": [],
  "count": 0
}
```

#### `GET /api/products/by-category/:categoryId`

Controller: `getProductsByCategory`

Current success response:

```json
{
  "success": true,
  "products": [],
  "count": 0,
  "categoryName": {
    "name": "Furniture"
  }
}
```

#### `GET /api/products/analytics/stock-movement`

Controller: `getStockMovementAnalysis`

Current success response:

```json
{
  "success": true,
  "message": "Stock movement analysis fetched successfully",
  "data": [
    { "month": "Jan", "value": 80, "actualUnits": 720 }
  ],
  "totalProductsAnalyzed": 20,
  "totalInventoryValue": 50000
}
```

#### `GET /api/products/analytics/category-performance`

Controller: `getCategoryPerformanceAnalysis`

Current success response:

```json
{
  "success": true,
  "message": "Category performance analysis fetched successfully",
  "data": [
    {
      "category": "Furniture",
      "value": 12.5,
      "actualValue": 12500,
      "productCount": 4,
      "averagePrice": 900
    }
  ],
  "totalCategoriesAnalyzed": 3,
  "totalInventoryValue": 50000
}
```

#### `GET /api/products/analytics/reorder-patterns`

Controller: `getReorderPatternsAnalysis`

Current success response:

```json
{
  "success": true,
  "message": "Reorder patterns analysis fetched successfully",
  "data": [
    { "month": "Jan", "value": 7, "lowStockItems": 3 }
  ],
  "avgReorderFrequency": "6.3",
  "totalProductsAnalyzed": 20,
  "currentLowStockItems": 3
}
```

Notes on analytics routes:

- all three analytics routes exist
- stock movement and reorder data are still simulated with random values
- there is no real movement ledger or reorder history model behind them

### 3. Categories

#### `GET /api/category`

Controller: `getCategory`

Current success response:

```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": "categoryId",
      "name": "Furniture",
      "company": "companyId",
      "productCount": 9,
      "createdAt": "2026-04-06T00:00:00.000Z",
      "updatedAt": "2026-04-06T00:00:00.000Z"
    }
  ]
}
```

#### `POST /api/category`

Controller: `createCategory`

Current success response:

```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "_id": "categoryId",
    "company": "companyId",
    "name": "furniture",
    "createdAt": "2026-04-06T00:00:00.000Z",
    "updatedAt": "2026-04-06T00:00:00.000Z"
  }
}
```

#### `PUT /api/category/:id`

Controller: `updateCategory`

Current success response:

```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "_id": "categoryId",
    "company": "companyId",
    "name": "updated-category",
    "createdAt": "2026-04-06T00:00:00.000Z",
    "updatedAt": "2026-04-06T00:00:00.000Z"
  }
}
```

#### `DELETE /api/category/:id`

Controller: `deleteCategory`

Current success response:

```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

Notes:

- category create/update return raw mongoose document style with `_id`
- category list returns normalized `id`
- response shape is inconsistent across category endpoints
- no protection against deleting a category that still has products assigned

### 4. Users

#### `GET /api/users`

Controller: `getUsersDetails`

Current success response:

```json
{
  "success": true,
  "count": 4,
  "data": [
    {
      "_id": "userId",
      "company": "companyId",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "phone": "9876543210",
      "role": "staff",
      "status": {
        "value": "active"
      },
      "createdAt": "2026-04-06T00:00:00.000Z",
      "updatedAt": "2026-04-06T00:00:00.000Z"
    }
  ]
}
```

Notes:

- query params are not implemented for search/filter/pagination
- frontend currently expects more than this route actually supports

#### `GET /api/users/:id`

Controller: `getUserById`

Current success response:

```json
{
  "success": true,
  "user": {
    "_id": "userId",
    "company": "companyId",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "9876543210",
    "role": "staff",
    "status": {
      "value": "active"
    },
    "createdAt": "2026-04-06T00:00:00.000Z",
    "updatedAt": "2026-04-06T00:00:00.000Z"
  }
}
```

#### `POST /api/users`

Controller: `addUsers`

Current success response:

```json
{
  "success": true,
  "message": "Staff added successfully.",
  "data": {
    "_id": "userId",
    "company": "companyId",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "9876543210",
    "role": "staff",
    "status": {
      "value": "active"
    },
    "createdAt": "2026-04-06T00:00:00.000Z",
    "updatedAt": "2026-04-06T00:00:00.000Z"
  }
}
```

Notes:

- plan user limit enforcement exists
- backend generates a random password
- no invite email flow or password handoff response exists

#### `PUT /api/users/:id`

Controller: `updateUsersDetails`

Current success response:

```json
{
  "success": true,
  "message": "Staff details updated successfully.",
  "data": {
    "_id": "userId",
    "company": "companyId",
    "name": "Updated Name",
    "email": "updated@example.com",
    "phone": "9876543210",
    "role": "admin",
    "status": {
      "value": "active"
    },
    "createdAt": "2026-04-06T00:00:00.000Z",
    "updatedAt": "2026-04-06T00:00:00.000Z"
  }
}
```

#### `PATCH /api/users/:id/deactivate`

Controller: `deactivateUser`

Current happy-path success response:

```json
{
  "success": true,
  "message": "Staff deactivated successfully."
}
```

#### `PATCH /api/users/:id/activate`

Controller: `activateUser`

Current happy-path success response:

```json
{
  "success": true,
  "message": "Staff activated successfully."
}
```

Notes:

- both activate/deactivate routes need fallback responses when user is already in that state

#### `DELETE /api/users/:id`

Controller: `deleteUser`

Current success response:

```json
{
  "success": true,
  "message": "Staff deleted successfully."
}
```

#### `GET /api/users/:id/activity`

Controller: `getUserActivity`

Current success response:

```json
{
  "success": true,
  "activities": [
    {
      "id": "activityId",
      "action": "updated_user",
      "details": "Updated user: Jane Doe",
      "timestamp": "2026-04-06T00:00:00.000Z",
      "metadata": {}
    }
  ],
  "pagination": {
    "count": 10,
    "total": 42,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

### 5. Plan Catalog

#### `GET /api/company/plan`

Controller: `planDetails`

Current success response:

```json
{
  "success": true,
  "message": "Plan Fetched successfully.",
  "data": [
    {
      "id": "basic",
      "label": "Basic",
      "maxProducts": 50,
      "maxUsers": 1,
      "features": ["inventory"]
    }
  ]
}
```

Notes:

- route is currently public even though `protect` is imported in the route file
- this route only exposes available plan definitions
- no current-subscription endpoint and no mutation endpoint exist

### 6. Alerts

#### `GET /api/alert/low-stock`

Controller: `getLowStockAlerts`

Current success response:

```json
{
  "success": true,
  "data": [
    {
      "_id": "productId",
      "name": "Chair",
      "stock": 2,
      "lowStockThreshold": 5
    }
  ]
}
```

Notes:

- overlaps with `/api/products/low-stock`
- should eventually be unified with a single alert contract

### 7. Dashboard

#### `GET /api/dashboard`

Controller: `dashboardStats`

Current response shape:

```json
{
  "totalProducts": 20,
  "totalCategories": 4,
  "totalAlerts": 0,
  "totalUsers": 5,
  "totalInventoryValue": 0
}
```

Notes:

- no `success` key
- currently uses collection-level queries directly
- references an `alerts` collection that does not appear to have a model
- uses product field `quantity` in inventory aggregation, but the product model uses `stock`
- route exists, but it is not ready to be a stable dashboard summary contract

#### `GET /api/dashboard/low-stock-alerts`

Controller: `getLowStockAlerts` from dashboard controller

Current response shape:

```json
[
  {
    "_id": "productId",
    "name": "Chair",
    "sku": "CHAIR-001",
    "stock": 2,
    "lowStockThreshold": 5
  }
]
```

Notes:

- returns a bare array instead of an envelope object
- overlaps with `/api/alert/low-stock` and `/api/products/low-stock`
- should be normalized before frontend adoption

## Backend Areas Still Left To Implement

## A. Auth and Account Management

Current state:

- register, login, forgot-password, reset-password, change-password, logout, refresh-token, send-verification-email, and verify-email are implemented
- server-side token invalidation is handled with `tokenVersion` on the user record
- email delivery falls back to console preview mode when SMTP is not configured

Still left:

- frontend pages or flows for `reset-password` and `verify-email` if the client app has not implemented them yet
- production SMTP configuration and branded email templates
- optional cookie-based refresh-token storage and token rotation if you want stronger session management
- optional strict email-verification enforcement by setting `REQUIRE_EMAIL_VERIFICATION=true`
- optional single-session or device-aware logout if logout-all-sessions is too broad for product needs

## B. Company Profile Management

Current state:

- `GET /api/company` exists and returns the raw company document for the authenticated user
- `PUT /api/company` exists and updates basic company profile fields
- several subscription and billing paths are mounted, but they currently point to placeholder controller behavior and do not return real subscription or billing data

Recommended routes:

- keep `GET /api/company`
- keep `PUT /api/company`
- implement real handlers for the mounted subscription and billing routes

Recommended success response:

```json
{
  "success": true,
  "company": {
    "id": "companyId",
    "company_name": "Acme",
    "email": "team@acme.com",
    "phone": "9876543210",
    "address": "Some address",
    "plan": "trial",
    "subscription_start_date": "2026-04-06T00:00:00.000Z",
    "subscription_end_date": "2026-04-13T00:00:00.000Z"
  }
}
```

## C. Subscription and Billing Management

Current state:

- only `GET /api/company/plan` exists
- `/api/company/subscription`, `/api/company/subscription/cancel`, and billing routes are mounted but currently return placeholder company-profile data instead of real subscription or billing payloads

Still missing:

- current company subscription summary endpoint
- plan upgrade endpoint
- plan downgrade endpoint
- cancel subscription endpoint
- billing history endpoint
- invoice list endpoint
- invoice download endpoint
- Stripe webhook endpoint

Recommended routes:

- `GET /api/company/subscription`
- `PATCH /api/company/subscription`
- `POST /api/company/subscription/cancel`
- `GET /api/company/billing-history`
- `GET /api/company/invoices`
- `POST /api/payments/stripe/webhook`

Recommended success response for subscription summary:

```json
{
  "success": true,
  "subscription": {
    "plan": "trial",
    "status": "active",
    "subscription_start_date": "2026-04-06T00:00:00.000Z",
    "subscription_end_date": "2026-04-13T00:00:00.000Z",
    "maxProducts": 500,
    "maxUsers": 5
  }
}
```

## D. Users API Hardening

Current state:

- base CRUD exists
- activity endpoint exists

Still left:

- true server-side search
- true server-side pagination on `GET /api/users`
- true server-side filter by `role`
- true server-side filter by `status`
- stable response when activate/deactivate is called on already active/inactive users
- onboarding flow for generated passwords

Recommended improved `GET /api/users` response:

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "count": 10,
    "total": 42,
    "page": 1,
    "limit": 10,
    "pages": 5
  },
  "filters": {
    "search": "john",
    "role": "staff",
    "status": "active"
  }
}
```

## E. Product Domain Completion

Current state:

- core CRUD exists
- analytics routes exist

Still left:

- support `lowStockThreshold` in create and update payloads
- import products from CSV or Excel
- export products
- stable real analytics based on real movement data
- consistent response envelope keys across all product routes
- inventory movement history model if analytics must be real

Recommended additional routes:

- `POST /api/products/import`
- `GET /api/products/export`
- `GET /api/products/:id/movements`
- `POST /api/products/:id/adjust-stock`

Recommended stock adjustment response:

```json
{
  "success": true,
  "message": "Stock adjusted successfully.",
  "data": {
    "productId": "productId",
    "previousStock": 8,
    "newStock": 12,
    "reason": "manual_adjustment",
    "adjustedAt": "2026-04-06T00:00:00.000Z"
  }
}
```

## F. Category Domain Completion

Current state:

- create, list, update, delete exist

Still left:

- category detail route if frontend needs one
- delete guard when products still belong to the category
- response-shape normalization from `_id` to `id`

Recommended additional route:

- `GET /api/category/:id`

Recommended delete-failure response when products exist:

```json
{
  "success": false,
  "message": "Cannot delete category with assigned products.",
  "productCount": 9
}
```

## G. Dashboard Consolidation

Current state:

- dashboard routes were added
- current implementation is partial and inconsistent

Still left:

- normalize `/api/dashboard` response envelope
- stop querying nonexistent `alerts` collection unless an alert model is introduced
- use `stock` instead of `quantity`
- choose one low-stock route family and remove overlap

Recommended dashboard summary response:

```json
{
  "success": true,
  "message": "Dashboard summary fetched successfully.",
  "data": {
    "totalProducts": 20,
    "totalCategories": 4,
    "totalAlerts": 3,
    "totalUsers": 5,
    "totalInventoryValue": 50000
  }
}
```

## H. Alerts and Notifications

Current state:

- low-stock alert reading exists in two places

Still left:

- one canonical alert route family
- alert read/unread state
- alert acknowledgement
- email notifications
- notification preferences

Recommended routes:

- `GET /api/alerts`
- `PATCH /api/alerts/:id/read`
- `PATCH /api/alerts/:id/acknowledge`
- `GET /api/alerts/preferences`
- `PUT /api/alerts/preferences`

## I. Reporting and Export

Current state:

- no report routes exist

Still left:

- inventory summary PDF endpoint
- low-stock report endpoint
- user activity report endpoint
- CSV export endpoints

Recommended routes:

- `POST /api/reports/inventory-summary`
- `POST /api/reports/low-stock`
- `POST /api/reports/user-activity`
- `GET /api/reports/:reportId`

Recommended response:

```json
{
  "success": true,
  "message": "Report generated successfully.",
  "data": {
    "reportId": "reportId",
    "type": "inventory-summary",
    "downloadUrl": "/api/reports/reportId/download"
  }
}
```

## J. Company-Wide Activity Feed

Current state:

- user-specific activity exists
- company-wide activity route does not exist

Still left:

- `GET /api/activity`

Recommended response:

```json
{
  "success": true,
  "activities": [
    {
      "id": "activityId",
      "user": {
        "id": "userId",
        "name": "Jane Doe"
      },
      "action": "created_product",
      "details": "Created product: Chair",
      "timestamp": "2026-04-06T00:00:00.000Z",
      "metadata": {}
    }
  ],
  "pagination": {
    "count": 10,
    "total": 42,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

## K. Operational Routes And Backend Quality

Still left:

- health check route like `GET /health`
- version route like `GET /api/meta`
- OpenAPI or Swagger docs
- automated tests
- consistent error-response helper across all controllers

Recommended health response:

```json
{
  "success": true,
  "status": "ok",
  "service": "inventory-management-api"
}
```

## Highest Priority Backend Work Next

1. stabilize `/api/dashboard` so it uses real product fields and a consistent response envelope
2. add server-side pagination, search, and filtering to `GET /api/users`
3. support `lowStockThreshold` in product create/update
4. unify low-stock routes under one alert contract
5. add company profile and subscription summary endpoints
6. guard category deletion when products still reference the category
7. normalize response shapes across controllers (`success`, `message`, `data`)
8. decide whether refresh tokens should remain body-based or move to httpOnly cookies

## Suggested Implementation Order By Route Group

### Phase 1

- `GET /api/company/profile`
- `PUT /api/company/profile`
- improved `GET /api/users`
- fixed `/api/dashboard`

### Phase 2

- `PATCH /api/company/subscription`
- `GET /api/company/subscription`
- company profile routes

### Phase 3

- `GET /api/activity`
- `POST /api/products/:id/adjust-stock`
- `GET /api/products/:id/movements`
- report generation routes

### Phase 4

- import/export routes
- billing history routes
- invoice routes
- notification preference routes
