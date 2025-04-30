const Citizen = require("../models/citizen.schema");
const Upvote = require("../models/upvote.schema");
const Complaint = require("../models/complaint.schema");

const upvote = async (req, res) => {
  try {
    const { citizen, complaint } = req.body;
    if (!citizen || !complaint) {
      return res
        .status(400)
        .json({ message: "Citizen and Complaint are required" });
    }
    const citizenExists = await Citizen.findById(citizen);
    if (!citizenExists) {
      return res.status(404).json({ message: "Citizen not found" });
    } else {
      const complaintExists = await Complaint.findById(complaint);
      if (!complaintExists) {
        return res.status(404).json({ message: "Complaint not found" });
      } else {
        if (complaintExists.status?.trim().toLowerCase() === "resolved") {
          return res
            .status(400)
            .json({ message: "Cannot upvote a resolved Complaint" });
        } else {
          const existingUpvote = await Upvote.findOne({ citizen, complaint });
          if (existingUpvote) {
            return res
              .status(400)
              .json({ message: "You already upvoted this Complaint" });
          } else {
            const newUpvote = new Upvote({ citizen, complaint });
            await newUpvote.save();
            complaintExists.upvotes.push(citizen);
            await complaintExists.save();
            return res.status(201).json({ message: "Upvoted successfully" });
          }
        }
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = upvote;
