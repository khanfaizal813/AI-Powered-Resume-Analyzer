const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const { analyzeResume } = require("../controllers/resumeController");

router.post("/analyze", upload.single("resume"), analyzeResume);

module.exports = router;
