import React from 'react';
import { Card, Footer } from 'flowbite-react';
import { FaPhone, FaFax, FaEnvelope, FaMapMarkerAlt, FaBuilding } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ContactUs = () => {
  const branches = [
    {
      name: 'Advertisement',
      phone: '+1 (123) 456-7890',
      fax: '+1 (123) 456-7891',
      email: 'ads@dreamsweddings.com',
      location: '123 Wedding Street, Dream City, DC 12345',
      accountNumber: 'ACCT-AD-1001',
    },
    {
      name: 'Add Service',
      phone: '+1 (123) 456-7892',
      fax: '+1 (123) 456-7893',
      email: 'services@dreamsweddings.com',
      location: '456 Celebration Avenue, Dream City, DC 12345',
      accountNumber: 'ACCT-SV-1002',
    },
    {
      name: 'Add Properties',
      phone: '+1 (123) 456-7894',
      fax: '+1 (123) 456-7895',
      email: 'properties@dreamsweddings.com',
      location: '789 Venue Boulevard, Dream City, DC 12345',
      accountNumber: 'ACCT-PR-1003',
    },
    {
      name: 'Customer Issue',
      phone: '+1 (123) 456-7896',
      fax: '+1 (123) 456-7897',
      email: 'support@dreamsweddings.com',
      location: '101 Support Lane, Dream City, DC 12345',
      accountNumber: null, // No account number for customer support
    },
    {
      name: 'Add Location to Site Map',
      phone: '+1 (123) 456-7898',
      fax: '+1 (123) 456-7899',
      email: 'locations@dreamsweddings.com',
      location: null, // No physical location for this branch
      accountNumber: 'ACCT-LM-1004',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#AC5180] to-[#160121] p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold text-center text-white">Contact Dreams</h1>
        <p className="text-center text-[#D4D4D4] mb-12">
          Reach out to our dedicated teams for your wedding planning needs. Connect with the right department to make your dream wedding a reality!
        </p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {branches.map((branch) => (
            <Card key={branch.name} className="text-white border border-gray-700 bg-white/10 backdrop-blur-md">
              <div className="flex items-center mb-4">
                <FaBuilding className="mr-2 text-white" size={24} />
                <h2 className="text-xl font-semibold">{branch.name}</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <FaPhone className="mr-2 text-white" />
                  <span className="text-[#D4D4D4]">{branch.phone}</span>
                </div>
                <div className="flex items-center">
                  <FaFax className="mr-2 text-white" />
                  <span className="text-[#D4D4D4]">{branch.fax}</span>
                </div>
                <div className="flex items-center">
                  <FaEnvelope className="mr-2 text-white" />
                  <a
                    href={`mailto:${branch.email}`}
                    className="text-[#D4D4D4] hover:text-white hover:underline hover:underline-offset-4"
                  >
                    {branch.email}
                  </a>
                </div>
                {branch.location && (
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-white" />
                    <span className="text-[#D4D4D4]">{branch.location}</span>
                  </div>
                )}
                {branch.accountNumber && (
                  <div className="flex items-center">
                    <FaBuilding className="mr-2 text-white" />
                    <span className="text-[#D4D4D4]">Account: {branch.accountNumber}</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        
      </div>
    </div>
  );
};

export default ContactUs;