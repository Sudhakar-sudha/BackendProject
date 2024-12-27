const express = require("express");
const { formdata , getFormData } = require("../controllers/formdataControllers");

const router = express.Router();
router.post("/api/formdata", formdata);


router.get("/formdata", getFormData);


module.exports = router;
