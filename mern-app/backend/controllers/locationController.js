// controllers/location.controller.js
import Location from '../models/location.model.js';

// Get all approved locations (for public map)
export const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find({ status: 'approved' });
    res.json(locations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get locations by category (only approved)
export const getLocationsByCategory = async (req, res) => {
  try {
    const locations = await Location.find({ 
      category: req.params.category,
      status: 'approved'
    });
    res.json(locations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Submit a new location request (creates pending location)
export const submitLocationRequest = async (req, res) => {
  const location = new Location({
    name: req.body.name,
    address: req.body.address,
    category: req.body.category,
    lat: req.body.lat,
    lng: req.body.lng,
    status: 'pending',
    userId: req.user.id, // Use authenticated user's ID
    requestedBy: req.body.requestedBy || req.user.username || 'anonymous'
  });

  try {
    const newLocation = await location.save();
    res.status(201).json(newLocation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all pending location requests (admin only)
export const getPendingLocations = async (req, res) => {
  try {
    // Admin authentication is handled by middleware
    const locations = await Location.find({ status: 'pending' });
    res.json(locations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user's locations (logged in user only)
export const getUserLocations = async (req, res) => {
  try {
    const userId = req.user.id;
    const locations = await Location.find({ userId: userId });
    res.json(locations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approve a location request (admin only)
export const approveLocation = async (req, res) => {
  try {
    // Admin authentication is handled by middleware
    const location = await Location.findById(req.params.id);
    
    if (!location) {
      return res.status(404).json({ message: 'Location request not found' });
    }
    
    location.status = 'approved';
    location.reviewedBy = req.body.adminId || req.user.id;
    location.reviewDate = Date.now();
    location.reviewComments = req.body.comments || 'Approved';
    
    const updatedLocation = await location.save();
    res.json(updatedLocation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Reject a location request (admin only)
export const rejectLocation = async (req, res) => {
  try {
    // Admin authentication is handled by middleware
    const location = await Location.findById(req.params.id);
    
    if (!location) {
      return res.status(404).json({ message: 'Location request not found' });
    }
    
    location.status = 'rejected';
    location.reviewedBy = req.body.adminId || req.user.id;
    location.reviewDate = Date.now();
    location.reviewComments = req.body.comments || 'Rejected';
    
    const updatedLocation = await location.save();
    res.json(updatedLocation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a location (admin only)
export const updateLocation = async (req, res) => {
  try {
    // Admin authentication is handled by middleware
    const location = await Location.findById(req.params.id);
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    if (req.body.name) location.name = req.body.name;
    if (req.body.address) location.address = req.body.address;
    if (req.body.category) location.category = req.body.category;
    if (req.body.lat) location.lat = req.body.lat;
    if (req.body.lng) location.lng = req.body.lng;
    
    // If this is an admin editing a pending request before approval
    if (req.body.status) location.status = req.body.status;
    
    const updatedLocation = await location.save();
    res.json(updatedLocation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a location (admin or owner)
export const deleteLocation = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    // Check if user is admin or owner of the location
    const isAdmin = req.user.isAdmin; // Assuming your auth middleware adds this
    const isOwner = location.userId === req.user.id;
    
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'Not authorized to delete this location' });
    }
    
    await location.deleteOne();
    res.json({ message: 'Location deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};