import QRCode from 'qrcode';
import { Resend } from 'resend';
import type { OrderDetail, TicketDetail } from '#lib/types';

const resendApiKey = process.env.RESEND_API_KEY;
const emailFrom = process.env.EMAIL_FROM || 'Tiket Resmi <onboarding@resend.dev>';
const appUrl = process.env.PUBLIC_APP_URL || 'http://localhost:5173';

const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function generateQrDataUrl(text: string): Promise<string> {
	return QRCode.toDataURL(text, {
		width: 320,
		margin: 2,
		color: {
			dark: '#0f172a',
			light: '#ffffff'
		}
	});
}

export async function sendTicketEmail(
	order: OrderDetail,
	tickets: TicketDetail[],
	eventTitle: string,
	venueName: string,
	eventDate: string
) {
	console.log(`📧 [EMAIL SERVICE] Preparing E-Ticket email for ${order.customerEmail}...`);

	// Generate QR code for the primary or all tickets
	const ticketPreviews = await Promise.all(
		tickets.map(async (t) => {
			const qrDataUrl = await generateQrDataUrl(t.qrHash);
			return {
				...t,
				qrDataUrl,
				webUrl: `${appUrl}/ticket/${t.ticketCode}`
			};
		})
	);

	const formattedDate = new Intl.DateTimeFormat('id-ID', {
		dateStyle: 'full',
		timeStyle: 'short'
	}).format(new Date(eventDate));

	const ticketsHtml = ticketPreviews
		.map(
			(t) => `
		<div style="background-color: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: center;">
			<div style="font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: 700;">
				E-TICKET RESMI
			</div>
			<div style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 6px 0 16px 0;">
				${t.tierName}
			</div>

			<div style="margin: 16px auto; display: inline-block; padding: 12px; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
				<img src="${t.qrDataUrl}" alt="QR Code Tiket" width="200" height="200" style="display: block; margin: 0 auto;" />
			</div>

			<div style="font-family: monospace; font-size: 18px; font-weight: 700; color: #4338ca; letter-spacing: 2px; margin: 8px 0;">
				${t.ticketCode}
			</div>
			<div style="font-size: 13px; color: #64748b; margin-bottom: 16px;">
				Tunjukkan QR code ini kepada petugas saat check-in di venue
			</div>

			<a href="${t.webUrl}" style="display: inline-block; background-color: #4f46e5; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px; padding: 10px 20px; border-radius: 8px;">
				Buka E-Ticket Digital di Web
			</a>
		</div>
	`
		)
		.join('');

	const htmlBody = `
	<!DOCTYPE html>
	<html lang="id">
	<head>
		<meta charset="UTF-8">
		<title>E-Ticket: ${eventTitle}</title>
	</head>
	<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; padding: 24px; margin: 0;">
		<div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.05);">
			
			<!-- Header -->
			<div style="background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
				<div style="font-size: 14px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; opacity: 0.9;">
					Pembayaran Berhasil Dikonfirmasi
				</div>
				<h1 style="font-size: 24px; font-weight: 800; margin: 8px 0 0 0;">
					${eventTitle}
				</h1>
			</div>

			<!-- Content -->
			<div style="padding: 24px 32px;">
				<p style="font-size: 15px; color: #334155; line-height: 1.6;">
					Halo <strong>${order.customerName}</strong>,
				</p>
				<p style="font-size: 15px; color: #334155; line-height: 1.6;">
					Pembayaran transfer Anda untuk pesanan <strong>#${order.orderNumber}</strong> telah berhasil diverifikasi oleh panitia. Berikut adalah tiket resmi Anda:
				</p>

				<!-- Event Details -->
				<div style="background-color: #f8fafc; border-radius: 10px; padding: 16px; margin: 20px 0; font-size: 14px; color: #1e293b;">
					<div style="margin-bottom: 8px;">
						<strong>📅 Tanggal & Waktu:</strong> ${formattedDate}
					</div>
					<div>
						<strong>📍 Lokasi / Venue:</strong> ${venueName}
					</div>
				</div>

				<!-- Tickets -->
				${ticketsHtml}

				<!-- Instructions -->
				<div style="border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 13px; color: #64748b; line-height: 1.6;">
					<h4 style="color: #1e293b; margin: 0 0 8px 0; font-size: 14px;">Petunjuk Check-in Hari-H:</h4>
					<ul style="margin: 0; padding-left: 20px;">
						<li>Simpan email ini atau unduh e-ticket ke smartphone Anda.</li>
						<li>Satu QR Code hanya dapat dipindai (check-in) sebanyak 1 kali.</li>
						<li>Harap datang 30 menit sebelum acara dimulai untuk registrasi ulang.</li>
					</ul>
				</div>
			</div>

			<!-- Footer -->
			<div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px; text-align: center; font-size: 12px; color: #94a3b8;">
				&copy; ${new Date().getFullYear()} ${eventTitle}. Semua Hak Dilindungi.
			</div>
		</div>
	</body>
	</html>
	`;

	if (resend) {
		try {
			const { data, error } = await resend.emails.send({
				from: emailFrom,
				to: [order.customerEmail],
				subject: `🎟️ E-Ticket Resmi: ${eventTitle} (#${order.orderNumber})`,
				html: htmlBody
			});

			if (error) {
				console.error('❌ Resend API Error:', error);
				return { success: false, error };
			}

			console.log(`✅ [RESEND] Email sent successfully to ${order.customerEmail}, ID:`, data?.id);
			return { success: true, emailId: data?.id };
		} catch (err) {
			console.error('❌ Exception sending email via Resend:', err);
			return { success: false, error: err };
		}
	} else {
		console.log(
			`ℹ️ [DEV EMAIL SIMULATION] RESEND_API_KEY is not configured. Email to ${order.customerEmail} simulated.`
		);
		console.log(`🔗 Ticket Links:`, ticketPreviews.map((t) => t.webUrl).join(', '));
		return { success: true, simulated: true };
	}
}

