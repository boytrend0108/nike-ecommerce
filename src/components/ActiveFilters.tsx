'use client';

import {
    clearAllFilters,
    parseFilters,
    removeFilter,
    stringifyFilters,
    updatePriceRange
} from '@/lib/utils/query';
import { X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface ActiveFilter {
  type: string;
  label: string;
  value: string;
}

interface ActiveFiltersProps {
  filters: ActiveFilter[];
}

export default function ActiveFilters({ filters }: ActiveFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentFilters = parseFilters(searchParams);

  const handleRemoveFilter = (type: string, value: string) => {
    let newFilters;
    
    if (type === 'priceRange') {
      newFilters = updatePriceRange(currentFilters, null);
    } else if (type === 'gender' || type === 'color' || type === 'size') {
      newFilters = removeFilter(currentFilters, type as 'gender' | 'color' | 'size', value);
    } else {
      return;
    }
    
    const queryString = stringifyFilters(newFilters);
    router.push(`/products${queryString ? `?${queryString}` : ''}`, { scroll: false });
  };

  const handleClearAll = () => {
    const newFilters = clearAllFilters();
    const queryString = stringifyFilters(newFilters);
    router.push(`/products${queryString ? `?${queryString}` : ''}`, { scroll: false });
  };

  if (filters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter, index) => (
        <button
          key={`${filter.type}-${filter.value}-${index}`}
          onClick={() => handleRemoveFilter(filter.type, filter.value)}
          className="inline-flex items-center gap-1 rounded-full bg-dark-900 px-3 py-1 text-footnote text-light-100 hover:bg-dark-700 transition-colors"
          aria-label={`Remove ${filter.label} filter`}
        >
          {filter.label}
          <X className="h-3 w-3" />
        </button>
      ))}
      {filters.length > 1 && (
        <button
          onClick={handleClearAll}
          className="text-caption text-dark-700 underline hover:text-dark-900 transition-colors"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
