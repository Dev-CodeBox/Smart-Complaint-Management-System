const Complaint = require("../models/complaint.schema");

const getComplaints = async (req, res) => {
  try {
    const complaint = await Complaint.find({}).sort({ upvotes: -1 });
    if (!complaint || complaint.length === 0) {
      return res.status(404).json({ message: "No complaints found" });
    }
    res
      .status(200)
      .json({ message: "Complaints fetched successfully", complaint });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching complaints", error: error.message });
  }
};

module.exports = getComplaints;
