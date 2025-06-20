'use client';
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

{/* Page for editing the password */}

export default function EditPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess('Password updated successfully! Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(result.error || 'Failed to update password');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    }
  };

  if (!token) {
    return null;
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
        <h1 className="text-[28px] font-medium text-center text-gray-900 mb-6">Reset Password</h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="block w-full px-4 py-3 pr-12 border border-black/5 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none"
              placeholder="New Password"
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

 
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full px-4 py-3 pr-12 border border-black/5 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none"
              placeholder="Confirm New Password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-900"
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {success && <p className="text-green-600 text-sm text-center">{success}</p>}

          <button
            type="submit"
            className="w-full bg-[#54A9DA]/50 text-gray-900 py-3 px-4 rounded-[50px] hover:bg-[#4898c9]/50 transition-colors font-medium border border-black/5"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
