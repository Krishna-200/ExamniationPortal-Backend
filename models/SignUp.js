const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullname: String,
  rollno: String,
  gender: { type: String, enum: ["male", "female"] },
  year: { type: String, enum: ["first", "second", "third", "fourth"] },
  mail: { type: String, unique: true },
  password: String,
  mobileno: Number,
  role: { type: String, enum: ["user", "admin"], default: "user" },
  file: String,
});
module.exports = mongoose.model("User", UserSchema);
