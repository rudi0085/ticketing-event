import { db } from '../db';
import { events, ticketTiers, orders, orderItems, tickets } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { mockEvent, mockOrders, mockTickets } from './mockStore';
import { sendTicketEmail } from './emailService';
import type { BankInfo, EventDetail, OrderDetail, TicketDetail, TicketTierDetail } from '#lib/types';
import crypto from 'node:crypto';

// Get bank transfer target configuration
export function getBankInfo(): BankInfo {
	return {
		bankName: process.env.BANK_NAME || 'BCA (Bank Central Asia)',
		accountNumber: process.env.BANK_ACCOUNT_NUMBER || '123-456-7890',
		accountName: process.env.BANK_ACCOUNT_NAME || 'Panitia Event Mandiri'
	};
}

// 1. Get Event Detail with Tiers
export async function getFeaturedEvent(): Promise<EventDetail> {
	try {
		const dbEvents = await db.select().from(events).limit(1);
		if (dbEvents.length > 0) {
			const evt = dbEvents[0];
			const tiers = await db.select().from(ticketTiers).where(eq(ticketTiers.eventId, evt.id));
			return {
				id: evt.id,
				title: evt.title,
				slug: evt.slug,
				description: evt.description || '',
				venueName: evt.venueName,
				eventDate: evt.eventDate.toISOString(),
				bannerUrl: evt.bannerUrl || undefined,
				tiers: tiers.map((t) => ({
					id: t.id,
					eventId: t.eventId,
					name: t.name,
					description: t.description,
					price: t.price,
					quota: t.quota,
					soldCount: t.soldCount,
					isActive: t.isActive,
					availableQuota: Math.max(0, t.quota - t.soldCount)
				}))
			};
		}
	} catch (err) {
		console.warn('⚠️ [DB Warning] Postgres connection failed or not ready. Falling back to mock data store.');
	}

	return mockEvent;
}

// 2. Create Order
export async function createOrder(data: {
	customerName: string;
	customerEmail: string;
	customerPhone: string;
	items: { tierId: string; quantity: number }[];
}): Promise<OrderDetail> {
	const event = await getFeaturedEvent();
	const orderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

	let totalAmount = 0;
	const detailedItems = data.items
		.map((item) => {
			const tier = event.tiers.find((t: TicketTierDetail) => t.id === item.tierId);
			if (!tier) return null;
			const subtotal = tier.price * item.quantity;
			totalAmount += subtotal;
			return {
				id: `item-${crypto.randomUUID()}`,
				orderId: '',
				tierId: tier.id,
				tierName: tier.name,
				quantity: item.quantity,
				unitPrice: tier.price,
				subtotal
			};
		})
		.filter((i): i is NonNullable<typeof i> => i !== null);

	const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
	const orderId = `ord-${crypto.randomUUID()}`;

	const newOrder: OrderDetail = {
		id: orderId,
		orderNumber,
		customerName: data.customerName,
		customerEmail: data.customerEmail,
		customerPhone: data.customerPhone,
		totalAmount,
		status: 'PENDING_PAYMENT',
		paymentProofUrl: null,
		rejectionReason: null,
		expiresAt,
		verifiedAt: null,
		createdAt: new Date().toISOString(),
		items: detailedItems.map((item) => ({ ...item, orderId })),
		tickets: []
	};

	// Try DB insert
	try {
		const [insertedOrder] = await db
			.insert(orders)
			.values({
				orderNumber,
				customerName: data.customerName,
				customerEmail: data.customerEmail,
				customerPhone: data.customerPhone,
				totalAmount,
				status: 'PENDING_PAYMENT',
				expiresAt: new Date(expiresAt)
			})
			.returning();

		for (const it of detailedItems) {
			await db.insert(orderItems).values({
				orderId: insertedOrder.id,
				tierId: it.tierId,
				quantity: it.quantity,
				unitPrice: it.unitPrice,
				subtotal: it.subtotal
			});
		}

		newOrder.id = insertedOrder.id;
		return newOrder;
	} catch (err) {
		console.warn('⚠️ [DB Warning] Postgres write failed. Saving in mock store.');
	}

	mockOrders.unshift(newOrder);
	return newOrder;
}

// 3. Get Order By ID or Order Number
export async function getOrderById(orderIdOrNumber: string): Promise<OrderDetail | null> {
	// Try DB query
	try {
		const dbOrders = await db
			.select()
			.from(orders)
			.where(eq(orders.id, orderIdOrNumber))
			.limit(1);

		if (dbOrders.length > 0) {
			const o = dbOrders[0];
			const items = await db.select().from(orderItems).where(eq(orderItems.orderId, o.id));
			const tix = await db.select().from(tickets).where(eq(tickets.orderId, o.id));
			const event = await getFeaturedEvent();

			return {
				id: o.id,
				orderNumber: o.orderNumber,
				customerName: o.customerName,
				customerEmail: o.customerEmail,
				customerPhone: o.customerPhone,
				totalAmount: o.totalAmount,
				status: o.status as any,
				paymentProofUrl: o.paymentProofUrl,
				rejectionReason: o.rejectionReason,
				expiresAt: o.expiresAt?.toISOString() || null,
				verifiedAt: o.verifiedAt?.toISOString() || null,
				createdAt: o.createdAt.toISOString(),
				items: items.map((it) => ({
					id: it.id,
					orderId: it.orderId,
					tierId: it.tierId,
					tierName: event.tiers.find((t: TicketTierDetail) => t.id === it.tierId)?.name || 'Tiket',
					quantity: it.quantity,
					unitPrice: it.unitPrice,
					subtotal: it.subtotal
				})),
				tickets: tix.map((tk) => ({
					id: tk.id,
					orderId: tk.orderId,
					tierId: tk.tierId,
					tierName: event.tiers.find((t: TicketTierDetail) => t.id === tk.tierId)?.name || 'Tiket',
					ticketCode: tk.ticketCode,
					qrHash: tk.qrHash,
					status: tk.status as any,
					checkedInAt: tk.checkedInAt?.toISOString() || null,
					createdAt: tk.createdAt.toISOString()
				}))
			};
		}
	} catch (err) {
		// Fallback to mock
	}

	const found = mockOrders.find(
		(o) => o.id === orderIdOrNumber || o.orderNumber === orderIdOrNumber
	);
	return found || null;
}

// 4. Submit Payment Proof
export async function submitPaymentProof(orderId: string, proofUrl: string): Promise<boolean> {
	try {
		await db
			.update(orders)
			.set({
				paymentProofUrl: proofUrl,
				status: 'AWAITING_VERIFICATION'
			})
			.where(eq(orders.id, orderId));
		return true;
	} catch (err) {
		// Mock fallback
		const order = mockOrders.find((o) => o.id === orderId || o.orderNumber === orderId);
		if (order) {
			order.paymentProofUrl = proofUrl;
			order.status = 'AWAITING_VERIFICATION';
			return true;
		}
	}
	return false;
}

// 5. Get All Orders (Admin)
export async function getAllOrders(filterStatus?: string): Promise<OrderDetail[]> {
	try {
		const dbOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
		if (dbOrders.length > 0) {
			const event = await getFeaturedEvent();
			const result: OrderDetail[] = [];
			for (const o of dbOrders) {
				if (filterStatus && filterStatus !== 'ALL' && o.status !== filterStatus) {
					continue;
				}
				const items = await db.select().from(orderItems).where(eq(orderItems.orderId, o.id));
				result.push({
					id: o.id,
					orderNumber: o.orderNumber,
					customerName: o.customerName,
					customerEmail: o.customerEmail,
					customerPhone: o.customerPhone,
					totalAmount: o.totalAmount,
					status: o.status as any,
					paymentProofUrl: o.paymentProofUrl,
					rejectionReason: o.rejectionReason,
					expiresAt: o.expiresAt?.toISOString() || null,
					verifiedAt: o.verifiedAt?.toISOString() || null,
					createdAt: o.createdAt.toISOString(),
					items: items.map((it) => ({
						id: it.id,
						orderId: it.orderId,
						tierId: it.tierId,
						tierName: event.tiers.find((t: TicketTierDetail) => t.id === it.tierId)?.name || 'Tiket',
						quantity: it.quantity,
						unitPrice: it.unitPrice,
						subtotal: it.subtotal
					}))
				});
			}
			return result;
		}
	} catch (err) {
		// Fallback
	}

	if (filterStatus && filterStatus !== 'ALL') {
		return mockOrders.filter((o) => o.status === filterStatus);
	}
	return mockOrders;
}

// 6. Verify Order and Issue Tickets (Trigger Automated Email)
export async function verifyOrder(orderId: string): Promise<{ success: boolean; message: string }> {
	const order = await getOrderById(orderId);
	if (!order) {
		return { success: false, message: 'Pesanan tidak ditemukan' };
	}

	if (order.status === 'VERIFIED') {
		return { success: false, message: 'Pesanan sudah diverifikasi sebelumnya' };
	}

	const event = await getFeaturedEvent();
	const generatedTickets: TicketDetail[] = [];

	// Generate tickets for each item & quantity
	for (const item of order.items) {
		for (let i = 0; i < item.quantity; i++) {
			const ticketCode = `TKT-${item.tierName?.substring(0, 3).toUpperCase() || 'EVT'}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
			const qrHash = crypto.createHash('sha256').update(`${order.id}-${ticketCode}-${Date.now()}`).digest('hex');

			const ticket: TicketDetail = {
				id: `tkt-${crypto.randomUUID()}`,
				orderId: order.id,
				tierId: item.tierId,
				tierName: item.tierName || 'Tiket',
				ticketCode,
				qrHash,
				status: 'ACTIVE',
				checkedInAt: null,
				createdAt: new Date().toISOString(),
				customerName: order.customerName,
				customerEmail: order.customerEmail,
				eventTitle: event.title,
				venueName: event.venueName,
				eventDate: event.eventDate
			};

			generatedTickets.push(ticket);

			try {
				await db.insert(tickets).values({
					orderId: order.id,
					tierId: item.tierId,
					ticketCode,
					qrHash,
					status: 'ACTIVE'
				});
			} catch (err) {
				mockTickets.push(ticket);
			}
		}
	}

	// Update order status
	const verifiedAt = new Date().toISOString();
	order.status = 'VERIFIED';
	order.verifiedAt = verifiedAt;
	order.tickets = generatedTickets;

	try {
		await db
			.update(orders)
			.set({
				status: 'VERIFIED',
				verifiedAt: new Date(verifiedAt)
			})
			.where(eq(orders.id, order.id));
	} catch (err) {
		const idx = mockOrders.findIndex((o) => o.id === order.id);
		if (idx !== -1) {
			mockOrders[idx] = { ...order };
		}
	}

	// Trigger automated email dispatch
	await sendTicketEmail(
		order,
		generatedTickets,
		event.title,
		event.venueName,
		event.eventDate
	);

	return {
		success: true,
		message: `Pesanan berhasil diverifikasi. ${generatedTickets.length} tiket resmi telah diterbitkan dan dikirimkan ke email ${order.customerEmail}.`
	};
}

// 7. Reject Order
export async function rejectOrder(orderId: string, reason: string): Promise<boolean> {
	try {
		await db
			.update(orders)
			.set({
				status: 'REJECTED',
				rejectionReason: reason
			})
			.where(eq(orders.id, orderId));
		return true;
	} catch (err) {
		const order = mockOrders.find((o) => o.id === orderId);
		if (order) {
			order.status = 'REJECTED';
			order.rejectionReason = reason;
			return true;
		}
	}
	return false;
}

// 8. Get Ticket by Ticket Code (Public /ticket/[code])
export async function getTicketByCode(ticketCode: string): Promise<TicketDetail | null> {
	const event = await getFeaturedEvent();

	try {
		const dbTix = await db.select().from(tickets).where(eq(tickets.ticketCode, ticketCode)).limit(1);
		if (dbTix.length > 0) {
			const tk = dbTix[0];
			const ord = await getOrderById(tk.orderId);
			const tier = event.tiers.find((t: TicketTierDetail) => t.id === tk.tierId);
			return {
				id: tk.id,
				orderId: tk.orderId,
				tierId: tk.tierId,
				tierName: tier?.name || 'Tiket',
				ticketCode: tk.ticketCode,
				qrHash: tk.qrHash,
				status: tk.status as any,
				checkedInAt: tk.checkedInAt?.toISOString() || null,
				createdAt: tk.createdAt.toISOString(),
				customerName: ord?.customerName,
				customerEmail: ord?.customerEmail,
				eventTitle: event.title,
				venueName: event.venueName,
				eventDate: event.eventDate
			};
		}
	} catch (err) {
		// Fallback
	}

	const t = mockTickets.find((tk: TicketDetail) => tk.ticketCode === ticketCode);
	if (t) {
		return {
			...t,
			eventTitle: event.title,
			venueName: event.venueName,
			eventDate: event.eventDate
		};
	}

	// Also check in mockOrders
	for (const o of mockOrders) {
		const found = o.tickets?.find((tk: TicketDetail) => tk.ticketCode === ticketCode);
		if (found) {
			return {
				...found,
				customerName: o.customerName,
				customerEmail: o.customerEmail,
				eventTitle: event.title,
				venueName: event.venueName,
				eventDate: event.eventDate
			};
		}
	}

	return null;
}

// 9. Validate & Check-In Ticket by QR Hash (Admin /admin/check-in)
export async function validateAndCheckIn(qrHash: string): Promise<{
	success: boolean;
	message: string;
	ticket?: TicketDetail;
}> {
	const event = await getFeaturedEvent();

	// Try DB
	try {
		const dbTix = await db.select().from(tickets).where(eq(tickets.qrHash, qrHash)).limit(1);
		if (dbTix.length > 0) {
			const tk = dbTix[0];
			const ord = await getOrderById(tk.orderId);
			const tier = event.tiers.find((t: TicketTierDetail) => t.id === tk.tierId);

			const ticketDetail: TicketDetail = {
				id: tk.id,
				orderId: tk.orderId,
				tierId: tk.tierId,
				tierName: tier?.name || 'Tiket',
				ticketCode: tk.ticketCode,
				qrHash: tk.qrHash,
				status: tk.status as any,
				checkedInAt: tk.checkedInAt?.toISOString() || null,
				createdAt: tk.createdAt.toISOString(),
				customerName: ord?.customerName,
				customerEmail: ord?.customerEmail,
				eventTitle: event.title,
				venueName: event.venueName,
				eventDate: event.eventDate
			};

			if (tk.status === 'CHECKED_IN') {
				return {
					success: false,
					message: `⚠️ Tiket sudah pernah digunakan check-in pada ${new Date(tk.checkedInAt!).toLocaleTimeString('id-ID')}`,
					ticket: ticketDetail
				};
			}

			if (tk.status === 'VOID') {
				return { success: false, message: '❌ Tiket ini telah dibatalkan (VOID)', ticket: ticketDetail };
			}

			// Perform check-in
			const checkInTime = new Date();
			await db
				.update(tickets)
				.set({
					status: 'CHECKED_IN',
					checkedInAt: checkInTime
				})
				.where(eq(tickets.id, tk.id));

			ticketDetail.status = 'CHECKED_IN';
			ticketDetail.checkedInAt = checkInTime.toISOString();

			return {
				success: true,
				message: `✅ Check-in berhasil! Selamat datang, ${ord?.customerName} (${tier?.name})`,
				ticket: ticketDetail
			};
		}
	} catch (err) {
		// Fallback
	}

	// Search in mock
	let matchedTicket = mockTickets.find((t: TicketDetail) => t.qrHash === qrHash);
	if (!matchedTicket) {
		for (const o of mockOrders) {
			const found = o.tickets?.find((t: TicketDetail) => t.qrHash === qrHash);
			if (found) {
				matchedTicket = found;
				break;
			}
		}
	}

	if (!matchedTicket) {
		return { success: false, message: '❌ QR Code tidak valid / tiket tidak ditemukan' };
	}

	if (matchedTicket.status === 'CHECKED_IN') {
		return {
			success: false,
			message: `⚠️ Tiket sudah pernah digunakan check-in pada ${matchedTicket.checkedInAt}`,
			ticket: matchedTicket
		};
	}

	matchedTicket.status = 'CHECKED_IN';
	matchedTicket.checkedInAt = new Date().toISOString();

	return {
		success: true,
		message: `✅ Check-in berhasil! Selamat datang, ${matchedTicket.customerName || 'Peserta'} (${matchedTicket.tierName})`,
		ticket: matchedTicket
	};
}
