import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
  const { items, phone } = req.body;

  if (!items || !items.length)
    return res.status(400).json({ error: "Cart empty" });

  const order = await Order.create({
    userId: req.user.id,
    items,
    address: phone,
  });

  res.json(order);
};

export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user.id });
  res.json(orders);
};

export const getAllOrders = async (req, res) => {
  const orders = await Order.find().populate("userId", "name email");
  res.json(orders);
};

export const updateOrderStatus = async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );

  res.json(order);
};
