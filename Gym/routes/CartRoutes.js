import express from "express";
import { mergeCart, getCart, clearCart } from "../controllers/cartController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/cart/merge
router.post("/merge", protect, mergeCart);

// GET /api/cart
router.get("/", protect, getCart);

// DELETE /api/cart/clear
router.delete("/clear", protect, clearCart);

export default router;
