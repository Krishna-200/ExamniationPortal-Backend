const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Admin = require("./models/AdminSignUp");
const User = require("./models/SignUp");
const OTP = require("./models/Otp");
const ExamPage = require("./models/ExamPaper");
const newQuestion = require("./models/Questions");
const ResultPage = require("./models/Results");
const Image = require("./models/Image");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const sendMail = require("./SendMail");
const verifyToken = require("./verifyToken");

const app = express();
const bcryptSalt = bcrypt.genSaltSync(10);
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "https://examination-portal-six.vercel.app",
  })
);
app.use(cookieParser());

dotenv.config();
mongoose.connect(process.env.Mongo_Url).then(() => {
  console.log("db connected successfully");
});
const jwtSecret = process.env.JWT_SECRET;
const { AUTH_MAIL } = process.env;

app.get("/test", (req, res) => {
  res.json("test is ok");
});

//User Registration

app.post("/SignUp", async (req, res) => {
  //   console.log(jwtSecret);
  const { fullname, rollno, password, gender, year, mail, mobileno } = req.body;
  const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
  try {
    const createduser = await User.create({
      fullname: fullname,
      rollno: rollno,
      password: hashedPassword,
      gender: gender,
      year: year,
      mail: mail,
      mobileno: mobileno,
      role: "user",
    });
    jwt.sign(
      { userId: createduser._id, fullname },
      jwtSecret,
      {},
      (err, token) => {
        if (err) throw err;
        res
          .cookie("token", token, {
            secure: true,
            sameSite: "none",
          })
          .status(201)
          .json({
            id: createduser._id,
          });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Admin SignUp

app.post("/AdminSignUp", async (req, res) => {
  //   console.log(jwtSecret);
  const { fullname, empid, password, gender, department, mail, mobileno } =
    req.body;
  const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
  try {
    const createduser = await Admin.create({
      fullname: fullname,
      empid: empid,
      password: hashedPassword,
      gender: gender,
      department: department,
      mail: mail,
      mobileno: mobileno,
      role: "admin",
    });
    jwt.sign(
      { userId: createduser._id, fullname },
      jwtSecret,
      {},
      (err, token) => {
        if (err) throw err;
        res
          .cookie("token", token, {
            secure: true,
            sameSite: "none",
          })
          .status(201)
          .json({
            id: createduser._id,
          });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//User login
app.post("/login", async (req, res) => {
  try {
    const { mail, password } = req.body;
    // console.log(mail, password);
    const foundUser = await User.findOne({ mail });
    if (!foundUser) {
      // console.log("user not found");
    }
    if (foundUser) {
      // console.log("user found");
      const passOk = bcrypt.compareSync(password, foundUser.password);
      if (passOk) {
        jwt.sign({ userId: foundUser._id }, jwtSecret, {}, (err, token) => {
          res.cookie("token", token).json({
            id: foundUser._id,
          });
        });
      } else {
        res.status(401).json("wrong credentials");
      }
    }
  } catch (error) {
    // if (error) throw error;
    // console.log(error);
  }
});

//Admin Login

app.post("/Adminlogin", async (req, res) => {
  try {
    const { mail, password } = req.body;
    // console.log(mail, password);
    const foundUser = await Admin.findOne({ mail });
    // console.log(foundUser);
    if (!foundUser) {
      console.log("user not found");
    }
    if (foundUser) {
      // console.log("user found");
      const passOk = bcrypt.compareSync(password, foundUser.password);
      if (passOk) {
        jwt.sign({ userId: foundUser._id }, jwtSecret, {}, (err, token) => {
          res.cookie("token", token).json({
            id: foundUser._id,
          });
        });
      } else {
        res.status(401).json("wrong credentials");
      }
    }
  } catch (error) {
    if (error) throw error;
  }
});

//User information

app.get("/UserPage/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    if (error) throw error;
  }
});

// all the user data
app.get("/UserDetails", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.log(error);
  }
});

// Admin information

app.get("/AdminPage/:id", async (req, res) => {
  try {
    // console.log(req.params.id);
    const admin = await Admin.findById(req.params.id);
    res.status(200).json(admin);
  } catch (error) {
    if (error) console.log(error);
  }
});

// to get all  of the admins information

app.get("/AllAdmins", async (req, res) => {
  const response = await Admin.find();
  // console.log(response);
  res.status(200).json(response);
});

//OTP verfication

app.post("/otp", async (req, res) => {
  try {
    const { mail } = req.body;
    const { fullname } = req.body;
    const subject = "Examniation portal SignUp Verification Mail";
    const message = `Hey ${fullname} the below code is your verification code`;
    const duration = 1;
    const sendOtp = async ({ mail, subject, message, duration = 1 }) => {
      try {
        if (!(mail && subject && message)) {
          throw Error("Provide values for email, subject and message");
        }
        await OTP.deleteOne({ mail });
        const generatedOtp = await generateOTP();

        const mailOptions = {
          from: AUTH_MAIL,
          to: mail,
          subject,
          html: `<p>${message}</p><p style='color:tomato;font-size:25px;letter-spacing:2px;'S><b>${generatedOtp}<b></p><p>This code <b> expires in ${duration} hour(s)</b>.</p>'`,
        };
        await sendMail(mailOptions);

        //save otp record

        const hashedOtp = await hasedotp(generatedOtp);
        const newOtp = await new OTP({
          mail,
          otp: hashedOtp,
          createdAr: Date.now(),
          expriesAt: Date.now() + 3600000 * +duration,
        });
        const createdOTPRecord = await newOtp.save();
        return createdOTPRecord;
      } catch (error) {
        throw error;
      }
    };

    //to generate otp
    const generateOTP = async () => {
      try {
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
        return otp;
      } catch (error) {
        throw error;
      }
    };

    // to hashed otp
    const hasedotp = async (generatedOtp) => {
      try {
        const hashedData = await bcrypt.hash(generatedOtp, bcryptSalt);
        return hashedData;
      } catch (error) {
        throw error;
      }
    };

    if (!mail) {
      return res.status(400).json({ error: "email is required" });
    }
    try {
      const createdOTP = await sendOtp({ mail, subject, message, duration });
      res.status(200).json(createdOTP);
    } catch (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
});

//to verify otp

app.post("/verifyOtp", async (req, res) => {
  {
    const verifyHashedData = async (unhased, hashed) => {
      try {
        const unhasedString = String(unhased);
        const match = await bcrypt.compare(unhasedString, hashed);
        return match;
      } catch (error) {
        throw error;
      }
    };
    const verifyOTP = async ({ mail, otp }) => {
      try {
        const matchedOTPRecord = await OTP.findOne({ mail });
        // console.log(matchedOTPRecord);
        const { expriesAt } = matchedOTPRecord;
        if (expriesAt < Date.now()) {
          await OTP.deleteOne({ mail });
          throw Error("Code has expried, Request for a new one.");
        }

        const hashedOTP = matchedOTPRecord.otp;
        const validOTP = await verifyHashedData(otp, hashedOTP);
        return validOTP;
      } catch (error) {
        throw error;
      }
    };

    try {
      const { mail, otp } = req.body;
      // console.log(mail);
      const validOTP = await verifyOTP({ mail, otp });
      // if (validOTP) {
      //   console.log("hlo");
      // } else {
      //   console.log("fail");
      // }
      res.status(200).json({ valid: validOTP });
    } catch (error) {
      throw error;
    }
  }
});

// Creating Exam

app.post("/ExamPaper/:id", verifyToken, async (req, res) => {
  const { examType, department, subject, year, marks, date, duration } =
    req.body;
  const id = req.params.id;
  try {
    const createdExam = await ExamPage.create({
      id,
      examType,
      department,
      subject,
      year,
      marks,
      date,
      duration,
    });
    res.status(200).json(createdExam);
  } catch (error) {
    res.status(404).json("error creating paper");
  }
});

// Uploading questions

app.post("/UploadQuestion", verifyToken, async (req, res) => {
  const {
    exam_id,
    question,
    optionA,
    optionB,
    optionC,
    optionD,
    correctOption,
    questionMarks,
  } = req.body;
  try {
    const createdQuestion = await newQuestion.create({
      exam_id,
      question,
      optionA,
      optionB,
      optionC,
      optionD,
      correctOption,
      questionMarks,
    });
    res.status(200).json(createdQuestion);
  } catch (error) {
    console.log(error);
  }
});

// to get Questions

app.get("/getQuestions", async (req, res) => {
  const { examId } = req.query;
  // console.log(examId);

  try {
    const questions = await newQuestion.find({ exam_id: examId });
    res.status(200).json(questions);
    // console.log(questions);
  } catch (error) {
    console.log(error);
  }
});

// to get exam details

app.get("/getExamDetails", async (req, res) => {
  const { examId } = req.query;
  // console.log(examId);
  try {
    const examDetails = await ExamPage.findById(examId);
    res.status(200).json(examDetails);
  } catch (error) {
    console.log(error);
  }
});

// to edit the question

app.post("/editQuestion", verifyToken, async (req, res) => {
  try {
    const { questionId } = req.body;
    // console.log(questionId);
    const {
      question,
      optionA,
      optionB,
      optionC,
      optionD,
      correctOption,
      questionMarks,
    } = req.body;
    // console.log(questionId);
    const editedQuestion = await newQuestion.findByIdAndUpdate(
      questionId,
      {
        question,
        optionA,
        optionB,
        optionC,
        optionD,
        correctOption,
        questionMarks,
      },
      { new: true }
    );
    res.status(200).json(editedQuestion);
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).send("Error updating question");
  }
});

// to delete a question

app.delete("/deleteQuestion", verifyToken, async (req, res) => {
  try {
    const { id } = req.query;
    // console.log(id);
    await newQuestion.findByIdAndDelete(id);
    res.status(200).json("question deleted successfully");
  } catch (error) {
    console.log(error);
  }
});

// to get all admin questions

app.get("/getAllExams", verifyToken, async (req, res) => {
  const { id } = req.query;
  // console.log(id);
  const response = await ExamPage.find({ id });
  res.status(200).json(response);
});

// to get all exams
app.get("/AllExams", async (req, res) => {
  const response = await ExamPage.find();
  // console.log(response);
  res.status(200).json(response);
});

// to delete exam

app.delete("/deleteExam", verifyToken, async (req, res) => {
  try {
    const { examId } = req.query;
    // console.log(examId);
    await ExamPage.findByIdAndDelete({ _id: examId });
    await newQuestion.findOneAndDelete({ exam_id: examId });
    res.status(200).json("exam deleted successfully");
  } catch (error) {
    console.log(error);
  }
});

// to logout admin

app.get("/logout", async (req, res) => {
  try {
    res
      .clearCookie("token", { sameSite: "none", secure: true })
      .status(200)
      .send("user logged out sucessfully");
  } catch (error) {
    res.status(500).json(error);
  }
});

//saving student exam results

app.post("/results", verifyToken, async (req, res) => {
  const {
    name,
    examId,
    adminId,
    userId,
    totalMarks,
    subject,
    date,
    examType,
    stauts,
    mobileno,
  } = req.body;
  try {
    const result = await ResultPage.create({
      name,
      examId,
      adminId,
      userId,
      totalMarks,
      subject,
      date,
      examType,
      stauts,
      mobileno,
    });
    // console.log(stauts);
    res.status(200).json(result);
    // console.log(result);
  } catch (error) {
    console.log(error);
  }
});

// to get all students results of admin exam

app.get("/ExamResutls", verifyToken, async (req, res) => {
  const { id } = req.query;
  // console.log(id);
  const response = await ResultPage.find({ adminId: id });
  res.status(200).json(response);
});

// to get user results

app.get("/UserResult", async (req, res) => {
  const { id } = req.query;
  // console.log(id);
  const response = await ResultPage.find({ userId: id });
  res.status(200).json(response);
});

// to store images of users

app.listen(3000, () => {
  console.log("server has been started");
});
