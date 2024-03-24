const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  id: String,
  file: String,
});

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
