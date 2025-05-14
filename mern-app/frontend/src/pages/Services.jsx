import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Services = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/propertyService?toggle=Service', {
          withCredentials: true,
        });
        setServices(response.data.data);
        setFilteredServices(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch services');
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    let filtered = [...services];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(term) ||
          s.location.toLowerCase().includes(term)
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter((s) => s.category === categoryFilter);
    }

    if (priceFilter) {
      filtered = filtered.filter((s) => {
        const price = Number(s.price);
        if (priceFilter === 'low') return price < 35000;
        if (priceFilter === 'mid') return price >= 35000 && price <= 45000;
        if (priceFilter === 'high') return price > 45000;
        return true;
      });
    }

    setFilteredServices(filtered);
  }, [searchTerm, categoryFilter, priceFilter, services]);

  if (loading) return <div className="py-10 text-center">Loading...</div>;
  if (error) return <div className="py-10 text-center text-red-500">{error}</div>;

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Services</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
        <input
          type="text"
          placeholder="Search by name or location"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">All Categories</option>
          <option value="Photography">Photography</option>
          <option value="Bridal Service">Bridal Service</option>
          <option value="Groom Dressing">Groom Dressing</option>
          <option value="Car Rental">Car Rental</option>
          {/* Add other categories as needed */}
        </select>

        <select
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">All Prices</option>
          <option value="low">Below $35000</option>
          <option value="mid">$35000 - $45000</option>
          <option value="high">Above $45000</option>
        </select>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredServices.map((service) => (
          <div key={service._id} className="p-4 bg-white rounded-lg shadow-md">
            <img
              src={service.image}
              alt={service.name}
              className="object-cover w-full h-48 mb-4 rounded-md"
            />
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
