# Backend Improvement Guide

A comprehensive guide to improving the Inventory Management backend from its current state to production-ready quality.

## Table of Contents

1. [Current State Assessment](#current-state-assessment)
2. [Critical Bug Fixes](#critical-bug-fixes)
3. [Security Hardening](#security-hardening)
4. [Architecture Improvements](#architecture-improvements)
5. [Code Quality Standards](#code-quality-standards)
6. [Testing Strategy](#testing-strategy)
7. [Documentation](#documentation)
8. [Performance Optimization](#performance-optimization)
9. [Deployment Checklist](#deployment-checklist)

---

## Current State Assessment

### Scores

| Category | Current | Target | Gap |
|----------|---------|--------|-----|
| Architecture | 7/10 | 9/10 | Need centralized error handling, validation layer |
| Security | 4/10 | 9/10 | Missing rate limiting, helmet, CORS config |
| Code Quality | 5/10 | 9/10 | 6 critical bugs, inconsistent patterns |
| Completeness | 6/10 | 9/10 | No tests, incomplete docs |

### What's Working Well

- ✅ Clean MVC folder structure
- ✅ Multi-tenant company scoping
- ✅ Password hashing with bcrypt pre-save hook
- ✅ JWT authentication middleware
- ✅ Subscription plan system with limits
- ✅ Compound unique indexes (company + sku, company + name)
- ✅ Trial period auto-calculation

---

## Critical Bug Fixes

### Bug 1: Variable Reassignment Error

**File:** `controllers/users.controller.js` (lines 162-166)

**Problem:** Destructuring with `const` then trying to reassign values causes runtime crash.

**Current Code:**
```javascript
const {name,email,phone,role} = req.body;
name = name?.trim();  // ❌ TypeError: Assignment to constant variable
email = email?.trim().toLowerCase();
phone = phone?.trim();
role = role?.trim().toLowerCase();
```

**Fixed Code:**
```javascript
let { name, email, phone, role } = req.body;
name = name?.trim();
email = email?.trim().toLowerCase();
phone = phone?.trim();
role = role?.trim().toLowerCase();
```

---

### Bug 2: Broken Regex Escaping

**File:** `controllers/product.controller.js` (lines 13-16)

**Problem:** Function doesn't return anything, causing search to use empty/undefined regex.

**Current Code:**
```javascript
const escapeRegex = (value) => {
  if (typeof value !== "string") return "";
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");  // ❌ No return
}
```

**Fixed Code:**
```javascript
const escapeRegex = (value) => {
  if (typeof value !== "string") return "";
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};
```

---

### Bug 3: Wrong Parameter Type in Subscription Check

**File:** `controllers/users.controller.js` (line 78)

**Problem:** `canAddUsersToPlan()` expects a plan name string, but receives the full company object.

**Current Code:**
```javascript
const companyDetails = await Company.findById(req.user.company).select("plan");
if(canAddUsersToPlan(companyDetails, users.length)){  // ❌ Wrong type
```

**Fixed Code:**
```javascript
const companyDetails = await Company.findById(req.user.company).select("plan");
if (canAddUsersToPlan(companyDetails.plan, users.length)) {  // ✅ Pass plan string
```

---

### Bug 4: Incorrect Object Path in Error Message

**File:** `controllers/users.controller.js` (line 139)

**Problem:** `req.user.company` is an ObjectId string, not a populated object with `.plan` property.

**Current Code:**
```javascript
message: `You have reached the limit of ${formatPlanUsersLimit(req.user.company.plan)} users.`
// ❌ req.user.company is "67f10d89..." not { plan: "pro", ... }
```

**Fixed Code:**
```javascript
message: `You have reached the limit of ${formatPlanUsersLimit(companyDetails.plan)} users.`
```

---

### Bug 5: Missing Company Population on Login

**File:** `controllers/auth.controller.js` (line 194)

**Problem:** `buildCompanyResponse()` receives an ObjectId instead of populated company document.

**Current Code:**
```javascript
return res.status(200).json({
  message: "Login successful",
  user: buildUserResponse(user),
  token: generateToken(user),
  company: buildCompanyResponse(user.company),  // ❌ user.company is ObjectId
});
```

**Fixed Code:**
```javascript
const user = await User.findOne(query).select("+password").populate("company");

// ... password validation ...

return res.status(200).json({
  message: "Login successful",
  user: buildUserResponse(user),
  token: generateToken(user),
  company: buildCompanyResponse(user.company),  // ✅ Now populated
});
```

---

### Bug 6: Incomplete Plan Controller

**File:** `controllers/plan.controller.js`

**Problem:** File contains only `import subscription` - incomplete syntax.

**Fixed Code:**
```javascript
import { SUBSCRIPTION_PLANS } from "../utils/subscription.js";

/**
 * @description Get all subscription plan details
 * @route GET /api/company/plan
 * @access Public
 */
export const planDetails = async (req, res) => {
  try {
    const plans = Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => ({
      id: key,
      label: plan.label,
      maxProducts: Number.isFinite(plan.maxProducts) ? plan.maxProducts : "unlimited",
      maxUsers: Number.isFinite(plan.maxUsers) ? plan.maxUsers : "unlimited",
      features: plan.features,
    }));

    return res.status(200).json({
      success: true,
      message: "Plans fetched successfully",
      data: plans,
    });
  } catch (error) {
    console.error("Plan error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
```

---

### Bug 7: Redundant Save After Create

**File:** `controllers/users.controller.js` (line 130)

**Problem:** `Model.create()` already saves to database. Calling `.save()` again is unnecessary.

**Current Code:**
```javascript
const user = await User.create({
  company: req.user.company,
  name,
  email,
  phone,
  password: generatePassword(),
  role
});

user.save();  // ❌ Redundant
```

**Fixed Code:**
```javascript
const user = await User.create({
  company: req.user.company,
  name,
  email,
  phone,
  password: generatePassword(),
  role
});

// Remove user.save() - create() already persists the document
```

---

## Security Hardening

### 1. Environment Variable Validation

**Create:** `config/validateEnv.js`

```javascript
const requiredEnvVars = [
  'MONGO_URI',
  'JWT_SECRET',
  'PORT'
];

const validateEnv = () => {
  const missing = requiredEnvVars.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  if (process.env.JWT_SECRET.length < 32) {
    console.error('❌ JWT_SECRET must be at least 32 characters long');
    process.exit(1);
  }

  console.log('✅ Environment variables validated');
};

export default validateEnv;
```

### 2. Security Middleware Setup

**Update:** `index.js`

```javascript
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import connectDb from './config/db.js';
import validateEnv from './config/validateEnv.js';

import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import categoryRoutes from './routes/category.routes.js';
import usersRoutes from './routes/users.routes.js';
import planRoutes from './routes/plan.routes.js';

import { errorHandler } from './middleware/error.middleware.js';

// Validate environment before starting
validateEnv();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
}));

// Request logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per window
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again in 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: {
    success: false,
    message: 'Too many requests. Please slow down.',
  },
});

const PORT = process.env.PORT || 5000;

// Connect to database
connectDb();

// Apply rate limiters
app.use('/api/auth', authLimiter);
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/company/plan', planRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Global error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
```

### 3. Install Required Packages

```bash
npm install express-rate-limit
```

### 4. Strong JWT Secret

**Update:** `.env`

```env
# Generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your_64_character_or_longer_random_string_here

# Add these new variables
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
JWT_EXPIRES_IN=7d
```

### 5. NoSQL Injection Prevention

**Create:** `middleware/sanitize.middleware.js`

```javascript
/**
 * Recursively sanitizes objects to prevent NoSQL injection
 * Removes keys starting with $ or containing .
 */
const sanitizeObject = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    // Skip keys that could be MongoDB operators
    if (key.startsWith('$') || key.includes('.')) {
      continue;
    }
    sanitized[key] = sanitizeObject(value);
  }
  return sanitized;
};

export const sanitize = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }
  next();
};
```

Add to `index.js` after body parsing:
```javascript
import { sanitize } from './middleware/sanitize.middleware.js';
app.use(sanitize);
```

---

## Architecture Improvements

### 1. Centralized Error Handling

**Create:** `middleware/error.middleware.js`

```javascript
/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(message, statusCode = 500, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Async handler wrapper to catch errors
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Global error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errors = err.errors || [];

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errors = Object.values(err.errors).map((e) => e.message);
    message = errors[0] || 'Validation failed';
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0];
    message = field ? `${field} already exists` : 'Duplicate entry';
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', {
      message: err.message,
      stack: err.stack,
      statusCode,
    });
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors.length > 0 && { errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
```

### 2. Standardized Response Helpers

**Create:** `utils/response.js`

```javascript
/**
 * Standardized success response
 */
export const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  const response = {
    success: true,
    message,
  };

  // Handle different data types
  if (Array.isArray(data)) {
    response.count = data.length;
    response.data = data;
  } else if (data !== null && data !== undefined) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

/**
 * Standardized error response
 */
export const errorResponse = (res, message = 'Error', statusCode = 400, errors = []) => {
  const response = {
    success: false,
    message,
  };

  if (errors.length > 0) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

/**
 * Paginated response helper
 */
export const paginatedResponse = (res, data, pagination, message = 'Success') => {
  return res.status(200).json({
    success: true,
    message,
    count: data.length,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: Math.ceil(pagination.total / pagination.limit),
      hasMore: pagination.page * pagination.limit < pagination.total,
    },
    data,
  });
};
```

### 3. Request Validation Layer

**Create:** `validators/auth.validator.js`

```javascript
import { body, validationResult } from 'express-validator';

/**
 * Validation middleware that checks for errors
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array().map((e) => e.msg),
    });
  }
  next();
};

/**
 * Registration validation rules
 */
export const registerValidation = [
  body('company_name')
    .trim()
    .notEmpty().withMessage('Company name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Company name must be 2-100 characters'),
  
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone is required')
    .matches(/^[6-9]\d{9}$/).withMessage('Please provide a valid 10-digit Indian phone number'),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  
  body('address')
    .trim()
    .notEmpty().withMessage('Address is required')
    .isLength({ max: 500 }).withMessage('Address cannot exceed 500 characters'),
  
  validate,
];

/**
 * Login validation rules
 */
export const loginValidation = [
  body()
    .custom((value, { req }) => {
      if (!req.body.email && !req.body.phone) {
        throw new Error('Email or phone is required');
      }
      return true;
    }),
  
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('phone')
    .optional()
    .trim()
    .matches(/^[6-9]\d{9}$/).withMessage('Please provide a valid phone number'),
  
  body('password')
    .notEmpty().withMessage('Password is required'),
  
  validate,
];
```

**Create:** `validators/product.validator.js`

```javascript
import { body, param, query } from 'express-validator';
import mongoose from 'mongoose';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array().map((e) => e.msg),
    });
  }
  next();
};

/**
 * ObjectId param validation
 */
export const validateObjectId = (paramName = 'id') => [
  param(paramName)
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage(`Invalid ${paramName}`),
  validate,
];

/**
 * Product creation validation
 */
export const createProductValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ max: 200 }).withMessage('Name cannot exceed 200 characters'),
  
  body('sku')
    .trim()
    .notEmpty().withMessage('SKU is required')
    .toUpperCase(),
  
  body('category')
    .notEmpty().withMessage('Category is required')
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Invalid category ID'),
  
  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  
  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  
  validate,
];

/**
 * Product update validation
 */
export const updateProductValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Name cannot be empty')
    .isLength({ max: 200 }).withMessage('Name cannot exceed 200 characters'),
  
  body('sku')
    .optional()
    .trim()
    .notEmpty().withMessage('SKU cannot be empty')
    .toUpperCase(),
  
  body('category')
    .optional()
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Invalid category ID'),
  
  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  
  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  
  validate,
];

/**
 * Product list query validation
 */
export const listProductsValidation = [
  query('page')
    .optional()
    .isInt({ min: 0 }).withMessage('Page must be a non-negative integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  
  query('category')
    .optional()
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Invalid category ID'),
  
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Search query too long'),
  
  validate,
];
```

**Update routes to use validators:**

```javascript
// routes/auth.routes.js
import express from 'express';
import { registerUser, loginUser } from '../controllers/auth.controller.js';
import { registerValidation, loginValidation } from '../validators/auth.validator.js';

const router = express.Router();

router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);

export default router;
```

---

## Code Quality Standards

### 1. Consistent Response Format

All API responses should follow this structure:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "count": 10,
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasMore": true
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error 1", "Detailed error 2"]
}
```

### 2. Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files | lowercase with dots | `auth.controller.js` |
| Functions | camelCase | `getUserById` |
| Classes | PascalCase | `ApiError` |
| Constants | UPPER_SNAKE_CASE | `MAX_LOGIN_ATTEMPTS` |
| Database fields | snake_case | `created_at` |

### 3. Controller Structure Template

```javascript
import { asyncHandler } from '../middleware/error.middleware.js';
import { successResponse, errorResponse } from '../utils/response.js';
import Model from '../models/model.js';

/**
 * @description Brief description
 * @route METHOD /api/resource
 * @access Public/Protected
 */
export const controllerFunction = asyncHandler(async (req, res) => {
  // 1. Extract and validate input
  const { field } = req.body;

  // 2. Business logic
  const result = await Model.find({ company: req.user.company });

  // 3. Return standardized response
  return successResponse(res, result, 'Operation successful');
});
```

### 4. Error Handling Best Practices

```javascript
// DO: Use asyncHandler wrapper
export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new ApiError('Product not found', 404);
  }
  return successResponse(res, product);
});

// DON'T: Manual try-catch in every function
export const getProduct = async (req, res) => {
  try {
    // ...
  } catch (error) {
    // Repetitive error handling
  }
};
```

---

## Testing Strategy

### 1. Test Structure

```
server/
├── __tests__/
│   ├── setup.js              # Test configuration
│   ├── fixtures/             # Test data
│   │   ├── users.js
│   │   └── products.js
│   ├── unit/                 # Unit tests
│   │   ├── utils.test.js
│   │   └── validators.test.js
│   └── integration/          # API tests
│       ├── auth.test.js
│       ├── products.test.js
│       └── categories.test.js
```

### 2. Test Setup

**Install test dependencies:**
```bash
npm install -D jest supertest mongodb-memory-server
```

**Update:** `package.json`
```json
{
  "scripts": {
    "test": "NODE_OPTIONS='--experimental-vm-modules' jest",
    "test:watch": "npm test -- --watch",
    "test:coverage": "npm test -- --coverage"
  },
  "jest": {
    "testEnvironment": "node",
    "setupFilesAfterEnv": ["./__tests__/setup.js"],
    "testMatch": ["**/__tests__/**/*.test.js"],
    "collectCoverageFrom": [
      "controllers/**/*.js",
      "middleware/**/*.js",
      "utils/**/*.js"
    ]
  }
}
```

**Create:** `__tests__/setup.js`

```javascript
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});
```

### 3. Example Test Files

**Create:** `__tests__/integration/auth.test.js`

```javascript
import request from 'supertest';
import app from '../../index.js';
import User from '../../models/users.model.js';
import Company from '../../models/company.model.js';

describe('Auth Endpoints', () => {
  describe('POST /api/auth/register', () => {
    const validUser = {
      company_name: 'Test Company',
      name: 'Test User',
      email: 'test@example.com',
      phone: '9876543210',
      password: 'password123',
      address: '123 Test Street',
    };

    it('should register a new user and company', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(validUser);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.user.email).toBe(validUser.email);
      expect(res.body.token).toBeDefined();
      expect(res.body.company).toBeDefined();
    });

    it('should reject duplicate email', async () => {
      await request(app).post('/api/auth/register').send(validUser);
      
      const res = await request(app)
        .post('/api/auth/register')
        .send(validUser);

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('exists');
    });

    it('should reject weak password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ ...validUser, password: '123' });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send({
        company_name: 'Test Company',
        name: 'Test User',
        email: 'test@example.com',
        phone: '9876543210',
        password: 'password123',
        address: '123 Test Street',
      });
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
    });

    it('should reject invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'wrongpassword' });

      expect(res.status).toBe(401);
    });
  });
});
```

**Create:** `__tests__/integration/products.test.js`

```javascript
import request from 'supertest';
import app from '../../index.js';

describe('Product Endpoints', () => {
  let authToken;
  let categoryId;

  beforeEach(async () => {
    // Register and login
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        company_name: 'Test Company',
        name: 'Test User',
        email: 'test@example.com',
        phone: '9876543210',
        password: 'password123',
        address: '123 Test Street',
      });
    
    authToken = registerRes.body.token;

    // Create a category
    const categoryRes = await request(app)
      .post('/api/category')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'Electronics' });
    
    categoryId = categoryRes.body.data._id;
  });

  describe('POST /api/products', () => {
    it('should create a product', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Product',
          sku: 'TEST-001',
          category: categoryId,
          price: 99.99,
          stock: 10,
        });

      expect(res.status).toBe(201);
      expect(res.body.product.name).toBe('Test Product');
    });

    it('should reject unauthenticated requests', async () => {
      const res = await request(app)
        .post('/api/products')
        .send({
          name: 'Test Product',
          sku: 'TEST-001',
          category: categoryId,
          price: 99.99,
        });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/products', () => {
    it('should list products for the company', async () => {
      // Create a product first
      await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Product',
          sku: 'TEST-001',
          category: categoryId,
          price: 99.99,
        });

      const res = await request(app)
        .get('/api/products')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.products.length).toBe(1);
    });
  });
});
```

---

## Documentation

### 1. API Documentation with Swagger

**Install:**
```bash
npm install swagger-jsdoc swagger-ui-express
```

**Create:** `config/swagger.js`

```javascript
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Inventory Management API',
      version: '1.0.0',
      description: 'API documentation for Inventory Management System',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js', './controllers/*.js'],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
```

**Add to index.js:**
```javascript
import { setupSwagger } from './config/swagger.js';

// After route setup
setupSwagger(app);
```

### 2. JSDoc Comments for Controllers

```javascript
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user and company
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - company_name
 *               - name
 *               - email
 *               - phone
 *               - password
 *               - address
 *             properties:
 *               company_name:
 *                 type: string
 *                 example: "Acme Inc"
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@acme.com"
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "securepassword"
 *               address:
 *                 type: string
 *                 example: "123 Main St"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error or duplicate entry
 */
export const registerUser = asyncHandler(async (req, res) => {
  // ... implementation
});
```

---

## Performance Optimization

### 1. Database Indexes

Add these indexes for better query performance:

```javascript
// models/product.model.js
productSchema.index({ company: 1, createdAt: -1 });  // List products sorted by date
productSchema.index({ company: 1, name: 'text', sku: 'text' });  // Text search

// models/category.model.js
categorySchema.index({ company: 1, createdAt: -1 });

// models/users.model.js
userSchema.index({ company: 1, createdAt: -1 });
```

### 2. Pagination for All List Endpoints

```javascript
export const getProducts = asyncHandler(async (req, res) => {
  const page = Math.max(0, parseInt(req.query.page) || 0);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
  
  const query = { company: req.user.company };
  
  const [products, total] = await Promise.all([
    Product.find(query)
      .skip(page * limit)
      .limit(limit)
      .lean(),
    Product.countDocuments(query),
  ]);

  return paginatedResponse(res, products, { page, limit, total });
});
```

### 3. Selective Field Projection

```javascript
// Only select fields that are needed
const users = await User.find({ company: companyId })
  .select('name email role createdAt')
  .lean();
```

### 4. Connection Pooling

**Update:** `config/db.js`

```javascript
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};
```

---

## Deployment Checklist

### Pre-Deployment

- [ ] All critical bugs fixed
- [ ] Environment variables configured (not in code)
- [ ] JWT_SECRET is strong (32+ characters)
- [ ] Rate limiting enabled
- [ ] CORS configured for production origins
- [ ] Helmet enabled
- [ ] All console.log statements removed or converted to proper logging
- [ ] Tests passing
- [ ] API documentation updated

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/inventory_prod
JWT_SECRET=<64-character-random-string>
JWT_EXPIRES_IN=7d
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Security Headers (via Helmet)

Verify these headers are set:
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security (if using HTTPS)

### Monitoring

Consider adding:
- Health check endpoint: `GET /health`
- Request logging with correlation IDs
- Error tracking (Sentry, LogRocket)
- APM (Application Performance Monitoring)

---

## Implementation Order

### Phase 1: Bug Fixes (Day 1)
1. Fix all 7 critical bugs
2. Test each fix manually

### Phase 2: Security (Day 2)
1. Add environment validation
2. Configure helmet, CORS, rate limiting
3. Update .env with strong secrets

### Phase 3: Architecture (Day 3-4)
1. Add centralized error middleware
2. Add response helpers
3. Add validation layer
4. Refactor controllers to use new patterns

### Phase 4: Testing (Day 5-6)
1. Set up test infrastructure
2. Write auth tests
3. Write product/category tests
4. Achieve 70%+ coverage

### Phase 5: Documentation (Day 7)
1. Add Swagger documentation
2. Update README
3. Create Postman collection

---

## Quick Reference

### File Changes Summary

| File | Action | Priority |
|------|--------|----------|
| `controllers/users.controller.js` | Fix bugs (lines 78, 130, 139, 162-166) | Critical |
| `controllers/product.controller.js` | Fix escapeRegex (line 13-16) | Critical |
| `controllers/auth.controller.js` | Add company population (line 178) | Critical |
| `controllers/plan.controller.js` | Complete implementation | Critical |
| `index.js` | Add security middleware | High |
| `config/validateEnv.js` | Create new file | High |
| `middleware/error.middleware.js` | Create new file | High |
| `utils/response.js` | Create new file | Medium |
| `validators/*.js` | Create new files | Medium |
| `__tests__/**` | Create test files | Medium |

---

## Resources

- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Mongoose Performance](https://mongoosejs.com/docs/performance.html)
- [OWASP Node.js Security](https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Swagger/OpenAPI](https://swagger.io/docs/specification/about/)
