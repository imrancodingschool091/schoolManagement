import React, { useState, useEffect } from 'react';
import { FaUser, FaLock, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { login, resetAuthState } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const dispatch = useDispatch();
  const { loading, error, token, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Reset auth state when component mounts
  useEffect(() => {
    dispatch(resetAuthState());
  }, [dispatch]);

  // Handle successful login
  useEffect(() => {
    if (token) {
      setSuccessMessage('Login successful! Redirecting...');
      const timer = setTimeout(() => {
        navigate("/dashboard/admin");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [token, user, navigate]);

  // Handle errors
  useEffect(() => {
    if (error) {
      setLocalError(error);
      const timer = setTimeout(() => {
        setLocalError(null);
        dispatch(resetAuthState());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMessage(null);
    
    // Basic client-side validation
    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }

    dispatch(login({ email, password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-800">
      <div className="w-full max-w-md px-6 py-8">
        <div className="bg-white rounded-lg shadow-2xl">
          <div className="bg-blue-600 py-4 px-6">
            <h1 className="text-2xl font-bold text-white text-center">Admin Dashboard</h1>
            <p className="text-blue-100 text-center mt-1">Control everything in one place!</p>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 text-center">
                School Management System
              </h2>
              <p className="text-gray-600 text-center text-sm mt-1">
                Manage students, teachers, library – all in one place!
              </p>
            </div>
            
            {/* Success Message */}
            {successMessage && (
              <div className="p-3 bg-green-100 text-green-700 rounded-md flex items-center">
                <FaCheckCircle className="mr-2" />
                {successMessage}
              </div>
            )}
            
            {/* Error Message */}
            {(localError || error) && (
              <div className="p-3 bg-red-100 text-red-700 rounded-md">
                {localError || error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdEmail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin h-5 w-5 mr-2" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <FaUser className="h-5 w-5 mr-2" />
                    Login
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;