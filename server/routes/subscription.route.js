import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
    getSubscriptionPlans,
    subscribeToPlan,
    getCurrentSubscription,
    cancelSubscription
} from '../controllers/subscription.controller.js';

const router = express.Router();

router.get('/plans',protect, getSubscriptionPlans);
router.post('/subscribe',protect,subscribeToPlan);
router.get('/current',protect,getCurrentSubscription);
router.post('/cancel',protect,cancelSubscription);

export default router;