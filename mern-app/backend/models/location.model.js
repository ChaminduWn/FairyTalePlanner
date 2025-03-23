const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      "Photography", 
      "Bridal Service", 
      "Photo Location", 
      "Groom Dressing", 
      "Car Rental", 
      "Entertainment Services", 
      "Invitation & Gift Services", 
      "Honeymoon",
      "Hotel"
    ]
  },
  lat: {
    type: String,
    required: true
  },
  lng: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Location', locationSchema);