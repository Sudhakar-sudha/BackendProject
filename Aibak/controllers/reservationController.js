import mongoose from "mongoose";
import crypto from "crypto";
import Razorpay from "razorpay";

import Reservation from "../models/Reservation.js";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// --- Helper: compute charges ---
function calculateCharges({ seats, hours, type }) {
  const seatCharge = seats * 100;
  const acCharge = type === "AC" ? seats * hours * 20 : 0;
  const total = seatCharge + acCharge;
  const advance = Math.ceil(total / 2);
  return { seatCharge, acCharge, total, advance };
}

// --- Helper: schedule reminder for Cash on Arrival ---
function scheduleCashReminder(reservation) {
  const [hour, minute] = reservation.time.split(":").map(Number);
  const visitDate = new Date(`${reservation.date}T${hour.toString().padStart(2,"0")}:${minute.toString().padStart(2,"0")}:00`);
  const reminderTime = new Date(visitDate.getTime() - 60 * 60 * 1000); // 1 hour before

  const delay = reminderTime.getTime() - Date.now();
  if (delay <= 0) return; // too late

  setTimeout(async () => {
    try {
      // 👉 Replace with actual SMS/Email/Push notification logic
      // console.log(`Reminder: Reservation ${reservation._id} scheduled in 1 hour`);

      await Reservation.findByIdAndUpdate(reservation._id, { reminderSent: true });

      // Optional: Auto-cancel if needed (for example if customer doesn't confirm)
      // await Reservation.findByIdAndUpdate(reservation._id, { status: "cancelled" });
    } catch (err) {
      console.error("Error sending reminder:", err);
    }
  }, delay);
}

// --- Create Reservation & handle payment type ---
export const createReservation = async (req, res) => {
  try {
    const { date, time, hours, seats, type, note, payment , user } = req.body;
    if (!date || !time || !hours || !seats) {
      return res.status(400).json({ msg: "Missing required fields." });
    }

    const { seatCharge, acCharge, total, advance } = calculateCharges({
      seats: Number(seats),
      hours: Number(hours),
      type,
    });

    const reservation = new Reservation({
      user: new mongoose.Types.ObjectId(req.body.user),
      date,
      time,
      hours,
      seats,
      type,
      note,
      payment,
      seatCharge,
      acCharge,
      total,
      advance,
      status: "pending",
    });
    // console.log(reservation);
    if (payment === "Cash on arrival") {
      await reservation.save();
      scheduleCashReminder(reservation);
      return res.status(201).json({ msg: "Reservation created with Cash on arrival", reservation });
    }

    // Online payment -> create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: advance * 100, // in paise
      currency: "INR",
      receipt: `res_${Date.now()}`,
      payment_capture: 1,
    });

    reservation.razorpay_order_id = razorpayOrder.id;
    await reservation.save();

    res.status(201).json({
      msg: "Reservation created, proceed to pay advance",
      reservation,
      razorpayKey: process.env.RAZORPAY_KEY_ID,
      order: razorpayOrder,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// --- Verify Razorpay payment and mark as confirmed ---
export const verifyPayment = async (req, res) => {
  try {
    const { reservationId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    const reservation = await Reservation.findById(reservationId);
    if (!reservation) return res.status(404).json({ msg: "Reservation not found" });

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ msg: "Payment verification failed" });
    }

    reservation.razorpay_payment_id = razorpay_payment_id;
    reservation.razorpay_signature = razorpay_signature;
    reservation.paymentStatus = "Completed";
    reservation.status = "confirmed";
    await reservation.save();

    res.json({ msg: "Payment verified and reservation confirmed", reservation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// --- Admin or user can view reservations ---
export const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
      // console.log(reservations);
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

export const getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.find({user:req.params.id}).populate("user", "name email");
    if (!reservation) return res.status(404).json({ msg: "Not found" });
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ msg: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
