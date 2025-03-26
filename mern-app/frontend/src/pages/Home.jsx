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
      
      {/* <div className="container px-4 py-16 mx-auto text-center">
        <h2 className="mb-2 text-2xl font-light tracking-wide uppercase">View our best services</h2>
        <div className="w-24 h-1 mx-auto mb-12 bg-pink-400"></div>
        
        <div className="mb-8 text-center">
          <p className="text-gray-600">Our work has been featured in MICHAEL & JOURNEY's wedding ceremony</p>
        </div>
        
        
       
      </div> */}
      
      
    </div>
  );
};

export default HomePage;