import mongoose from "mongoose";

const advertismentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    contactNo: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "Pending",
        enum: ["Pending", "Approved", "Rejected", "Expired"],
    },
    // postedBy: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User",
    // },
}, { timestamps: true });

const Advertisment = mongoose.model("Advertisment", advertismentSchema);

export default Advertisment;