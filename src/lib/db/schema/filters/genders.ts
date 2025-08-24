import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { z } from 'zod';
import { products } from '../products';

export const genders = pgTable('genders', {
  id: uuid('id').primaryKey().defaultRandom(),
  label: varchar('label', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
});

export const gendersRelations = relations(genders, ({ many }) => ({
  products: many(products),
}));

export type Gender = typeof genders.$inferSelect;
export type NewGender = typeof genders.$inferInsert;

export const GenderInsertSchema = z.object({
  label: z.string().min(1),
  slug: z.string().min(1),
});

export const GenderSelectSchema = z.object({
  id: z.string().uuid(),
  label: z.string(),
  slug: z.string(),
});
