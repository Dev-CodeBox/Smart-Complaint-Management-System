const Citizen = require("../models/citizen.schema");
const bcrypt = require("bcrypt");
const validator = require("validator");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol",
      });
    }
    const existingCitizen = await Citizen.findOne({ email });
    if (existingCitizen) {
      return res.status(400).json({ message: "Citizen already exists" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newCitizen = new Citizen({
        name,
        email,
        password: hashedPassword,
      });
      await newCitizen.save();
      res.status(201).json({ message: "Citizen registered successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = signup;
