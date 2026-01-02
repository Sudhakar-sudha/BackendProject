const express = require("express");
const router = express.Router();
const { addToCart, getCart, removeFromCart } = require("../controllers/cartController");

// All routes need user to be logged in
router.post("/", addToCart);
router.get("/", getCart);
router.delete("/:menuItemId", removeFromCart);

module.exports = router;
