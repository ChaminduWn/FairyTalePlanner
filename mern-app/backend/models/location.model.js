import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    default: 'No Name',

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

const location = mongoose.model('Location', locationSchema);

export default location;