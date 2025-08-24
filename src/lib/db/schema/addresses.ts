import { pgTable, uuid, varchar, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { user } from './user';
import { relations } from 'drizzle-orm';
import { z } from 'zod';

export const addressTypeEnum = pgEnum('address_type', ['billing', 'shipping']);

export const addresses = pgTable('addresses', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  type: addressTypeEnum('type').notNull(),
  line1: varchar('line1', { length: 255 }).notNull(),
  line2: varchar('line2', { length: 255 }),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }).notNull(),
  country: varchar('country', { length: 100 }).notNull(),
  postalCode: varchar('postal_code', { length: 20 }).notNull(),
  isDefault: boolean('is_default').notNull().default(false),
});

export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(user, {
    fields: [addresses.userId],
    references: [user.id],
  }),
}));

export type Address = typeof addresses.$inferSelect;
export type NewAddress = typeof addresses.$inferInsert;

export const AddressInsertSchema = z.object({
  userId: z.string().uuid(),
  type: z.enum(['billing', 'shipping']),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  postalCode: z.string().min(1),
  isDefault: z.boolean().optional(),
});

export const AddressSelectSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  type: z.enum(['billing', 'shipping']),
  line1: z.string(),
  line2: z.string().nullable(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  postalCode: z.string(),
  isDefault: z.boolean(),
});
