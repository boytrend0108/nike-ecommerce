'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function CollapsibleSection({ 
  title, 
  children, 
  defaultOpen = false 
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="border-b border-light-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className="w-full py-4 flex items-center justify-between text-left hover:text-dark-700 transition-colors group focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2 rounded-sm"
        aria-expanded={isOpen}
        aria-controls={`section-${title.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <span className="text-body-medium text-dark-900">{title}</span>
        <div className="flex-shrink-0 ml-4">
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-dark-700 group-hover:text-dark-900 transition-colors" />
          ) : (
            <ChevronDown className="w-5 h-5 text-dark-700 group-hover:text-dark-900 transition-colors" />
          )}
        </div>
      </button>
      
      <div
        id={`section-${title.toLowerCase().replace(/\s+/g, '-')}`}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[500px] pb-4' : 'max-h-0'
        }`}
      >
        <div className="text-body text-dark-700 space-y-2">
          {children}
        </div>
      </div>
    </div>
  );
}
