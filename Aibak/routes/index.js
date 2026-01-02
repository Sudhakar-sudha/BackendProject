const express = require("express");
const router = express.Router();

const menuRoutes = require("./menuRoutes");
const authRoutes = require("./authRoutes");
const chefRoutes = require("./chefRoutes");
const cartRoutes = require("./cartRoutes");
const orderRoutes = require("./orderRoutes");
const adminOrderRoutes = require("./adminOrderRoutes");
const reservationRoutes = require("./reservationRoutes");

// routes
router.use('/api/auth', authRoutes);
router.use('/api/menu', menuRoutes);
router.use('/api/chefs', chefRoutes);
router.use('/api/cart', cartRoutes);
router.use('/api/cart/order', orderRoutes);
router.use('/api/admin/orders', adminOrderRoutes);
router.use('/api/reservations', reservationRoutes);

module.exports = router;  // ✅ VERY IMPORTANT
