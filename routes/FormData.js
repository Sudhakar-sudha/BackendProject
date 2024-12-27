const express = require("express");
const { formdata } = require("../controllers/formdataControllers");

const router = express.Router();

router.post("/form", formdata);

module.exports = router;
