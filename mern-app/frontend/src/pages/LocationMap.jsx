// LocationMap.jsx
import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const categories = [
  { name: "Photography", color: "#FF5733", icon: "📷" },
  { name: "Bridal Service", color: "#FFC0CB", icon: "👰" },
  { name: "Photo Location", color: "#33FF57", icon: "🏞️" },
  { name: "Groom Dressing", color: "#3357FF", icon: "🤵" },
  { name: "Car Rental", color: "#000000", icon: "🚗" },
  { name: "Entertainment Services", color: "#9933FF", icon: "🎭" },
  { name: "Invitation & Gift Services", color: "#FF33E9", icon: "🎁" },
  { name: "Honeymoon", color: "#FF9933", icon: "🏝️" },
  { name: "Hotel", color: "#33FFF9", icon: "🏨" }
];

const mapContainerStyle = {
  width: '100%',
  height: '500px'
};

const center = {
  lat: 7.8731, // Default center (Sri Lanka)
  lng: 80.7718
};

function LocationMap() {
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newLocation, setNewLocation] = useState({
    name: "",
    address: "",
    category: categories[0].name,
    lat: "",
    lng: ""
  });
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);

  // Fetch locations from backend
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('/api/location');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setLocations(data);
        setFilteredLocations(data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    
    fetchLocations();
  }, []);

  // Filter locations based on selected category
  useEffect(() => {
    if (selectedCategory) {
      setFilteredLocations(locations.filter(loc => loc.category === selectedCategory));
    } else {
      setFilteredLocations(locations);
    }
  }, [selectedCategory, locations]);

  // Handle map click for adding new location
  const handleMapClick = (event) => {
    if (isAddingLocation) {
      setNewLocation({
        ...newLocation,
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      });
    }
  };

  // Save new location
  const handleSaveLocation = async () => {
    try {
      const response = await fetch('/api/location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLocation),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setLocations([...locations, data]);
      setNewLocation({
        name: "",
        address: "",
        category: categories[0].name,
        lat: "",
        lng: ""
      });
      setIsAddingLocation(false);
    } catch (error) {
      console.error("Error saving location:", error);
    }
  };

  // Find category details
  const getCategoryDetails = (categoryName) => {
    return categories.find(cat => cat.name === categoryName) || {};
  };

  // Get marker icon based on category
  const getMarkerIcon = (category) => {
    const categoryDetails = getCategoryDetails(category);
    return {
      path: window.google.maps.SymbolPath.CIRCLE,
      fillColor: categoryDetails.color,
      fillOpacity: 1,
      scale: 8,
      strokeColor: 'white',
      strokeWeight: 2
    };
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold text-center">Wedding Service Locations</h1>
      
      {/* Category Filter */}
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-900">Filter by Category:</label>
        <select 
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.name} value={category.name}>{category.name}</option>
          ))}
        </select>
      </div>
      
      {/* Category Legend */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <div 
            key={category.name} 
            className="flex items-center gap-1 p-1 text-sm rounded"
            style={{ backgroundColor: `${category.color}30` }}
          >
            <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></span>
            <span>{category.name}</span>
          </div>
        ))}
      </div>
      
      {/* Add Location Controls */}
      <div className="mb-6">
        {!isAddingLocation ? (
          <button 
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            onClick={() => setIsAddingLocation(true)}
          >
            Add New Location
          </button>
        ) : (
          <div className="p-4 bg-gray-100 rounded">
            <h3 className="mb-3 font-bold">Add New Location</h3>
            <p className="mb-2 text-sm text-gray-700">Click on the map to set location coordinates or enter them manually.</p>
            
            <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-900">Name</label>
                <input 
                  type="text" 
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  value={newLocation.name}
                  onChange={(e) => setNewLocation({...newLocation, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-900">Address</label>
                <input 
                  type="text" 
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  value={newLocation.address}
                  onChange={(e) => setNewLocation({...newLocation, address: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-900">Category</label>
                <select 
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  value={newLocation.category}
                  onChange={(e) => setNewLocation({...newLocation, category: e.target.value})}
                >
                  {categories.map((category) => (
                    <option key={category.name} value={category.name}>{category.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-900">Latitude</label>
                  <input 
                    type="text" 
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    value={newLocation.lat}
                    onChange={(e) => setNewLocation({...newLocation, lat: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-900">Longitude</label>
                  <input 
                    type="text" 
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    value={newLocation.lng}
                    onChange={(e) => setNewLocation({...newLocation, lng: e.target.value})}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
                onClick={handleSaveLocation}
                disabled={!newLocation.name || !newLocation.category || !newLocation.lat || !newLocation.lng}
              >
                Save Location
              </button>
              <button 
                className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700"
                onClick={() => setIsAddingLocation(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Google Map Component */}
      <LoadScript googleMapsApiKey="AIzaSyBxwUZXzqzRJ6UgwCIcNFIMSV5LurxF314">
      {/* <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}> */}

        <GoogleMap 
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={8}
          onClick={handleMapClick}
          onLoad={map => setMapInstance(map)}
        >
          {/* Render filtered locations on map */}
          {filteredLocations.map((location) => (
            <Marker
              key={location._id}
              position={{ lat: parseFloat(location.lat), lng: parseFloat(location.lng) }}
              icon={getMarkerIcon(location.category)}
              onClick={() => setSelectedMarker(location)}
            />
          ))}
          
          {/* Add temporary marker for new location */}
          {isAddingLocation && newLocation.lat && newLocation.lng && (
            <Marker
              position={{ lat: parseFloat(newLocation.lat), lng: parseFloat(newLocation.lng) }}
              icon={getMarkerIcon(newLocation.category)}
            />
          )}
          
          {/* Info Window for selected marker */}
          {selectedMarker && (
            <InfoWindow
              position={{ lat: parseFloat(selectedMarker.lat), lng: parseFloat(selectedMarker.lng) }}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div className="p-2">
                <h3 className="font-bold">{selectedMarker.name}</h3>
                <p className="text-sm">{selectedMarker.address}</p>
                <div className="flex items-center mt-1">
                  <span className="inline-block w-3 h-3 mr-1 rounded-full" 
                        style={{ backgroundColor: getCategoryDetails(selectedMarker.category).color }}></span>
                  <span className="text-sm">{selectedMarker.category}</span>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default LocationMap;