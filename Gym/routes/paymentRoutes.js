import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import  upload  from "../middleware/upload.js";
import { addPayment, getPayments } from "../controllers/paymentController.js";

const router = express.Router();

// ✅ Create payment
router.post("/", protect, upload.single("screenshot"), addPayment);

// ✅ Get all payments (admin only if needed)
router.get("/", protect, getPayments);

export default router;
