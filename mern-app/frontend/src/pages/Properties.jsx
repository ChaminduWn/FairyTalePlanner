import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/propertyService?toggle=Property', { withCredentials: true });
        setProperties(response.data.data);
        setFilteredProperties(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch properties');
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  useEffect(() => {
    let filtered = [...properties];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.location.toLowerCase().includes(term)
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    if (priceFilter) {
      filtered = filtered.filter((p) => {
        const price = Number(p.price);
        if (priceFilter === 'low') return price < 100000;
        if (priceFilter === 'mid') return price >= 100000 && price <= 300000;
        if (priceFilter === 'high') return price > 300000;
        return true;
      });
    }

    setFilteredProperties(filtered);
  }, [searchTerm, categoryFilter, priceFilter, properties]);

  if (loading) return <div className="py-10 text-center">Loading...</div>;
  if (error) return <div className="py-10 text-center text-red-500">{error}</div>;

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Properties</h1>

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
          <option value="Photo Location">Photo Location</option>
          <option value="Honeymoon">Honeymoon</option>
          <option value="Hotel">Hotel</option>
          {/* Add other categories as needed */}
        </select>

        <select
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">All Prices</option>
          <option value="low">Below $100k</option>
          <option value="mid">$100k - $300k</option>
          <option value="high">Above $300k</option>
        </select>
      </div>

      {/* Property Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProperties.map((property) => (
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
