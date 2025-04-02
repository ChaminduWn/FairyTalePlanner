import React, { useState } from 'react';
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth.jsx';
import weddingImage from '../assets/signup02.jpg'; // Replace with a wedding-themed image

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage('Please fill out all fields.');
    }

    if (formData.username.length < 4 || formData.username.length > 20) {
      return setErrorMessage('Username must be between 4 and 20 characters.');
    }

    if (formData.username.includes(' ')) {
      return setErrorMessage('Username cannot contain spaces.');
    }

    if (formData.username !== formData.username.toLowerCase()) {
      return setErrorMessage('Username must be lowercase.');
    }

    if (!formData.username.match(/^[a-zA-Z0-9]+$/)) {
      return setErrorMessage('Username can only contain letters and numbers.');
    }

    if (formData.email.length < 6 || !formData.email.includes('@')) {
      return setErrorMessage('Please enter a valid email address.');
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(formData.password)) {
      return setErrorMessage('Password must be at least 6 characters long and contain both letters and numbers.');
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to sign up');
      }

      setLoading(false);
      navigate('/signin');
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.message || 'An error occurred');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-pink-50 via-rose-100 to-white">
      <div className="flex flex-col w-full max-w-4xl overflow-hidden bg-white rounded-lg shadow-lg md:flex-row">
        
        {/* Left Side - Image */}
        <div className="hidden md:block md:w-1/2">
          <img
            src={weddingImage}
            alt="Wedding Sign Up"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Right Side - Form */}
        <div className="flex flex-col justify-center w-full p-8 md:w-1/2">
          <h2 className="mb-2 font-serif text-3xl font-bold text-center text-rose-800">
            Create an Account
          </h2>
          <p className="mb-6 text-sm text-center text-gray-600">
            Start planning your dream wedding today
          </p>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div>
              <Label value="Username" className="text-gray-700" />
              <TextInput
                type="text"
                placeholder="username"
                id="username"
                onChange={handleChange}
                className="mt-1 focus:ring-rose-500 focus:border-rose-500"
              />
            </div>
            <div>
              <Label value="Email" className="text-gray-700" />
              <TextInput
                type="email"
                placeholder="your@email.com"
                id="email"
                onChange={handleChange}
                className="mt-1 focus:ring-rose-500 focus:border-rose-500"
              />
            </div>
            <div>
              <Label value="Password" className="text-gray-700" />
              <TextInput
                type="password"
                placeholder="********"
                id="password"
                onChange={handleChange}
                className="mt-1 focus:ring-rose-500 focus:border-rose-500"
              />
            </div>
            <Button
              type="submit"
              gradientDuoTone="pinkToOrange"
              className="w-full font-semibold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
            <OAuth />
          </form>

          <div className="flex justify-center gap-2 mt-5 text-sm text-gray-600">
            <span>Already have an account?</span>
            <Link to="/signin" className="text-rose-600 hover:underline">
              Sign In
            </Link>
          </div>

          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}