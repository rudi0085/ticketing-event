import { pgTable, text, integer, timestamp, boolean, uuid } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

// 1. Events Table
export const events = pgTable('events', {
	id: uuid('id').defaultRandom().primaryKey(),
	title: text('title').notNull(),
	slug: text('slug').notNull().unique(),
	description: text('description'),
	venueName: text('venue_name').notNull(),
	eventDate: timestamp('event_date', { withTimezone: true }).notNull(),
	bannerUrl: text('banner_url'),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});

// 2. Ticket Tiers Table
export const ticketTiers = pgTable('ticket_tiers', {
	id: uuid('id').defaultRandom().primaryKey(),
	eventId: uuid('event_id')
		.references(() => events.id, { onDelete: 'cascade' })
		.notNull(),
	name: text('name').notNull(),
	description: text('description'),
	price: integer('price').notNull(), // dalam IDR (Rupiah)
	quota: integer('quota').notNull(),
	soldCount: integer('sold_count').default(0).notNull(),
	isActive: boolean('is_active').default(true).notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});

// 3. Orders Table
export const orders = pgTable('orders', {
	id: uuid('id').defaultRandom().primaryKey(),
	orderNumber: text('order_number').notNull().unique(),
	customerName: text('customer_name').notNull(),
	customerEmail: text('customer_email').notNull(),
	customerPhone: text('customer_phone').notNull(),
	totalAmount: integer('total_amount').notNull(),
	status: text('status').default('PENDING_PAYMENT').notNull(), // PENDING_PAYMENT, AWAITING_VERIFICATION, VERIFIED, REJECTED, EXPIRED
	paymentProofUrl: text('payment_proof_url'),
	rejectionReason: text('rejection_reason'),
	expiresAt: timestamp('expires_at', { withTimezone: true }),
	verifiedAt: timestamp('verified_at', { withTimezone: true }),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});

// 4. Order Items Table
export const orderItems = pgTable('order_items', {
	id: uuid('id').defaultRandom().primaryKey(),
	orderId: uuid('order_id')
		.references(() => orders.id, { onDelete: 'cascade' })
		.notNull(),
	tierId: uuid('tier_id')
		.references(() => ticketTiers.id)
		.notNull(),
	quantity: integer('quantity').notNull(),
	unitPrice: integer('unit_price').notNull(),
	subtotal: integer('subtotal').notNull()
});

// 5. Issued Tickets Table
export const tickets = pgTable('tickets', {
	id: uuid('id').defaultRandom().primaryKey(),
	orderId: uuid('order_id')
		.references(() => orders.id, { onDelete: 'cascade' })
		.notNull(),
	tierId: uuid('tier_id')
		.references(() => ticketTiers.id)
		.notNull(),
	ticketCode: text('ticket_code').notNull().unique(),
	qrHash: text('qr_hash').notNull().unique(),
	status: text('status').default('ACTIVE').notNull(), // ACTIVE, CHECKED_IN, VOID
	checkedInAt: timestamp('checked_in_at', { withTimezone: true }),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});

// 6. Admin Users Table
export const adminUsers = pgTable('admin_users', {
	id: uuid('id').defaultRandom().primaryKey(),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	name: text('name').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});

// Relations
export const eventsRelations = relations(events, ({ many }) => ({
	tiers: many(ticketTiers)
}));

export const ticketTiersRelations = relations(ticketTiers, ({ one, many }) => ({
	event: one(events, {
		fields: [ticketTiers.eventId],
		references: [events.id]
	}),
	orderItems: many(orderItems),
	tickets: many(tickets)
}));

export const ordersRelations = relations(orders, ({ many }) => ({
	items: many(orderItems),
	tickets: many(tickets)
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
	order: one(orders, {
		fields: [orderItems.orderId],
		references: [orders.id]
	}),
	tier: one(ticketTiers, {
		fields: [orderItems.tierId],
		references: [ticketTiers.id]
	})
}));

export const ticketsRelations = relations(tickets, ({ one }) => ({
	order: one(orders, {
		fields: [tickets.orderId],
		references: [orders.id]
	}),
	tier: one(ticketTiers, {
		fields: [tickets.tierId],
		references: [ticketTiers.id]
	})
}));

// Export Types
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type TicketTier = typeof ticketTiers.$inferSelect;
export type NewTicketTier = typeof ticketTiers.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type Ticket = typeof tickets.$inferSelect;
export type AdminUser = typeof adminUsers.$inferSelect;

