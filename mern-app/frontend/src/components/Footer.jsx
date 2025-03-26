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
    <Footer container className="text-whitebg-gradient-to-r from-[#AC5180] to-[#160121] border-t border-amber-400">
      <div className="w-full mx-auto max-w-7xl">
        <div className="grid w-full grid-cols-1 gap-8 px-6 py-8 md:grid-cols-4">
          <div>
            <Footer.Title title="Wedding Planner" className="mb-4 text-xl text-amber-400" />
            <Footer.LinkGroup col>
              <p className="mb-3 text-gray-300">
                Your one-stop destination for planning the perfect wedding. From venues to services, we've got you covered!
              </p>
              <div className="flex mt-4 space-x-4">
                <a href="#" className="text-amber-400 hover:text-amber-300">
                  <FaFacebook size={20} />
                </a>
                <a href="#" className="text-amber-400 hover:text-amber-300">
                  <FaTwitter size={20} />
                </a>
                <a href="#" className="text-amber-400 hover:text-amber-300">
                  <FaInstagram size={20} />
                </a>
                <a href="#" className="text-amber-400 hover:text-amber-300">
                  <FaPinterest size={20} />
                </a>
              </div>
            </Footer.LinkGroup>
          </div>
          
          <div>
            <Footer.Title title="Services" className="text-amber-400" />
            <Footer.LinkGroup col>
              <Footer.Link as={Link} to="/services/photography">Photography</Footer.Link>
              <Footer.Link as={Link} to="/services/bridal">Bridal Services</Footer.Link>
              <Footer.Link as={Link} to="/services/groom">Groom Dressing</Footer.Link>
              <Footer.Link as={Link} to="/services/car-rental">Car Rental</Footer.Link>
              <Footer.Link as={Link} to="/services/entertainment">Entertainment</Footer.Link>
            </Footer.LinkGroup>
          </div>
          
          <div>
            <Footer.Title title="Quick Links" className="text-amber-400" />
            <Footer.LinkGroup col>
              <Footer.Link as={Link} to="/about">About Us</Footer.Link>
              <Footer.Link as={Link} to="/contact">Contact Us</Footer.Link>
              <Footer.Link as={Link} to="/budget-planner">Budget Planner</Footer.Link>
              <Footer.Link as={Link} to="/advertise">Advertise With Us</Footer.Link>
              <Footer.Link as={Link} to="/register/service-provider">Register as Provider</Footer.Link>
            </Footer.LinkGroup>
          </div>
          
          <div>
            <Footer.Title title="Contact Us" className="text-amber-400" />
            <Footer.LinkGroup col>
              <div className="flex items-center mb-3">
                <FaMapMarkerAlt className="mr-2 text-amber-400" />
                <span>123 Wedding Street, City</span>
              </div>
              <div className="flex items-center mb-3">
                <FaPhone className="mr-2 text-amber-400" />
                <span>+1 (123) 456-7890</span>
              </div>
              <div className="flex items-center mb-3">
                <FaEnvelope className="mr-2 text-amber-400" />
                <span>info@weddingplanner.com</span>
              </div>
            </Footer.LinkGroup>
          </div>
        </div>
        
        <div className="w-full px-6 py-4 text-center bg-purple-700 border-t border-gray-700">
          <span className="text-sm text-gray-300">
            © {new Date().getFullYear()} Wedding Planner. All Rights Reserved.
          </span>
        </div>
      </div>
    </Footer>
  );
};

export default AppFooter;