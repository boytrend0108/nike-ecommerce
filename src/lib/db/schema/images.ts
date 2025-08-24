import { pgTable, uuid, varchar, integer, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { z } from 'zod';
import { products } from './products';
import { productVariants } from './variants';

export const productImages = pgTable('product_images', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  variantId: uuid('variant_id').references(() => productVariants.id, { onDelete: 'cascade' }),
  url: varchar('url', { length: 500 }).notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  isPrimary: boolean('is_primary').notNull().default(false),
});

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, { fields: [productImages.productId], references: [products.id] }),
  variant: one(productVariants, { fields: [productImages.variantId], references: [productVariants.id] }),
}));

export type ProductImage = typeof productImages.$inferSelect;
export type NewProductImage = typeof productImages.$inferInsert;

export const ProductImageInsertSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid().nullable().optional(),
  url: z.string().min(1),
  sortOrder: z.number().int().optional(),
  isPrimary: z.boolean().optional(),
});

export const ProductImageSelectSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  variantId: z.string().uuid().nullable(),
  url: z.string(),
  sortOrder: z.number().int(),
  isPrimary: z.boolean(),
});
