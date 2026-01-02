import express from "express";
import reservationCtrl from "../controllers/reservationController.js";

const router = express.Router();

// Middleware for authentication if needed
// const { protect } = require("../middleware/auth");

router.post("/", /*protect,*/ reservationCtrl.createReservation);
router.post("/verify-payment", reservationCtrl.verifyPayment);
router.get("/", reservationCtrl.getAllReservations);
router.get("/:id", reservationCtrl.getReservationById);
router.put("/:id/status", reservationCtrl.updateStatus);

export default router;
