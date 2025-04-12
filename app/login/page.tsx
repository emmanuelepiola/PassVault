'use\ client';
import React, { useState } from 'react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPasswordPage, setShowPasswordPage] = useState(false);
  
    const handleEmailSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setShowPasswordPage(true);
    };
  
    const handlePasswordSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log('Login attempted with:', { email, password });
    };
  
    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (!showPasswordPage) {
          handleEmailSubmit(e as any);
        } else {
          handlePasswordSubmit(e as any);
        }
      }
    };
  
    if (showPasswordPage) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
          <div className="w-[400px] bg-white rounded-lg border border-gray-100 shadow-sm p-8">
            <h1 className="text-[28px] font-medium text-center text-gray-800 mb-6">
              Login
            </h1>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="block w-full px-4 py-3 border border-gray-200 rounded-lg bg-[#F0F7FF] text-gray-700 placeholder-gray-500 focus:outline-none focus:border-gray-300"
                  placeholder="Password"
                  required
                />
              </div>
  
              <button
                type="submit"
                className="w-full bg-[#86C9F0] text-gray-900 py-3 px-4 rounded-[20px] hover:bg-[#77B9E0] transition duration-200 font-medium"
              >
                Login
              </button>
  
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 text-sm">Or</span>
                </div>
              </div>
  
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 bg-[#86C9F0] text-gray-900 py-3 px-4 rounded-[20px] hover:bg-[#77B9E0] transition duration-200 font-medium"
              >
                <img 
                  src="https://www.google.com/favicon.ico" 
                  alt="Google" 
                  className="w-5 h-5"
                />
                Signin with Google
              </button>
            </form>
  
            <p className="mt-6 text-center text-[15px] text-gray-600">
              Don't have an account?{' '}
              <a href="#" className="text-gray-900 hover:text-gray-700 transition duration-200 font-medium">
                Sign up
              </a>
            </p>
          </div>
        </div>
      );
    }
  
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-[400px] bg-white rounded-lg border border-gray-100 shadow-sm p-8">
          <h1 className="text-[28px] font-medium text-center text-gray-800 mb-6">
            Login
          </h1>
          
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="block w-full px-4 py-3 border border-gray-200 rounded-lg bg-[#F0F7FF] text-gray-700 placeholder-gray-500 focus:outline-none focus:border-gray-300"
                placeholder="Email address"
                required
              />
            </div>
  
            <button
              type="submit"
              className="w-full bg-[#86C9F0] text-gray-900 py-3 px-4 rounded-[20px] hover:bg-[#77B9E0] transition duration-200 font-medium"
            >
              Continue
            </button>
  
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 text-sm">Or</span>
              </div>
            </div>
  
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 bg-[#86C9F0] text-gray-900 py-3 px-4 rounded-[20px] hover:bg-[#77B9E0] transition duration-200 font-medium"
            >
              <img 
                src="https://www.google.com/favicon.ico" 
                alt="Google" 
                className="w-5 h-5"
              />
              Signin with Google
            </button>
          </form>
  
          <p className="mt-6 text-center text-[15px] text-gray-600">
            Don't have an account?{' '}
            <a href="#" className="text-gray-900 hover:text-gray-700 transition duration-200 font-medium">
              Sign up
            </a>
          </p>
        </div>
      </div>
    );
  }