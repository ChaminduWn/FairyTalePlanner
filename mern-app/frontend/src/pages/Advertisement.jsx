import React, { useState, useEffect } from "react";
import { Button, Card, Spinner } from "flowbite-react";
import {
  FaArrowRight,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaDollarSign,
} from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";

// Import PostAdvertismentModal or add it to this file
// import PostAdvertismentModal from "./PostAdvertismentModal";

const Advertisement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch advertisements on component mount
  useEffect(() => {
    fetchAdvertisements();
  }, []);

  const fetchAdvertisements = async () => {
    try {
      setLoading(true);
      // Use axios instead of fetch to match AdminDashAdvertisment
      const response = await axios.get('http://localhost:4000/api/advertisement');
      
      // Filter to only show advertisements with status "approved" (note lowercase)
      const approvedAds = response.data.data.filter(ad => 
        ad.status.toLowerCase() === "approved"
      );
      
      // Format data to match the expected structure
      const formattedAds = approvedAds.map(ad => ({
        _id: ad._id,
        title: ad.title,
        description: ad.description,
        category: ad.category,
        price: ad.price,
        location: ad.location,
        contactNo: ad.contactNo.toString(),
        email: ad.email,
        image: ad.image, // This is now a direct Firebase URL
        createdAt: ad.createdAt
      }));
      
      setAdvertisements(formattedAds);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching advertisements:", error);
      setError("Failed to load advertisements");
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitAdvertisement = () => {
    // After successful submission, refresh the advertisement list
    fetchAdvertisements();
    handleCloseModal();
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-8 bg-gradient-to-t from-[#954d9c] to-[#a73278] flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Spinner size="xl" />
          <p className="mt-2 text-white">Loading advertisements...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-8 bg-gradient-to-t from-[#954d9c] to-[#a73278] flex justify-center items-center min-h-screen">
        <div className="text-center text-white">
          <h3 className="mb-2 text-xl font-bold">Error loading advertisements</h3>
          <p>{error}</p>
          <Button onClick={fetchAdvertisements} className="mt-4 bg-pink-600 hover:bg-pink-800">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-t from-[#954d9c] to-[#a73278]">
      <Button 
        className="flex mb-8 ml-auto text-white bg-pink-600 hover:bg-pink-800"
        onClick={handleOpenModal}
      >
        Post Your Advertisement <FaArrowRight className="mt-1 ml-2" />   
      </Button>
      
      {advertisements.length === 0 ? (
        <div className="p-8 text-center text-white">
          <h3 className="mb-2 text-xl font-bold">No approved advertisements found</h3>
          <p>Be the first to post an approved advertisement!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {advertisements.map((ad) => (
            <Card key={ad._id} className="overflow-hidden transition-shadow duration-300 border border-pink-200 hover:shadow-xl">
              <div 
                className="relative"
                style={{ 
                  aspectRatio: "210/297", /* A4 aspect ratio */
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${ad.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
              >
                <div className="absolute inset-0 flex flex-col p-6">
                  <h3 className="p-3 mx-auto mb-4 text-xl font-bold tracking-wide text-center text-white uppercase border-b-2 rounded-lg shadow-lg" 
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.7)" }}>
                    {ad.title}
                  </h3>
                  
                  <div className="flex-grow max-w-xl p-4 mx-auto mb-4 text-center text-white bg-black rounded bg-opacity-20">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap md:text-base">
                      {ad.description}
                    </p>
                  </div>
                  
                  <div className="absolute left-0 right-0 px-4 py-3 text-sm bg-black rounded-lg bottom-6 bg-opacity-30">
                    <div className="flex items-start mb-2 text-white">
                      <FaDollarSign className="mt-1 mr-2" />
                      <span><strong>Starting from</strong> ${ad.price}</span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-start text-white">
                        <FaMapMarkerAlt className="mt-1 mr-2" />
                        <span>{ad.location}</span>
                      </div>
                      
                      <div className="flex items-start text-white">
                        <FaPhone className="mt-1 mr-2" />
                        <span>{ad.contactNo}</span>
                      </div>
                      
                      <div className="flex items-start text-white">
                        <FaEnvelope className="mt-1 mr-2" />
                        <span>{ad.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Advertisement Creation Modal */}
      {isModalOpen && (
        <PostAdvertismentModal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          onSubmit={handleSubmitAdvertisement} 
        />
      )}
    </div>
  );
};

export default Advertisement;

// You'll need to implement this component based on your existing code
// This is a simplified outline of what PostAdvertismentModal might look like
const PostAdvertismentModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    location: "",
    contactNo: "",
    email: "",
    image: ""
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(null);
  
  // Upload image to Firebase when the image file changes
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);
  
  const uploadImage = async () => {
    // Import the Firebase storage functions here
    // This should match the implementation in AdminDashAdvertisment.jsx
    // See AdminDashAdvertisment.jsx for complete implementation details
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Check if image is still uploading
      if (imageUploading) {
        alert("Please wait until the image is uploaded.");
        return;
      }
      
      // Submit to backend
      await axios.post('http://localhost:4000/api/advertisement', formData);
      
      // Call the onSubmit callback
      onSubmit();
    } catch (err) {
      console.error("Error creating advertisement:", err);
      alert("Failed to create advertisement");
    }
  };
  
  return (
    <div>
      {/* Implement your modal UI here */}
    </div>
  );
};