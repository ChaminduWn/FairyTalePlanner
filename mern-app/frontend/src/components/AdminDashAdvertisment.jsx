import React, { useState, useEffect } from "react";
import { Button, Modal, Spinner, Badge, Toast } from "flowbite-react";
import { FaEye, FaTrash, FaCheck, FaTimes, FaEdit, FaArrowRight, FaMapMarkerAlt, FaPhone, FaEnvelope, FaDollarSign } from "react-icons/fa";
import { TextInput, Textarea, Select, Label, FileInput } from "flowbite-react";
import axios from "axios";
import homeImage from "../assets/home.jpg";

const AdminDashAdvertisment = () => {
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAds, setFilteredAds] = useState([]);
  
  // Form state for editing
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  
  // Fetch advertisements from API
  const fetchAdvertisements = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:4000/api/advertisement');
      const formattedAds = response.data.data.map(ad => ({
        id: ad._id,
        title: ad.title,
        date: ad.createdAt,
        status: ad.status.toLowerCase(), 
        description: ad.description,
        category: ad.category,
        price: `$${ad.price}`,
        location: ad.location,
        contactNumber: ad.contactNo.toString(),
        email: ad.email,
        imageUrl: `../../../backend/uploads/1742885812805-image (10).jpg`
      }));
      setAdvertisements(formattedAds);
    } catch (err) {
      console.error("Error fetching advertisements:", err);
      setError("Failed to load advertisements");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAdvertisements();
  }, []);
  
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredAds(advertisements);
      return;
    }
    const query = searchQuery.toLowerCase();
    setFilteredAds(advertisements.filter(ad => 
      ["title"].some(key =>
        ad[key]?.toLowerCase().includes(query)
      )
    ));
  }, [searchQuery, advertisements]);
  
  
  const handleViewAd = (ad) => {
    setSelectedAd(ad);
    setViewModalOpen(true);
    setShowEditForm(false);
    
    // Populate form fields for possible editing
    setTitle(ad.title);
    setDescription(ad.description);
    setCategory(ad.category);
    setPrice(ad.price);
    setLocation(ad.location);
    setContactNumber(ad.contactNumber);
    setEmail(ad.email);
    setImagePreview(ad.imageUrl);
  };
  
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this advertisement?")) {
      try {
        await axios.delete(`http://localhost:4000/api/advertisement/${id}`);
        // Refresh advertisements after deletion
        fetchAdvertisements();
      } catch (err) {
        console.error("Error deleting advertisement:", err);
        setError("Failed to delete advertisement");
      }
    }
  };
  
  const handleAccept = async (id) => {
    try {
      await axios.patch(`http://localhost:4000/api/advertisement/${id}/approve`);
      // Update local state and close modal
      setAdvertisements(advertisements.map(ad => 
        ad.id === id ? {...ad, status: "approved"} : ad
      ));
      setViewModalOpen(false);
      // Refresh advertisements to get updated data
      fetchAdvertisements();
    } catch (err) {
      console.error("Error approving advertisement:", err);
      setError("Failed to approve advertisement");
    }
  };
  
  const handleReject = async (id) => {
    try {
      await axios.patch(`http://localhost:4000/api/advertisement/${id}/reject`);
      // Update local state and close modal
      setAdvertisements(advertisements.map(ad => 
        ad.id === id ? {...ad, status: "rejected"} : ad
      ));
      setViewModalOpen(false);
      // Refresh advertisements to get updated data
      fetchAdvertisements();
    } catch (err) {
      console.error("Error rejecting advertisement:", err);
      setError("Failed to reject advertisement");
    }
  };
  
  const toggleEditForm = () => {
    setShowEditForm(!showEditForm);
  };
  
  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('price', price.replace('$', ''));
      formData.append('location', location);
      formData.append('contactNo', contactNumber);
      formData.append('email', email);
      
      // If there's a new image file
      const imageInput = document.getElementById('image');
      if (imageInput && imageInput.files[0]) {
        formData.append('image', imageInput.files[0]);
      }
      
      await axios.put(`http://localhost:4000/api/advertisement/${selectedAd.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Close form and refresh data
      setShowEditForm(false);
      setViewModalOpen(false);
      fetchAdvertisements();
    } catch (err) {
      console.error("Error updating advertisement:", err);
      setError("Failed to update advertisement");
    }
  };
  
  const getStatusBadge = (status) => {
    switch(status) {
      case "pending":
        return <Badge color="warning">Pending</Badge>;
      case "approved":
        return <Badge color="success">Approved</Badge>;
      case "rejected":
        return <Badge color="failure">Rejected</Badge>;
      case "expired":
        return <Badge color="gray">Expired</Badge>;
      default:
        return <Badge color="gray">Unknown</Badge>;
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-900 text-white">
      <h2 className="text-2xl font-semibold mb-4 text-pink-300">Advertisement Management</h2>
      
      {/* Search bar */}
      <div className="mb-4 flex">
        <div className="relative w-full md:w-1/3">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
          </div>
          <input
            type="search"
            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg block w-full ps-10 p-2.5"
            placeholder="Search advertisements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="absolute inset-y-0 end-0 flex items-center pe-3"
              onClick={() => setSearchQuery("")}
            >
              <svg className="w-4 h-4 text-gray-400 hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {error && (
        <div className="bg-red-800 text-white p-3 rounded-lg mb-4">
          {error}
          <Button size="xs" className="ml-3" onClick={() => setError(null)}>
            Dismiss
          </Button>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-700">
          <thead>
            <tr className="bg-gray-800">
              <th className="px-4 py-3 text-left text-pink-400 font-semibold border-b border-gray-700">Title</th>
              <th className="px-4 py-3 text-left text-pink-400 font-semibold border-b border-gray-700">Date</th>
              <th className="px-4 py-3 text-left text-pink-400 font-semibold border-b border-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-pink-400 font-semibold border-b border-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAds.length > 0 ? (
              filteredAds.map((ad) => (
                <tr key={ad.id} className="bg-gray-800 hover:bg-gray-700 border-b border-gray-700">
                  <td className="px-4 py-3 text-white font-medium">{ad.title}</td>
                  <td className="px-4 py-3 text-gray-300">{new Date(ad.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{getStatusBadge(ad.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <Button size="xs" className="bg-indigo-700 hover:bg-indigo-900" onClick={() => handleViewAd(ad)}>
                        <FaEye className="mr-2" /> View
                      </Button>
                      <Button size="xs" className="bg-red-700 hover:bg-red-900" onClick={() => handleDelete(ad.id)}>
                        <FaTrash className="mr-2" /> Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="bg-gray-800">
                <td colSpan="4" className="px-4 py-6 text-center text-gray-400">
                  No advertisements found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* View/Edit Modal */}
      <Modal show={viewModalOpen} onClose={() => setViewModalOpen(false)} size="6xl">
        <Modal.Header className="bg-[#3a1d4d] h-[60px] rounded-t-[10px] text-white">
          Advertisement Details
        </Modal.Header>
        <Modal.Body className="max-h-[76vh] bg-[#2d2d2d] text-white">
          {selectedAd && (
            <div className="flex flex-col md:flex-row gap-6">
              {/* Preview on the left */}
              <div className={`${showEditForm ? 'md:w-1/2' : 'w-full'} p-4 flex items-center justify-center`}>
                <div className="bg-[#1a1a1a] border border-gray-700 shadow-xl" style={{ 
                  width: "370px", 
                  height: "500px",
                  maxHeight: "70vh",
                  overflow: "hidden"
                }}>
                  {/* Advertisement Preview */}
                  <div 
                    className="w-full h-full relative bg-cover bg-center p-6"
                    style={{
                      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${homeImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center"
                    }}
                  >
                    <div className="text-center text-white">
                      <h1 className="text-3xl font-thin mb-3 tracking-widest" style={{
                        fontFamily: 'Bodoni, serif',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                      }}>
                        {selectedAd.title}
                      </h1>

                      <div className="max-w-md mx-auto bg-black bg-opacity-60 p-4 rounded-lg">
                        <p className="text-sm mb-3 leading-relaxed whitespace-pre-wrap">
                          {selectedAd.description}
                        </p>
                      </div>

                      <div className="absolute bottom-6 left-0 right-0 text-sm bg-black bg-opacity-60 py-3 px-4 rounded-lg">
                        <div className="flex items-start mb-2">
                          <FaDollarSign className="mr-2 mt-1" />
                          <span><strong>Starting from</strong> {selectedAd.price}</span>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-start ">
                            <FaMapMarkerAlt className="mr-2 mt-1" />
                            <span>{selectedAd.location}</span>
                          </div>
                          
                          <div className="flex items-start">
                            <FaPhone className="mr-2 mt-1" />
                            <span>{selectedAd.contactNumber}</span>
                          </div>
                          
                          <div className="flex items-start ">
                            <FaEnvelope className="mr-2 mt-1" />
                            <span>{selectedAd.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Edit Form on the right */}
              {showEditForm && (
                <div className="md:w-1/2 p-4 overflow-y-auto max-h-[70vh] bg-gray-800 rounded-lg">
                  <form className="space-y-4">
                    <div>
                      <div className="mb-2 block">
                        <Label htmlFor="title" value="Title" className="text-white" />
                      </div>
                      <TextInput
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="bg-gray-700 text-white border-gray-600"
                      />
                    </div>

                    <div>
                      <div className="mb-2 block">
                        <Label htmlFor="description" value="Description" className="text-white" />
                      </div>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        rows={5}
                        className="bg-white border-gray-600"
                        // style={{ color: 'white' }}
                        placeholder="Enter description..."
                      />
                    </div>

                    <div>
                      <div className="mb-2 block">
                        <Label htmlFor="category" value="Category" className="text-white" />
                      </div>
                      <Select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        className="bg-white border-gray-600"
                        // style={{ color: 'white' }}
                      >
                        <option value="" disabled style={{ color: 'black' }}>Select a category</option>
                        <option value="Venues" style={{ color: 'black' }}>Venues</option>
                        <option value="Photography" style={{ color: 'black' }}>Photography</option>
                        <option value="Catering" style={{ color: 'black' }}>Catering</option>
                        <option value="Decorations" style={{ color: 'black' }}>Decorations</option>
                        <option value="Entertainment" style={{ color: 'black' }}>Entertainment</option>
                        <option value="Bridal Wear" style={{ color: 'black' }}>Bridal Wear</option>
                        <option value="Other" style={{ color: 'black' }}>Other</option>
                      </Select>
                    </div>

                    <div>
                      <div className="mb-2 block">
                        <Label htmlFor="location" value="Location" className="text-white" />
                      </div>
                      <TextInput
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                        className="bg-white border-gray-600"
                        // style={{ color: 'white' }}
                        placeholder="Enter location..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="mb-2 block">
                          <Label htmlFor="contactNumber" value="Contact Number" className="text-white" />
                        </div>
                        <TextInput
                          id="contactNumber"
                          value={contactNumber}
                          onChange={(e) => setContactNumber(e.target.value)}
                          required
                          className="bg-white border-gray-600"
                          // style={{ color: 'white' }}
                          placeholder="Phone number..."
                        />
                      </div>

                      <div>
                        <div className="mb-2 block">
                          <Label htmlFor="email" value="Email" className="text-white" />
                        </div>
                        <TextInput
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="bg-gray-700 text-white border-gray-600"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 block">
                        <Label htmlFor="price" value="Price" className="text-white" />
                      </div>
                      <TextInput
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        className="bg-gray-700 text-white border-gray-600"
                      />
                    </div>

                    <div>
                      <div className="mb-2 block">
                        <Label htmlFor="image" value="Background Image" className="text-white" />
                      </div>
                      <FileInput
                        id="image"
                        accept="image/*"
                        helperText="Upload a new background image (optional)"
                        className="bg-gray-700 text-white border-gray-600"
                      />
                    </div>
                    
                    <Button className="w-full bg-green-800 hover:bg-green-900" onClick={handleUpdate}>
                      Save Changes
                    </Button>
                  </form>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-[#3a1d4d] h-[60px] rounded-b-[10px]">
          <div className="flex justify-end gap-4 w-full">
            {selectedAd && !showEditForm && (
              <>
                <Button className="bg-green-800 hover:bg-green-900" onClick={() => handleAccept(selectedAd.id)}>
                  <FaCheck className="mr-2" /> Accept
                </Button>
                <Button className="bg-red-800 hover:bg-red-900" onClick={() => handleReject(selectedAd.id)}>
                  <FaTimes className="mr-2" /> Reject
                </Button>
                <Button className="bg-indigo-800 hover:bg-indigo-900" onClick={toggleEditForm}>
                  <FaEdit className="mr-2" /> Edit
                </Button>
              </>
            )}
            <Button className="bg-gray-700 hover:bg-gray-800" onClick={() => {
              setViewModalOpen(false);
              setShowEditForm(false);
            }}>
              Close
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashAdvertisment;