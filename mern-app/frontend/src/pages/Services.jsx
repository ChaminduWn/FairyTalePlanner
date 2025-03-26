import React, { useState, useEffect } from "react";
import { Search, MapPin, Tag, Star } from "lucide-react";
import Carrental from "../assets/carrental.jpg";
import Briddal from "../assets/briddal.jpg";
import Groom from "../assets/groomDressing.jpg";
import Photography from "../assets/photography.jpg";
import Location from "../assets/location.jpg";
import Entertain from "../assets/weddingentertainment.webp";

// Expanded dummy services data
const servicesData = [
  {
    id: 1,
    name: "Magical Wedding Photography",
    location: "Colombo",
    price: 1500,
    category: "Photography",
    image: Photography,
    description: "Professional wedding photography with artistic storytelling",
    contactNumber: "+94 77 987 6543",
    email: "shoot@magicalweddings.com",
    rating: 4.8,
    tags: ["Candid", "Traditional", "Destination"],
  },
  {
    id: 2,
    name: "Royal Bridal Couture",
    location: "Kandy",
    price: 2000,
    category: "Bridal Service",
    image: Briddal,
    description: "Exquisite wedding dress design and rental services",
    contactNumber: "+94 81 234 5678",
    email: "royalbridal@wedding.com",
    rating: 4.9,
    tags: ["Designer", "Custom", "Luxury"],
  },
  {
    id: 3,
    name: "Scenic Wedding Locations",
    location: "Galle",
    price: 1200,
    category: "Photo Location",
    image: Location,
    description: "Breathtaking venues for wedding photoshoots",
    contactNumber: "+94 91 456 7890",
    email: "locations@weddingspots.com",
    rating: 4.7,
    tags: ["Beach", "Garden", "Historic"],
  },
  {
    id: 4,
    name: "Groom's Style Haven",
    location: "Colombo",
    price: 800,
    category: "Groom Dressing",
    image: Groom,
    description: "Tailored suits and complete groom styling",
    contactNumber: "+94 77 654 3210",
    email: "groomstyle@wedding.com",
    rating: 4.6,
    tags: ["Tailored", "Modern", "Classic"],
  },
  {
    id: 5,
    name: "Luxury Wedding Cars",
    location: "Gampaha",
    price: 600,
    category: "Car Rental",
    image: Carrental,
    description: "Elegant vintage and modern wedding car rentals",
    contactNumber: "+94 32 987 6543",
    email: "luxurycars@wedding.com",
    rating: 4.5,
    tags: ["Vintage", "Modern", "Luxury"],
  },
  {
    id: 6,
    name: "Wedding Entertainment Experts",
    location: "Colombo",
    price: 1800,
    category: "Entertainment Services",
    image: Entertain,
    description: "Complete wedding entertainment and event management",
    contactNumber: "+94 11 234 5678",
    email: "entertainment@weddingshow.com",
    rating: 4.7,
    tags: ["DJ", "Band", "MC"],
  },
];

// Dummy category images
const categoryImages = {
  Photography: "/api/placeholder/1200/400",
  "Bridal Service": "/api/placeholder/1200/400",
  "Groom Dressing": "/api/placeholder/1200/400",
  "Car Rental": "/api/placeholder/1200/400",
  "Entertainment Services": "/api/placeholder/1200/400",
  "Invitation & Gift Services": "/api/placeholder/1200/400",
};

const ServicesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentCategoryCarousel, setCurrentCategoryCarousel] = useState(0);

  const categories = [
    "Photography",
    "Bridal Service",
    "Groom Dressing",
    "Car Rental",
    "Entertainment Services",
    "Invitation & Gift Services",
  ];

  // Category Carousel Auto-Swipe Effect
  useEffect(() => {
    const categoryCarouselInterval = setInterval(() => {
      setCurrentCategoryCarousel((prev) =>
        prev + 1 >= categories.length ? 0 : prev + 1
      );
    }, 2000); // Change every 2 seconds

    return () => clearInterval(categoryCarouselInterval);
  }, [categories.length]);

  // Filtering services based on search and category
  const filteredServices = servicesData.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory ? service.category === selectedCategory : true)
  );

  // Get current category for carousel
  const currentCategory = categories[currentCategoryCarousel];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8 text-purple-900">
        Wedding Services
      </h1>

      {/* Category Carousel */}
      <div className="mr-8 ml-8 mb-8 w-70%">
        <div
          key={currentCategory}
          className="relative cursor-pointer transform transition-all hover:scale-105"
          onClick={() => setSelectedCategory(currentCategory)}
        >
          <img
            src={categoryImages[currentCategory]}
            alt={currentCategory}
            className="w-60% h-[200px] object-cover rounded-xl shadow-md"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-purple-600 bg-opacity-50 text-white text-center p-4 rounded-b-xl">
            <span className="text-2xl font-bold">{currentCategory}</span>
          </div>
        </div>
      </div>

      {/* Category Filter Buttons */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full transition-all ${
              selectedCategory === category
                ? "bg-purple-600 text-white"
                : "bg-purple-100 text-purple-800 hover:bg-purple-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center bg-white shadow-md rounded-lg w-full max-w-md">
          <Search className="ml-3 text-purple-500" />
          <input
            type="text"
            placeholder="Search services..."
            className="p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Services Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-white shadow-md rounded-lg overflow-hidden group transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            {/* Service Image */}
            <div className="relative h-40 overflow-hidden">
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-full object-cover"
              />
              {/* Category Tag */}
              <span className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded-full text-xs">
                {service.category}
              </span>
            </div>

            {/* Service Details */}
            <div className="p-3">
              {/* Service Name */}
              <h2 className="text-base font-semibold text-purple-900 mb-1 truncate">
                {service.name}
              </h2>

              {/* Location and Price */}
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center text-purple-700 text-sm">
                  <MapPin className="w-3 h-3 mr-1" />
                  <span>{service.location}</span>
                </div>
                <span className="font-bold text-amber-600 text-sm">
                  ${service.price}
                </span>
              </div>

              {/* Description */}
              <p className="text-purple-600 text-xs mb-2 line-clamp-2">
                {service.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-2">
                {service.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center bg-purple-100 text-purple-800 px-1 py-0.5 rounded-full text-[0.6rem]"
                  >
                    <Tag className="w-2 h-2 mr-0.5" />
                    {tag}
                  </span>
                ))}
              </div>

              {/* Rating */}
              <div className="flex items-center text-amber-500 text-sm">
                <Star className="w-4 h-4 mr-1" />
                <span className="font-semibold">{service.rating}/5</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;
