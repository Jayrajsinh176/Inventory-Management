import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
    companyProfile,
    updateCompanyProfile,
    getCompanySubscription,
    updateCompanySubscription,
    cancelCompanySubscription,
    getCompanyBillingHistory,
    getInvoiceDetails
} from '../controllers/company.controller.js';


const router = express.Router();

router.get('/',protect , companyProfile);
router.put('/', protect, updateCompanyProfile);
router.get('/subscription', protect, getCompanySubscription);
router.patch('/subscription', protect, updateCompanySubscription);
router.post('/subscription/cancel', protect, cancelCompanySubscription);
router.get('/billing-history',protect, getCompanyBillingHistory);
router.get('/billing-history/invoice/:id', protect, getInvoiceDetails);
export default router;  