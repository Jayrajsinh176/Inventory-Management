import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
    getOrderStats,
} from '../controllers/order.controller.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/stats/overview', protect, getOrderStats);
router.get('/', protect, getOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id', protect, updateOrder);
router.delete('/:id', protect, deleteOrder);
// router.get('/:id/invoice', protect, getInvoiceByOrderId);
export default router;