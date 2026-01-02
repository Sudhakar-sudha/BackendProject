import express from "express";
import menuCtrl from "../controllers/menuController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/", upload.single("image"), menuCtrl.createMenuItem);
router.get("/", menuCtrl.getMenuItems);       
router.get("/:id", menuCtrl.getMenuItem);         
router.put("/:id", upload.single("image"), menuCtrl.updateMenuItem);
router.delete("/:id", menuCtrl.deleteMenuItem); 

export default router;
