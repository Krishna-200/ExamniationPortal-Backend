const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullname: String,
  empid: String,
  gender: { type: String, enum: ["male", "female"] },
  department: { type: String, enum: ["cse", "ece", "mech", "civil", "eee"] },
  mail: { type: String, unique: true },
  password: String,
  mobileno: Number,
  role: { type: String, enum: ["user", "admin"], default: "user" },
});
module.exports = mongoose.model("Admin", UserSchema);
