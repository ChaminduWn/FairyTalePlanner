import { Alert, Label, Spinner, TextInput } from 'flowbite-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, EyeOff } from 'lucide-react';
import OAuth from '../components/OAuth.jsx';
import weddingImage from '../assets/signin04.jpg'; // Replace with your wedding-themed image
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';

export default function SignIn() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState(null);
  const { loading, error: reduxError } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Clear local error when form data changes
  useEffect(() => {
    setLocalError(null);
  }, [formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    // Client-side validation
    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }
    if (!validateEmail(email)) {
      setLocalError('Please enter a valid email address');
      return;
    }

    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        setLocalError(data.message);
        return;
      }
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate('/');
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
      setLocalError('An error occurred. Please try again.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-rose-50 via-pink-100 to-white">
      <div className="flex flex-col w-full max-w-5xl overflow-hidden bg-white shadow-xl rounded-2xl md:flex-row">
        {/* Left Side - Image */}
        <div className="hidden md:block md:w-1/2">
          <img
            src={weddingImage}
            alt="Wedding Sign In"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Right Side - Form */}
        <div className="flex flex-col justify-center w-full p-6 sm:p-8 md:w-1/2">
          <h2 className="mb-3 font-serif text-3xl font-bold text-center text-rose-800 sm:text-4xl">
            Welcome Back
          </h2>
          <p className="mb-6 text-sm text-center text-gray-600 sm:text-base">
            Sign in to plan your dream wedding
          </p>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div>
              <Label
                value="Email"
                className="text-sm font-medium text-gray-700"
              />
              <TextInput
                type="email"
                placeholder="your@email.com"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                color={localError && !validateEmail(formData.email) ? 'failure' : 'gray'}
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Label
                value="Password"
                className="text-sm font-medium text-gray-700"
              />
              <TextInput
                type={showPassword ? 'text' : 'password'}
                placeholder="********"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                color={localError && !formData.password ? 'failure' : 'gray'}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute text-gray-500 right-3 top-9 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-rose-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full px-6 py-3 text-sm font-semibold text-white transition-all rounded-lg bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Spinner size="sm" className="mr-2" />
                  <span>Loading...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>

            {/* OAuth Button */}
            <OAuth />
          </form>

          {/* Sign Up Link */}
          <div className="flex justify-center gap-2 mt-6 text-sm text-gray-600">
            <span>Don’t have an account?</span>
            <Link to="/signup" className="text-rose-600 hover:underline">
              Sign Up
            </Link>
          </div>

          {/* Error Message */}
          {(localError || reduxError) && (
            <Alert className="mt-5 rounded-lg" color="failure">
              {localError || reduxError}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}