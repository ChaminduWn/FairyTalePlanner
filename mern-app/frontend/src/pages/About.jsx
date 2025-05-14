import React from 'react';
import { Heart, MapPin, DollarSign, Camera, Users } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500">
      <div className="container px-4 py-16 mx-auto">
        <div className="overflow-hidden bg-white shadow-2xl rounded-xl">
          {/* Hero Section */}
          <div className="relative h-64 bg-center bg-cover" style={{
            backgroundImage: 'url("/api/placeholder/1200/400")'
          }}>
            <div className="absolute inset-0 bg-purple-600 opacity-70"></div>
            <div className="relative z-10 flex items-center justify-center h-full">
              <h1 className="text-5xl font-bold text-center text-white">
                Dreams Wedding Planner
              </h1>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-12 space-y-8">
            {/* Mission Statement */}
            <section>
              <h2 className="mb-6 text-3xl font-bold text-purple-700">
                Our Mission
              </h2>
              <p className="leading-relaxed text-gray-700">
                Dream Wedding Planner is dedicated to transforming your wedding vision into a beautiful reality. We understand that your wedding day is one of the most important moments of your life, and we're here to make every detail perfect.
              </p>
            </section>

            {/* Key Features */}
            <section>
              <h2 className="mb-6 text-3xl font-bold text-purple-700">
                What We Offer
              </h2>
              <div className="grid gap-6 md:grid-cols-3">
                {[
                  {
                    icon: <DollarSign className="w-12 h-12 text-amber-500" />,
                    title: "Budget Tracking",
                    description: "Comprehensive budget management tools to help you plan your perfect day without financial stress."
                  },
                  {
                    icon: <MapPin className="w-12 h-12 text-amber-500" />,
                    title: "Venue & Location",
                    description: "Discover and explore a wide range of wedding venues and photoshoot locations tailored to your dream."
                  },
                  {
                    icon: <Camera className="w-12 h-12 text-amber-500" />,
                    title: "Service Marketplace",
                    description: "Connect with top-rated wedding services including photography, bridal services, entertainment, and more."
                  }
                ].map((feature, index) => (
                  <div 
                    key={index} 
                    className="p-6 text-center transition-shadow rounded-lg bg-pink-50 hover:shadow-lg"
                  >
                    <div className="flex justify-center mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="mb-3 text-xl font-semibold text-purple-700">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Services Overview */}
            <section>
              <h2 className="mb-6 text-3xl font-bold text-purple-700">
                Our Services
              </h2>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  "Photography", 
                  "Bridal Services", 
                  "Photo Locations", 
                  "Groom Dressing", 
                  "Car Rental",
                  "Entertainment",
                  "Invitation Services",
                  "Honeymoon Planning",
                  "Hotel Bookings"
                ].map((service, index) => (
                  <div 
                    key={index} 
                    className="p-4 text-center bg-purple-100 rounded-lg"
                  >
                    <span className="text-lg font-medium text-purple-700">
                      {service}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Closing Section */}
            <section className="text-center">
              <div className="p-8 rounded-lg bg-amber-50">
                <Heart className="w-16 h-16 mx-auto mb-4 text-pink-500" />
                <h3 className="mb-4 text-2xl font-bold text-purple-700">
                  Your Love Story, Our Passion
                </h3>
                <p className="text-gray-700">
                  We're committed to making your wedding day as unique and special as your love story. Let us help you create memories that will last a lifetime.
                </p>
              </div>
            </section>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default AboutPage;