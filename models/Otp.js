const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OTPSchmea = new Schema({
  mail: String,
  otp: String,
  createdAt: Date,
  expriesAt: Date,
});

const OTP = mongoose.model("OTP", OTPSchmea);

module.exports = OTP;
