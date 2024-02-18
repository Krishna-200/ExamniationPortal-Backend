const mongoose = require("mongoose");

const ResultSchema = new mongoose.Schema({
  name: String,
  examId: String,
  adminId: String,
  userId: String,
  totalMarks: Number,
  subject: String,
  date: Date,
  examType: String,
  stauts: String,
  mobileno: Number,
});

module.exports = mongoose.model("ResultPage", ResultSchema);
