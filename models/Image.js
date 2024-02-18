const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  examId: String,
  userId: String,
  data: {
    type: Buffer,
    required: true,
  },
});

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
