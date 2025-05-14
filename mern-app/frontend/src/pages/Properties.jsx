import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/propertyService?toggle=Property', { withCredentials: true });
        setProperties(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch properties');
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  if (loading) return <div className="py-10 text-center">Loading...</div>;
  if (error) return <div className="py-10 text-center text-red-500">{error}</div>;

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Properties</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <div key={property._id} className="p-4 bg-white rounded-lg shadow-md">
            <img src={property.image} alt={property.name} className="object-cover w-full h-48 mb-4 rounded-md" />
            <h2 className="text-xl font-semibold">{property.name}</h2>
            <p className="text-gray-600">Location: {property.location}</p>
            <p className="text-gray-600">Price: ${property.price}</p>
            <p className="text-gray-600">Category: {property.category}</p>
            <p className="text-gray-600">Contact: {property.contactNumber}</p>
            <p className="text-gray-600">Email: {property.email}</p>
            <p className="mt-2 text-gray-600">{property.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Properties;