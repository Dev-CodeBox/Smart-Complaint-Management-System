const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const citizen = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "citizen"],
      default: "citizen",
    },
  },
  {
    timestamps: true,
  }
);

citizen.post("save", async (doc) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Smart Complaint Management System" <${process.env.EMAIL_USER}>`,
      to: doc.email,
      subject: "Welcome to Smart Complaint Management System",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center; border: 1px solid #eee; border-radius: 10px; max-width: 500px; margin: auto;">
          <img src="https://img.icons8.com/emoji/96/waving-hand-emoji.png" style="width: 80px; margin-bottom: 20px;" />
          <h2 style="color: #2b6cb0;">Welcome, ${doc.name}!</h2>
          <p>Thanks for joining the <strong>Smart Complaint Management System</strong>.</p>
          <p>You can now report cities problems and track them easily. Let’s make our city better together! </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error in post-save hook:", error);
  }
});

module.exports = mongoose.model("Citizen", citizen);
