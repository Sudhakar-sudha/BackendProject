// routes/reservationRoutes.js
const express = require("express");
const router = express.Router();
const reservationCtrl = require("../controllers/reservationController");

// Middleware for authentication if needed
// const { protect } = require("../middleware/auth");

router.post("/", /*protect,*/ reservationCtrl.createReservation);
router.post("/verify-payment", reservationCtrl.verifyPayment);
router.get("/", reservationCtrl.getAllReservations);
router.get("/:id", reservationCtrl.getReservationById);
router.put("/:id/status", reservationCtrl.updateStatus);

module.exports = router;
