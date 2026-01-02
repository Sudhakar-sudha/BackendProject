import Booking from "../models/Booking.js";
import User from "../models/User.js";

export const createBooking = async (req, res) => {
  try {
    const { trainerId, trainerName, fees, timing, phone } = req.body;

    if (!/^\d{10}$/.test(phone))
      return res.status(400).json({ message: "Invalid phone number" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const booking = await Booking.create({
      userId: user._id,
      username: user.name,
      email: user.email,
      phone,
      trainerId,
      trainerName,
      fees,
      timing,
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: "Booking failed" });
  }
};

export const getUserBookings = async (req, res) => {
  const bookings = await Booking.find({ userId: req.user.id });
  res.json(bookings);
};

export const getBookings = async (req, res) => {
  const bookings = await Booking.find();
  res.json(bookings);
};

export const updateBookingStatus = async (req, res) => {
  const { status } = req.body;

  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  res.json(booking);
};
