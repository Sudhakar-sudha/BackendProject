const express = require("express");
const router = express.Router();
const adminOrderController = require("../controllers/adminOrderController");

// Optional: add an adminAuth middleware if you have admin authentication
// const { adminAuth } = require("../middleware/auth");

router.get("/",    /* adminAuth, */ adminOrderController.getAllOrders);
router.put("/:id", /* adminAuth, */ adminOrderController.updateOrder);
router.delete("/:id", /* adminAuth, */ adminOrderController.deleteOrder);

module.exports = router;
