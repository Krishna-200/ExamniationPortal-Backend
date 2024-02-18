const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const { AUTH_MAIL, AUTH_PASS } = process.env;
// console.log(AUTH_MAIL);

let transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  port: 587,
  secure: false,
  auth: {
    user: AUTH_MAIL,
    pass: AUTH_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    // console.log("Ready for message");
    // console.log("success");
  }
});

const sendMail = async (mailOptions) => {
  try {
    await transporter.sendMail(mailOptions);
    console.log("email sent sucessfully");

    return true;
  } catch (error) {
    console.log("error sending email", error);
    return false;
  }
};

module.exports = sendMail;
