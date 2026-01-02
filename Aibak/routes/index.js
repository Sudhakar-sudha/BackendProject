import express from "express";
import menuRoutes from "./menuRoutes.js";
import authRoutes from "./authRoutes.js";
import chefRoutes from "./chefRoutes.js";
import cartRoutes from "./cartRoutes.js";
import orderRoutes from "./orderRoutes.js";
import adminOrderRoutes from "./adminOrderRoutes.js";
import reservationRoutes from "./reservationRoutes.js";

const router = express.Router();

// routes
router.use('/api/auth', authRoutes);
router.use('/api/menu', menuRoutes);
router.use('/api/chefs', chefRoutes);
router.use('/api/cart', cartRoutes);
router.use('/api/cart/order', orderRoutes);
router.use('/api/admin/orders', adminOrderRoutes);
router.use('/api/reservations', reservationRoutes);

export default router;