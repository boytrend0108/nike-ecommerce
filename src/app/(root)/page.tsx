'use client';

import { Card, RenderList } from '@/components';

const bestOfAirMaxProducts = [
  {
    title: 'Nike Air Force 1 Mid \'07',
    meta: "Men's Shoes",
    price: '$94.97',
    badge: { text: 'Best Seller' },
    imageSrc: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-force-1-07-shoes-WrLlWX.png',
    imageAlt: 'Nike Air Force 1 Mid 07',
    description: '6 Colour',
  },
  {
    title: 'Nike Court Vision Low Next Nature',
    meta: "Men's Shoes", 
    price: '$64.97',
    badge: { text: 'Extra 20% off' },
    imageSrc: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/e777c881-5b62-4250-92a6-362967f54cca/court-vision-low-next-nature-shoes-TgD6sM.png',
    imageAlt: 'Nike Court Vision Low Next Nature',
    description: '4 Colour',
  },
  {
    title: 'Nike Dunk Low Retro',
    meta: "Men's Shoes",
    price: '$89.97', 
    badge: { text: 'Extra 10% off' },
    imageSrc: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b1bcbca4-e853-4df7-b329-5be3c61ee057/dunk-low-shoes-0LFgSB.png',
    imageAlt: 'Nike Dunk Low Retro',
    description: '6 Colour',
  },
  {
    title: 'Nike Air Force 1 Mid \'07',
    meta: "Men's Shoes",
    price: '$94.97',
    badge: { text: 'Best Seller' },
    imageSrc: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-force-1-07-shoes-WrLlWX.png',
    imageAlt: 'Nike Air Force 1 Mid 07',
    description: '6 Colour',
  },
  {
    title: 'Nike Court Vision Low Next Nature',
    meta: "Men's Shoes", 
    price: '$64.97',
    badge: { text: 'Extra 20% off' },
    imageSrc: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/e777c881-5b62-4250-92a6-362967f54cca/court-vision-low-next-nature-shoes-TgD6sM.png',
    imageAlt: 'Nike Court Vision Low Next Nature',
    description: '4 Colour',
  },
  {
    title: 'Nike Dunk Low Retro',
    meta: "Men's Shoes",
    price: '$89.97', 
    badge: { text: 'Extra 10% off' },
    imageSrc: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b1bcbca4-e853-4df7-b329-5be3c61ee057/dunk-low-shoes-0LFgSB.png',
    imageAlt: 'Nike Dunk Low Retro',
    description: '6 Colour',
  },
];

export default function Home() {

  
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
              className="h-full"
            />
          )}
        />
      </section>
    </div>
  );
}
