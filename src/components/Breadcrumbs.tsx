'use client';

import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-dark-700 mb-6" aria-label="Breadcrumb">
      <Link 
        href="/" 
        className="flex items-center hover:text-dark-900 transition-colors"
        aria-label="Home"
      >
        <Home className="w-4 h-4" />
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight className="w-4 h-4 text-dark-500" />
          {item.href && index < items.length - 1 ? (
            <Link 
              href={item.href} 
              className="hover:text-dark-900 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-dark-900 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
