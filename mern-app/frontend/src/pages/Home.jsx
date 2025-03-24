import React from 'react';
import { Navbar, Button, Card, Carousel } from 'flowbite-react';
import { 
  FaCamera, 
  FaHotel, 
  FaCar, 
  FaUserTie, 
  FaFemale, 
  FaMapMarkerAlt,
  FaArrowRight,
  FaMusic,
  FaGift,
  FaPlane
} from 'react-icons/fa';
import { Link } from 'react-router-dom';


const HomePage = () => {

    const services = [
        { 
          icon: <FaHotel className="mb-4 text-4xl text-purple-600" />, 
          title: 'Hotels & Venues', 
          description: 'Find the perfect venue for your special day.',
          url: '/about'
        },
        { 
          icon: <FaCamera className="mb-4 text-4xl text-purple-600" />, 
          title: 'Photography', 
          description: 'Capture every moment with professional photographers.',
          url: '/services/photography'
        },
        { 
          icon: <FaFemale className="mb-4 text-4xl text-purple-600" />, 
          title: 'Bridal Services', 
          description: 'Complete bridal packages for your perfect look.',
          url: '/services/bridal'
        },
        { 
          icon: <FaUserTie className="mb-4 text-4xl text-purple-600" />, 
          title: 'Groom Services', 
          description: 'Dressing and grooming services for grooms.',
          url: '/services/groom'
        },
        { 
          icon: <FaCar className="mb-4 text-4xl text-purple-600" />, 
          title: 'Car Rentals', 
          description: 'Luxury vehicles to travel in style.',
          url: '/services/car-rental'
        },
        { 
          icon: <FaMapMarkerAlt className="mb-4 text-4xl text-purple-600" />, 
          title: 'Photo Locations', 
          description: 'Scenic spots for memorable wedding photos.',
          url: '/services/photo-locations'
        },
        { 
            icon: <FaMusic className="mb-4 text-4xl text-purple-600" />, 
            title: 'Entertainment Services', 
            description: 'Music and performances for your special celebration.',
            url: '/services/entertainment'
          },
          { 
            icon: <FaGift className="mb-4 text-4xl text-purple-600" />, 
            title: 'Invitation & Gift Services', 
            description: 'Beautiful invitations and creative gift solutions.',
            url: '/services/invitations-gifts'
          },
          { 
            icon: <FaPlane className="mb-4 text-4xl text-purple-600" />, 
            title: 'Honeymoon', 
            description: 'Plan your perfect honeymoon getaway.',
            url: '/services/honeymoon'
          }
      ];

  return (
    <div className="font-sans">
     
   
      
      {/* Hero Section */}
      <div className="w-full h-screen bg-[linear-gradient(to_right_bottom,rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url('./assets/home2.jpg')] bg-center bg-cover">
        {/* Hero Image */}
       
        
        {/* Overlay Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-white">
          <div className="text-center">
            <h1 className="mb-4 text-4xl md:text-7xl font-script">
              {/* <span className="italic font-light"> Welcome to Dreams</span> */}
              {/* <span className="text-pink-400"> Welcome to Dreams</span> */}
              <span className="italic font-normal">Welcome to Dreams</span>
            </h1>
            <p className="mb-8 text-xl italic font-light md:text-2xl">- Plan the perfect wedding -</p>
            <div className="flex justify-center py-10">
              <Link to="/budget-tracker">
                <Button
                  gradientDuoTone="pinkToOrange"
                  size="lg"
                  className="flex justify-center px-8 py-3 text-xl font-semibold transition-transform duration-300 ease-in-out rounded-full shadow-lg hover:scale-105"
                >
                  Plan Your Wedding with your budget
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
            <section className="py-16 bg-white">
              <div className="container px-4 mx-auto">
                <h2 className="mb-4 text-3xl font-bold text-center text-purple-600 md:text-4xl">
                  Our <span className="text-purple-600">Services</span>
                </h2>
                <p className="max-w-2xl mx-auto mb-12 text-center text-gray-600">
                  Discover all the wedding services available on our platform to make your special day perfect.
                </p>
                
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {services.map((service, index) => (
                    <Card 
                      key={index} 
                      className="transition-shadow duration-300 border border-pink-200 hover:shadow-xl"
                    >
                      <div className="p-4 text-center">
                        {service.icon}
                        <h3 className="mb-2 text-xl font-semibold text-pink-900">{service.title}</h3>
                        <p className="mb-4 text-gray-600">{service.description}</p>
                        <div className="flex justify-center">
  <Link to={service.url}>
  <Button className="text-white bg-pink-600 hover:bg-pink-800">
  Explore <FaArrowRight className="mt-1 ml-2" />
</Button>
  </Link>
</div>
                      </div>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-12 text-center">
                  <Link to="/services">
                    <Button size="xl" gradientDuoTone="pinkToBlue">
                      View All Services
                    </Button>
                  </Link>
                </div>
              </div>
            </section>
      
      <div className="container px-4 py-16 mx-auto text-center">
        <h2 className="mb-2 text-2xl font-light tracking-wide uppercase">View our best services</h2>
        <div className="w-24 h-1 mx-auto mb-12 bg-pink-400"></div>
        
        <div className="mb-8 text-center">
          <p className="text-gray-600">Our work has been featured in MICHAEL & JOURNEY's wedding ceremony</p>
        </div>
        
        
       
      </div>
      
      {/* Footer */}
      <footer className="py-8 bg-gray-100">
        <div className="container px-4 mx-auto text-center">
          <p className="text-gray-600">© 2025 Dreams Wedding Planning. All Rights Reserved.</p>
          <div className="flex justify-center mt-4 space-x-4">
            <a href="#" className="text-pink-500 hover:text-pink-700">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-pink-500 hover:text-pink-700">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465.668.25 1.272.644 1.772 1.153.509.5.902 1.104 1.153 1.772.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772c-.5.509-1.104.902-1.772 1.153-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427.25-.668.644-1.272 1.153-1.772A4.902 4.902 0 014.88 2.525c.636-.247 1.363-.416 2.427-.465C8.274 2.013 8.614 2 11.03 2h.63zm-.08 1.802h-.63c-2.342 0-2.672.013-3.64.059-.876.04-1.353.186-1.67.31-.42.163-.72.358-1.035.673-.315.315-.51.615-.673 1.035-.124.317-.27.794-.31 1.67-.046.969-.059 1.3-.059 3.64v.63c0 2.342.013 2.672.059 3.64.04.876.186 1.353.31 1.67.163.42.358.72.673 1.035.315.315.615.51 1.035.673.317.124.794.27 1.67.31.969.046 1.3.059 3.64.059h.63c2.342 0 2.672-.013 3.64-.059.876-.04 1.353-.186 1.67-.31.42-.163.72-.358 1.035-.673.315-.315.51-.615.673-1.035.124-.317.27-.794.31-1.67.046-.969.059-1.3.059-3.64v-.63c0-2.342-.013-2.672-.059-3.64-.04-.876-.186-1.353-.31-1.67a2.75 2.75 0 00-.673-1.035 2.75 2.75 0 00-1.035-.673c-.317-.124-.794-.27-1.67-.31-.969-.046-1.3-.059-3.64-.059z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M12.235 6.6a5.4 5.4 0 100 10.8 5.4 5.4 0 000-10.8zm0 8.903a3.501 3.501 0 110-7.002 3.501 3.501 0 010 7.002zm5.386-8.549a1.171 1.171 0 100-2.342 1.171 1.171 0 000 2.342z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;