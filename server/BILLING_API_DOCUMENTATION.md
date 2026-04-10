# Billing Backend API Documentation

## Overview
Complete billing system backend for the Inventory Management application, with support for orders, invoices, and payment tracking.

---

## Order Endpoints

### 1. Create Order
**POST** `/api/orders`

**Request Body:**
```json
{
  "items": [
    {
      "product": "ObjectId",
      "quantity": 2,
      "unitPrice": 1500,
      "subtotal": 3000
    }
  ],
  "subtotal": 3000,
  "tax": 540,
  "discount": 0,
  "total": 3540,
  "paymentMethod": "online|cash",
  "paymentStatus": "pending|paid",
  "transactionId": "TXN123456789",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "9876543210",
  "notes": "Optional notes"
}
```

**Response:**
```json
{
  "message": "Order created successfully",
  "order": {
    "_id": "ObjectId",
    "orderNumber": "ORD-1712756....",
    "items": [...],
    "status": "pending",
    "paymentStatus": "pending",
    "paidAt": null,
    "invoiceId": "ObjectId"
  },
  "invoice": { ... }
}
```

---

### 2. Get All Orders
**GET** `/api/orders?status=pending&paymentStatus=paid&sortBy=-createdAt&page=1&limit=10`

**Query Parameters:**
- `status` - Filter by order status (pending, processing, completed, cancelled, failed)
- `paymentStatus` - Filter by payment status (pending, paid, failed, refunded)
- `sortBy` - Sort field (default: -createdAt)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Response:**
```json
{
  "message": "Orders retrieved successfully",
  "orders": [...],
  "pagination": {
    "total": 50,
    "page": 1,
    "pages": 5,
    "limit": 10
  }
}
```

---

### 3. Get Order by ID
**GET** `/api/orders/:id`

**Response:**
```json
{
  "message": "Order retrieved successfully",
  "order": { ... }
}
```

---

### 4. Update Order
**PUT** `/api/orders/:id`

**Request Body:**
```json
{
  "status": "processing",
  "paymentStatus": "paid",
  "transactionId": "TXN123456789",
  "notes": "Updated notes",
  "reason": "Payment confirmed"
}
```

**Response:**
```json
{
  "message": "Order updated successfully",
  "order": { ... }
}
```

---

### 5. Delete Order (Cancel)
**DELETE** `/api/orders/:id`

**Response:**
```json
{
  "message": "Order cancelled and deleted successfully",
  "order": { ... }
}
```
**Note:** Only pending or processing orders can be deleted. Stock will be restored.

---

### 6. Get Order Statistics
**GET** `/api/orders/stats/overview?dateFrom=2024-01-01&dateTo=2024-12-31`

**Query Parameters:**
- `dateFrom` - Start date (ISO format)
- `dateTo` - End date (ISO format)

**Response:**
```json
{
  "message": "Order statistics retrieved successfully",
  "stats": {
    "totalOrders": 150,
    "totalRevenue": 450000,
    "paidOrders": 120,
    "pendingOrders": 20,
    "completedOrders": 100,
    "cancelledOrders": 5,
    "averageOrderValue": 3000
  }
}
```

---

## Invoice Endpoints

### 1. Get All Invoices
**GET** `/api/invoices?status=paid&sortBy=-issueDate&page=1&limit=10`

**Query Parameters:**
- `status` - Filter by status (paid, unpaid)
- `sortBy` - Sort field (default: -issueDate)
- `page` - Page number
- `limit` - Items per page

**Response:**
```json
{
  "message": "Invoices retrieved successfully",
  "invoices": [...],
  "pagination": { ... }
}
```

---

### 2. Get Invoice by ID
**GET** `/api/invoices/:id`

**Response:**
```json
{
  "message": "Invoice retrieved successfully",
  "invoice": {
    "_id": "ObjectId",
    "invoiceNumber": "INV-1712756...",
    "order": "ObjectId",
    "amount": 3540,
    "status": "paid",
    "issueDate": "2024-04-10T00:00:00Z",
    "dueDate": "2024-05-10T00:00:00Z",
    "paidDate": "2024-04-12T00:00:00Z"
  }
}
```

---

### 3. Get Invoice by Order ID
**GET** `/api/invoices/order/:orderId`

**Response:** Same as Get Invoice by ID

---

### 4. Update Invoice Status
**PUT** `/api/invoices/:id`

**Request Body:**
```json
{
  "status": "paid",
  "paymentMethod": "online",
  "transactionId": "TXN987654321",
  "notes": "Payment received"
}
```

**Response:**
```json
{
  "message": "Invoice updated successfully",
  "invoice": { ... }
}
```

---

### 5. Get Invoice Statistics
**GET** `/api/invoices/stats/overview?dateFrom=2024-01-01&dateTo=2024-12-31`

**Response:**
```json
{
  "message": "Invoice statistics retrieved successfully",
  "stats": {
    "totalInvoices": 150,
    "totalAmount": 450000,
    "paidInvoices": 120,
    "unpaidInvoices": 30,
    "totalPaid": 360000,
    "totalUnpaid": 90000
  }
}
```

---

### 6. Get Pending Invoices
**GET** `/api/invoices/pending/list?page=1&limit=10`

**Response:**
```json
{
  "message": "Pending invoices retrieved successfully",
  "invoices": [...],
  "totalPending": 30,
  "totalPendingAmount": 90000,
  "pagination": { ... }
}
```

---

### 7. Download Invoice
**GET** `/api/invoices/:id/download`

**Response:**
```json
{
  "message": "Invoice ready for download",
  "invoice": { ... },
  "downloadUrl": "/api/invoices/:id/pdf"
}
```

---

## Model Schemas

### Order Schema
```
{
  company: ObjectId (ref: Company),
  user: ObjectId (ref: User),
  orderNumber: String (unique),
  items: [
    {
      product: ObjectId,
      productName: String,
      productSku: String,
      quantity: Number,
      unitPrice: Number,
      subtotal: Number
    }
  ],
  subtotal: Number,
  tax: Number,
  discount: Number,
  total: Number,
  status: String (enum: pending, processing, completed, cancelled, failed),
  statusHistory: [
    {
      status: String,
      changedAt: Date,
      reason: String
    }
  ],
  paymentMethod: String (enum: online, cash),
  paymentStatus: String (enum: pending, paid, failed, refunded),
  transactionId: String (unique, sparse),
  paidAt: Date,
  customerName: String,
  customerPhone: String,
  customerEmail: String,
  notes: String,
  invoiceId: ObjectId (ref: Invoice),
  stockAdjustments: [
    {
      productId: ObjectId,
      quantity: Number,
      adjustedAt: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### Invoice Schema
```
{
  company: ObjectId (ref: Company),
  user: ObjectId (ref: User),
  invoiceNumber: String (unique),
  order: ObjectId (ref: Order),
  subtotal: Number,
  tax: Number,
  discount: Number,
  amount: Number,
  status: String (enum: paid, unpaid),
  issueDate: Date,
  dueDate: Date,
  paidDate: Date,
  paymentMethod: String (enum: online, cash),
  transactionId: String,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Error Handling

### Common Error Responses

**400 Bad Request**
```json
{
  "message": "Order must have at least one item"
}
```

**403 Forbidden**
```json
{
  "message": "Not authorized to access this order"
}
```

**404 Not Found**
```json
{
  "message": "Order not found"
}
```

**500 Internal Server Error**
```json
{
  "message": "Error creating order",
  "error": "Error details"
}
```

---

## Key Features

1. **Order Management**
   - Create orders with multiple items
   - Automatic stock deduction
   - Order status tracking with history
   - Payment status management
   - Support for cash and online payments

2. **Invoice Management**
   - Automatic invoice generation with orders
   - Payment tracking
   - Due date management
   - Invoice statistics and reporting

3. **Payment Processing**
   - Transaction ID tracking
   - Payment method selection (online/cash)
   - Payment status updates
   - Paid date recording

4. **Stock Management**
   - Automatic stock reduction on order creation
   - Stock restoration on order cancellation
   - Stock adjustment tracking

5. **Authorization**
   - Company-level access control
   - User-based billing data isolation

---

## Frontend Integration Notes

The backend is designed to support the billing page components:
- **CartItems**: Items array in order creation
- **CustomerInfo**: Customer details in order
- **PaymentMethod**: Payment method enum (online/cash)
- **OrderSummary**: Order totals (subtotal, tax, discount, total)
- **PaymentSuccess**: Order confirmation with invoice

---

## Usage Examples

### Create an Order with Cash Payment
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"product": "507f1f77bcf86cd799439011", "quantity": 2, "unitPrice": 1500, "subtotal": 3000}],
    "subtotal": 3000,
    "tax": 540,
    "total": 3540,
    "paymentMethod": "cash",
    "customerName": "John Doe",
    "customerPhone": "9876543210"
  }'
```

### Get All Orders
```bash
curl -X GET "http://localhost:5000/api/orders?status=pending&page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

### Mark Invoice as Paid
```bash
curl -X PUT http://localhost:5000/api/invoices/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "paid",
    "paymentMethod": "online",
    "transactionId": "TXN123456789"
  }'
```

---

## Notes

- All endpoints require authentication (Bearer token)
- Company context is extracted from authenticated user
- Dates are in ISO 8601 format
- Pagination starts from page 1
- Stock adjustments are immutable records for audit purposes
