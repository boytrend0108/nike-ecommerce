import { pgTable, uuid, varchar, integer, real, jsonb, timestamp, numeric } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { z } from 'zod';
import { products } from './products';
import { colors } from './filters/colors';
import { sizes } from './filters/sizes';

export const productVariants = pgTable('product_variants', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  sku: varchar('sku', { length: 100 }).notNull().unique(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  salePrice: numeric('sale_price', { precision: 10, scale: 2 }),
  colorId: uuid('color_id').notNull().references(() => colors.id, { onDelete: 'restrict' }),
  sizeId: uuid('size_id').notNull().references(() => sizes.id, { onDelete: 'restrict' }),
  inStock: integer('in_stock').notNull().default(0),
  weight: real('weight').notNull().default(0),
  dimensions: jsonb('dimensions'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const productVariantsRelations = relations(productVariants, ({ one, many }) => ({
  product: one(products, { fields: [productVariants.productId], references: [products.id] }),
  color: one(colors, { fields: [productVariants.colorId], references: [colors.id] }),
  size: one(sizes, { fields: [productVariants.sizeId], references: [sizes.id] }),
  images: many(productImages),
  cartItems: many(cartItems),
  orderItems: many(orderItems),
  reviews: many(reviews),
}));

export type ProductVariant = typeof productVariants.$inferSelect;
export type NewProductVariant = typeof productVariants.$inferInsert;

export const ProductVariantInsertSchema = z.object({
  productId: z.string().uuid(),
  sku: z.string().min(1),
  price: z.string(),
  salePrice: z.string().nullable().optional(),
  colorId: z.string().uuid(),
  sizeId: z.string().uuid(),
  inStock: z.number().int().optional(),
  weight: z.number().optional(),
  dimensions: z.any().optional(),
  createdAt: z.date().optional(),
});

export const ProductVariantSelectSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  sku: z.string(),
  price: z.string(),
  salePrice: z.string().nullable(),
  colorId: z.string().uuid(),
  sizeId: z.string().uuid(),
  inStock: z.number().int(),
  weight: z.number(),
  dimensions: z.any().nullable(),
  createdAt: z.date(),
});

import { productImages } from './images';
import { cartItems } from './carts';
import { orderItems } from './orders';
import { reviews } from './reviews';
