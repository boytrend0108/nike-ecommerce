import { pgTable, uuid, timestamp, numeric, pgEnum, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { z } from 'zod';
import { user } from './user';
import { addresses } from './addresses';
import { productVariants } from './variants';

export const orderStatusEnum = pgEnum('order_status', ['pending', 'paid', 'shipped', 'delivered', 'cancelled']);

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => user.id, { onDelete: 'restrict' }),
  status: orderStatusEnum('status').notNull().default('pending'),
  totalAmount: numeric('total_amount', { precision: 10, scale: 2 }).notNull(),
  shippingAddressId: uuid('shipping_address_id').notNull().references(() => addresses.id, { onDelete: 'restrict' }),
  billingAddressId: uuid('billing_address_id').notNull().references(() => addresses.id, { onDelete: 'restrict' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  productVariantId: uuid('product_variant_id').notNull().references(() => productVariants.id, { onDelete: 'restrict' }),
  quantity: integer('quantity').notNull().default(1),
  priceAtPurchase: numeric('price_at_purchase', { precision: 10, scale: 2 }).notNull(),
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(user, { fields: [orders.userId], references: [user.id] }),
  shippingAddress: one(addresses, { fields: [orders.shippingAddressId], references: [addresses.id] }),
  billingAddress: one(addresses, { fields: [orders.billingAddressId], references: [addresses.id] }),
  items: many(orderItems),
  payments: many(payments),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  variant: one(productVariants, { fields: [orderItems.productVariantId], references: [productVariants.id] }),
}));

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;

export const OrderInsertSchema = z.object({
  userId: z.string().uuid(),
  status: z.enum(['pending', 'paid', 'shipped', 'delivered', 'cancelled']).optional(),
  totalAmount: z.string(),
  shippingAddressId: z.string().uuid(),
  billingAddressId: z.string().uuid(),
  createdAt: z.date().optional(),
});

export const OrderSelectSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  status: z.enum(['pending', 'paid', 'shipped', 'delivered', 'cancelled']),
  totalAmount: z.string(),
  shippingAddressId: z.string().uuid(),
  billingAddressId: z.string().uuid(),
  createdAt: z.date(),
});

export const OrderItemInsertSchema = z.object({
  orderId: z.string().uuid(),
  productVariantId: z.string().uuid(),
  quantity: z.number().int().min(1),
  priceAtPurchase: z.string(),
});

export const OrderItemSelectSchema = z.object({
  id: z.string().uuid(),
  orderId: z.string().uuid(),
  productVariantId: z.string().uuid(),
  quantity: z.number().int(),
  priceAtPurchase: z.string(),
});

import { payments } from './payments';
