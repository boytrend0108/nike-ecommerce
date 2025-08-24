'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface NavItem {
  label: string;
  href?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Men', href: '/products?gender=men' },
  { label: 'Women', href: '/products?gender=women' },
  { label: 'Kids', href: '/products?gender=kids' },
  { label: 'Collections', href: '#' },
  { label: 'Contact', href: '#' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav aria-label="Primary" className="bg-light-100 border-b border-light-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" aria-label="Nike Home" className="flex items-center">
              <Image src="/logo.svg" alt="Nike" width={28} height={28} priority />
            </Link>
          </div>

          <ul className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href ?? '#'}
                  className="text-body-medium text-dark-900 hover:text-dark-700 transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-6">
            <button type="button" className="text-body-medium text-dark-900 hover:text-dark-700">
              Search
            </button>
            <button type="button" className="text-body-medium text-dark-900 hover:text-dark-700">
              My Cart (2)
            </button>
          </div>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-dark-900 hover:bg-light-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-900"
            aria-controls="mobile-menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Toggle menu</span>
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      <div id="mobile-menu" className={`md:hidden ${open ? 'block' : 'hidden'} border-t border-light-300`}>
        <div className="space-y-1 px-4 py-3">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href ?? '#'}
              className="block rounded-md px-3 py-2 text-body text-dark-900 hover:bg-light-200"
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-2 flex items-center gap-4 px-3 py-2">
            <button className="text-body-medium text-dark-900">Search</button>
            <button className="text-body-medium text-dark-900">My Cart (2)</button>
          </div>
        </div>
      </div>
    </nav>
  );
}
