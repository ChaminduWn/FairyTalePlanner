import Advertisment from "../models/advertismentModel.js";
import asyncHandler from "express-async-handler";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const postAdvertisment = asyncHandler(async (req, res) => {
  try {
    const { title, description, category, location, contactNo, email, price, status } = req.body;

    // Validate required fields
    if (!title || !description || !category || !location || !contactNo || !email || !price) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    // Handle image upload
    let imagePath = "";
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    } else {
      return res.status(400).json({ message: "Image is required" });
    }

    // Create new advertisement
    const newAdvertisment = await Advertisment.create({
      title,
      description,
      category,
      location,
      contactNo: Number(contactNo),
      email,
      price: Number(price),
      image: imagePath,
      status: status || "Pending",
      // postedBy: req.user._id,
    });

    if (newAdvertisment) {
      res.status(201).json({
        success: true,
        data: newAdvertisment,
        message: "Advertisement created successfully",
      });
    } else {
      res.status(400).json({ message: "Invalid advertisement data" });
    }
  } catch (error) {
    console.error("Error in postAdvertisment:", error);
    res.status(500).json({ 
      message: "Server Error", 
      error: error.message 
    });
  }
});

const getAdvertisments = asyncHandler(async (req, res) => {
  try {
    const { status, category, page = 1, limit = 10 } = req.query;
    
    // Create filter object
    const filter = {};
    if (status) {
      filter.status = status;
    }
    if (category) {
      filter.category = category;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get total count for pagination
    const total = await Advertisment.countDocuments(filter);

    const advertisments = await Advertisment.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
      // .populate("postedBy", "name email"); 

    res.status(200).json({
      success: true,
      count: advertisments.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: advertisments,
    });
  } catch (error) {
    console.error("Error in getAdvertisments:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

const getAdvertismentById = asyncHandler(async (req, res) => {
  try {
    const advertisment = await Advertisment.findById(req.params.id);
      // .populate("postedBy", "name email"); 

    if (advertisment) {
      res.status(200).json({
        success: true,
        data: advertisment,
      });
    } else {
      res.status(404).json({ message: "Advertisement not found" });
    }
  } catch (error) {
    console.error("Error in getAdvertismentById:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

const updateAdvertismentStatus = asyncHandler(async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status
    const validStatuses = ["Pending", "Approved", "Rejected", "Expired"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: "Please provide a valid status (Pending, Approved, Rejected, or Expired)" 
      });
    }

    const advertisment = await Advertisment.findById(req.params.id);

    if (!advertisment) {
      return res.status(404).json({ message: "Advertisement not found" });
    }

    advertisment.status = status;
    await advertisment.save();

    res.status(200).json({
      success: true,
      data: advertisment,
      message: `Advertisement status updated to ${status}`,
    });
  } catch (error) {
    console.error("Error in updateAdvertismentStatus:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

const updateAdvertisment = asyncHandler(async (req, res) => {
  try {
    const { title, description, category, location, contactNo, email, price } = req.body;
    
    const advertisment = await Advertisment.findById(req.params.id);
    
    if (!advertisment) {
      return res.status(404).json({ message: "Advertisement not found" });
    }
    
    // Handle image upload if there's a new image
    let imagePath = advertisment.image;
    if (req.file) {
      // Delete old image
      if (advertisment.image) {
        const oldImagePath = path.join(__dirname, '../', advertisment.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      imagePath = `/uploads/${req.file.filename}`;
    }
    
    // Update advertisement
    advertisment.title = title || advertisment.title;
    advertisment.description = description || advertisment.description;
    advertisment.category = category || advertisment.category;
    advertisment.location = location || advertisment.location;
    advertisment.contactNo = contactNo ? Number(contactNo) : advertisment.contactNo;
    advertisment.email = email || advertisment.email;
    advertisment.price = price ? Number(price) : advertisment.price;
    advertisment.image = imagePath;
    
    const updatedAdvertisment = await advertisment.save();
    
    res.status(200).json({
      success: true,
      data: updatedAdvertisment,
      message: "Advertisement updated successfully",
    });
  } catch (error) {
    console.error("Error in updateAdvertisment:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

const deleteAdvertisment = asyncHandler(async (req, res) => {
  try {
    const advertisment = await Advertisment.findById(req.params.id);
    
    if (!advertisment) {
      return res.status(404).json({ message: "Advertisement not found" });
    }
    
    
    // Delete image from server
    if (advertisment.image) {
      const imagePath = path.join(__dirname, '../', advertisment.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await Advertisment.deleteOne({ _id: req.params.id });
    
    res.status(200).json({
      success: true,
      message: "Advertisement deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteAdvertisment:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

export { 
  postAdvertisment, 
  getAdvertisments, 
  getAdvertismentById, 
  updateAdvertismentStatus,
  updateAdvertisment,
  deleteAdvertisment
};