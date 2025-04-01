// models/location.model.js
import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  userId:{
    type : String,
    required : true
  },
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  lat: {
    type: String,
    required: true
  },
  lng: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  requestedBy: {
    type: String,
    default: 'anonymous'
  },
  requestDate: {
    type: Date,
    default: Date.now
  },
  reviewedBy: {
    type: String,
    default: null
  },
  reviewDate: {
    type: Date,
    default: null
  },
  reviewComments: {
    type: String,
    default: null
  }
});

const Location = mongoose.model('Location', locationSchema);

export default Location;