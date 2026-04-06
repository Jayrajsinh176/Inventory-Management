import express from "express";

import { protect } from "../middleware/auth.middleware.js";

import {
    getLowStockAlerts,
} from "../controllers/alert.controller.js";

const router = express.Router();


router.get('/low-stock', protect, getLowStockAlerts);
router.patch('/:id/read', protect, );
router.patch('/:id/acknowledge', protect, );
router.get('/preferences', protect, );
router.put('/preferences', protect, );

export default router;