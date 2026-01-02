import express from 'express';
import { body } from 'express-validator';
import authController from '../controllers/authController.js';

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('username').trim().notEmpty().withMessage('Username is required').isLength({ min: 3 }),
    body('email').isEmail().withMessage('Valid email required'),
    body('phone').trim().notEmpty().withMessage('Phone is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
    body('address').optional().trim(),
  ],
  authController.register
);

router.post('/send-otp', authController.sendOtp);
router.post('/resend-otp', authController.resendOtp);
router.post('/verify-otp', authController.verifyOtp);
router.post("/login", authController.login);
router.get("/", authController.getAllUsers);
router.delete("/:id", authController.deleteUser);
router.put("/:id",  authController.updateUser);
router.get("/:id", authController.getUserById);

export default router;

