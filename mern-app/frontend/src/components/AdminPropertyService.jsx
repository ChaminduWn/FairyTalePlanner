import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const AdminPropertyService = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [view, setView] = useState("list"); // 'list' or 'form' (for modal)
  const [propertyServiceId, setPropertyServiceId] = useState(null);
  const [propertyServices, setPropertyServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    price: "",
    toggle: "Property",
    category: "",
    image: "",
    contactNumber: "",
    email: "",
    description: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false); // For modal visibility
  const [isEditMode, setIsEditMode] = useState(false); // To distinguish create vs edit

  const [districts] = useState([
    "Ampara",
    "Anuradhapura",
    "Badulla",
    "Batticaloa",
    "Colombo",
    "Galle",
    "Gampaha",
    "Hambantota",
    "Jaffna",
    "Kalutara",
    "Kandy",
    "Kegalle",
    "Kilinochchi",
    "Kurunegala",
    "Mannar",
    "Matale",
    "Matara",
    "Monaragala",
    "Mullaitivu",
    "Nuwara Eliya",
    "Polonnaruwa",
    "Puttalam",
    "Ratnapura",
    "Trincomalee",
    "Vavuniya",
  ]);
  const [categories] = useState([
    "Photography",
    "Bridal Service",
    "Photo Location",
    "Groom Dressing",
    "Car Rental",
    "Entertainment Services",
    "Invitation & Gift Services",
    "Honeymoon",
    "Hotel",
  ]);

  // Fetch all property services on mount
  useEffect(() => {
    fetchPropertyServices();
  }, []);

  const fetchPropertyServices = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:4000/api/propertyService",
        { withCredentials: true }
      );
      setPropertyServices(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err.response?.data || err.message);
      setError("Failed to fetch properties/services");
      setLoading(false);
    }
  };

  const fetchPropertyServiceDetails = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:4000/api/propertyService/${id}`,
        { withCredentials: true }
      );
      setFormData(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err.response?.data || err.message);
      setError("Failed to fetch property/service details");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode && propertyServiceId) {
        await axios.put(
          `http://localhost:4000/api/propertyService/${propertyServiceId}`,
          formData,
          { withCredentials: true }
        );
      } else {
        await axios.post(
          "http://localhost:4000/api/propertyService",
          formData,
          { withCredentials: true }
        );
      }
      setIsModalOpen(false);
      resetForm();
      fetchPropertyServices();
    } catch (err) {
      console.error("Submit error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to save data");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`http://localhost:4000/api/propertyService/${id}`, {
          withCredentials: true,
        });
        setPropertyServices(propertyServices.filter((item) => item._id !== id));
        if (isModalOpen && propertyServiceId === id) {
          setIsModalOpen(false);
          resetForm();
        }
      } catch (err) {
        console.error("Delete error:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Failed to delete item");
      }
    }
  };

  const handleEdit = (id) => {
    setPropertyServiceId(id);
    setIsEditMode(true);
    fetchPropertyServiceDetails(id);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    resetForm();
    setIsEditMode(false);
    setPropertyServiceId(null);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      price: "",
      toggle: "Property",
      category: "",
      image: "",
      contactNumber: "",
      email: "",
      description: "",
    });
    setError(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  if (loading)
    return <div className="py-10 text-center text-[#D4D4D4]">Loading...</div>;

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-6 text-3xl font-bold text-[#D4D4D4]">
        Properties & Services
      </h1>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <button
        onClick={handleCreate}
        className="px-4 py-2 mb-6 text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        Create New
      </button>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {propertyServices.map((item) => (
          <div key={item._id} className="p-4 bg-[#1f1f1f] rounded-lg shadow-md">
            <img
              src={item.image}
              alt={item.name}
              className="object-cover w-full h-48 mb-4 rounded-md"
            />
            <h2 className="text-xl font-semibold text-[#D4D4D4]">
              {item.name}
            </h2>
            <p className="text-[#D4D4D4]">Type: {item.toggle}</p>
            <p className="text-[#D4D4D4]">Location: {item.location}</p>
            <p className="text-[#D4D4D4]">Price: ${item.price}</p>
            <p className="text-[#D4D4D4]">Category: {item.category}</p>
            <p className="text-[#D4D4D4]">Contact: {item.contactNumber}</p>
            <p className="text-[#D4D4D4]">Email: {item.email}</p>
            <p className="mt-2 text-[#D4D4D4]">{item.description}</p>
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => handleEdit(item._id)}
                className="px-4 py-2 text-white bg-yellow-500 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-lg p-6 bg-[#1f1f1f] rounded-lg shadow-md max-h-[80vh] overflow-y-auto">
            <h2 className="mb-4 text-2xl font-bold text-[#D4D4D4]">
              {isEditMode ? "Edit" : "Create"} Property/Service
            </h2>
            {error && <div className="mb-4 text-red-500">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[#D4D4D4] text-sm font-medium">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 bg-[#2a2a2a] text-[#D4D4D4] border border-[#707070] rounded text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-[#D4D4D4] text-sm font-medium">
                  Location
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full p-2 bg-[#2a2a2a] text-[#D4D4D4] border border-[#707070] rounded text-sm"
                  required
                >
                  <option value="">Select Location</option>
                  {districts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[#D4D4D4] text-sm font-medium">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full p-2 bg-[#2a2a2a] text-[#D4D4D4] border border-[#707070] rounded text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-[#D4D4D4] text-sm font-medium">
                  Type
                </label>
                <select
                  name="toggle"
                  value={formData.toggle}
                  onChange={handleChange}
                  className="w-full p-2 bg-[#2a2a2a] text-[#D4D4D4] border border-[#707070] rounded text-sm"
                  required
                >
                  <option value="Property">Property</option>
                  <option value="Service">Service</option>
                </select>
              </div>
              <div>
                <label className="block text-[#D4D4D4] text-sm font-medium">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-2 bg-[#2a2a2a] text-[#D4D4D4] border border-[#707070] rounded text-sm"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[#D4D4D4] text-sm font-medium">
                  Image URL
                </label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full p-2 bg-[#2a2a2a] text-[#D4D4D4] border border-[#707070] rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-[#D4D4D4] text-sm font-medium">
                  Contact Number
                </label>
                <input
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="w-full p-2 bg-[#2a2a2a] text-[#D4D4D4] border border-[#707070] rounded text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-[#D4D4D4] text-sm font-medium">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 bg-[#2a2a2a] text-[#D4D4D4] border border-[#707070] rounded text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-[#D4D4D4] text-sm font-medium">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-2 bg-[#2a2a2a] text-[#D4D4D4] border border-[#707070] rounded text-sm"
                  rows="4"
                  required
                ></textarea>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                  {isEditMode ? "Update" : "Create"}
                </button>
                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => handleDelete(propertyServiceId)}
                    className="px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                )}
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm text-white bg-gray-500 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPropertyService;
