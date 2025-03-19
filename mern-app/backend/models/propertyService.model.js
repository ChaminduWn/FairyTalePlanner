import mongoose from "mongoose";

const districts = [
  "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara", "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar", "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya", "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
];

const categories = ["Photography", "Bridal Service", "Photo Location","Groom Dressign", "Car rental" , "Entertainment Services"," Invitation & Gift Services","Private Villa"];

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
    }
}, { timestamps: true });

const PropertyService = mongoose.model('PropertyService', propertyServiceSchema);

export default PropertyService;
