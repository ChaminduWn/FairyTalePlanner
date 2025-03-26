import React, { useState } from 'react';
import { 
  Eye, 
  CheckCircle, 
  XCircle, 
  Trash2,
  Filter, 
  Search, 
  Info 
} from 'lucide-react';

// Mock data to simulate submissions
const initialSubmissions = [
  {
    id: 1,
    name: "Elegant Wedding Photography",
    type: "service",
    category: "Photography",
    location: "New York, NY",
    price: 2500,
    submissionDate: "2024-03-20",
    status: "pending"
  },
  {
    id: 2,
    name: "Luxury Honeymoon Resort",
    type: "property",
    category: "Honeymoon",
    location: "Maldives",
    price: 5000,
    submissionDate: "2024-03-22",
    status: "pending"
  },
  {
    id: 3,
    name: "Bridal Styling Services",
    type: "service",
    category: "Bridal Service",
    location: "Los Angeles, CA",
    price: 1500,
    submissionDate: "2024-03-18",
    status: "pending"
  }
];

const ManagementDashboard = () => {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Handle submission status update
  const updateSubmissionStatus = (id, status) => {
    setSubmissions(prev => 
      prev.map(submission => 
        submission.id === id 
          ? { ...submission, status } 
          : submission
      )
    );
  };

  // Handle submission deletion
  const deleteSubmission = (id) => {
    setSubmissions(prev => prev.filter(submission => submission.id !== id));
  };

  // Filter and search submissions
  const filteredSubmissions = submissions.filter(submission => {
    const matchesFilter = 
      filter === 'all' || 
      submission.status === filter;
    
    const matchesSearch = 
      submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">
          Submission Management
        </h1>

        {/* Filters and Search */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <button 
              onClick={() => setFilter('all')} 
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === 'all' 
                  ? "bg-purple-600 text-white"
                : "bg-purple-100 text-purple-800 hover:bg-purple-200"
              }`}
            >
              All Submissions
            </button>
            <button 
              onClick={() => setFilter('pending')} 
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === 'pending' 
                   ? "bg-purple-600 text-white"
                : "bg-purple-100 text-purple-800 hover:bg-purple-200"
              }`}
            >
              Pending
            </button>
            <button 
              onClick={() => setFilter('approved')} 
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === 'approved' 
                  ? "bg-purple-600 text-white"
                : "bg-purple-100 text-purple-800 hover:bg-purple-200"
              }`}
            >
              Approved
            </button>
            <button 
              onClick={() => setFilter('rejected')} 
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === 'rejected' 
                  ? "bg-purple-600 text-white"
                : "bg-purple-100 text-purple-800 hover:bg-purple-200"
              }`}
            >
              Rejected
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <input 
              type="text"
              placeholder="Search submissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-72"
            />
            <Search className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        {/* Submissions Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Type</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Location</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Submission Date</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.map(submission => (
                <tr 
                  key={submission.id} 
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 font-medium">{submission.name}</td>
                  <td className="p-4 capitalize">
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-bold
                      ${submission.type === 'service' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                      }
                    `}>
                      {submission.type}
                    </span>
                  </td>
                  <td className="p-4">{submission.category}</td>
                  <td className="p-4">{submission.location}</td>
                  <td className="p-4">${submission.price.toLocaleString()}</td>
                  <td className="p-4">{submission.submissionDate}</td>
                  <td className="p-4">
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-bold capitalize
                      ${submission.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : submission.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                      }
                    `}>
                      {submission.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center space-x-2">
                      {/* View Details */}
                      <button 
                        className="text-blue-500 hover:text-blue-700 transition-colors group relative"
                        title="View Details"
                      >
                        <Eye />
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          View Details
                        </span>
                      </button>

                      {/* Action Buttons Based on Status */}
                      {submission.status === 'pending' && (
                        <>
                          {/* Approve Button */}
                          <button 
                            onClick={() => updateSubmissionStatus(submission.id, 'approved')}
                            className="text-green-500 hover:text-green-700 transition-colors group relative"
                            title="Approve"
                          >
                            <CheckCircle />
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                              Approve
                            </span>
                          </button>

                          {/* Reject Button */}
                          <button 
                            onClick={() => updateSubmissionStatus(submission.id, 'rejected')}
                            className="text-red-500 hover:text-red-700 transition-colors group relative"
                            title="Reject"
                          >
                            <XCircle />
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                              Reject
                            </span>
                          </button>
                        </>
                      )}

                      {/* Delete Button for Approved/Rejected Submissions */}
                      {(submission.status === 'approved' || submission.status === 'rejected') && (
                        <button 
                          onClick={() => deleteSubmission(submission.id)}
                          className="text-gray-500 hover:text-red-700 transition-colors group relative"
                          title="Delete Submission"
                        >
                          <Trash2 />
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            Delete
                          </span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* No Results */}
          {filteredSubmissions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Info className="mx-auto mb-4 w-12 h-12 text-gray-400" />
              <p>No submissions match your current filter or search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagementDashboard;