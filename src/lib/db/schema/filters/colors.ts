import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { z } from 'zod';
import { productVariants } from '../variants';

export const colors = pgTable('colors', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  hexCode: varchar('hex_code', { length: 7 }).notNull(),
});

export const colorsRelations = relations(colors, ({ many }) => ({
  variants: many(productVariants),
}));

export type Color = typeof colors.$inferSelect;
export type NewColor = typeof colors.$inferInsert;

export const ColorInsertSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  hexCode: z.string().regex(/^#([0-9A-Fa-f]{6})$/),
});

export const ColorSelectSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  hexCode: z.string(),
});
