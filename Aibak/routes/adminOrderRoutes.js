import express from "express";

import {
  getAllOrders,
  updateOrder,
  deleteOrder,
} from "../controllers/adminOrderController.js";

const router = express.Router();

// Optional: add adminAuth middleware later
// import { adminAuth } from "../middleware/auth.js";

router.get("/", /* adminAuth, */ getAllOrders);
router.put("/:id", /* adminAuth, */ updateOrder);
router.delete("/:id", /* adminAuth, */ deleteOrder);

export default router;
