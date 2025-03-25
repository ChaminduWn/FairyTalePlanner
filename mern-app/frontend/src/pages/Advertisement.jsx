import React, { useState, useEffect } from "react";
import { Navbar, Button, Card, Carousel, Spinner } from "flowbite-react";
import {
  FaCamera,
  FaHotel,
  FaCar,
  FaUserTie,
  FaFemale,
  FaMapMarkerAlt,
  FaArrowRight,
  FaMusic,
  FaGift,
  FaPlane,
  FaPhone,
  FaEnvelope,
  FaDollarSign,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import PostAdvertismentModal from "../components/PostAdvertismentModal";
import homeImage from "../assets/home.jpg";


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
      const response = await fetch("/api/advertisement");
      if (!response.ok) {
        throw new Error("Failed to fetch advertisements");
      }
      
      const data = await response.json();
      // Filter to only show advertisements with status "Approved"
      const approvedAds = (data.data || []).filter(ad => ad.status === "Approved");
      setAdvertisements(approvedAds);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching advertisements:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  // Add this after fetching data
  useEffect(() => {
    if (advertisements.length > 0) {
      console.log("First advertisement image path:", advertisements[0].image);
      console.log("Full image URL:", BACKEND_URL + advertisements[0].image);
    }
  }, [advertisements]);

  // Add this right after your fetchAdvertisements function
  useEffect(() => {
    if (advertisements.length > 0) {
      advertisements.forEach(ad => {
        console.log(`Advertisement ID: ${ad._id}`);
        console.log(`Image path: ${ad.image}`);
        console.log(`Full image URL: ${BACKEND_URL}${ad.image}`);
        
        // Test if image is accessible
        fetch(`${BACKEND_URL}${ad.image}`)
          .then(response => {
            console.log(`Image ${ad._id} status: ${response.status}`);
          })
          .catch(error => {
            console.error(`Error fetching image ${ad._id}:`, error);
          });
      });
    }
  }, [advertisements]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitAdvertisement = (formData) => {
    // After successful submission, refresh the advertisement list
    fetchAdvertisements();
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
          <h3 className="text-xl font-bold mb-2">Error loading advertisements</h3>
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
        className="text-white bg-pink-600 hover:bg-pink-800 mb-8 flex ml-auto"
        onClick={handleOpenModal}
      >
        Post Your Advertisement <FaArrowRight className="mt-1 ml-2" />   
      </Button>
      
      {advertisements.length === 0 ? (
        <div className="text-center text-white p-8">
          <h3 className="text-xl font-bold mb-2">No approved advertisements found</h3>
          <p>Be the first to post an approved advertisement!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {advertisements.map((ad) => (
            <Card key={ad._id} className="transition-shadow duration-300 border border-pink-200 hover:shadow-xl overflow-hidden">
              <div 
                className="relative"
                style={{ 
                  aspectRatio: "210/297", /* A4 aspect ratio */
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${homeImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
              >
                {/* Remove the hidden image with error handler since we're using a local image */}
                <div className="absolute inset-0 flex flex-col p-6">
                  <h3 className="text-xl font-bold mb-4 text-white text-center p-3 mx-auto rounded-lg border-b-2 shadow-lg tracking-wide uppercase" 
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.7)" }}>
                    {ad.title}
                  </h3>
                  
                  <div className="text-white flex-grow text-center p-4 rounded max-w-xl mx-auto bg-black bg-opacity-20 mb-4">
                    <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">
                      {ad.description}
                    </p>
                  </div>
                  
                  <div className="absolute bottom-6 left-0 right-0 text-sm bg-black bg-opacity-30 py-3 px-4 rounded-lg">
                    <div className="flex items-start text-white mb-2">
                      <FaDollarSign className="mr-2 mt-1" />
                      <span><strong>Starting from</strong> ${ad.price}</span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-start text-white">
                        <FaMapMarkerAlt className="mr-2 mt-1" />
                        <span>{ad.location}</span>
                      </div>
                      
                      <div className="flex items-start text-white">
                        <FaPhone className="mr-2 mt-1" />
                        <span>{ad.contactNo}</span>
                      </div>
                      
                      <div className="flex items-start text-white">
                        <FaEnvelope className="mr-2 mt-1" />
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
      <PostAdvertismentModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSubmit={handleSubmitAdvertisement} 
      />
    </div>
  );
};

export default Advertisement;
