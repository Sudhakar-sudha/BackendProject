const express = require("express");
const router = express.Router();
const {
  getChefs,
  createChef,
  updateChef,
  deleteChef,
} = require("../controllers/chefController");
const upload = require("../middleware/upload");

router.get("/",  getChefs);
router.post("/", upload.single("image"), createChef);
router.put("/:id", upload.single("image"), updateChef);
router.delete("/:id",  deleteChef);

module.exports = router;
