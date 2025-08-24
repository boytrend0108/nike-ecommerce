import { pgTable, uuid, varchar, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { z } from 'zod';
import { productVariants } from '../variants';

export const sizes = pgTable('sizes', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 50 }).notNull(),
  slug: varchar('slug', { length: 50 }).notNull().unique(),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const sizesRelations = relations(sizes, ({ many }) => ({
  variants: many(productVariants),
}));

export type Size = typeof sizes.$inferSelect;
export type NewSize = typeof sizes.$inferInsert;

export const SizeInsertSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  sortOrder: z.number().int().optional(),
});

export const SizeSelectSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  sortOrder: z.number().int(),
});
