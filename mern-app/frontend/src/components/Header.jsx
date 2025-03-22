import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Dropdown, Avatar } from 'flowbite-react';
import { FaUserCircle, FaSignInAlt, FaUserPlus, FaBars } from 'react-icons/fa';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if user is logged in from localStorage or context
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
      setUserRole(JSON.parse(user).role);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserRole(null);
    // Redirect to home page
    window.location.href = '/';
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Locations', path: '/locations' },
    { name: 'Budget Planner', path: '/budget-planner' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="fixed w-full z-50">
      <Navbar fluid className="bg-purple-900 border-b border-amber-400 shadow-lg px-4 py-2">
        <Navbar.Brand as={Link} to="/">
          <img
            src="/logo.svg"
            className="mr-3 h-10"
            alt="Wedding Planner Logo"
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold text-white">
            <span className="text-amber-400">Wedding</span> Planner
          </span>
        </Navbar.Brand>
        
        <div className="flex md:order-2">
          {isLoggedIn ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar alt="User settings" img="/user-avatar.png" rounded className="border-2 border-amber-400" />
              }
            >
              <Dropdown.Header>
                <span className="block text-sm">Welcome back!</span>
                <span className="block truncate text-sm font-medium">
                  {userRole && `Logged in as ${userRole}`}
                </span>
              </Dropdown.Header>
              <Link to="/dashboard">
                <Dropdown.Item>Dashboard</Dropdown.Item>
              </Link>
              <Link to="/profile">
                <Dropdown.Item>Profile</Dropdown.Item>
              </Link>
              {userRole === 'Service Provider' && (
                <Link to="/services/manage">
                  <Dropdown.Item>Manage Services</Dropdown.Item>
                </Link>
              )}
              {userRole === 'Property Owner' && (
                <Link to="/properties/manage">
                  <Dropdown.Item>Manage Properties</Dropdown.Item>
                </Link>
              )}
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>Sign out</Dropdown.Item>
            </Dropdown>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="px-4 py-2 text-white hover:text-amber-300 flex items-center"
              >
                <FaSignInAlt className="mr-2" /> Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg flex items-center transition duration-300 shadow-md"
              >
                <FaUserPlus className="mr-2" /> Register
              </Link>
            </div>
          )}
          <Navbar.Toggle className="ml-3 text-white" />
        </div>
        
        <Navbar.Collapse>
          {navLinks.map((link) => (
            <Navbar.Link
              key={link.path}
              as={Link}
              to={link.path}
              active={location.pathname === link.path}
              className={`${
                location.pathname === link.path
                  ? 'text-amber-400'
                  : 'text-gray-200 hover:text-amber-300'
              } text-base font-medium`}
            >
              {link.name}
            </Navbar.Link>
          ))}
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
};

export default Header;