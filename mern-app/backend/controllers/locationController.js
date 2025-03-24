import Location from '../models/location.model.js';

// Get all locations
export const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get locations by category
export const getLocationsByCategory = async (req, res) => {
  try {
    const locations = await Location.find({ category: req.params.category });
    res.json(locations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new location
export const createLocation = async (req, res) => {
  const location = new Location({
    name: req.body.name,
    address: req.body.address,
    category: req.body.category,
    lat: req.body.lat,
    lng: req.body.lng
  });

  try {
    const newLocation = await location.save();
    res.status(201).json(newLocation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a location
export const updateLocation = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    if (req.body.name) location.name = req.body.name;
    if (req.body.address) location.address = req.body.address;
    if (req.body.category) location.category = req.body.category;
    if (req.body.lat) location.lat = req.body.lat;
    if (req.body.lng) location.lng = req.body.lng;
    
    const updatedLocation = await location.save();
    res.json(updatedLocation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a location
export const deleteLocation = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    await location.deleteOne(); // Updated from remove() which is deprecated
    res.json({ message: 'Location deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};