import express from "express";
import { loginFranchise } from "../controllers/franchiseAuth.controller.js";
import { protectFranchise } from "../middleware/franchiseAuth.js";

const router = express.Router();

// Public
router.post("/login", loginFranchise);

// Protected
router.get("/me", protectFranchise, (req, res) => {
  res.json({
    success: true,
    franchise: req.franchise,
  });
});

export default router;