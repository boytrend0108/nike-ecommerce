import { db } from '../src/lib/db';
import { products } from '../src/lib/db/schema';

const nikeProducts = [
  {
    name: 'Air Jordan 1 Retro High OG',
    description: 'The Air Jordan 1 Retro High OG brings back the classic silhouette with premium materials and iconic colorways.',
    price: '170.00',
    originalPrice: '170.00',
    category: 'Basketball',
    brand: 'Nike',
    size: 'US 10',
    color: 'Chicago',
    imageUrl: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-jordan-1-retro-high-og-shoes-Pph9LM.png',
    stock: 25,
  },
  {
    name: 'Nike Air Max 90',
    description: 'The Nike Air Max 90 stays true to its OG running roots with the iconic Waffle sole, stitched overlays and classic TPU accents.',
    price: '120.00',
    originalPrice: '120.00',
    category: 'Lifestyle',
    brand: 'Nike',
    size: 'US 9',
    color: 'White/Black',
    imageUrl: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/zwxes8uud05rkuei1mpt/air-max-90-shoes-6n3vKB.png',
    stock: 40,
  },
  {
    name: 'Nike Dunk Low',
    description: 'Created for the hardwood but taken to the streets, the Nike Dunk Low returns with crisp overlays and original team colors.',
    price: '110.00',
    originalPrice: '110.00',
    category: 'Lifestyle',
    brand: 'Nike',
    size: 'US 8.5',
    color: 'Panda',
    imageUrl: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b1bcbca4-e853-4df7-b329-5be3c61ee057/dunk-low-shoes-0LFgSB.png',
    stock: 30,
  },
  {
    name: 'Nike Air Force 1 \'07',
    description: 'The radiance lives on in the Nike Air Force 1 \'07, the basketball original that puts a fresh spin on what you know best.',
    price: '110.00',
    originalPrice: '110.00',
    category: 'Lifestyle',
    brand: 'Nike',
    size: 'US 11',
    color: 'Triple White',
    imageUrl: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-force-1-07-shoes-WrLlWX.png',
    stock: 50,
  },
  {
    name: 'Nike React Infinity Run Flyknit 3',
    description: 'A comfortable, reliable road running shoe that\'s engineered to help keep you on the run.',
    price: '160.00',
    originalPrice: '160.00',
    category: 'Running',
    brand: 'Nike',
    size: 'US 9.5',
    color: 'Black/White',
    imageUrl: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/e777c881-5b62-4250-92a6-362967f54cca/react-infinity-run-flyknit-3-road-running-shoes-XpNdLn.png',
    stock: 35,
  },
  {
    name: 'Nike Blazer Mid \'77 Vintage',
    description: 'In the \'70s, Nike was the new shoe on the block. So new in fact, we were still breaking into the basketball scene.',
    price: '100.00',
    originalPrice: '100.00',
    category: 'Lifestyle',
    brand: 'Nike',
    size: 'US 10.5',
    color: 'White/Black',
    imageUrl: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/0a36cbf1-da7c-4db7-9b95-7a5978681b11/blazer-mid-77-vintage-shoes-nw30B2.png',
    stock: 20,
  },
];

async function seed() {
  try {
    console.log('🌱 Seeding database...');
    
    // Insert products
    await db.insert(products).values(nikeProducts);
    
    console.log('✅ Database seeded successfully!');
    console.log(`📦 Inserted ${nikeProducts.length} Nike products`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();