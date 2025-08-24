import { pgTable, uuid, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { z } from 'zod';
import { user } from './user';
import { products } from './products';

export const wishlists = pgTable('wishlists', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  addedAt: timestamp('added_at').defaultNow().notNull(),
});

export const wishlistsRelations = relations(wishlists, ({ one }) => ({
  user: one(user, { fields: [wishlists.userId], references: [user.id] }),
  product: one(products, { fields: [wishlists.productId], references: [products.id] }),
}));

export type Wishlist = typeof wishlists.$inferSelect;
export type NewWishlist = typeof wishlists.$inferInsert;

export const WishlistInsertSchema = z.object({
  userId: z.string().uuid(),
  productId: z.string().uuid(),
  addedAt: z.date().optional(),
});

export const WishlistSelectSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  productId: z.string().uuid(),
  addedAt: z.date(),
});
