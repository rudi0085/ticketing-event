import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getAllOrders, verifyOrder, rejectOrder } from '#lib/server/services/ticketService';

export const load: PageServerLoad = async ({ url }) => {
	const currentFilter = url.searchParams.get('status') || 'ALL';
	const allOrders = await getAllOrders();

	// Calculate metrics from all orders
	let totalRevenue = 0;
	let totalSoldTickets = 0;
	let pendingCount = 0;

	for (const o of allOrders) {
		if (o.status === 'VERIFIED') {
			totalRevenue += o.totalAmount;
			totalSoldTickets += o.items.reduce((acc, it) => acc + it.quantity, 0);
		} else if (o.status === 'AWAITING_VERIFICATION') {
			pendingCount++;
		}
	}

	// Filter orders for display
	const displayOrders =
		currentFilter === 'ALL'
			? allOrders
			: allOrders.filter((o) => o.status === currentFilter);

	return {
		orders: displayOrders,
		stats: {
			totalRevenue,
			totalSoldTickets,
			pendingCount,
			totalOrders: allOrders.length
		},
		currentFilter
	};
};

export const actions: Actions = {
	verify: async ({ request }) => {
		const formData = await request.formData();
		const orderId = formData.get('orderId')?.toString();

		if (!orderId) {
			return fail(400, { error: 'ID Pesanan tidak valid.' });
		}

		const result = await verifyOrder(orderId);
		if (!result.success) {
			return fail(400, { error: result.message });
		}

		return {
			success: true,
			message: result.message
		};
	},

	reject: async ({ request }) => {
		const formData = await request.formData();
		const orderId = formData.get('orderId')?.toString();
		const reason = formData.get('reason')?.toString() || 'Bukti transfer tidak valid atau nominal tidak sesuai.';

		if (!orderId) {
			return fail(400, { error: 'ID Pesanan tidak valid.' });
		}

		const success = await rejectOrder(orderId, reason);
		if (!success) {
			return fail(500, { error: 'Gagal menolak pesanan.' });
		}

		return {
			success: true,
			message: `Pesanan #${orderId} telah ditandai ditolak.`
		};
	}
};

