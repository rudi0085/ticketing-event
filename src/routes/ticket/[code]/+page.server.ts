import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getTicketByCode } from '#lib/server/services/ticketService';
import { generateQrDataUrl } from '#lib/server/services/emailService';

export const load: PageServerLoad = async ({ params }) => {
	const ticket = await getTicketByCode(params.code);
	if (!ticket) {
		throw error(404, 'Tiket tidak ditemukan atau kode tiket salah.');
	}

	const qrDataUrl = await generateQrDataUrl(ticket.qrHash);

	return {
		ticket,
		qrDataUrl
	};
};

