'use client';
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../config/api';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
  
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
  
    try {
      const response = await fetch(`${API_BASE_URL}/signupHandler`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const responseBody = await response.json();

      if (response.ok) {
        setSuccess('Registration successful');
      } else {
        setError(responseBody.error || 'Failed to register user');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An unexpected error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-[400px] bg-white rounded-lg border border-black/10 shadow-sm p-8">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16">
            <svg
              className="w-full h-full"
              viewBox="0 0 180 180"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M180 90C180 139.706 139.706 180 90 180C40.2944 180 0 139.706 0 90C0 40.2944 40.2944 0 90 0C139.706 0 180 40.2944 180 90Z" fill="#54A9DA" />
              <path d="M117 63.5C117 77.5833 105.807 89 92 89C78.1929 89 67 77.5833 67 63.5C67 49.4167 78.1929 38 92 38C105.807 38 117 49.4167 117 63.5Z" fill="white" />
              <path d="M90.5 63L123 132H58L90.5 63Z" fill="white" />
            </svg>
          </div>
        </div>
        <h1 className="text-[28px] font-medium text-center text-gray-900 mb-6">
          Create Account
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-4 py-3 border border-black/5 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0"
              placeholder="Email address"
              required
            />
          </div>

          <div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 pr-12 border border-black/5 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0"
                placeholder="Password"
                required
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowPassword(!showPassword);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                {showPassword ? (
                  <EyeOff size={16} className="text-gray-500" />
                ) : (
                  <Eye size={16} className="text-gray-500" />
                )}
              </button>
            </div>
          </div>

          <div>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full px-4 py-3 pr-12 border border-black/5 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0"
                placeholder="Confirm password"
                required
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowConfirmPassword(!showConfirmPassword);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff size={16} className="text-gray-500" />
                ) : (
                  <Eye size={16} className="text-gray-500" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {success && (
            <p className="text-green-500 text-sm text-center">{success}</p>
          )}

          <button
            type="submit"
            className="w-full bg-[#54A9DA]/50 text-gray-900 py-3 px-4 rounded-[50px] hover:bg-[#4898c9]/50 transition-colors font-medium border border-black/5"
          >
            Sign up
          </button>
        </form>

        <p className="mt-6 text-center text-[15px] text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-[#54A9DA] hover:text-[#4898c9] transition-colors font-medium">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
