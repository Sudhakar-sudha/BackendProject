import Order from "../models/Order.js";

/**
 * GET /api/admin/orders
 * Get all orders (with user & menu item info)
 */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")                // include user name/email
      .populate("items.menuItem", "name price");
    res.status(200).json(orders);
  } catch (err) {
    console.error("getAllOrders error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * PUT /api/admin/orders/:id
 * Update order (e.g., status, address)
 */
 export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body; // { status, address, ... }

    const order = await Order.findByIdAndUpdate(id, updates, {
      new: true,
    }).populate("user", "name email")
      .populate("items.menuItem", "name price");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order updated successfully", order });
  } catch (err) {
    console.error("updateOrder error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * DELETE /api/admin/orders/:id
 * Permanently delete an order
 */
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("deleteOrder error:", err);
    res.status(500).json({ message: err.message });
  }
};
