import { pgTable, uuid, varchar, pgEnum, numeric, timestamp, integer } from 'drizzle-orm/pg-core';
import { z } from 'zod';

export const discountTypeEnum = pgEnum('discount_type', ['percentage', 'fixed']);

export const coupons = pgTable('coupons', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: varchar('code', { length: 100 }).notNull().unique(),
  discountType: discountTypeEnum('discount_type').notNull(),
  discountValue: numeric('discount_value', { precision: 10, scale: 2 }).notNull(),
  expiresAt: timestamp('expires_at'),
  maxUsage: integer('max_usage').notNull().default(0),
  usedCount: integer('used_count').notNull().default(0),
});

export type Coupon = typeof coupons.$inferSelect;
export type NewCoupon = typeof coupons.$inferInsert;

export const CouponInsertSchema = z.object({
  code: z.string().min(1),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.string(),
  expiresAt: z.date().nullable().optional(),
  maxUsage: z.number().int().optional(),
  usedCount: z.number().int().optional(),
});

export const CouponSelectSchema = z.object({
  id: z.string().uuid(),
  code: z.string(),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.string(),
  expiresAt: z.date().nullable(),
  maxUsage: z.number().int(),
  usedCount: z.number().int(),
});
