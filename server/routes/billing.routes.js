import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
    getProducts,
    searchProducts,
    completeBilling,
    getBillingSummary
} from '../controllers/billing.controller.js';

const router = express.Router();

// Get all products with available stock
router.get('/products', protect, getProducts);

// Search products for billing
router.get('/search', protect, searchProducts);

// Get billing summary (revenue, orders, etc.)
router.get('/summary', protect, getBillingSummary);

// Complete billing/create order
router.post('/complete', protect, completeBilling);

export default router;