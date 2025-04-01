import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { PlusCircle, Trash2, Edit2, AlertTriangle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const YourLocations = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  
  useEffect(() => {
    const fetchUserLocations = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/api/location/user', {
          withCredentials: true
        });
        setLocations(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load your locations. Please try again later.');
        console.error('Error fetching user locations:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserLocations();
  }, []);

  const handleDelete = async (locationId) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      try {
        await axios.delete(`/api/location/user/${locationId}`, {
          withCredentials: true
        });
        setLocations(locations.filter(location => location._id !== locationId));
      } catch (err) {
        console.error('Error deleting location:', err);
        alert('Failed to delete location. Please try again.');
      }
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved':
        return <span className="px-3 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">Approved</span>;
      case 'pending':
        return <span className="px-3 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">Pending</span>;
      case 'rejected':
        return <span className="px-3 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">Rejected</span>;
      default:
        return <span className="px-3 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full">{status}</span>;
    }
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedLocations = [...locations].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const filteredLocations = sortedLocations.filter(location => 
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="mt-4 text-lg text-gray-600">Loading your locations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl p-6 mx-auto mt-10 border border-red-200 rounded-lg shadow-sm bg-red-50">
        <div className="flex items-center mb-4">
          <AlertTriangle className="w-6 h-6 mr-2 text-red-500" />
          <h2 className="text-xl font-semibold text-red-700">Error Loading Locations</h2>
        </div>
        <p className="mb-4 text-red-600">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 text-white transition-colors bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Try Again
        </button>
      </div>
    );
  }

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? '↑' : '↓';
    }
    return null;
  };

  return (
    <div className="max-w-6xl p-6 mx-auto">
      <div className="flex flex-col justify-between mb-8 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold text-gray-800">My Locations</h1>
        <Link 
          to="/location-map" 
          className="flex items-center px-4 py-2 mt-4 text-white transition-colors bg-blue-600 rounded-md sm:mt-0 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Add New Location
        </Link>
      </div>
      
      {locations.length === 0 ? (
        <div className="p-12 text-center bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 mb-6 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="mb-2 text-xl font-medium text-gray-600">No locations found</p>
            <p className="mb-6 text-gray-500">You haven't added any locations yet.</p>
            <Link 
              to="/add-location" 
              className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Add Your First Location
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                type="text"
                className="block w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search locations by name, address or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center">
                        Name {getSortIcon('name')}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('address')}
                    >
                      <div className="flex items-center">
                        Address {getSortIcon('address')}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('category')}
                    >
                      <div className="flex items-center">
                        Category {getSortIcon('category')}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center">
                        Status {getSortIcon('status')}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLocations.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                        No locations found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredLocations.map((location) => (
                      <tr key={location._id} className="transition-colors hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{location.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500">{location.address}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500">{location.category}</div>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(location.status)}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
                          <div className="flex space-x-3">
                            <Link
                              to={`/edit-location/${location._id}`}
                              className="text-blue-600 transition-colors hover:text-blue-900"
                            >
                              <Edit2 className="w-5 h-5" />
                            </Link>
                            <button
                              onClick={() => handleDelete(location._id)}
                              className="text-red-600 transition-colors hover:text-red-900"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-500">
                Showing {filteredLocations.length} of {locations.length} locations
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default YourLocations;