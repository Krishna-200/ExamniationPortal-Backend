const mongoose = require("mongoose");

const screenshotSchema = new mongoose.Schema({
  userId: String,
  examId: String,
  images: [{ type: String, required: true }],
});

module.exports = mongoose.model("Screenshot", screenshotSchema);
