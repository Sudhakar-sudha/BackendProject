import Cart from "../models/Cart.js";

export const mergeCart = async (req, res) => {
  const { items } = req.body;

  for (const item of items) {
    const existing = await Cart.findOne({
      userId: req.user.id,
      productId: item.id,
    });

    if (existing) {
      existing.qty += item.qty;
      await existing.save();
    } else {
      await Cart.create({
        userId: req.user.id,
        productId: item.id,
        qty: item.qty,
        price: item.price,
        productname: item.productname,
        image: item.image,
      });
    }
  }

  const cart = await Cart.find({ userId: req.user.id });
  res.json(cart);
};

export const getCart = async (req, res) => {
  const cart = await Cart.find({ userId: req.user.id });
  res.json(cart);
};

export const clearCart = async (req, res) => {
  await Cart.deleteMany({ userId: req.user.id });
  res.json({ message: "Cart cleared" });
};
