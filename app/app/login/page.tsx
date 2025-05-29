'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { API_BASE_URL } from '../../config/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPasswordPage, setShowPasswordPage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_BASE_URL}/checkEmailHandler`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const responseBody = await response.json();

      if (response.ok) {
        setSuccess('Email found! Proceed to enter your password.');
        setShowPasswordPage(true);
      } else {
        setError('Invalid email');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An unexpected error occurred');
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_BASE_URL}/loginHandler`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const responseBody = await response.json();

      if (response.ok) {
        sessionStorage.setItem('userId', responseBody.user_id);
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setError('Invalid password');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An unexpected error occurred');
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        // Ottieni i dettagli dell'utente da Google
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${response.access_token}` },
        }).then(res => res.json());

        // Invia l'email al backend
        const backendResponse = await fetch(`${API_BASE_URL}/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userInfo.email }),
        });

        const data = await backendResponse.json();

        if (backendResponse.ok) {
          sessionStorage.setItem('userId', data.user_id);
          setSuccess('Login successful! Redirecting...');
          setTimeout(() => {
            router.push('/dashboard');
          }, 2000);
        } else {
          setError('Failed to authenticate with Google');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('An unexpected error occurred');
      }
    },
    onError: () => {
      setError('Google login failed');
    },
  });

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
        <div className="w-[400px] bg-white rounded-lg border border-black/10 shadow-sm p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16">
              <svg className="w-full h-full" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="90" cy="90" r="90" fill="#54A9DA" />
                <path d="M117 63.5C117 77.5833 105.807 89 92 89C78.1929 89 67 77.5833 67 63.5C67 49.4167 78.1929 38 92 38C105.807 38 117 49.4167 117 63.5Z" fill="white" />
                <path d="M90.5 63L123 132H58L90.5 63Z" fill="white" />
              </svg>
            </div>
          </div>
          <h1 className="text-[28px] font-medium text-center text-gray-900 mb-6">Login</h1>

          <div className="text-center text-gray-700 mb-4">
            <p>You are logging in as:</p>
            <p className="font-medium text-gray-900">{email}</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="block w-full px-4 py-3 pr-12 border border-black/5 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0"
                placeholder="Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-900"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="text-right mt-1">
              <Link href="/recover-password" className="text-sm text-[#54A9DA] hover:text-[#4898c9] font-medium">
                Forgot your password?
              </Link>
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {success && <p className="text-green-600 text-sm text-center">{success}</p>}

            <button
              type="submit"
              className="w-full bg-[#54A9DA]/50 text-gray-900 py-3 px-4 rounded-[50px] hover:bg-[#4898c9]/50 transition-colors font-medium border border-black/5"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-center text-[15px] text-gray-600">
            Don't have an account?{' '}
            <Link href="/signup" className="text-[#54A9DA] hover:text-[#4898c9] transition-colors font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-[400px] bg-white rounded-lg border border-black/10 shadow-sm p-8">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16">
            <svg className="w-full h-full" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="90" cy="90" r="90" fill="#54A9DA" />
              <path d="M117 63.5C117 77.5833 105.807 89 92 89C78.1929 89 67 77.5833 67 63.5C67 49.4167 78.1929 38 92 38C105.807 38 117 49.4167 117 63.5Z" fill="white" />
              <path d="M90.5 63L123 132H58L90.5 63Z" fill="white" />
            </svg>
          </div>
        </div>
        <h1 className="text-[28px] font-medium text-center text-gray-900 mb-6">Login</h1>

        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="block w-full px-4 py-3 border border-black/5 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0"
              placeholder="Email address"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-[#54A9DA]/50 text-gray-900 py-3 px-4 rounded-[50px] hover:bg-[#4898c9]/50 transition-colors font-medium border border-black/5"
          >
            Continue
          </button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black/5"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 text-sm">Or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleGoogleLogin()}
            className="w-full flex items-center justify-center gap-2 bg-[#54A9DA]/30 text-gray-900 py-3 px-4 rounded-[50px] hover:bg-[#4898c9]/30 transition-colors font-medium border border-black/5"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>
        </form>

        <p className="mt-6 text-center text-[15px] text-gray-600">
          Don't have an account?{' '}
          <Link href="/signup" className="text-[#54A9DA] hover:text-[#4898c9] transition-colors font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
