import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { validateAndCheckIn } from '#lib/server/services/ticketService';

export const load: PageServerLoad = async () => {
	return {};
};

export const actions: Actions = {
	checkIn: async ({ request }) => {
		const formData = await request.formData();
		const qrHash = formData.get('qrHash')?.toString().trim();

		if (!qrHash) {
			return fail(400, { error: 'Kode QR tidak boleh kosong.', ticket: undefined });
		}

		const result = await validateAndCheckIn(qrHash);
		if (!result.success) {
			return fail(400, {
				error: result.message,
				ticket: result.ticket
			});
		}

		return {
			success: true,
			message: result.message,
			ticket: result.ticket
		};
	}
};
