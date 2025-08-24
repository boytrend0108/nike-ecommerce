import { pgTable, uuid, timestamp, varchar, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { z } from 'zod';
import { orders } from './orders';

export const paymentMethodEnum = pgEnum('payment_method', ['stripe', 'paypal', 'cod']);
export const paymentStatusEnum = pgEnum('payment_status', ['initiated', 'completed', 'failed']);

export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  method: paymentMethodEnum('method').notNull(),
  status: paymentStatusEnum('status').notNull().default('initiated'),
  paidAt: timestamp('paid_at'),
  transactionId: varchar('transaction_id', { length: 255 }),
});

export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, { fields: [payments.orderId], references: [orders.id] }),
}));

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;

export const PaymentInsertSchema = z.object({
  orderId: z.string().uuid(),
  method: z.enum(['stripe', 'paypal', 'cod']),
  status: z.enum(['initiated', 'completed', 'failed']).optional(),
  paidAt: z.date().nullable().optional(),
  transactionId: z.string().nullable().optional(),
});

export const PaymentSelectSchema = z.object({
  id: z.string().uuid(),
  orderId: z.string().uuid(),
  method: z.enum(['stripe', 'paypal', 'cod']),
  status: z.enum(['initiated', 'completed', 'failed']),
  paidAt: z.date().nullable(),
  transactionId: z.string().nullable(),
});
