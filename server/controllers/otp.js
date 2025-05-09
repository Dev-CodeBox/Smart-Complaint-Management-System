const nodemailer = require("nodemailer");
const validator = require("validator");
require("dotenv").config();

const otpStorage = {};
const OTP_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes
const OTP_RESEND_TIME = 30 * 1000; // 30 seconds

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ message: "Email is required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStorage[email] = {
      otp,
      sentTime: Date.now(),
    };

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Smart Complaint Management System "<${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔐 Your OTP Code - Smart Complaint Management System",
      html: `
      <div style="font-family: 'Segoe UI', sans-serif; padding: 20px; max-width: 500px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center;">
          <img src="https://cdn-icons-png.flaticon.com/512/747/747376.png" alt="Secure Icon" style="width: 80px; margin-bottom: 20px;" />
          <h2 style="color: #2f855a;">Hello ${email},</h2>
          <p style="font-size: 16px;">We received a request to verify your email address for <strong>Smart Complaint Management System</strong>.</p>
          <p style="font-size: 18px; margin: 20px 0;">
          Your One-Time Password (OTP) is:
          </p>
          <h1 style="color: #2b6cb0; font-size: 36px; margin: 10px 0;">${otp}</h1>
          <p style="color: #718096;">This OTP is valid for <strong>5 minutes</strong>. Do not share it with anyone.</p>
          <hr style="margin: 30px 0;">
          <p style="font-size: 12px; color: #a0aec0;">If you didn’t request this, you can safely ignore this email.</p>
        </div>
      </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    } else {
      if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Email is Not Valid" });
      } else {
        const { otp: storedOtp, sentTime } = otpStorage[email];
        const currentTime = Date.now();
        if (currentTime - sentTime > OTP_EXPIRATION_TIME) {
          delete otpStorage[email];
          return res.status(400).json({ message: "Otp Expired" });
        } else {
          if (otp !== storedOtp) {
            return res.status(400).json({ message: "Invalid Otp" });
          } else {
            delete otpStorage[email];
            return res
              .status(200)
              .json({ message: "Otp verification Success" });
          }
        }
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
};
