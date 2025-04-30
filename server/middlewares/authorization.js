const Citizen = require("../models/citizen.schema");

const citizenAuthorization = async (req, res, next) => {
  try {
    const citizenId = req.citizenId;
    const citizen = await Citizen.findById(citizenId);
    if (!citizen) {
      return res.status(403).json({ message: "Unauthorised" });
    } else {
      if (citizen.role !== "citizen") {
        return res.status(403).json({ message: "Unauthorised" });
      }
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const adminAuthorization = async (req, res, next) => {
  try {
    const citizenId = req.citizenId;
    const citizen = await Citizen.findById(citizenId);
    if (!citizen) {
      return res.status(403).json({ message: "Unauthorised" });
    }
    if (citizen.role !== "admin") {
      return res.status(403).json({ message: "Unauthorised" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { citizenAuthorization, adminAuthorization };
