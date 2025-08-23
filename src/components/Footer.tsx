import Image from 'next/image';
import Link from 'next/link';

const columns = [
  { title: 'Featured', links: ['Air Force 1', 'Huarache', 'Air Max 90', 'Air Max 95'] },
  { title: 'Shoes', links: ['All Shoes', 'Custom Shoes', 'Jordan Shoes', 'Running Shoes'] },
  { title: 'Clothing', links: ['All Clothing', 'Modest Wear', 'Hoodies & Pullovers', 'Shirts & Tops'] },
  { title: "Kids'", links: ["Infant & Toddler Shoes", "Kids' Shoes", "Kids' Jordan Shoes", "Kids' Basketball Shoes"] },
];

export default function Footer() {
  return (
    <footer className="bg-dark-900 text-light-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="md:col-span-2">
            <Image src="/logo.svg" alt="Nike" width={36} height={36} />
          </div>

          <div className="md:col-span-9 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-heading-3 text-light-100">{col.title}</h3>
                <ul className="mt-4 space-y-3">
                  {col.links.map((label) => (
                    <li key={label}>
                      <Link href="#" className="text-body text-dark-500 hover:text-light-100 transition-colors">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="md:col-span-1 flex md:justify-end items-start gap-3">
            {[
              { src: '/x.svg', alt: 'X' },
              { src: '/facebook.svg', alt: 'Facebook' },
              { src: '/instagram.svg', alt: 'Instagram' },
            ].map((icon) => (
              <Link
                key={icon.alt}
                href="#"
                aria-label={icon.alt}
                className="inline-flex h-9 w-9 min-w-9 items-center justify-center rounded-full bg-light-100 hover:bg-light-100/10 ring-1 ring-light-400/10"
              >
                <Image src={icon.src} alt={icon.alt} width={16} height={16} />
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 border-t border-light-400/10 pt-6 text-caption text-dark-500">
          © {new Date().getFullYear()} Nike, Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
