const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

const resumeRoutes = require("./routes/resumeRoutes");
app.use("/api/resume", resumeRoutes);

// general API for testing server on the browser:
app.use("/", (req, res) => {
  res.json({ success: true, message: "server is listening on the / url" });
});

module.exports = app;
