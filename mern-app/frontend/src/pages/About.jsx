import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Carousel } from 'flowbite-react';
import { 
  FaCalendarCheck, 
  FaMapMarkedAlt, 
  FaMoneyBillWave, 
  FaCamera, 
  FaHotel, 
  FaCar, 
  FaUserTie, 
  FaFemale, 
  FaMapMarkerAlt,
  FaArrowRight
} from 'react-icons/fa';

const About = () => {
  const [budget, setBudget] = useState('');
  const [location, setLocation] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Navigate to budget planner with pre-filled data
    window.location.href = `/budget-planner?budget=${budget}&location=${encodeURIComponent(location)}`;
  };

  const services = [
    { 
      icon: <FaHotel className="text-4xl text-amber-500 mb-4" />, 
      title: 'Hotels & Venues', 
      description: 'Find the perfect venue for your special day.',
      url: '/services/venues'
    },
    { 
      icon: <FaCamera className="text-4xl text-amber-500 mb-4" />, 
      title: 'Photography', 
      description: 'Capture every moment with professional photographers.',
      url: '/services/photography'
    },
    { 
      icon: <FaFemale className="text-4xl text-amber-500 mb-4" />, 
      title: 'Bridal Services', 
      description: 'Complete bridal packages for your perfect look.',
      url: '/services/bridal'
    },
    { 
      icon: <FaUserTie className="text-4xl text-amber-500 mb-4" />, 
      title: 'Groom Services', 
      description: 'Dressing and grooming services for grooms.',
      url: '/services/groom'
    },
    { 
      icon: <FaCar className="text-4xl text-amber-500 mb-4" />, 
      title: 'Car Rentals', 
      description: 'Luxury vehicles to travel in style.',
      url: '/services/car-rental'
    },
    { 
      icon: <FaMapMarkerAlt className="text-4xl text-amber-500 mb-4" />, 
      title: 'Photo Locations', 
      description: 'Scenic spots for memorable wedding photos.',
      url: '/services/photo-locations'
    }
  ];

  const testimonials = [
    {
      name: "Sarah & Michael",
      image: "/testimonials/couple1.jpg",
      text: "The budget tracker helped us find amazing services within our budget. We couldn't have planned our perfect day without this platform!",
      rating: 5
    },
    {
      name: "Jessica & David",
      image: "/testimonials/couple2.jpg",
      text: "As a bride on a budget, I was worried about finding quality services. This platform connected us with incredible vendors that fit our budget perfectly.",
      rating: 5
    },
    {
      name: "Emma & James",
      image: "/testimonials/couple3.jpg",
      text: "The location-based search was a game-changer! We found a stunning venue just 15 minutes from our home that we didn't even know existed.",
      rating: 4
    }
  ];

  return (
    <div className="pt-16"> {/* Add padding to account for fixed header */}
      {/* Hero Section */}
      <section className="relative h-screen">
        <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero-wedding.jpg')" }}
        ></div>
        
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Plan Your <span className="text-amber-400">Perfect</span> Wedding
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl">
            Find all the services you need within your budget and preferred location
          </p>
          
          {/* Budget & Location Form */}
          <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-md p-6 rounded-lg w-full max-w-3xl shadow-xl border border-purple-500/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="budget" className="block text-amber-300 mb-2 font-medium">Your Budget</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white">$</span>
                  <input
                    type="number"
                    id="budget"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="bg-purple-900/70 pl-8 border border-purple-400 text-white rounded-lg w-full p-3 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Enter your budget"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="location" className="block text-amber-300 mb-2 font-medium">Preferred Location</label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute top-3.5 left-3 text-white" />
                  <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="bg-purple-900/70 pl-10 border border-purple-400 text-white rounded-lg w-full p-3 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Enter location"
                    required
                  />
                </div>
              </div>
            </div>
            
            <Button type="submit" gradientDuoTone="purpleToBlue" size="xl" className="w-full">
              Find Perfect Combinations <FaArrowRight className="ml-2" />
            </Button>
          </form>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 bg-gradient-to-b from-purple-900 to-purple-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
            How <span className="text-amber-400">It Works</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg text-center">
              <div className="bg-amber-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaMoneyBillWave className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-amber-400 mb-3">Set Your Budget</h3>
              <p className="text-gray-300">
                Enter your budget and let our smart system find the best service combinations that fit within your budget.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg text-center">
              <div className="bg-amber-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaMapMarkedAlt className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-amber-400 mb-3">Choose Location</h3>
              <p className="text-gray-300">
                Specify your preferred location and discover nearby venues and service providers using our Google Maps integration.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg text-center">
              <div className="bg-amber-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCalendarCheck className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-amber-400 mb-3">View Combinations</h3>
              <p className="text-gray-300">
                Browse through the top 5 combinations of services tailored to your needs and make your selections.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-purple-900 mb-4">
            Our <span className="text-amber-500">Services</span>
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Discover all the wedding services available on our platform to make your special day perfect.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card 
                key={index} 
                className="hover:shadow-xl transition-shadow duration-300 border border-purple-100"
              >
                <div className="text-center p-4">
                  {service.icon}
                  <h3 className="text-xl font-semibold text-purple-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <Link to={service.url}>
                    <Button gradientDuoTone="purpleToPink" outline>
                      Explore <FaArrowRight className="ml-2" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/services">
              <Button size="xl" gradientDuoTone="purpleToBlue">
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-purple-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-purple-900 mb-12">
            What <span className="text-amber-500">Couples Say</span>
          </h2>
          
          <div className="h-56 sm:h-64 xl:h-80 2xl:h-96">
            <Carousel>
              {testimonials.map((testimonial, index) => (
                <div key={index} className="flex h-full items-center justify-center bg-purple-900 p-8 rounded-lg shadow-lg">
                  <div className="text-center max-w-4xl mx-auto">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-4 border-amber-400">
                      <img 
                        src={testimonial.image || "/images/avatar-placeholder.jpg"} 
                        alt={testimonial.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-white text-xl italic mb-4">"{testimonial.text}"</p>
                    <div className="flex justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-5 h-5 ${i < testimonial.rating ? 'text-amber-400' : 'text-gray-400'}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      ))}
                    </div>
                    <h3 className="text-amber-400 font-semibold">{testimonial.name}</h3>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-800 to-purple-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Plan Your <span className="text-amber-400">Dream Wedding?</span>
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of happy couples who planned their perfect wedding with our platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register">
              <Button size="xl" gradientDuoTone="purpleToBlue">
                Get Started
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="xl" outline color="light">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;