import Cart from "../models/Cart.js";
import Menu from "../models/MenuItem.js";

// Add item to cart
export const addToCart = async (req, res) => {
    const { menuItemId, quantity, userId } = req.body;

    try {
        let cart = await Cart.findOne({ user: userId });
// console.log(cart);
        if (!cart) {
            // create new cart
            cart = new Cart({ user: userId, items: [{ menuItem: menuItemId, quantity }] });
        } else {
            // check if item exists
            const itemIndex = cart.items.findIndex(
                (item) => item.menuItem.toString() === menuItemId
            );
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ menuItem: menuItemId, quantity });
            }
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Failed to add to cart" });
    }
};

// Get user's cart
export const getCart = async (req, res) => {
    const { userId } = req.query;

    try {
        const cart = await Cart.findOne({ user: userId }).populate("items.menuItem");
        res.status(200).json(cart || { items: [] });
    } catch (err) {
        res.status(500).json({ msg: "Failed to get cart" });
    }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
    const { userId } = req.query;

    const { menuItemId } = req.params;
    try {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ msg: "Cart not found" });

        cart.items = cart.items.filter(
            (item) => item.menuItem.toString() !== menuItemId
        );

        await cart.save();
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ msg: "Failed to remove item" });
    }
};
