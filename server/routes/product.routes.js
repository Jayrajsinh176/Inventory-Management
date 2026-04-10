import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
  getProductsByVendor,
  getProductStats,
  getStockMovementAnalysis,
  getCategoryPerformanceAnalysis,
  getReorderPatternsAnalysis,
  getLowStock,
  getProductsByCategory,
} from "../controllers/product.controller.js";


const router = express.Router();

router.get("/", protect, getProducts);
router.post("/", protect, createProduct);
router.get("/stats", protect, getProductStats);
router.get("/analytics/stock-movement", protect, getStockMovementAnalysis);
router.get("/analytics/category-performance", protect, getCategoryPerformanceAnalysis);
router.get("/analytics/reorder-patterns", protect, getReorderPatternsAnalysis);
router.get("/low-stock", protect, getLowStock);
router.get("/by-category/:categoryId", protect, getProductsByCategory);
router.get("/:id", protect, getProductById);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);
router.get("/vendor/:vendorName", protect, getProductsByVendor);
export default router;
