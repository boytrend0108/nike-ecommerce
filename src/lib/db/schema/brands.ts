import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { z } from 'zod';
import { products } from './products';

export const brands = pgTable('brands', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  logoUrl: varchar('logo_url', { length: 500 }),
});

export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
}));

export type Brand = typeof brands.$inferSelect;
export type NewBrand = typeof brands.$inferInsert;

export const BrandInsertSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  logoUrl: z.string().url().optional(),
});

export const BrandSelectSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  logoUrl: z.string().url().nullable(),
});
