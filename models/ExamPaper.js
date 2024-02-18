const mongoose = require("mongoose");

const ExamSchema = new mongoose.Schema({
  id: String,
  examType: { type: String, enum: ["practice", "actual"] },
  department: { type: String, enum: ["cse", "ece", "mech", "civil", "eee"] },
  subject: {
    type: String,
    enum: ["maths", "physics", "chemistry", "computer"],
  },
  year: { type: String, enum: ["first", "second", "third", "fourth"] },
  marks: Number,
  date: Date,
  duration: String,
});

module.exports = mongoose.model("ExamPage", ExamSchema);
