import type { EventDetail, OrderDetail, TicketDetail } from '#lib/types';

// Default seeded Sound From Tiger event
export const mockEvent: EventDetail = {
	id: 'evt-sound-from-tiger-2026',
	title: 'SOUND FROM TIGER',
	slug: 'sound-from-tiger-2026',
	description:
		'Konser musik rock & underground spektakuler. Menghadirkan panggung distorsi berenergi tinggi, dentuman suara membara, dan pengalaman live gig tak terlupakan.',
	venueName: 'Tiger Arena & Concert Hall, Jakarta',
	eventDate: '2026-11-28T17:00:00+07:00',
	bannerUrl:
		'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
	tiers: [
		{
			id: 'tier-early-bird',
			eventId: 'evt-sound-from-tiger-2026',
			name: 'Early Bird',
			description: 'Akses masuk moshpit dengan harga promo rilisan awal. Kuota sangat terbatas.',
			price: 75000,
			quota: 50,
			soldCount: 12,
			isActive: true,
			availableQuota: 38
		},
		{
			id: 'tier-presale-regular',
			eventId: 'evt-sound-from-tiger-2026',
			name: 'Presale Regular',
			description: 'Akses seluruh arena konser + wristband eksklusif Sound From Tiger.',
			price: 125000,
			quota: 150,
			soldCount: 30,
			isActive: true,
			availableQuota: 120
		},
		{
			id: 'tier-vip-all-access',
			eventId: 'evt-sound-from-tiger-2026',
			name: 'VIP All-Access',
			description:
				'Akses barisan depan panggung, official t-shirt Sound From Tiger, poster koleksi bertanda tangan, & private lounge.',
			price: 250000,
			quota: 35,
			soldCount: 15,
			isActive: true,
			availableQuota: 20
		}
	]
};

// In-memory collections for dev/fallback mode
export const mockOrders: OrderDetail[] = [
	{
		id: 'ord-sample-001',
		orderNumber: 'ORD-20261022-8921',
		customerName: 'Siti Rahma',
		customerEmail: 'siti.rahma@example.com',
		customerPhone: '081298765432',
		totalAmount: 150000,
		status: 'AWAITING_VERIFICATION',
		paymentProofUrl:
			'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
		rejectionReason: null,
		expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
		verifiedAt: null,
		createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
		items: [
			{
				id: 'item-1',
				orderId: 'ord-sample-001',
				tierId: 'tier-early-bird',
				tierName: 'Early Bird',
				quantity: 2,
				unitPrice: 75000,
				subtotal: 150000
			}
		],
		tickets: []
	},
	{
		id: 'ord-sample-002',
		orderNumber: 'ORD-20261022-7712',
		customerName: 'Budi Santoso',
		customerEmail: 'budi.santoso@example.com',
		customerPhone: '081234567890',
		totalAmount: 125000,
		status: 'AWAITING_VERIFICATION',
		paymentProofUrl:
			'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
		rejectionReason: null,
		expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
		verifiedAt: null,
		createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
		items: [
			{
				id: 'item-2',
				orderId: 'ord-sample-002',
				tierId: 'tier-presale-regular',
				tierName: 'Presale Regular',
				quantity: 1,
				unitPrice: 125000,
				subtotal: 125000
			}
		],
		tickets: []
	},
	{
		id: 'ord-sample-003',
		orderNumber: 'ORD-20261022-5531',
		customerName: 'Ahmad Fauzi',
		customerEmail: 'ahmad.fauzi@example.com',
		customerPhone: '085712345678',
		totalAmount: 250000,
		status: 'PENDING_PAYMENT',
		paymentProofUrl: null,
		rejectionReason: null,
		expiresAt: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(),
		verifiedAt: null,
		createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
		items: [
			{
				id: 'item-3',
				orderId: 'ord-sample-003',
				tierId: 'tier-vip-all-access',
				tierName: 'VIP All-Access',
				quantity: 1,
				unitPrice: 250000,
				subtotal: 250000
			}
		],
		tickets: []
	}
];

export const mockTickets: TicketDetail[] = [];
