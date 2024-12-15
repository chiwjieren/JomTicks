import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="backdrop-blur-md bg-gradient-to-r from-purple-900/70 via-indigo-900/70 to-blue-900/70 border-b border-white/10 shadow-xl">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 hover:from-purple-500 hover:to-cyan-500 transition-all duration-300">
              JomTicks
            </Link>
            {token && (
              <div className="ml-10 flex space-x-6">
                <Link to="/" className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-all duration-300 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Home
                </Link>
                <Link to="/events" className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-all duration-300 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Events
                </Link>
                <Link to="/my-tickets" className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-all duration-300 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  My Tickets
                </Link>
              </div>
            )}
          </div>
          
          <div className="flex items-center">
            {token ? (
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            ) : (
              <div className="flex space-x-4">
                <Link to="/login" className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300">
                  Login
                </Link>
                <Link to="/signup" className="bg-gradient-to-r from-purple-400 to-indigo-500 hover:from-purple-500 hover:to-indigo-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 