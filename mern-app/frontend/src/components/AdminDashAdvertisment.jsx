import React, { useState, useEffect } from "react";
import { Button, Modal, Spinner, Badge, Toast } from "flowbite-react";
import { FaEye, FaTrash, FaCheck, FaTimes, FaEdit, FaArrowRight, FaMapMarkerAlt, FaPhone, FaEnvelope, FaDollarSign, FaExclamationCircle, FaCheckCircle } from "react-icons/fa";
import { TextInput, Textarea, Select, Label, FileInput } from "flowbite-react";
import axios from "axios";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase"; // Import Firebase app instance

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
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    location: "",
    contactNo: "",
    email: "",
    image: "",
  });
  
  // Image handling states
  const [imageFile, setImageFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("error");
  
  // Show toast message
  const displayToast = (message, type = "error") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    // Auto hide after 3 seconds
    setTimeout(() => setShowToast(false), 3000);
  };
  
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
        price: ad.price,
        location: ad.location,
        contactNo: ad.contactNo.toString(),
        email: ad.email,
        image: ad.image
      }));
      setAdvertisements(formattedAds);
      setFilteredAds(formattedAds);
    } catch (err) {
      console.error("Error fetching advertisements:", err);
      setError("Failed to load advertisements");
      displayToast("Failed to load advertisements", "error");
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
      ["title", "category", "location"].some(key =>
        ad[key]?.toLowerCase().includes(query)
      )
    ));
  }, [searchQuery, advertisements]);
  
  const handleViewAd = (ad) => {
    setSelectedAd(ad);
    setViewModalOpen(true);
    setShowEditForm(false);
    
    // Populate form fields for possible editing
    setFormData({
      title: ad.title,
      description: ad.description,
      category: ad.category,
      price: ad.price,
      location: ad.location,
      contactNo: ad.contactNo,
      email: ad.email,
      image: ad.image
    });
    
    setImagePreview(ad.image);
  };
  
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this advertisement?")) {
      try {
        await axios.delete(`http://localhost:4000/api/advertisement/${id}`);
        // Refresh advertisements after deletion
        displayToast("Advertisement deleted successfully", "success");
        fetchAdvertisements();
      } catch (err) {
        console.error("Error deleting advertisement:", err);
        setError("Failed to delete advertisement");
        displayToast("Failed to delete advertisement", "error");
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
      displayToast("Advertisement approved successfully", "success");
      // Refresh advertisements to get updated data
      fetchAdvertisements();
    } catch (err) {
      console.error("Error approving advertisement:", err);
      setError("Failed to approve advertisement");
      displayToast("Failed to approve advertisement", "error");
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
      displayToast("Advertisement rejected", "success");
      // Refresh advertisements to get updated data
      fetchAdvertisements();
    } catch (err) {
      console.error("Error rejecting advertisement:", err);
      setError("Failed to reject advertisement");
      displayToast("Failed to reject advertisement", "error");
    }
  };
  
  const toggleEditForm = () => {
    setShowEditForm(!showEditForm);
    setImageUploadProgress(null);
    setImageUploading(false);
    setImageUploadError(null);
  };
  
  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Upload image to Firebase when the image file changes
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);
  
  const uploadImage = async () => {
    setImageUploading(true);
    setImageUploadError(null);
    const storage = getStorage(app); // Firebase storage instance
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageUploadError("Error uploading image. Please try again.");
        setImageUploadProgress(null);
        setImageUploading(false);
        displayToast("Error uploading image!", "error");
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setFormData((prev) => ({ ...prev, image: downloadURL }));
        setImageUploading(false);
        displayToast("Image uploaded successfully!", "success");
      }
    );
  };
  
  const handleUpdate = async () => {
    try {
      // Check if image is still uploading
      if (imageUploading) {
        displayToast("Please wait until the image is uploaded.");
        return;
      }
      
      // Prepare data for update
      const updateData = { ...formData };
      
      // Remove $ from price if it exists
      if (typeof updateData.price === 'string' && updateData.price.startsWith('$')) {
        updateData.price = updateData.price.substring(1);
      }
      
      await axios.put(`http://localhost:4000/api/advertisement/${selectedAd.id}`, updateData);
      
      // Close form and refresh data
      displayToast("Advertisement updated successfully!", "success");
      setShowEditForm(false);
      setViewModalOpen(false);
      fetchAdvertisements();
    } catch (err) {
      console.error("Error updating advertisement:", err);
      setError("Failed to update advertisement");
      displayToast("Failed to update advertisement", "error");
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
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="p-4 text-white bg-gray-900">
      {/* Toast notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-[9999]">
          <Toast className="shadow-lg">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg shrink-0">
              {toastType === "error" ? (
                <FaExclamationCircle className="w-5 h-5 text-red-500" />
              ) : (
                <FaCheckCircle className="w-5 h-5 text-green-500" />
              )}
            </div>
            <div className="ml-3 text-sm font-normal">
              {toastMessage}
            </div>
            <Toast.Toggle onDismiss={() => setShowToast(false)} />
          </Toast>
        </div>
      )}
      
      <h2 className="mb-4 text-2xl font-semibold text-pink-300">Advertisement Management</h2>
      
      {/* Search bar */}
      <div className="flex mb-4">
        <div className="relative w-full md:w-1/3">
          <div className="absolute inset-y-0 flex items-center pointer-events-none start-0 ps-3">
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
              className="absolute inset-y-0 flex items-center end-0 pe-3"
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
        <div className="p-3 mb-4 text-white bg-red-800 rounded-lg">
          {error}
          <Button size="xs" className="ml-3" onClick={() => setError(null)}>
            Dismiss
          </Button>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full border border-collapse border-gray-700">
          <thead>
            <tr className="bg-gray-800">
              <th className="px-4 py-3 font-semibold text-left text-pink-400 border-b border-gray-700">Title</th>
              <th className="px-4 py-3 font-semibold text-left text-pink-400 border-b border-gray-700">Date</th>
              <th className="px-4 py-3 font-semibold text-left text-pink-400 border-b border-gray-700">Status</th>
              <th className="px-4 py-3 font-semibold text-left text-pink-400 border-b border-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAds.length > 0 ? (
              filteredAds.map((ad) => (
                <tr key={ad.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700">
                  <td className="px-4 py-3 font-medium text-white">{ad.title}</td>
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
        <Modal.Header className="bg-[#e8cfee] h-[60px] rounded-t-[10px]">
          Advertisement Details
        </Modal.Header>
        <Modal.Body className="max-h-[76vh] bg-[#d1cfd1]">
          {selectedAd && (
            <div className="flex flex-col gap-6 md:flex-row">
              {/* Preview on the left */}
              <div className={`${showEditForm ? 'md:w-1/2' : 'w-full'} p-4 flex items-center justify-center`}>
                <div className="bg-[#fff] border shadow-md" style={{ 
                  width: "370px", 
                  height: "600px",
                  maxHeight: "70vh",
                  overflow: "hidden"
                }}>
                  {/* Advertisement Preview */}
                  <div 
                    className="relative w-full h-full p-6 bg-center bg-cover"
                    style={{
                      backgroundImage: imagePreview ? 
                        `url(${imagePreview})` : 
                        'url("/api/placeholder/800/1200")',
                      backgroundBlendMode: 'overlay',
                      backgroundColor: 'rgba(0,0,0,0.5)'
                    }}
                  >
                    <div className="text-center text-white">
                      <h1 className="mb-3 text-3xl font-thin tracking-widest" style={{
                        fontFamily: 'Bodoni, serif',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                      }}>
                        {formData.title}
                      </h1>

                      <div className="max-w-md p-4 mx-auto bg-black rounded-lg bg-opacity-30">
                        <p className="mb-3 text-sm leading-relaxed whitespace-pre-wrap">
                          {formData.description}
                        </p>
                      </div>

                      <div className="absolute left-0 right-0 px-4 py-3 text-sm bg-black rounded-lg bottom-6 bg-opacity-30">
                        <div className="flex items-start mb-2">
                          <FaDollarSign className="mt-1 mr-2" />
                          <span><strong>Starting from</strong> {formData.price}</span>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-start">
                            <FaMapMarkerAlt className="mt-1 mr-2" />
                            <span>{formData.location}</span>
                          </div>
                          
                          <div className="flex items-start">
                            <FaPhone className="mt-1 mr-2" />
                            <span>{formData.contactNo}</span>
                          </div>
                          
                          <div className="flex items-start">
                            <FaEnvelope className="mt-1 mr-2" />
                            <span>{formData.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Edit Form on the right */}
              {showEditForm && (
                <div className="md:w-1/2 p-4 overflow-y-auto max-h-[70vh]">
                  <form className="space-y-4">
                    <div>
                      <div className="block mb-2">
                        <Label htmlFor="title" value="Title" />
                      </div>
                      <TextInput
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div>
                      <div className="block mb-2">
                        <Label htmlFor="description" value="Description" />
                      </div>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={5}
                      />
                    </div>

                    <div>
                      <div className="block mb-2">
                        <Label htmlFor="category" value="Category" />
                      </div>
                      <Select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                      >
                        <option value="" disabled>Select a category</option>
                        <option value="Venues">Venues</option>
                        <option value="Photography">Photography</option>
                        <option value="Catering">Catering</option>
                        <option value="Decorations">Decorations</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Bridal Wear">Bridal Wear</option>
                        <option value="Other">Other</option>
                      </Select>
                    </div>

                    <div>
                      <div className="block mb-2">
                        <Label htmlFor="location" value="Location" />
                      </div>
                      <TextInput
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <div className="block mb-2">
                          <Label htmlFor="contactNo" value="Contact Number" />
                        </div>
                        <TextInput
                          id="contactNo"
                          name="contactNo"
                          value={formData.contactNo}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div>
                        <div className="block mb-2">
                          <Label htmlFor="email" value="Email" />
                        </div>
                        <TextInput
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <div className="block mb-2">
                        <Label htmlFor="price" value="Price" />
                      </div>
                      <TextInput
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div>
                      <div className="block mb-2">
                        <Label htmlFor="image" value="Background Image" />
                      </div>
                      <FileInput
                        id="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        helperText="Upload a new background image (optional)"
                      />
                    </div>

                    {imageUploadProgress !== null && (
                      <div className="flex justify-center">
                        <div style={{ width: 80, height: 80 }}>
                          <CircularProgressbar
                            value={imageUploadProgress || 0}
                            text={`${imageUploadProgress}%`}
                            strokeWidth={5}
                          />
                        </div>
                      </div>
                    )}
                    
                    {imageUploadError && (
                      <p className="text-red-500 error">
                        {imageUploadError}
                      </p>
                    )}
                    
                    <Button 
                      className="w-full text-white bg-pink-600 hover:bg-pink-800" 
                      onClick={handleUpdate}
                      disabled={imageUploading}
                    >
                      {imageUploading ? "Uploading..." : "Save Changes"} {!imageUploading && <FaArrowRight className="ml-2" />}
                    </Button>
                  </form>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-[#e8cfee] h-[60px] rounded-b-[10px]">
          <div className="flex justify-end w-full gap-4">
            {selectedAd && !showEditForm && (
              <>
                <Button className="bg-green-600 hover:bg-green-800" onClick={() => handleAccept(selectedAd.id)}>
                  <FaCheck className="mr-2" /> Accept
                </Button>
                <Button className="bg-red-600 hover:bg-red-800" onClick={() => handleReject(selectedAd.id)}>
                  <FaTimes className="mr-2" /> Reject
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-800" onClick={toggleEditForm}>
                  <FaEdit className="mr-2" /> Edit
                </Button>
              </>
            )}
            <Button className="bg-gray-600 hover:bg-gray-800" onClick={() => {
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