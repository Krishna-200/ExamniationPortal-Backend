const mongoose = require("mongoose");

const screenshotSchema = new mongoose.Schema({
  userId: String,
  examId: String,
  images: [
    {
      data: Buffer,
      contentType: String,
    },
  ],
});

module.exports = mongoose.model("Screenshot", screenshotSchema);
