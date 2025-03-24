import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cover_Image from "../assets/EmpLogin.jpg";
import { Alert, Spinner } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice";

export default function EmployeeLogin() {
  const { loading, error: errorMessage } = useSelector(state => state.user);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData(prevState => ({ ...prevState, [e.target.id]: e.target.value.trim() }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.email || !formData.password) {
      dispatch(signInFailure("All fields are required"));
      return; // Prevent further execution
    }

    try {
      dispatch(signInStart());
      const res = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();

      if (!res.ok) {
        dispatch(signInFailure(data.message || "Login failed"));
        return; // Stop execution if login fails
      }

      // Successful login
      dispatch(signInSuccess(data));
      navigate("/admin-dashboard?tab=profile");
      
    } catch (error) {
      dispatch(signInFailure(error.message || "An error occurred"));
    }
  };

  return (
    <div className="flex w-full h-screen">
      {/* Left Image Section */}
      <div className="relative hidden h-screen md:flex md:w-1/2">
        <img src={Cover_Image} className="object-cover w-full h-full" alt="Cover" />
      </div>

      {/* Right Login Form */}
      <div className="w-full md:w-1/2 h-screen bg-[#1f1f1f] flex flex-col p-20 justify-center">
        <div className="w-full flex flex-col max-w-[550px] mx-auto">
          <h1 className="text-2xl font-normal text-[#d4d4d4] my-8">Foods and Restaurants</h1>
          <h3 className="text-4xl font-semibold mb-4 text-[#d4d4d4]">Login</h3>
          <p className="text-base mb-2 text-[#d4d4d4]">Welcome Back! Please enter your details</p>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col w-full gap-2">
              <label htmlFor="email" className="text-[#d4d4d4]">Email</label>
              <input 
                type="email"
                id="email"
                value={formData.email}
                placeholder="Enter your email"
                className="w-full rounded-md text-white py-2 my-2 bg-[#707070] outline-none focus:outline-none placeholder:text-[#d4d4d4] focus:ring-[#03001C]"
                onChange={handleChange}
              />

              <label htmlFor="password" className="text-[#d4d4d4]">Password</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                placeholder="Enter your password"
                className="w-full rounded-md text-white py-2 my-2 bg-[#707070] border outline-none focus:outline-none placeholder:text-[#d4d4d4] focus:ring-[#03001C]"
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col w-full my-4">
              <button 
                type="submit" 
                className="w-full text-[#d4d4d4] my-2 bg-[#4c0042] rounded-md p-3 text-center flex items-center justify-center cursor-pointer hover:bg-[#7e1010]"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    <span className="pl-3">Loading...</span>
                  </>
                ) : "Login"}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {errorMessage && (
            <Alert className="p-2 mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
