import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getFeaturedEvent, createOrder } from '#lib/server/services/ticketService';

export const load: PageServerLoad = async () => {
	const event = await getFeaturedEvent();
	return {
		event
	};
};

export const actions: Actions = {
	checkout: async ({ request }) => {
		const formData = await request.formData();
		const customerName = formData.get('customerName')?.toString().trim();
		const customerEmail = formData.get('customerEmail')?.toString().trim();
		const customerPhone = formData.get('customerPhone')?.toString().trim();
		const itemsJson = formData.get('items')?.toString();

		if (!customerName || !customerEmail || !customerPhone) {
			return fail(400, {
				error: 'Mohon lengkapi nama, email, dan nomor WhatsApp Anda.'
			});
		}

		if (!customerEmail.includes('@') || !customerEmail.includes('.')) {
			return fail(400, {
				error: 'Format email tidak valid.'
			});
		}

		let items: { tierId: string; quantity: number }[] = [];
		try {
			if (itemsJson) {
				items = JSON.parse(itemsJson);
			}
		} catch (e) {
			return fail(400, { error: 'Data tiket tidak valid.' });
		}

		// Filter items with quantity > 0
		const selectedItems = items.filter((item) => item.quantity > 0);
		if (selectedItems.length === 0) {
			return fail(400, {
				error: 'Silakan pilih minimal 1 tiket untuk melanjutkan pesanan.'
			});
		}

		// Create order
		const order = await createOrder({
			customerName,
			customerEmail,
			customerPhone,
			items: selectedItems
		});

		// Redirect to payment invoice page
		throw redirect(303, `/order/${order.orderNumber}`);
	}
};

