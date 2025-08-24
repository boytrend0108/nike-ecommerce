'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AuthFormClientProps {
  type: 'signin' | 'signup';
}

export function AuthFormClient({ type }: AuthFormClientProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const data = {
      email: formData.email,
      password: formData.password,
      ...(type === 'signup' && { name: formData.fullName }),
    };

    try {
      const response = await fetch(`/api/auth/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'An error occurred');
        return;
      }

      router.push('/');
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {type === 'signup' && (
        <div>
          <label htmlFor="fullName" className="block text-body-medium text-dark-900 mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 border border-light-300 rounded-lg text-body text-dark-900 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-dark-900 focus:border-transparent"
            required
          />
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-body-medium text-dark-900 mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="johndoe@gmail.com"
          className="w-full px-4 py-3 border border-light-300 rounded-lg text-body text-dark-900 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-dark-900 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-body-medium text-dark-900 mb-2">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="minimum 8 characters"
            className="w-full px-4 py-3 pr-12 border border-light-300 rounded-lg text-body text-dark-900 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-dark-900 focus:border-transparent"
            required
            minLength={8}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-500 hover:text-dark-700"
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm text-center">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-dark-900 text-light-100 py-3 px-4 rounded-full text-body-medium font-medium hover:bg-dark-700 transition-colors focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Loading...' : (type === 'signin' ? 'Sign In' : 'Sign Up')}
      </button>
    </form>
  );
}
