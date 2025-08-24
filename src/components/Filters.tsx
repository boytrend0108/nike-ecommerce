'use client';

import { mockFilters } from '@/lib/data/mockProducts';
import {
  addFilter,
  clearAllFilters,
  parseFilters,
  removeFilter,
  stringifyFilters,
  updatePriceRange
} from '@/lib/utils/query';
import { ChevronDown, ChevronUp, Filter, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Filters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    gender: true,
    size: true,
    color: true,
    price: true,
  });
  
  const currentFilters = parseFilters(searchParams);
  
  // Close mobile drawer when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [searchParams]);

  const handleFilterChange = (filterType: 'gender' | 'color' | 'size', value: string, isChecked: boolean) => {
    const newFilters = isChecked 
      ? addFilter(currentFilters, filterType, value)
      : removeFilter(currentFilters, filterType, value);
    
    const queryString = stringifyFilters(newFilters);
    router.push(`/products${queryString ? `?${queryString}` : ''}`, { scroll: false });
  };

  const handlePriceRangeChange = (priceRange: string | null) => {
    const newFilters = updatePriceRange(currentFilters, priceRange);
    const queryString = stringifyFilters(newFilters);
    router.push(`/products${queryString ? `?${queryString}` : ''}`, { scroll: false });
  };

  const handleClearAll = () => {
    const newFilters = clearAllFilters();
    const queryString = stringifyFilters(newFilters);
    router.push(`/products${queryString ? `?${queryString}` : ''}`, { scroll: false });
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const hasActiveFilters = 
    currentFilters.gender.length > 0 || 
    currentFilters.color.length > 0 || 
    currentFilters.size.length > 0 || 
    currentFilters.priceRange !== null;

  const FilterSection = ({ 
    title, 
    sectionKey, 
    children 
  }: { 
    title: string; 
    sectionKey: keyof typeof expandedSections; 
    children: React.ReactNode 
  }) => (
    <div className="border-b border-light-300 pb-6">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex w-full items-center justify-between text-left"
        aria-expanded={expandedSections[sectionKey]}
      >
        <h3 className="text-body-medium text-dark-900">{title}</h3>
        {expandedSections[sectionKey] ? (
          <ChevronUp className="h-4 w-4 text-dark-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-dark-500" />
        )}
      </button>
      
      {expandedSections[sectionKey] && (
        <div className="mt-4 space-y-3">
          {children}
        </div>
      )}
    </div>
  );

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Clear All Button */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between">
          <span className="text-caption text-dark-700">Active filters</span>
          <button
            onClick={handleClearAll}
            className="text-caption text-dark-900 underline hover:text-dark-700 focus:outline-none focus:text-dark-700"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Gender Filter */}
      <FilterSection title="Gender" sectionKey="gender">
        {mockFilters.genders.map((gender) => (
          <label key={gender.id} className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={currentFilters.gender.includes(gender.slug)}
              onChange={(e) => handleFilterChange('gender', gender.slug, e.target.checked)}
              className="h-4 w-4 rounded border-light-400 text-dark-900 focus:ring-2 focus:ring-dark-900 focus:ring-offset-0"
            />
            <span className="text-body text-dark-700">{gender.label}</span>
          </label>
        ))}
      </FilterSection>

      {/* Size Filter */}
      <FilterSection title="Size" sectionKey="size">
        {mockFilters.sizes
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((size) => (
            <label key={size.id} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={currentFilters.size.includes(size.slug)}
                onChange={(e) => handleFilterChange('size', size.slug, e.target.checked)}
                className="h-4 w-4 rounded border-light-400 text-dark-900 focus:ring-2 focus:ring-dark-900 focus:ring-offset-0"
              />
              <span className="text-body text-dark-700">US {size.name}</span>
            </label>
          ))}
      </FilterSection>

      {/* Color Filter */}
      <FilterSection title="Color" sectionKey="color">
        {mockFilters.colors.map((color) => (
          <label key={color.id} className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={currentFilters.color.includes(color.slug)}
              onChange={(e) => handleFilterChange('color', color.slug, e.target.checked)}
              className="h-4 w-4 rounded border-light-400 text-dark-900 focus:ring-2 focus:ring-dark-900 focus:ring-offset-0"
            />
            <div className="flex items-center space-x-2">
              <div 
                className="h-4 w-4 rounded-full border border-light-400"
                style={{ backgroundColor: color.hexCode }}
              />
              <span className="text-body text-dark-700">{color.name}</span>
            </div>
          </label>
        ))}
      </FilterSection>

      {/* Price Range Filter */}
      <FilterSection title="Price" sectionKey="price">
        {mockFilters.priceRanges.map((range) => (
          <label key={range.value} className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="priceRange"
              checked={currentFilters.priceRange === range.value}
              onChange={() => handlePriceRangeChange(range.value)}
              className="h-4 w-4 border-light-400 text-dark-900 focus:ring-2 focus:ring-dark-900 focus:ring-offset-0"
            />
            <span className="text-body text-dark-700">{range.label}</span>
          </label>
        ))}
        {currentFilters.priceRange && (
          <button
            onClick={() => handlePriceRangeChange(null)}
            className="text-caption text-dark-900 underline hover:text-dark-700 focus:outline-none focus:text-dark-700"
          >
            Clear price filter
          </button>
        )}
      </FilterSection>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button - Only shown on mobile */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center gap-2 rounded-lg border border-light-400 bg-light-100 px-4 py-2 text-body-medium text-dark-900 hover:border-dark-500 focus:border-dark-900 focus:outline-none transition-colors"
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-dark-900 text-footnote text-light-100">
              {currentFilters.gender.length + currentFilters.color.length + currentFilters.size.length + (currentFilters.priceRange ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      {/* Desktop Sidebar - Only shown on desktop */}
      <aside className="hidden lg:block w-80 shrink-0">
        <div className="sticky top-6">
          <div className="rounded-xl border border-light-300 bg-light-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-heading-3 text-dark-900">Filters</h2>
              {hasActiveFilters && (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-dark-900 text-footnote text-light-100">
                  {currentFilters.gender.length + currentFilters.color.length + currentFilters.size.length + (currentFilters.priceRange ? 1 : 0)}
                </span>
              )}
            </div>
            <FilterContent />
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-dark-900/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Drawer */}
          <div className="absolute left-0 top-0 h-full w-80 max-w-[90vw] bg-light-100 shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="flex items-center justify-between border-b border-light-300 p-6">
              <h2 className="text-heading-3 text-dark-900">Filters</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-2 text-dark-500 hover:bg-light-200 hover:text-dark-900 focus:bg-light-200 focus:text-dark-900 focus:outline-none transition-colors"
                aria-label="Close filters"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="h-full overflow-y-auto p-6 pb-20">
              <FilterContent />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
