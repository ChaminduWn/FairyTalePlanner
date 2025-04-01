import React, { useState, useEffect } from 'react';

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

function AdminLocationsDashboard() {
  const [pendingLocations, setPendingLocations] = useState([]);
  const [approvedLocations, setApprovedLocations] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [editingLocation, setEditingLocation] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [statusMessage, setStatusMessage] = useState(null);
  
  // Fetch pending locations
  const fetchPendingLocations = async () => {
    try {
      const response = await fetch('/api/admin/locations/pending', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setPendingLocations(data);
    } catch (error) {
      console.error("Error fetching pending locations:", error);
      setStatusMessage({
        type: 'error',
        message: 'Failed to load pending location requests.'
      });
    }
  };
  
  // Fetch approved locations - Fixed API endpoint
  const fetchApprovedLocations = async () => {
    try {
      // Change the endpoint to get all approved locations
      const response = await fetch('/api/location', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setApprovedLocations(data);
    } catch (error) {
      console.error("Error fetching approved locations:", error);
      setStatusMessage({
        type: 'error',
        message: 'Failed to load approved locations.'
      });
    }
  };
  
  // Load data on initial render
  useEffect(() => {
    fetchPendingLocations();
    fetchApprovedLocations();
  }, []);
  
  // Refresh data after actions
  const refreshData = () => {
    fetchPendingLocations();
    fetchApprovedLocations();
  };
  
  // Handle approving a location
  const handleApproveLocation = async (id) => {
    try {
      const response = await fetch(`/api/admin/locations/approve/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
          adminId: 'admin', // This should come from your auth system
          comments: 'Approved by admin'
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // Refresh data
      refreshData();
      
      setStatusMessage({
        type: 'success',
        message: 'Location approved successfully.'
      });
      
      setTimeout(() => setStatusMessage(null), 3000);
      
    } catch (error) {
      console.error("Error approving location:", error);
      setStatusMessage({
        type: 'error',
        message: 'Failed to approve location.'
      });
    }
  };
  
  // Handle rejecting a location
  const handleRejectLocation = async (id) => {
    try {
      const response = await fetch(`/api/admin/locations/reject/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
          adminId: 'admin', // This should come from your auth system
          comments: rejectReason || 'Rejected by admin'
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // Refresh data
      refreshData();
      setRejectReason('');
      
      setStatusMessage({
        type: 'success',
        message: 'Location rejected successfully.'
      });
      
      setTimeout(() => setStatusMessage(null), 3000);
      
    } catch (error) {
      console.error("Error rejecting location:", error);
      setStatusMessage({
        type: 'error',
        message: 'Failed to reject location.'
      });
    }
  };
  
  // Handle updating a location
  const handleUpdateLocation = async () => {
    try {
      const response = await fetch(`/api/admin/locations/${editingLocation._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(editingLocation)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // Refresh data
      refreshData();
      
      // Close edit form
      setEditingLocation(null);
      
      setStatusMessage({
        type: 'success',
        message: 'Location updated successfully.'
      });
      
      setTimeout(() => setStatusMessage(null), 3000);
      
    } catch (error) {
      console.error("Error updating location:", error);
      setStatusMessage({
        type: 'error',
        message: 'Failed to update location.'
      });
    }
  };
  
  // Handle deleting a location
  const handleDeleteLocation = async (id) => {
    if (!window.confirm('Are you sure you want to delete this location?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/locations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // Refresh data
      refreshData();
      
      setStatusMessage({
        type: 'success',
        message: 'Location deleted successfully.'
      });
      
      setTimeout(() => setStatusMessage(null), 3000);
      
    } catch (error) {
      console.error("Error deleting location:", error);
      setStatusMessage({
        type: 'error',
        message: 'Failed to delete location.'
      });
    }
  };
  
  // Get category details
  const getCategoryDetails = (categoryName) => {
    return categories.find(cat => cat.name === categoryName) || {};
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Admin Location Dashboard</h1>
      
      {/* Status Message */}
      {statusMessage && (
        <div className={`p-4 mb-6 rounded ${
          statusMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {statusMessage.message}
        </div>
      )}
      
      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500">
          <li className="mr-2">
            <button
              className={`inline-block p-4 border-b-2 rounded-t-lg ${
                activeTab === 'pending' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'border-transparent hover:text-gray-600 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('pending')}
            >
              Pending Requests
              {pendingLocations.length > 0 && (
                <span className="ml-2 text-xs text-white bg-red-500 rounded-full px-2 py-0.5">
                  {pendingLocations.length}
                </span>
              )}
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block p-4 border-b-2 rounded-t-lg ${
                activeTab === 'approved' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'border-transparent hover:text-gray-600 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('approved')}
            >
              Approved Locations
              {approvedLocations.length > 0 && (
                <span className="ml-2 text-xs text-white bg-green-500 rounded-full px-2 py-0.5">
                  {approvedLocations.length}
                </span>
              )}
            </button>
          </li>
        </ul>
      </div>
      
      {/* Edit Location Form */}
      {editingLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl p-6 bg-white rounded-lg">
            <h2 className="mb-4 text-xl font-bold">Edit Location</h2>
            
            <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-900">Name</label>
                <input 
                  type="text" 
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  value={editingLocation.name}
                  onChange={(e) => setEditingLocation({...editingLocation, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-900">Address</label>
                <input 
                  type="text" 
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  value={editingLocation.address}
                  onChange={(e) => setEditingLocation({...editingLocation, address: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-900">Category</label>
                <select 
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  value={editingLocation.category}
                  onChange={(e) => setEditingLocation({...editingLocation, category: e.target.value})}
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
                    value={editingLocation.lat}
                    onChange={(e) => setEditingLocation({...editingLocation, lat: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-900">Longitude</label>
                  <input 
                    type="text" 
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    value={editingLocation.lng}
                    onChange={(e) => setEditingLocation({...editingLocation, lng: e.target.value})}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <button 
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                onClick={handleUpdateLocation}
              >
                Save Changes
              </button>
              <button 
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setEditingLocation(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Pending Locations Tab */}
      {activeTab === 'pending' && (
        <div>
          <h2 className="mb-4 text-xl font-semibold">Pending Location Requests</h2>
          
          {pendingLocations.length === 0 ? (
            <p className="p-4 text-gray-500 bg-gray-100 rounded">No pending location requests.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Category</th>
                    <th className="px-4 py-2 text-left">Address</th>
                    <th className="px-4 py-2 text-left">Date Submitted</th>
                    <th className="px-4 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingLocations.map((location) => (
                    <tr key={location._id} className="border-b">
                      <td className="px-4 py-3">{location.name}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <span 
                            className="inline-block w-3 h-3 mr-2 rounded-full" 
                            style={{ backgroundColor: getCategoryDetails(location.category).color }}
                          ></span>
                          {location.category}
                        </div>
                      </td>
                      <td className="px-4 py-3">{location.address}</td>
                      <td className="px-4 py-3">
                        {new Date(location.requestDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center space-x-2">
                          <button 
                            className="px-3 py-1 text-white bg-green-600 rounded hover:bg-green-700"
                            onClick={() => handleApproveLocation(location._id)}
                          >
                            Approve
                          </button>
                          <button 
                            className="px-3 py-1 text-white bg-yellow-600 rounded hover:bg-yellow-700"
                            onClick={() => setEditingLocation(location)}
                          >
                            Edit
                          </button>
                          <button 
                            className="px-3 py-1 text-white bg-red-600 rounded hover:bg-red-700"
                            onClick={() => {
                              const reason = prompt("Please provide a reason for rejection (optional):");
                              if (reason !== null) {
                                setRejectReason(reason);
                                handleRejectLocation(location._id);
                              }
                            }}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      
      {/* Approved Locations Tab */}
      {activeTab === 'approved' && (
        <div>
          <h2 className="mb-4 text-xl font-semibold">Approved Locations</h2>
          
          {approvedLocations.length === 0 ? (
            <p className="p-4 text-gray-500 bg-gray-100 rounded">No approved locations.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Category</th>
                    <th className="px-4 py-2 text-left">Address</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {approvedLocations.map((location) => (
                    <tr key={location._id} className="border-b">
                      <td className="px-4 py-3">{location.name}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <span 
                            className="inline-block w-3 h-3 mr-2 rounded-full" 
                            style={{ backgroundColor: getCategoryDetails(location.category).color }}
                          ></span>
                          {location.category}
                        </div>
                      </td>
                      <td className="px-4 py-3">{location.address}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                          Approved
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center space-x-2">
                          <button 
                            className="px-3 py-1 text-white bg-yellow-600 rounded hover:bg-yellow-700"
                            onClick={() => setEditingLocation(location)}
                          >
                            Edit
                          </button>
                          <button 
                            className="px-3 py-1 text-white bg-red-600 rounded hover:bg-red-700"
                            onClick={() => handleDeleteLocation(location._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminLocationsDashboard;