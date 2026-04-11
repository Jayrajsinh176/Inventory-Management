import express from 'express';

const router = express.Router();
import { 
    createVendor,
    getVendors, 
    getVendorById, 
    updateVendor, 
    deleteVendor,
    getVendorProducts,
    getVendorOrders,
    getVendorInvoices,
    getVendorAlerts,
    getVendorStats,
} from '../controllers/vendor.controller.js';
import { protect } from '../middleware/auth.middleware.js';


router.post('/',protect, createVendor);
router.get('/',protect, getVendors);
router.get('/:id',protect, getVendorById);
router.put('/:id',protect, updateVendor);
router.delete('/:id',protect, deleteVendor);
router.get('/:id/products',protect, getVendorProducts);
router.get('/:id/orders',protect, getVendorOrders);
router.get('/:id/invoices',protect, getVendorInvoices);
router.get('/:id/alerts',protect, getVendorAlerts);
router.get('/:id/stats',protect, getVendorStats);

export default router;