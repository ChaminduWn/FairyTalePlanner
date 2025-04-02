import React, { useState, useEffect } from "react";
import { Modal, Button, TextInput, Textarea, Label, FileInput, Select, Toast } from "flowbite-react";
import { FaArrowRight, FaExclamationCircle, FaCheckCircle } from "react-icons/fa";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase"; // Import Firebase app instance
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const PostAdvertismentModal = ({ isOpen, onClose, onSubmit }) => {
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    contactNo: "",
    email: "",
    price: "",
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
  
  // Validation errors
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    email: "",
    contactNo: "",
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
  
  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Run validation for the changed field
    if (name === "title") {
      setErrors({...errors, title: validateTitle(value)});
    } else if (name === "description") {
      setErrors({...errors, description: validateDescription(value)});
    } else if (name === "email") {
      setErrors({...errors, email: validateEmail(value)});
    } else if (name === "contactNo") {
      setErrors({...errors, contactNo: validatePhone(value)});
    } else if (name === "price") {
      setErrors({...errors, price: validatePrice(value)});
    }
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

  // Handle form submission with validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if image is still uploading
    if (imageUploading) {
      displayToast("Please wait until the image is uploaded.");
      return;
    }
    
    // Check if the image has been uploaded
    if (!formData.image) {
      displayToast("Please upload an image");
      return;
    }
    
    // Check if any required field is empty
    if (!formData.title || !formData.description || !formData.category || !formData.location || !formData.contactNo || !formData.email || !formData.price) {
      // Set generic error message for empty fields
      setErrors({
        title: !formData.title ? "Title is required" : validateTitle(formData.title),
        description: !formData.description ? "Description is required" : validateDescription(formData.description),
        email: !formData.email ? "Email is required" : validateEmail(formData.email),
        contactNo: !formData.contactNo ? "Contact number is required" : validatePhone(formData.contactNo),
        price: !formData.price ? "Price is required" : validatePrice(formData.price)
      });
      
      displayToast("Please fill in all required fields");
      return;
    }
    
    // Validate all fields before submission
    const titleError = validateTitle(formData.title);
    const descriptionError = validateDescription(formData.description);
    const emailError = validateEmail(formData.email);
    const phoneError = validatePhone(formData.contactNo);
    const priceError = validatePrice(formData.price);
    
    // Update all errors
    setErrors({
      title: titleError,
      description: descriptionError,
      email: emailError,
      contactNo: phoneError,
      price: priceError
    });
    
    if (titleError || descriptionError || emailError || phoneError || priceError) {
      displayToast("Please correct the errors before submitting");
      return;
    }
    
    try {
      const response = await fetch("http://localhost:4000/api/advertisement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to create advertisement");
      }
      
      const data = await response.json();
      displayToast("Advertisement created successfully!", "success");
      onSubmit?.(data);
      handleClose();
    } catch (error) {
      displayToast(error.message || "Error creating advertisement");
      console.error("Error:", error);
    }
  };

  // Reset form and close modal
  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      location: "",
      contactNo: "",
      email: "",
      price: "",
      image: "",
    });
    setImageFile(null);
    setImagePreview(null);
    setImageUploadProgress(null);
    setErrors({
      title: "",
      description: "",
      email: "",
      contactNo: "",
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
      
      <Modal show={isOpen} onClose={handleClose} size="6xl" >
        <Modal.Header className="bg-[#e8cfee] h-[60px] rounded-t-[10px]">
          Create Advertisement
        </Modal.Header>
        <Modal.Body className="max-h-[76vh] bg-[#d1cfd1]">
          <div className="flex flex-col gap-6 md:flex-row">
            {/* A4 Preview on the left */}
            <div className="flex items-center justify-center p-4 md:w-1/2">
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
                      {formData.title || "Advertisement Title"}
                    </h1>

                    <div className="max-w-md p-4 mx-auto bg-black rounded-lg bg-opacity-30">
                      <p className="mb-3 text-sm leading-relaxed whitespace-pre-wrap">
                        {formData.description || "Your advertisement description will appear here..."}
                      </p>
                    </div>

                    <div className="absolute left-0 right-0 px-4 py-3 text-sm bg-black rounded-lg bottom-6 bg-opacity-30">
                      {formData.price && (
                        <p className="mb-2">
                          <strong>Starting from</strong> {formData.price}
                        </p>
                      )}
                      <div className="space-y-1">
                        {formData.location && <p>📍 {formData.location}</p>}
                        {formData.contactNo && <p>📞 {formData.contactNo}</p>}
                        {formData.email && <p>✉️ {formData.email}</p>}
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
                  <div className="block mb-2">
                    <Label htmlFor="title" value="Title (max 6 words)" />
                  </div>
                  <TextInput
                    id="title"
                    name="title"
                    placeholder="Short and descriptive title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    color={errors.title ? "failure" : undefined}
                    helperText={errors.title}
                  />
                </div>

                <div>
                  <div className="block mb-2">
                    <Label htmlFor="description" value="Description (max 100 words)" />
                  </div>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Detailed description of your service"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={5}
                    color={errors.description ? "failure" : undefined}
                    helperText={errors.description}
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
                    placeholder="Service location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <div className="block mb-2">
                      <Label htmlFor="contactNo" value="Contact Number (digits only)" />
                    </div>
                    <TextInput
                      id="contactNo"
                      name="contactNo"
                      placeholder="Phone number for inquiries"
                      value={formData.contactNo}
                      onChange={handleChange}
                      required
                      color={errors.contactNo ? "failure" : undefined}
                      helperText={errors.contactNo}
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
                      placeholder="Email for communication"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      color={errors.email ? "failure" : undefined}
                      helperText={errors.email}
                    />
                  </div>
                </div>

                <div>
                  <div className="block mb-2">
                    <Label htmlFor="price" value="Price (positive number)" />
                  </div>
                  <TextInput
                    id="price"
                    name="price"
                    placeholder="Price of your service"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    color={errors.price ? "failure" : undefined}
                    helperText={errors.price}
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
                    helperText="Upload a background image for your advertisement (A4 size recommended)"
                  />
                </div>

                {imageUploadProgress && (
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

                <div className="mt-2 text-sm text-gray-500">
                  <p>Preview shows how your advertisement will look in A4 format (210mm × 297mm).</p>
                </div>
              </form>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="bg-[#e8cfee] h-[60px] rounded-b-[10px]">
          <div className="flex justify-end w-full gap-4">
            <Button 
              className="text-white bg-pink-600 hover:bg-pink-800" 
              onClick={handleSubmit}
              disabled={imageUploading}
            >
              {imageUploading ? "Uploading..." : "Create Advertisement"} {!imageUploading && <FaArrowRight className="ml-2" />}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PostAdvertismentModal;