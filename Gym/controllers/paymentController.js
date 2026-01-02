import Payment from "../models/Payment.js";

// ✅ Add new payment
export const addPayment = async (req, res) => {
  try {
    const { planId, planName, price } = req.body;
    const screenshot = req.file ? req.file.path : null;

    if (!planId || !planName || !price || !screenshot) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const payment = await Payment.create({
      user_id: req.user.id, // from protect middleware
      plan_id: planId,
      plan_name: planName,
      price,
      screenshot,
    });

    res.status(201).json({
      message: "✅ Payment submitted successfully",
      payment,
    });
  } catch (error) {
    console.error("❌ Error creating payment:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Get all payments (Admin use)
export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .sort({ createdAt: -1 })
      .populate("user_id", "name email");

    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
};
