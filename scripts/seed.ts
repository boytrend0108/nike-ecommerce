import { db } from '../src/lib/db';
import {
  brands,
  categories,
  colors,
  genders,
  productImages,
  products,
  productVariants,
  sizes
} from '../src/lib/db/schema';

// Reference data
const brandsData = [
  { name: 'Nike', slug: 'nike', logoUrl: null },
  { name: 'Adidas', slug: 'adidas', logoUrl: null },
  { name: 'Puma', slug: 'puma', logoUrl: null },
  { name: 'New Balance', slug: 'new-balance', logoUrl: null },
  { name: 'Converse', slug: 'converse', logoUrl: null },
];

const categoriesData = [
  { name: 'Running Shoes', slug: 'running-shoes', parentId: null },
  { name: 'Basketball Shoes', slug: 'basketball-shoes', parentId: null },
  { name: 'Lifestyle Shoes', slug: 'lifestyle-shoes', parentId: null },
  { name: 'Training Shoes', slug: 'training-shoes', parentId: null },
  { name: 'Casual Sneakers', slug: 'casual-sneakers', parentId: null },
];

const gendersData = [
  { label: 'Men', slug: 'men' },
  { label: 'Women', slug: 'women' },
  { label: 'Kids', slug: 'kids' },
  { label: 'Unisex', slug: 'unisex' },
];

const colorsData = [
  { name: 'Black', slug: 'black', hexCode: '#000000' },
  { name: 'White', slug: 'white', hexCode: '#FFFFFF' },
  { name: 'Red', slug: 'red', hexCode: '#FF0000' },
  { name: 'Blue', slug: 'blue', hexCode: '#0000FF' },
  { name: 'Green', slug: 'green', hexCode: '#008000' },
  { name: 'Yellow', slug: 'yellow', hexCode: '#FFFF00' },
  { name: 'Purple', slug: 'purple', hexCode: '#800080' },
  { name: 'Orange', slug: 'orange', hexCode: '#FFA500' },
  { name: 'Gray', slug: 'gray', hexCode: '#808080' },
  { name: 'Navy', slug: 'navy', hexCode: '#000080' },
];

const sizesData = [
  { name: '6', slug: '6', sortOrder: 1 },
  { name: '6.5', slug: '6-5', sortOrder: 2 },
  { name: '7', slug: '7', sortOrder: 3 },
  { name: '7.5', slug: '7-5', sortOrder: 4 },
  { name: '8', slug: '8', sortOrder: 5 },
  { name: '8.5', slug: '8-5', sortOrder: 6 },
  { name: '9', slug: '9', sortOrder: 7 },
  { name: '9.5', slug: '9-5', sortOrder: 8 },
  { name: '10', slug: '10', sortOrder: 9 },
  { name: '10.5', slug: '10-5', sortOrder: 10 },
  { name: '11', slug: '11', sortOrder: 11 },
  { name: '11.5', slug: '11-5', sortOrder: 12 },
  { name: '12', slug: '12', sortOrder: 13 },
];

// Available shoe images from public/shoes directory
const availableImages = [
  'shoe-1.jpg',
  'shoe-2.webp',
  'shoe-3.webp',
  'shoe-4.webp',
  'shoe-5.avif',
  'shoe-6.avif',
  'shoe-7.avif',
  'shoe-8.avif',
  'shoe-9.avif',
  'shoe-10.avif',
  'shoe-11.avif',
  'shoe-12.avif',
  'shoe-13.avif',
  'shoe-14.avif',
  'shoe-15.avif',
];

// Product names for random generation
const productBaseNames = [
  'Air Max', 'React', 'Zoom', 'Free Run', 'Pegasus',
  'Revolution', 'Downshifter', 'Tanjun', 'Cortez', 'Blazer',
  'Dunk', 'Force', 'Jordan', 'KD', 'LeBron',
  'Kyrie', 'Giannis', 'Zion', 'Ja', 'Tatum'
];

const productSuffixes = [
  '1', '2', '3', 'Pro', 'Elite', 'Premium', 'SE', 'Low', 'Mid', 'High',
  'Flyknit', 'Knit', 'Leather', 'Canvas', 'Mesh', 'OG', 'Retro'
];

// Utility functions
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomPrice(): string {
  const basePrice = Math.floor(Math.random() * 200) + 50; // $50-$250
  return basePrice.toString();
}

function getRandomSalePrice(price: string): string | null {
  if (Math.random() < 0.3) { // 30% chance of sale
    const originalPrice = parseInt(price);
    const salePrice = Math.floor(originalPrice * (0.7 + Math.random() * 0.2)); // 70-90% of original
    return salePrice.toString();
  }
  return null;
}

function generateProductName(): string {
  const baseName = getRandomElement(productBaseNames);
  const suffix = getRandomElement(productSuffixes);
  return `${baseName} ${suffix}`;
}

function generateProductDescription(name: string): string {
  const descriptions = [
    `Experience ultimate comfort and performance with the ${name}. Designed for athletes and everyday wear.`,
    `The ${name} combines style and functionality in a sleek, modern design that's perfect for any occasion.`,
    `Step up your game with the ${name}. Features advanced cushioning and superior grip for maximum performance.`,
    `Discover the perfect blend of comfort and style with the ${name}. Built for those who demand excellence.`,
    `The ${name} delivers exceptional comfort and durability, making it the ideal choice for active lifestyles.`
  ];
  return getRandomElement(descriptions);
}

function generateSKU(productName: string, colorName: string, sizeName: string): string {
  const productCode = productName.replace(/\s+/g, '').substring(0, 6).toUpperCase();
  const colorCode = colorName.substring(0, 3).toUpperCase();
  const sizeCode = sizeName.replace('.', '');
  return `${productCode}-${colorCode}-${sizeCode}`;
}

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🧹 Clearing existing data...');
    await db.delete(productVariants);
    await db.delete(products);
    await db.delete(brands);
    await db.delete(categories);
    await db.delete(genders);
    await db.delete(colors);
    await db.delete(sizes);

    // Seed reference data
    console.log('📦 Seeding brands...');
    const insertedBrands = await db.insert(brands).values(brandsData).returning();

    console.log('📂 Seeding categories...');
    const insertedCategories = await db.insert(categories).values(categoriesData).returning();

    console.log('👥 Seeding genders...');
    const insertedGenders = await db.insert(genders).values(gendersData).returning();

    console.log('🎨 Seeding colors...');
    const insertedColors = await db.insert(colors).values(colorsData).returning();

    console.log('📏 Seeding sizes...');
    const insertedSizes = await db.insert(sizes).values(sizesData).returning();

    // Generate and seed products
    console.log('👟 Generating 20 random products...');
    
    for (let i = 0; i < 20; i++) {
      const productName = generateProductName();
      const description = generateProductDescription(productName);
      const brand = getRandomElement(insertedBrands);
      const category = getRandomElement(insertedCategories);
      const gender = getRandomElement(insertedGenders);

      // Create product
      const [insertedProduct] = await db.insert(products).values({
        name: productName,
        description: description,
        categoryId: category.id,
        genderId: gender.id,
        brandId: brand.id,
        isPublished: true,
      }).returning();

      console.log(`  ✓ Created product: ${productName}`);

      // Create 2-4 variants per product (different color/size combinations)
      const numVariants = Math.floor(Math.random() * 3) + 2; // 2-4 variants
      const usedCombinations = new Set<string>();

      for (let j = 0; j < numVariants; j++) {
        let color, size, combination;
        let attempts = 0;
        
        // Ensure unique color/size combinations for this product
        do {
          color = getRandomElement(insertedColors);
          size = getRandomElement(insertedSizes);
          combination = `${color.id}-${size.id}`;
          attempts++;
        } while (usedCombinations.has(combination) && attempts < 10);

        if (attempts >= 10) continue; // Skip if we can't find a unique combination

        usedCombinations.add(combination);

        const price = getRandomPrice();
        const salePrice = getRandomSalePrice(price);
        const sku = generateSKU(productName, color.name, size.name);
        const inStock = Math.floor(Math.random() * 100) + 10; // 10-109 items in stock

        const [insertedVariant] = await db.insert(productVariants).values({
          productId: insertedProduct.id,
          sku: sku,
          price: price,
          salePrice: salePrice,
          colorId: color.id,
          sizeId: size.id,
          inStock: inStock,
          weight: Math.random() * 2 + 0.5, // 0.5-2.5 lbs
          dimensions: {
            length: Math.floor(Math.random() * 5) + 10, // 10-14 inches
            width: Math.floor(Math.random() * 3) + 4,   // 4-6 inches
            height: Math.floor(Math.random() * 2) + 3   // 3-4 inches
          }
        }).returning();

        console.log(`    ✓ Added variant: ${color.name} / Size ${size.name} - $${price}${salePrice ? ` (Sale: $${salePrice})` : ''}`);
        
        // Add 1-3 random images for this variant
        const numImages = Math.floor(Math.random() * 3) + 1; // 1-3 images
        const selectedImages = [...availableImages].sort(() => 0.5 - Math.random()).slice(0, numImages);
        
        for (let k = 0; k < selectedImages.length; k++) {
          const imagePath = `/shoes/${selectedImages[k]}`;
          await db.insert(productImages).values({
            productId: insertedProduct.id,
            variantId: insertedVariant.id,
            url: imagePath,
            sortOrder: k,
            isPrimary: k === 0, // First image is primary
          });
          
          console.log(`      📸 Added image: ${selectedImages[k]} ${k === 0 ? '(primary)' : ''}`);
        }
      }
    }

    console.log('✅ Database seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - ${insertedBrands.length} brands`);
    console.log(`   - ${insertedCategories.length} categories`);
    console.log(`   - ${insertedGenders.length} genders`);
    console.log(`   - ${insertedColors.length} colors`);
    console.log(`   - ${insertedSizes.length} sizes`);
    console.log(`   - 20 products with variants`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedDatabase()
  .then(() => {
    console.log('🎉 Seeding process finished!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Seeding process failed:', error);
    process.exit(1);
  });
