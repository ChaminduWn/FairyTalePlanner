import express from "express";
import {
  getPropertyServices,
  getPropertyServiceById,
  createPropertyService,
  updatePropertyService,
  deletePropertyService,
} from "../controllers/propertyService.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// Public routes
router.get("/", getPropertyServices); // Get all or filtered by toggle
router.get("/:id", getPropertyServiceById); // Get single property/service

// Admin routes (protected)
router.post("/", verifyToken, createPropertyService); // Create new
router.put("/:id", verifyToken, updatePropertyService); // Update existing
router.delete("/:id", verifyToken, deletePropertyService); // Delete

export default router;
