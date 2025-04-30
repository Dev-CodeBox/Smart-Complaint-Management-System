const Citizen = require("../models/citizen.schema");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    const citizen = await Citizen.findOne({ email });
    if (!citizen) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, citizen.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Password" });
    }
    const token = jwt.sign(
      { id: citizen._id, role: citizen.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({
      token,
      citizen: {
        _id: citizen._id,
        name: citizen.name,
        email: citizen.email,
        role: citizen.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = login;
