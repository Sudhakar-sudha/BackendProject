import express from "express";
import {
  getChefs,
  createChef,
  updateChef,
  deleteChef,
} from "../controllers/chefController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/",  getChefs);
router.post("/", upload.single("image"), createChef);
router.put("/:id", upload.single("image"), updateChef);
router.delete("/:id",  deleteChef);

export default router;
