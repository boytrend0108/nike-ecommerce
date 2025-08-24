'use client';

import { Card, RenderList } from '@/components';
import { mockProducts } from '@/lib/data/mockProducts';
import Link from 'next/link';

export default function Home() {
  // Get first 6 products for the "Best of Air Max" section
  const bestOfAirMaxProducts = mockProducts.slice(0, 6).map(product => {
    const firstVariant = product.variants[0];
    const hasDiscount = !!firstVariant.salePrice;
    const currentPrice = hasDiscount ? firstVariant.salePrice : firstVariant.price;
    
    return {
      id: product.id,
      title: product.name,
      meta: `${product.genderLabel}'s ${product.categoryName}`,
      price: `$${currentPrice}`,
      badge: hasDiscount ? { text: 'Sale' } : null,
      imageSrc: product.images[0],
      imageAlt: product.name,
      description: product.description,
      href: `/products/${product.id}`
    };
  });

  
  return (
    <div className="container mx-auto px-4 py-8">      
      <section className="mb-16">
        <h2 className="text-heading-2 mb-8 text-dark-900">Best of Air Max</h2>

        <RenderList
          items={bestOfAirMaxProducts}
          renderItem={(product) => (
            <Card
              title={product.title}
              description={product.description}
              imageSrc={product.imageSrc}
              imageAlt={product.imageAlt}
              price={product.price}
              badge={product.badge}
              meta={product.meta}
              href={product.href}
              className="h-full"
            />
          )}
        />
        
        <div className="mt-8 text-center">
          <Link 
            href="/products" 
            className="inline-flex items-center rounded-lg bg-dark-900 px-6 py-3 text-body-medium text-light-100 hover:bg-dark-700 transition-colors"
          >
            View All Products
          </Link>
        </div>
      </section>
    </div>
  );
}
