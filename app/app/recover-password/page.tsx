'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RecoverPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:8000/request-password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess('Recovery email sent. Please check your inbox.');
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setError(result.error || 'Failed to send recovery email.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    }
  };

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
        <h1 className="text-[28px] font-medium text-center text-gray-900 mb-6">Recover Password</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full px-4 py-3 border border-black/5 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none"
            placeholder="Email address"
            required
          />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {success && <p className="text-green-600 text-sm text-center">{success}</p>}

          <button
            type="submit"
            className="w-full bg-[#54A9DA]/50 text-gray-900 py-3 px-4 rounded-[50px] hover:bg-[#4898c9]/50 transition-colors font-medium border border-black/5"
          >
            Send Recovery Email
          </button>
        </form>

        <p className="mt-6 text-center text-[15px] text-gray-600">
          Remember your password?{' '}
          <a href="/login" className="text-[#54A9DA] hover:text-[#4898c9] transition-colors font-medium">
            Back to login
          </a>
        </p>
      </div>
    </div>
  );
}
