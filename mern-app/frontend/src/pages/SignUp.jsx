import { Alert, Label, Spinner, TextInput } from 'flowbite-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, EyeOff } from 'lucide-react';
import OAuth from '../components/OAuth.jsx';
import weddingImage from '../assets/signup02.jpg'; // Replace with your wedding-themed image
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice'; // Adjusted to use userSlice for consistency

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const validateForm = () => {
    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      return 'Please fill in all fields';
    }

    if (username.length < 4 || username.length > 20) {
      return 'Username must be between 4 and 20 characters';
    }

    if (username.includes(' ')) {
      return 'Username cannot contain spaces';
    }

    if (username !== username.toLowerCase()) {
      return 'Username must be lowercase';
    }

    if (!username.match(/^[a-zA-Z0-9]+$/)) {
      return 'Username can only contain letters and numbers';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(password)) {
      return 'Password must be at least 6 characters long and contain both letters and numbers';
    }

    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setLocalError(validationError);
      return;
    }

    try {
      dispatch(signInStart()); // Using signInStart for consistency with Redux
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(signInFailure(data.message || 'Failed to sign up'));
        setLocalError(data.message || 'Failed to sign up');
        return;
      }

      dispatch(signInSuccess(data)); // Assuming signup returns user data
      navigate('/signin');
    } catch (error) {
      dispatch(signInFailure(error.message || 'An error occurred'));
      setLocalError(error.message || 'An error occurred');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-rose-50 via-pink-100 to-white">
      <div className="flex flex-col w-full max-w-5xl overflow-hidden bg-white shadow-xl rounded-2xl md:flex-row">
        {/* Left Side - Image */}
        <div className="hidden md:block md:w-1/2">
          <img
            src={weddingImage}
            alt="Wedding Sign Up"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Right Side - Form */}
        <div className="flex flex-col justify-center w-full p-6 sm:p-8 md:w-1/2">
          <h2 className="mb-3 font-serif text-3xl font-bold text-center text-rose-800 sm:text-4xl">
            Create an Account
          </h2>
          <p className="mb-6 text-sm text-center text-gray-600 sm:text-base">
            Start planning your dream wedding today
          </p>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {/* Username Input */}
            <div>
              <Label
                value="Username"
                className="text-sm font-medium text-gray-700"
              />
              <TextInput
                type="text"
                placeholder="username"
                id="username"
                value={formData.username}
                onChange={handleChange}
                className="mt-1 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                color={
                  localError &&
                  (formData.username.length < 4 ||
                    formData.username.length > 20 ||
                    formData.username.includes(' ') ||
                    formData.username !== formData.username.toLowerCase() ||
                    !formData.username.match(/^[a-zA-Z0-9]+$/))
                    ? 'failure'
                    : 'gray'
                }
              />
            </div>

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
                color={
                  localError &&
                  (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
                    ? 'failure'
                    : 'gray'
                }
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
                color={
                  localError &&
                  (!formData.password ||
                    !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(formData.password))
                    ? 'failure'
                    : 'gray'
                }
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

            {/* Confirm Password Input */}
            <div className="relative">
              <Label
                value="Confirm Password"
                className="text-sm font-medium text-gray-700"
              />
              <TextInput
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="********"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                color={
                  localError &&
                  (!formData.confirmPassword ||
                    formData.password !== formData.confirmPassword)
                    ? 'failure'
                    : 'gray'
                }
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute text-gray-500 right-3 top-9 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Sign Up Button */}
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
                'Sign Up'
              )}
            </button>

            {/* OAuth Button */}
            <OAuth />
          </form>

          {/* Sign In Link */}
          <div className="flex justify-center gap-2 mt-6 text-sm text-gray-600">
            <span>Already have an account?</span>
            <Link to="/signin" className="text-rose-600 hover:underline">
              Sign In
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