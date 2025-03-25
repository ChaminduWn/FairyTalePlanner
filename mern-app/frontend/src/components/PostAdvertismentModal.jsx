import React, { useState } from "react";
import { Modal, Button, TextInput, Textarea, Label, FileInput, Select, Toast } from "flowbite-react";
import { FaArrowRight, FaUpload, FaMapMarkerAlt, FaPhone, FaEnvelope, FaDollarSign, FaExclamationCircle, FaCheckCircle } from "react-icons/fa";

const PostAdvertismentModal = ({ isOpen, onClose, onSubmit }) => {
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [price, setPrice] = useState("");
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("error");
  
  // Validation errors
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    email: "",
    contactNumber: "",
    price: ""
  });
  
  // Show toast message
  const displayToast = (message, type = "error") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    // Auto hide after 3 seconds
    setTimeout(() => setShowToast(false), 3000);
  };
  
  // Validation functions
  const validateTitle = (value) => {
    const wordCount = value.trim().split(/\s+/).filter(word => word !== "").length;
    return wordCount <= 6 ? "" : "Title should not exceed 6 words";
  };
  
  const validateDescription = (value) => {
    const wordCount = value.trim().split(/\s+/).filter(word => word !== "").length;
    return wordCount <= 100 ? "" : "Description should not exceed 100 words";
  };
  
  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? "" : "Please enter a valid email address";
  };
  
  const validatePhone = (value) => {
    const phoneRegex = /^\d+$/;
    return phoneRegex.test(value) ? "" : "Contact number should contain only digits";
  };
  
  const validatePrice = (value) => {
    const priceRegex = /^[1-9]\d*(\.\d+)?$/;
    return priceRegex.test(value) ? "" : "Price should be a positive number";
  };
  
  // Handle input change with validation
  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);
    setErrors({...errors, title: validateTitle(value)});
  };
  
  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescription(value);
    setErrors({...errors, description: validateDescription(value)});
  };
  
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setErrors({...errors, email: validateEmail(value)});
  };
  
  const handleContactNumberChange = (e) => {
    const value = e.target.value;
    setContactNumber(value);
    setErrors({...errors, contactNumber: validatePhone(value)});
  };
  
  const handlePriceChange = (e) => {
    const value = e.target.value;
    setPrice(value);
    setErrors({...errors, price: validatePrice(value)});
  };
  
  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackgroundImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission with validation
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if any required field is empty
    if (!title || !description || !category || !location || !contactNumber || !email || !price) {
      // Set generic error message for empty fields
      setErrors({
        title: !title ? "Title is required" : validateTitle(title),
        description: !description ? "Description is required" : validateDescription(description),
        email: !email ? "Email is required" : validateEmail(email),
        contactNumber: !contactNumber ? "Contact number is required" : validatePhone(contactNumber),
        price: !price ? "Price is required" : validatePrice(price)
      });
      
      // Show toast for required fields
      if (!category || !location) {
        displayToast("Please fill in all required fields");
      }
      
      return;
    }
    
    // Validate all fields before submission
    const titleError = validateTitle(title);
    const descriptionError = validateDescription(description);
    const emailError = validateEmail(email);
    const phoneError = validatePhone(contactNumber);
    const priceError = validatePrice(price);
    
    // Update all errors
    setErrors({
      title: titleError,
      description: descriptionError,
      email: emailError,
      contactNumber: phoneError,
      price: priceError
    });
    
    if (titleError || descriptionError || emailError || phoneError || priceError) {
      displayToast("Please correct the errors before submitting");
      return;
    }
    
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("location", location);
    formData.append("contactNo", contactNumber);
    formData.append("email", email);
    formData.append("price", price);
    if (backgroundImage) {
      formData.append("image", backgroundImage);
    }
    
    // Set loading state
    setIsLoading(true);
    
    // Add actual API call
    fetch("http://localhost:4000/api/advertisement", {
      method: "POST",
      body: formData,
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(data => {
          throw new Error(data.message || "Failed to create advertisement");
        });
      }
      return response.json();
    })
    .then(data => {
      setIsLoading(false);
      displayToast("Advertisement created successfully!", "success");
      onSubmit?.(data);
      handleClose();
    })
    .catch(error => {
      setIsLoading(false);
      displayToast(error.message || "Error creating advertisement");
      console.error("Error:", error);
    });
  };

  // Reset form and close modal
  const handleClose = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setLocation("");
    setContactNumber("");
    setEmail("");
    setPrice("");
    setBackgroundImage(null);
    setImagePreview(null);
    setErrors({
      title: "",
      description: "",
      email: "",
      contactNumber: "",
      price: ""
    });
    onClose?.();
  };

  return (
    <>
      {/* Toast notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-[9999]">
          <Toast className="shadow-lg">
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
              {toastType === "error" ? (
                <FaExclamationCircle className="h-5 w-5 text-red-500" />
              ) : (
                <FaCheckCircle className="h-5 w-5 text-green-500" />
              )}
            </div>
            <div className="ml-3 text-sm font-normal">
              {toastMessage}
            </div>
            <Toast.Toggle onDismiss={() => setShowToast(false)} />
          </Toast>
        </div>
      )}
      
      <Modal show={isOpen} onClose={handleClose} size="6xl" >
        <Modal.Header className="bg-[#e8cfee] h-[60px] rounded-t-[10px]">
          Create Advertisement
        </Modal.Header>
        <Modal.Body className="max-h-[76vh] bg-[#d1cfd1]">
          <div className="flex flex-col md:flex-row gap-6">
            {/* A4 Preview on the left */}
            <div className="md:w-1/2 p-4 flex items-center justify-center">
              <div className="bg-[#fff] border shadow-md" style={{ 
                  width: "370px", 
                  height: "6600px",
                  maxHeight: "70vh",
                  overflow: "hidden"
                }}>
                {/* Advertisement Preview */}
                <div 
                  className="w-full h-full relative bg-cover bg-center p-6"
                  style={{
                    backgroundImage: imagePreview ? 
                      `url(${imagePreview})` : 
                      'url("/api/placeholder/800/1200")',
                    backgroundBlendMode: 'overlay',
                    backgroundColor: 'rgba(0,0,0,0.5)'
                  }}
                >
                  <div className="text-center text-white">
                    <h1 className="text-3xl font-thin mb-3 tracking-widest" style={{
                      fontFamily: 'Bodoni, serif',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                    }}>
                      {title || "Advertisement Title"}
                    </h1>

                    <div className="max-w-md mx-auto bg-black bg-opacity-30 p-4 rounded-lg">
                      <p className="text-sm mb-3 leading-relaxed whitespace-pre-wrap">
                        {description || "Your advertisement description will appear here..."}
                      </p>
                    </div>

                    <div className="absolute bottom-6 left-0 right-0 text-sm bg-black bg-opacity-30 py-3 px-4 rounded-lg">
                      {price && (
                        <p className="mb-2">
                          <strong>Starting from</strong> {price}
                        </p>
                      )}
                      <div className="space-y-1">
                        {location && <p>📍 {location}</p>}
                        {contactNumber && <p>📞 {contactNumber}</p>}
                        {email && <p>✉️ {email}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form on the right */}
            <div className="md:w-1/2 p-4 overflow-y-auto max-h-[70vh]">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="title" value="Title (max 6 words)" />
                  </div>
                  <TextInput
                    id="title"
                    placeholder="Short and descriptive title"
                    value={title}
                    onChange={handleTitleChange}
                    required
                    color={errors.title ? "failure" : undefined}
                    helperText={errors.title}
                  />
                </div>

                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="description" value="Description (max 100 words)" />
                  </div>
                  <Textarea
                    id="description"
                    placeholder="Detailed description of your service"
                    value={description}
                    onChange={handleDescriptionChange}
                    required
                    rows={5}
                    color={errors.description ? "failure" : undefined}
                    helperText={errors.description}
                  />
                </div>

                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="category" value="Category" />
                  </div>
                  <Select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
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
                  <div className="mb-2 block">
                    <Label htmlFor="location" value="Location" />
                  </div>
                  <TextInput
                    id="location"
                    placeholder="Service location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    icon={FaMapMarkerAlt}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="contactNumber" value="Contact Number (digits only)" />
                    </div>
                    <TextInput
                      id="contactNumber"
                      placeholder="Phone number for inquiries"
                      value={contactNumber}
                      onChange={handleContactNumberChange}
                      required
                      icon={FaPhone}
                      color={errors.contactNumber ? "failure" : undefined}
                      helperText={errors.contactNumber}
                    />
                  </div>

                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="email" value="Email" />
                    </div>
                    <TextInput
                      id="email"
                      type="email"
                      placeholder="Email for communication"
                      value={email}
                      onChange={handleEmailChange}
                      required
                      icon={FaEnvelope}
                      color={errors.email ? "failure" : undefined}
                      helperText={errors.email}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="price" value="Price (positive number)" />
                  </div>
                  <TextInput
                    id="price"
                    placeholder="Price of your service"
                    value={price}
                    onChange={handlePriceChange}
                    required
                    icon={FaDollarSign}
                    color={errors.price ? "failure" : undefined}
                    helperText={errors.price}
                  />
                </div>

                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="image" value="Background Image" />
                  </div>
                  <FileInput
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    helperText="Upload a background image for your advertisement (A4 size recommended)"
                  />
                </div>

                <div className="text-sm text-gray-500 mt-2">
                  <p>Preview shows how your advertisement will look in A4 format (210mm × 297mm).</p>
                </div>
              </form>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="bg-[#e8cfee] h-[60px] rounded-b-[10px]">
          <div className="flex justify-end gap-4 w-full">
            <Button 
              className="text-white bg-pink-600 hover:bg-pink-800" 
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Advertisement"} {!isLoading && <FaArrowRight className="mt-1 ml-2" />}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PostAdvertismentModal;