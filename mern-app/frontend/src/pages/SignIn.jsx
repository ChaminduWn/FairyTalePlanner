import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import OAuth from '../components/OAuth.jsx';
import weddingImage from '../assets/signin04.jpg'; // Replace with a wedding-themed image
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure('Please fill all the fields'));
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
      }

      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate('/');
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-pink-50 via-rose-100 to-white">
      <div className="flex flex-col w-full max-w-4xl overflow-hidden bg-white rounded-lg shadow-lg md:flex-row">
        
        {/* Left Side - Image */}
        <div className="hidden md:block md:w-1/2">
          <img
            src={weddingImage}
            alt="Wedding Sign In"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Right Side - Form */}
        <div className="flex flex-col justify-center w-full p-8 md:w-1/2">
          <h2 className="mb-2 font-serif text-3xl font-bold text-center text-rose-800">
            Welcome Back
          </h2>
          <p className="mb-6 text-sm text-center text-gray-600">
            Sign in to plan your dream wedding
          </p>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
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
                'Sign In'
              )}
            </Button>
            <OAuth />
          </form>

          <div className="flex justify-center gap-2 mt-5 text-sm text-gray-600">
            <span>Don’t have an account?</span>
            <Link to="/signup" className="text-rose-600 hover:underline">
              Sign Up
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