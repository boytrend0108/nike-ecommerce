import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { z } from 'zod';
import { products } from './products';

export const collections = pgTable('collections', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const productsToCollections = pgTable('products_to_collections', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').notNull(),
  collectionId: uuid('collection_id').notNull(),
});

export const collectionsRelations = relations(collections, ({ many }) => ({
  productLinks: many(productsToCollections),
}));

export const productsToCollectionsRelations = relations(productsToCollections, ({ one }) => ({
  collection: one(collections, {
    fields: [productsToCollections.collectionId],
    references: [collections.id],
  }),
  product: one(products, {
    fields: [productsToCollections.productId],
    references: [products.id],
  }),
}));

export type Collection = typeof collections.$inferSelect;
export type NewCollection = typeof collections.$inferInsert;

export type ProductCollection = typeof productsToCollections.$inferSelect;
export type NewProductCollection = typeof productsToCollections.$inferInsert;

export const CollectionInsertSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  createdAt: z.date().optional(),
});

export const CollectionSelectSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  createdAt: z.date(),
});

export const ProductCollectionInsertSchema = z.object({
  productId: z.string().uuid(),
  collectionId: z.string().uuid(),
});

export const ProductCollectionSelectSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  collectionId: z.string().uuid(),
});
