import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3001';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Check if email already exists
      const checkResponse = await fetch(
        `${API_URL}/users?email=${encodeURIComponent(formData.email)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const existingUsers = await checkResponse.json();
      if (existingUsers.length > 0) {
        setError('Email already exists');
        setIsLoading(false);
        return;
      }

      // Create new user
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          createdAt: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create account');
      }

      const data = await response.json();
      const token = btoa(JSON.stringify({ 
        userId: data.id, 
        email: data.email,
        name: data.name 
      }));
      
      localStorage.setItem('token', token);
      navigate('/');

    } catch (err) {
      console.error('Signup error:', err);
      if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        setError('Server is not running. Please start the server with: npm run mock-api');
      } else {
        setError(err.message || 'Failed to create account');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 backdrop-blur-lg bg-white/10 p-8 rounded-2xl border border-white/20 shadow-2xl">
        <div>
          <h2 className="text-center text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
            Create Account
          </h2>
          <p className="text-center text-sm text-gray-300 mt-2">
            Join us and start exploring events
          </p>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg relative">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Name
            </label>
            <input
              type="text"
              name="name"
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-900/50 border border-gray-700 text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-900/50 border border-gray-700 text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-900/50 border border-gray-700 text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-900/50 border border-gray-700 text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-300"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-300">
              Already have an account?{' '}
              <a href="/login" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                Login
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup; 