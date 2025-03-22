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

const appFooter = () => {
  return (
    <Footer container className="bg-purple-900 text-white border-t border-amber-400">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid w-full grid-cols-1 gap-8 py-8 px-6 md:grid-cols-4">
          <div>
            <Footer.Title title="Wedding Planner" className="text-amber-400 text-xl mb-4" />
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
        
        <div className="w-full bg-purple-950 py-4 px-6 border-t border-gray-700 text-center">
          <span className="text-sm text-gray-300">
            © {new Date().getFullYear()} Wedding Planner. All Rights Reserved.
          </span>
        </div>
      </div>
    </Footer>
  );
};

export default appFooter;