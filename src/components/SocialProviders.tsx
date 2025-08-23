'use client';

import React from 'react';
import { Chrome, Apple } from 'lucide-react';

export function SocialProviders() {
  return (
    <div className="space-y-3">
      <button
        type="button"
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-light-300 rounded-full text-body-medium text-dark-900 hover:bg-light-200 transition-colors focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2"
      >
        <Chrome className="w-5 h-5" />
        Continue with Google
      </button>
      
      <button
        type="button"
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-light-300 rounded-full text-body-medium text-dark-900 hover:bg-light-200 transition-colors focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2"
      >
        <Apple className="w-5 h-5" />
        Continue with Apple
      </button>
    </div>
  );
}
