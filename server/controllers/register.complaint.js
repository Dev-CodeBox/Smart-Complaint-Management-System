const Complaint = require("../models/complaint.schema");
const cloudinary = require("cloudinary").v2;

const registerComplaint = async (req, res) => {
  try {
    const { title, description, location } = req.body;
    if (!title || !description || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const image = req.files.image;
    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    } else {
      const imageType = image.mimetype.split("/")[1];
      const allowedTypes = ["jpeg", "png", "jpg"];
      if (!allowedTypes.includes(imageType)) {
        return res.status(400).json({ message: "Invalid image type" });
      }
      const maxSize = 1024 * 1024;
      if (image.size > maxSize) {
        return res.status(400).json({ message: "Image size exceeds limit" });
      }
    }

    const uploadedImage = await cloudinary.uploader.upload(image.tempFilePath, {
      folder: "scms",
    });

    const imageUrl = uploadedImage.secure_url;

    const newComplaint = new Complaint({
      title,
      image: imageUrl,
      description,
      location,
      upvotes: [],
    });

    await newComplaint.save();
    res
      .status(201)
      .json({ message: "Complaint registered successfully", newComplaint });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering Complaint", error: error.message });
  }
};

module.exports = registerComplaint;
