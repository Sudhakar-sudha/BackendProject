const express = require("express");
const router = express.Router();
const menuCtrl = require("../controllers/menuController");
const upload = require("../middleware/upload");

router.post("/", upload.single("image"), menuCtrl.createMenuItem);
router.get("/", menuCtrl.getMenuItems);       
router.get("/:id", menuCtrl.getMenuItem);         
router.put("/:id", upload.single("image"), menuCtrl.updateMenuItem);
router.delete("/:id", menuCtrl.deleteMenuItem); 

module.exports = router;
