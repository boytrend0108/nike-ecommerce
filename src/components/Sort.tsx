'use client';

import { sortOptions } from '@/lib/data/mockProducts';
import { parseFilters, stringifyFilters, updateSort } from '@/lib/utils/query';
import { ChevronDown } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function Sort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  
  const currentFilters = parseFilters(searchParams);
  const currentSort = currentFilters.sort;
  const currentSortLabel = sortOptions.find(option => option.value === currentSort)?.label || 'Featured';

  const handleSortChange = (sortValue: string) => {
    const newFilters = updateSort(currentFilters, sortValue);
    const queryString = stringifyFilters(newFilters);
    
    router.push(`/products${queryString ? `?${queryString}` : ''}`, { scroll: false });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2 rounded-lg border border-light-400 bg-light-100 px-4 py-2 text-body-medium text-dark-900 hover:border-dark-500 focus:border-dark-900 focus:outline-none transition-colors"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>Sort by: {currentSortLabel}</span>
        <ChevronDown 
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-10 mt-1 w-full min-w-48 rounded-lg border border-light-400 bg-light-100 shadow-lg">
          <ul role="listbox" className="py-1">
            {sortOptions.map((option) => (
              <li key={option.value} role="option" aria-selected={currentSort === option.value}>
                <button
                  onClick={() => handleSortChange(option.value)}
                  className={`w-full px-4 py-2 text-left text-body hover:bg-light-200 focus:bg-light-200 focus:outline-none transition-colors ${
                    currentSort === option.value 
                      ? 'bg-light-200 text-dark-900 font-medium' 
                      : 'text-dark-700'
                  }`}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Invisible overlay to close dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-5"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
