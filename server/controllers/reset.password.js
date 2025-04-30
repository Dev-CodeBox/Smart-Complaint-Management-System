const Citizen = require("../models/citizen.schema");
const validator = require("validator");
const bcrypt = require("bcrypt");

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email) {
      return res.status(401).json({ message: "Email is required" });
    } else if (!validator.isEmail(email)) {
      return res.status(401).json({ message: "Invalid email" });
    } else if (!validator.isStrongPassword(newPassword)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol",
      });
    }
    const existingCitizen = await Citizen.findOne({ email });
    if (!existingCitizen) {
      return res.status(401).json({ message: "Citizen does not exist" });
    } else {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      existingCitizen.password = hashedPassword;
      await existingCitizen.save();
      return res.status(200).json({ message: "Password updated succesfully" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = resetPassword;
