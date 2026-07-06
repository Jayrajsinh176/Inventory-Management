import express from "express";
import {
  createFranchise,
  getFranchises,
  getFranchiseById,
  updateFranchise,
  toggleFranchiseStatus,
  getFranchiseLocations,
} from "../controllers/franchise.controller.js";
import { protect } from "../middleware/auth.middleware.js"; // Use your existing auth middleware

const router = express.Router();

router.post("/", protect, createFranchise);
router.get("/", protect, getFranchises);
router.get("/locations", protect, getFranchiseLocations);
router.get("/:id", protect, getFranchiseById);
router.put("/:id", protect, updateFranchise);
router.patch("/:id/status", protect, toggleFranchiseStatus);


export default router;