import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { transferStock } from "../controllers/stockTransfer.controller.js";

const router = express.Router();

// Transfer stock
router.post("/", protect, transferStock);

export default router;