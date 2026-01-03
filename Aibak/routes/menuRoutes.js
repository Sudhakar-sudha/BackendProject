import express from "express";
import {
  createMenuItem,
  getMenuItems,
  getMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../controllers/menuController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/", upload.single("image"), createMenuItem);
router.get("/", getMenuItems);
router.get("/:id", getMenuItem);
router.put("/:id", upload.single("image"), updateMenuItem);
router.delete("/:id", deleteMenuItem);

export default router;
