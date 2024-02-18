const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  exam_id: String,
  question: String,
  optionA: String,
  optionB: String,
  optionC: String,
  optionD: String,
  correctOption: { type: String, enum: ["A", "B", "C", "D"] },
  questionMarks: Number,
});

module.exports = mongoose.model("newQuestion", QuestionSchema);
