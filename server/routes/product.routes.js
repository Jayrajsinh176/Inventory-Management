import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
  getLowStock,
  getProductsByCategory,
  getProductStats
} from "../controllers/product.controller.js";
// import { get } from "mongoose";

const router = express.Router();

router.get("/", protect, getProducts);
router.post("/", protect, createProduct);
router.get("/stats", protect, getProductStats);
router.get("/low-stock",protect,getLowStock);
router.get("/by-category/:categoryId",protect,getProductsByCategory);
router.get("/:id", protect, getProductById);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);

export default router;
