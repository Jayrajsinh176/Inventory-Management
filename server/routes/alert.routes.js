import express from "express";

import { protect } from "../middleware/auth.middleware.js";

import {
    getLowStockAlerts,
} from "../controllers/alert.controller.js";

const router = express.Router();

router.get("/low-stock", protect , getLowStockAlerts);


export default router;