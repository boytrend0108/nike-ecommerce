'use client';

import { Ruler } from 'lucide-react';
import { useState } from 'react';

interface Size {
  id: string;
  name: string;
  inStock: boolean;
}

interface SizePickerProps {
  sizes: Size[];
}

export default function SizePicker({ sizes }: SizePickerProps) {
  const [selectedSizeId, setSelectedSizeId] = useState<string>('');

  const handleKeyDown = (e: React.KeyboardEvent, sizeId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedSizeId(sizeId);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-body-medium text-dark-900">Select Size</h3>
        <button className="flex items-center gap-1 text-caption text-dark-700 hover:text-dark-900 transition-colors">
          <Ruler className="w-4 h-4" />
          Size Guide
        </button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
        {sizes.map((size) => (
          <button
            key={size.id}
            onClick={() => setSelectedSizeId(size.id)}
            onKeyDown={(e) => handleKeyDown(e, size.id)}
            disabled={!size.inStock}
            className={`
              relative py-3 px-2 sm:px-4 text-body-medium border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2
              ${selectedSizeId === size.id
                ? 'border-dark-900 bg-dark-900 text-light-100'
                : size.inStock
                ? 'border-light-400 hover:border-dark-900 text-dark-900'
                : 'border-light-300 text-dark-500 cursor-not-allowed'
              }
              ${!size.inStock ? 'relative' : ''}
            `}
            aria-pressed={selectedSizeId === size.id}
            aria-label={`Size ${size.name}${!size.inStock ? ' (Out of stock)' : ''}`}
          >
            {size.name}
            {!size.inStock && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-px bg-dark-500 rotate-45 absolute"></div>
              </div>
            )}
          </button>
        ))}
      </div>

      {!selectedSizeId && (
        <p className="text-caption text-dark-500">Please select a size to continue</p>
      )}
    </div>
  );
}
