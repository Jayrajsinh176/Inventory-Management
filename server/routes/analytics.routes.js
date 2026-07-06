import express from "express";
import { protect } from "../middleware/auth.middleware.js";

import {
  getStockMovementAnalysis,
  getCategoryPerformanceAnalysis,
  getReorderPatternsAnalysis,
  getBusinessOverview,
} from "../controllers/analytics.controller.js";

const router = express.Router();

router.get(
  "/stock-movement",
  protect,
  getStockMovementAnalysis
);

router.get(
  "/category-performance",
  protect,
  getCategoryPerformanceAnalysis
);

router.get(
  "/reorder-patterns",
  protect,
  getReorderPatternsAnalysis
);

router.get(
  "/business-overview",
  protect,
  getBusinessOverview
);



export default router;