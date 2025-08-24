import 'dotenv/config';
import { db } from '../src/lib/db';
import {
  genders, colors, sizes, brands, categories, collections, products, productsToCollections,
  productVariants, productImages,
} from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

async function ensureUploads() {
  const uploadsDir = path.join(process.cwd(), 'static', 'uploads', 'shoes');
  fs.mkdirSync(uploadsDir, { recursive: true });
  const srcDir = path.join(process.cwd(), 'public', 'shoes');
  const files = fs.readdirSync(srcDir);
  for (const f of files) {
    const src = path.join(srcDir, f);
    const dest = path.join(uploadsDir, f);
    if (!fs.existsSync(dest)) {
      fs.copyFileSync(src, dest);
    }
  }
  return { uploadsDir, files };
}

function pick<T>(arr: T[], n: number) {
  const copy = arr.slice();
  const out: T[] = [];
  while (out.length < n && copy.length) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function seed() {
  try {
    console.log('🌱 Seeding database...');
    const { files } = await ensureUploads();

    await db.transaction(async (tx) => {
      const gendersData = [
        { label: 'Men', slug: 'men' },
        { label: 'Women', slug: 'women' },
        { label: 'Unisex', slug: 'unisex' },
      ];
      const colorsData = [
        { name: 'Red', slug: 'red', hexCode: '#FF0000' },
        { name: 'Black', slug: 'black', hexCode: '#000000' },
        { name: 'White', slug: 'white', hexCode: '#FFFFFF' },
        { name: 'Blue', slug: 'blue', hexCode: '#0000FF' },
        { name: 'Green', slug: 'green', hexCode: '#00FF00' },
      ];
      const sizesData = [
        { name: 'US 7', slug: 'us-7', sortOrder: 1 },
        { name: 'US 8', slug: 'us-8', sortOrder: 2 },
        { name: 'US 9', slug: 'us-9', sortOrder: 3 },
        { name: 'US 10', slug: 'us-10', sortOrder: 4 },
        { name: 'US 11', slug: 'us-11', sortOrder: 5 },
        { name: 'US 12', slug: 'us-12', sortOrder: 6 },
      ];

      await tx.insert(genders).values(gendersData).onConflictDoNothing();
      await tx.insert(colors).values(colorsData).onConflictDoNothing();
      await tx.insert(sizes).values(sizesData).onConflictDoNothing();

      const [nike] = await tx.insert(brands).values([{ name: 'Nike', slug: 'nike' }]).onConflictDoNothing().returning();
      const brandId = nike?.id ?? (await tx.select().from(brands).where(eq(brands.slug, 'nike'))).at(0)!.id;

      const catNames = ['Running', 'Basketball', 'Lifestyle', 'Training'];
      const cats = await tx.insert(categories).values(catNames.map((n) => ({ name: n, slug: slugify(n) }))).onConflictDoNothing().returning();
      const catBySlug = new Map((cats.length ? cats : await tx.select().from(categories)).map((c) => [c.slug, c.id]));

      const cols = await tx.insert(collections).values([
        { name: "Summer '25", slug: 'summer-25' },
        { name: 'Essentials', slug: 'essentials' },
      ]).onConflictDoNothing().returning();

      const gendersAll = await tx.select().from(genders);
      const colorsAll = await tx.select().from(colors);
      const sizesAll = await tx.select().from(sizes);

      const baseNames = [
        'Air Zoom Pegasus', 'Air Max 90', 'Dunk Low', 'Air Force 1', 'Metcon', 'Invincible Run', 'Jordan 1 Mid',
        'Jordan 4 Retro', 'Structure', 'Trail Pegasus', 'Zoom Fly', 'InfinityRN', 'Blazer Mid', 'Vomero', 'React Escape',
      ];

      const createdProducts = [];
      for (let i = 0; i < 15; i++) {
        const name = `${baseNames[i]} ${Math.floor(Math.random() * 100)}`;
        const gender = gendersAll[Math.floor(Math.random() * gendersAll.length)];
        const catKey = slugify(catNames[Math.floor(Math.random() * catNames.length)]);
        const categoryId = catBySlug.get(catKey)!;

        const inserted = await tx.insert(products).values({
          name,
          description: `${name} premium performance and comfort.`,
          categoryId,
          genderId: gender.id,
          brandId,
          isPublished: true,
        }).returning();
        const prod = inserted[0]!;
        createdProducts.push(prod);

        const chosenColors = pick(colorsAll, Math.floor(Math.random() * 3) + 1);
        for (const color of chosenColors) {
          const chosenSizes = pick(sizesAll, Math.floor(Math.random() * 3) + 2);
          for (const size of chosenSizes) {
            const sku = `${slugify(name)}-${color.slug}-${size.slug}-${Math.floor(Math.random() * 10000)}`;
            const price = (Math.floor(Math.random() * 120) + 80).toFixed(2);
            const sale: string | null = Math.random() > 0.6 ? (Number(price) - 10).toFixed(2) : null;
            const [variant] = await tx.insert(productVariants).values({
              productId: prod.id,
              sku,
              price,
              salePrice: sale ?? undefined,
              colorId: color.id,
              sizeId: size.id,
              inStock: Math.floor(Math.random() * 40) + 5,
              weight: 0.5,
              dimensions: { length: 30, width: 20, height: 12 },
            }).returning();

            const imgPick = pick(files, Math.floor(Math.random() * 2) + 1);
            let sort = 0;
            for (const file of imgPick) {
              await tx.insert(productImages).values({
                productId: prod.id,
                variantId: variant.id,
                url: `/static/uploads/shoes/${file}`,
                sortOrder: sort++,
                isPrimary: sort === 1,
              });
            }
          }
        }

        const coll = cols[Math.floor(Math.random() * cols.length)];
        await tx.insert(productsToCollections).values({ productId: prod.id, collectionId: coll.id }).onConflictDoNothing();
      }

      console.log(`✅ Seeded ${createdProducts.length} products with variants and images.`);
    });

    console.log('🎉 Seeding completed.');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
