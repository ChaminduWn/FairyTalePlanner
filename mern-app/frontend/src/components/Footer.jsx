import React from 'react';
import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaPinterest, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt 
} from 'react-icons/fa';

const AppFooter = () => {
  return (
    <Footer container className="bg-gradient-to-r from-[#AC5180] to-[#160121] border-t border-gray-700 text-white">
      <div className="w-full mx-auto max-w-7xl">
        <div className="grid w-full grid-cols-1 gap-8 px-6 py-8 md:grid-cols-4">
          <div>
            <Footer.Title title="Wedding Planner" className="mb-4 text-xl font-bold text-white" />
            <Footer.LinkGroup col>
              <p className="mb-3 text-[#D4D4D4]">
                Your one-stop destination for planning the perfect wedding. From venues to services, we've got you covered!
              </p>
              <div className="flex mt-4 space-x-4">
                <a href="#" className="p-2 rounded-full bg-[#160121] text-white hover:bg-[#AC5180] transition-colors duration-200">
                  <FaFacebook size={20} />
                </a>
                <a href="#" className="p-2 rounded-full bg-[#160121] text-white hover:bg-[#AC5180] transition-colors duration-200">
                  <FaTwitter size={20} />
                </a>
                <a href="#" className="p-2 rounded-full bg-[#160121] text-white hover:bg-[#AC5180] transition-colors duration-200">
                  <FaInstagram size={20} />
                </a>
                <a href="#" className="p-2 rounded-full bg-[#160121] text-white hover:bg-[#AC5180] transition-colors duration-200">
                  <FaPinterest size={20} />
                </a>
              </div>
            </Footer.LinkGroup>
          </div>
          
          <div>
            <Footer.Title title="Services" className="font-semibold text-white" />
            <Footer.LinkGroup col>
              <Footer.Link as={Link} to="/services/photography" className="text-[#D4D4D4] hover:text-white hover:underline hover:underline-offset-4">
                Photography
              </Footer.Link>
              <Footer.Link as={Link} to="/services/bridal" className="text-[#D4D4D4] hover:text-white hover:underline hover:underline-offset-4">
                Bridal Services
              </Footer.Link>
              <Footer.Link as={Link} to="/services/groom" className="text-[#D4D4D4] hover:text-white hover:underline hover:underline-offset-4">
                Groom Dressing
              </Footer.Link>
              <Footer.Link as={Link} to="/services/car-rental" className="text-[#D4D4D4] hover:text-white hover:underline hover:underline-offset-4">
                Car Rental
              </Footer.Link>
              <Footer.Link as={Link} to="/services/entertainment" className="text-[#D4D4D4] hover:text-white hover:underline hover:underline-offset-4">
                Entertainment
              </Footer.Link>
            </Footer.LinkGroup>
          </div>
          
          <div>
            <Footer.Title title="Quick Links" className="font-semibold text-white" />
            <Footer.LinkGroup col>
              <Footer.Link as={Link} to="/about" className="text-[#D4D4D4] hover:text-white hover:underline hover:underline-offset-4">
                About Us
              </Footer.Link>
              <Footer.Link as={Link} to="/contact" className="text-[#D4D4D4] hover:text-white hover:underline hover:underline-offset-4">
                Contact Us
              </Footer.Link>
              <Footer.Link as={Link} to="/budget-planner" className="text-[#D4D4D4] hover:text-white hover:underline hover:underline-offset-4">
                Budget Planner
              </Footer.Link>
              <Footer.Link as={Link} to="/advertise" className="text-[#D4D4D4] hover:text-white hover:underline hover:underline-offset-4">
                Advertise With Us
              </Footer.Link>
              <Footer.Link as={Link} to="/register/service-provider" className="text-[#D4D4D4] hover:text-white hover:underline hover:underline-offset-4">
                Register as Provider
              </Footer.Link>
            </Footer.LinkGroup>
          </div>
          
          <div>
            <Footer.Title title="Contact Us" className="font-semibold text-white" />
            <Footer.LinkGroup col>
              <div className="flex items-center mb-3">
                <FaMapMarkerAlt className="mr-2 text-white" />
                <span className="text-[#D4D4D4]">123 Wedding Street, City</span>
              </div>
              <div className="flex items-center mb-3">
                <FaPhone className="mr-2 text-white" />
                <span className="text-[#D4D4D4]">+1 (123) 456-7890</span>
              </div>
              <div className="flex items-center mb-3">
                <FaEnvelope className="mr-2 text-white" />
                <span className="text-[#D4D4D4]">info@weddingplanner.com</span>
              </div>
            </Footer.LinkGroup>
          </div>
        </div>
        
        <div className="w-full px-6 py-4 text-center bg-[#160121] border-t border-gray-700">
          <span className="text-sm text-[#D4D4D4]">
            © {new Date().getFullYear()} Dreams Wedding Planner. All Rights Reserved.
          </span>
        </div>
      </div>
    </Footer>
  );
};

export default AppFooter;