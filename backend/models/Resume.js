const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema({
  name: String,
  email: String,
  skills: [String],
  experienceSummary: String,
  suggestions: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Resume", ResumeSchema);
