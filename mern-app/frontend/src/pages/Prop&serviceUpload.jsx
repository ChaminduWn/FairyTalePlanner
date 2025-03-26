import React, { useState, useRef } from 'react';
import { 
  Upload, 
  MapPin, 
  Tag, 
  Star, 
  Camera, 
  Plus, 
  X, 
  CheckCircle 
} from 'lucide-react';

const UploadPage = () => {
  const [uploadType, setUploadType] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    price: '',
    category: '',
    description: '',
    contactNumber: '',
    email: '',
    tags: []
  });
  const [images, setImages] = useState([]);
  const [newTag, setNewTag] = useState('');
  const fileInputRef = useRef(null);

  // Categories for different upload types
  const categoryOptions = {
    service: [
      "Photography", 
      "Bridal Service", 
      "Groom Dressing", 
      "Car Rental", 
      "Entertainment Services", 
      "Invitation & Gift Services"
    ],
    property: [
      "Hotels", 
      "Honeymoon", 
      "Photo Locations"
    ]
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  // Remove image
  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  // Add tag
  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }));
      setNewTag('');
    }
  };

  // Remove tag
  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    // Combine form data with images for submission
    const submissionData = {
      ...formData,
      uploadType,
      images: images.map(img => img.file)
    };

    console.log('Submission Data:', submissionData);
    alert('Upload successful!');
  };

  return (
    <div className="container mx-auto p-6 bg-purple-50 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-purple-800">
          List Your Wedding Service or Property
        </h1>

        {/* Upload Type Selector */}
        <div className="mb-6">
          <label className="block text-purple-700 font-bold mb-2">
            What are you listing?
          </label>
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              onClick={() => setUploadType('service')}
              className={`px-6 py-3 rounded-lg transition-all flex items-center ${
                uploadType === 'service' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-purple-200 text-purple-700 hover:bg-purple-300'
              }`}
            >
              <Upload className="mr-2" /> Service
            </button>
            <button
              type="button"
              onClick={() => setUploadType('property')}
              className={`px-6 py-3 rounded-lg transition-all flex items-center ${
                uploadType === 'property' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-purple-200 text-purple-700 hover:bg-purple-300'
              }`}
            >
              <MapPin className="mr-2" /> Property
            </button>
          </div>
        </div>

        {/* Upload Form */}
        {uploadType && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-purple-700 mb-2">
                  Business/Property Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter name"
                  required
                />
              </div>
              <div>
                <label className="block text-purple-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="City/Region"
                  required
                />
              </div>
            </div>

            {/* Category and Price */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-purple-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select Category</option>
                  {categoryOptions[uploadType].map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-purple-700 mb-2">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter price"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-purple-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Provide detailed description"
                rows="4"
                required
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-purple-700 mb-2">
                Tags
              </label>
              <div className="flex mb-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="flex-grow p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Add tags"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="bg-purple-600 text-white px-4 rounded-r-lg hover:bg-purple-700"
                >
                  <Plus />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="flex items-center bg-purple-200 text-purple-700 px-2 py-1 rounded-full text-sm"
                  >
                    {tag}
                    <button 
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-amber-500"
                    >
                      <X size={16} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-purple-700 mb-2">
                  Contact Number
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Your contact number"
                  required
                />
              </div>
              <div>
                <label className="block text-purple-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Your email address"
                  required
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-purple-700 mb-2">
                Upload Images
              </label>
              <div 
                className="border-2 border-dashed border-purple-300 p-6 text-center rounded-lg"
                onClick={() => fileInputRef.current.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  multiple
                  accept="image/*"
                  className="hidden"
                />
                <div className="flex justify-center mb-4">
                  <Camera className="text-purple-400 w-12 h-12" />
                </div>
                <p className="text-purple-600">
                  Click to upload or drag and drop images
                </p>
                <p className="text-xs text-purple-500 mt-2">
                  PNG, JPG, WEBP up to 10MB
                </p>
              </div>

              {/* Image Preview */}
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {images.map((image, index) => (
                    <div 
                      key={index} 
                      className="relative group"
                    >
                      <img 
                        src={image.preview} 
                        alt={`Upload ${index}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-amber-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-all flex items-center justify-center mx-auto"
              >
                <CheckCircle className="mr-2" /> Upload Listing
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UploadPage;