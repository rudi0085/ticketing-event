import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getOrderById, getBankInfo, submitPaymentProof, getFeaturedEvent } from '#lib/server/services/ticketService';

export const load: PageServerLoad = async ({ params }) => {
	const order = await getOrderById(params.id);
	if (!order) {
		throw error(404, 'Pesanan tidak ditemukan. Periksa kembali nomor pesanan Anda.');
	}

	const bankInfo = getBankInfo();
	const event = await getFeaturedEvent();

	return {
		order,
		bankInfo,
		event
	};
};

export const actions: Actions = {
	uploadProof: async ({ request, params }) => {
		const formData = await request.formData();
		const file = formData.get('proofFile') as File | null;

		if (!file || file.size === 0) {
			return fail(400, { error: 'Silakan pilih file bukti transfer Anda.' });
		}

		// Validate max size 5MB
		if (file.size > 5 * 1024 * 1024) {
			return fail(400, { error: 'Ukuran file maksimal 5MB.' });
		}

		// Validate MIME type
		const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
		if (!validTypes.includes(file.type)) {
			return fail(400, { error: 'Format file tidak didukung. Harap upload gambar JPEG, PNG, atau WebP.' });
		}

		// Convert buffer to data URI for resilient storage
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		const base64Data = buffer.toString('base64');
		const dataUrl = `data:${file.type};base64,${base64Data}`;

		const success = await submitPaymentProof(params.id, dataUrl);
		if (!success) {
			return fail(500, { error: 'Gagal menyimpan bukti transfer. Silakan coba lagi.' });
		}

		return {
			success: true,
			message: 'Bukti transfer berhasil diunggah! Panitia akan segera memverifikasi pesanan Anda.'
		};
	}
};

