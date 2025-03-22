import mongoose from "mongoose";

const districts = [
  "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara", 
  "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar", "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya", 
  "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
];

const categories = [
  "Photography", "Bridal Service", "Photo Location", "Groom Dressing", "Car Rental", 
  "Entertainment Services", "Invitation & Gift Services", "Honeymoon","Hotel"
];

const propertyServiceSchema = new mongoose.Schema({
    name: {
        type: String,
        default: 'No Name',
    },
    location: {
        type: String,
        enum: districts,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    toggle: {
        type: String,
        enum: ["Property", "Service"],
        required: true,
    },
    category: {
        type: String,
        enum: categories,
        required: true,
    },
    image: {
        type: String, // URL of the image
        default: 'https://cdn.pixabay.com/photo/2017/03/16/21/18/logo-2150297_960_720.png',
    },
    contactNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    description: {
        type: String,
        required: true,
    }
}, { timestamps: true });

const PropertyService = mongoose.model('PropertyService', propertyServiceSchema);

export default PropertyService;
