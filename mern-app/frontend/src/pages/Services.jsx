import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/propertyService?toggle=Service', { withCredentials: true });
        setServices(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch services');
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) return <div className="py-10 text-center">Loading...</div>;
  if (error) return <div className="py-10 text-center text-red-500">{error}</div>;

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Services</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <div key={service._id} className="p-4 bg-white rounded-lg shadow-md">
            <img src={service.image} alt={service.name} className="object-cover w-full h-48 mb-4 rounded-md" />
            <h2 className="text-xl font-semibold">{service.name}</h2>
            <p className="text-gray-600">Location: {service.location}</p>
            <p className="text-gray-600">Price: ${service.price}</p>
            <p className="text-gray-600">Category: {service.category}</p>
            <p className="text-gray-600">Contact: {service.contactNumber}</p>
            <p className="text-gray-600">Email: {service.email}</p>
            <p className="mt-2 text-gray-600">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;