import express from "express";
import adminOrderController from "../controllers/adminOrderController.js";

const router = express.Router();

// Optional: add an adminAuth middleware if you have admin authentication
// const { adminAuth } = require("../middleware/auth");

router.get("/",    /* adminAuth, */ adminOrderController.getAllOrders);
router.put("/:id", /* adminAuth, */ adminOrderController.updateOrder);
router.delete("/:id", /* adminAuth, */ adminOrderController.deleteOrder);

export default router;