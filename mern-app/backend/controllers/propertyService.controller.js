import PropertyService from "../models/propertyService.model.js";

// Get all properties/services or filter by toggle (Property/Service)
export const getPropertyServices = async (req, res, next) => {
  try {
    const { toggle } = req.query; // Optional query to filter by Property or Service
    const filter = toggle ? { toggle } : {};
    const propertyServices = await PropertyService.find(filter);
    res.status(200).json({
      success: true,
      data: propertyServices,
    });
  } catch (error) {
    next(error);
  }
};

// Get single property/service by ID
export const getPropertyServiceById = async (req, res, next) => {
  try {
    const propertyService = await PropertyService.findById(req.params.id);
    if (!propertyService) {
      return res.status(404).json({
        success: false,
        message: "Property/Service not found",
      });
    }
    res.status(200).json({
      success: true,
      data: propertyService,
    });
  } catch (error) {
    next(error);
  }
};

// Create a new property/service
export const createPropertyService = async (req, res, next) => {
  try {
    const propertyService = await PropertyService.create(req.body);
    res.status(201).json({
      success: true,
      data: propertyService,
    });
  } catch (error) {
    next(error);
  }
};

// Update a property/service
export const updatePropertyService = async (req, res, next) => {
  try {
    const propertyService = await PropertyService.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!propertyService) {
      return res.status(404).json({
        success: false,
        message: "Property/Service not found",
      });
    }
    res.status(200).json({
      success: true,
      data: propertyService,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a property/service
export const deletePropertyService = async (req, res, next) => {
  try {
    const propertyService = await PropertyService.findByIdAndDelete(
      req.params.id
    );
    if (!propertyService) {
      return res.status(404).json({
        success: false,
        message: "Property/Service not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Property/Service deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
