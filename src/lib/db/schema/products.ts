import { pgTable, uuid, varchar, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { z } from 'zod';
import { categories } from './categories';
import { genders } from './filters/genders';
import { brands } from './brands';

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  categoryId: uuid('category_id').notNull().references(() => categories.id, { onDelete: 'restrict' }),
  genderId: uuid('gender_id').notNull().references(() => genders.id, { onDelete: 'restrict' }),
  brandId: uuid('brand_id').notNull().references(() => brands.id, { onDelete: 'restrict' }),
  isPublished: boolean('is_published').notNull().default(true),
  defaultVariantId: uuid('default_variant_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  gender: one(genders, {
    fields: [products.genderId],
    references: [genders.id],
  }),
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  variants: many(productVariants),
  images: many(productImages),
  collections: many(productsToCollections),
  reviews: many(reviews),
}));

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export const ProductInsertSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  categoryId: z.string().uuid(),
  genderId: z.string().uuid(),
  brandId: z.string().uuid(),
  isPublished: z.boolean().optional(),
  defaultVariantId: z.string().uuid().nullable().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const ProductSelectSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  categoryId: z.string().uuid(),
  genderId: z.string().uuid(),
  brandId: z.string().uuid(),
  isPublished: z.boolean(),
  defaultVariantId: z.string().uuid().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

import { productVariants } from './variants';
import { productImages } from './images';
import { productsToCollections } from './collections';
import { reviews } from './reviews';
