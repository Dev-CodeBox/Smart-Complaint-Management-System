const Complaint = require("../models/complaint.schema");

const updateStatusToProgress = async (req, res) => {
  try {
    const { complaintId } = req.params;

    const existingComplaint = await Complaint.findById(complaintId);
    if (!existingComplaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    } else {
      if (existingComplaint.status === "resolved") {
        return res.status(400).json({
          success: false,
          message: "Cannot update status of a resolved complaint",
        });
      } else if (existingComplaint.status === "in-progress") {
        return res.status(400).json({
          success: false,
          message: "Complaint is already in progress",
        });
      } else {
        existingComplaint.status = "in-progress";
        await existingComplaint.save();
        return res.status(200).json({
          success: true,
          message: "Status updated to in-progress successfully",
          issue: existingComplaint,
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const updateStatusToResolved = async (req, res) => {
  try {
    const { complaintId } = req.params;

    const existingComplaint = await Complaint.findById(complaintId);
    if (!existingComplaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    } else {
      if (existingComplaint.status !== "resolved") {
        existingComplaint.status = "resolved";
        await existingComplaint.save();
        return res.status(200).json({
          success: true,
          message: "Status resolved successfully",
          issue: existingComplaint,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Complaint is already resolved",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  updateStatusToProgress,
  updateStatusToResolved,
};
