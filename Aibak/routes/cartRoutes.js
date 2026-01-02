import express from "express";
import { addToCart, getCart, removeFromCart } from "../controllers/cartController.js";

const router = express.Router();

// All routes need user to be logged in
router.post("/", addToCart);
router.get("/", getCart);
router.delete("/:menuItemId", removeFromCart);

export default router;