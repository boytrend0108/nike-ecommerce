import { pgTable, serial, varchar, text, decimal, integer, timestamp, boolean } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal('original_price', { precision: 10, scale: 2 }),
  category: varchar('category', { length: 100 }).notNull(),
  brand: varchar('brand', { length: 100 }).notNull().default('Nike'),
  size: varchar('size', { length: 50 }),
  color: varchar('color', { length: 50 }),
  imageUrl: varchar('image_url', { length: 500 }),
  stock: integer('stock').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
