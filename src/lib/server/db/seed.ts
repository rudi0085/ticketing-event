import { db } from './index';
import { events, ticketTiers, adminUsers } from './schema';
import { eq } from 'drizzle-orm';

export async function seedDatabase() {
	console.log('🌱 Checking seed data...');

	// 1. Check existing event
	const existingEvents = await db.select().from(events).limit(1);
	if (existingEvents.length === 0) {
		console.log('📌 Seeding default Sound From Tiger event and ticket tiers...');
		const [newEvent] = await db
			.insert(events)
			.values({
				title: 'Sound From Tiger',
				slug: 'sound-from-tiger-2026',
				description:
					'Konser musik rock & underground spektakuler. Menghadirkan panggung distorsi berenergi tinggi, dentuman suara membara, dan pengalaman live gig tak terlupakan.',
				venueName: 'Tiger Arena & Concert Hall, Senayan - Jakarta',
				eventDate: new Date('2026-11-28T17:00:00+07:00'),
				bannerUrl:
					'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80'
			})
			.returning();

		await db.insert(ticketTiers).values([
			{
				eventId: newEvent.id,
				name: 'Early Bird',
				description: 'Akses masuk moshpit dengan harga promo rilisan awal. Kuota sangat terbatas.',
				price: 75000,
				quota: 50,
				soldCount: 0,
				isActive: true
			},
			{
				eventId: newEvent.id,
				name: 'Presale Regular',
				description: 'Akses seluruh arena konser + wristband eksklusif Sound From Tiger.',
				price: 125000,
				quota: 150,
				soldCount: 0,
				isActive: true
			},
			{
				eventId: newEvent.id,
				name: 'VIP All-Access',
				description:
					'Akses barisan depan panggung, official t-shirt Sound From Tiger, poster koleksi bertanda tangan, & private lounge.',
				price: 250000,
				quota: 35,
				soldCount: 0,
				isActive: true
			}
		]);

		console.log('✅ Default event & ticket tiers seeded successfully.');
	}

	// 2. Check admin user
	const existingAdmin = await db.select().from(adminUsers).limit(1);
	if (existingAdmin.length === 0) {
		console.log('📌 Seeding default admin user...');
		await db.insert(adminUsers).values({
			email: 'admin@eventorganizer.com',
			passwordHash: 'adminpassword123', // In production, use bcrypt/argon2
			name: 'Panitia Acara (Admin)'
		});
		console.log('✅ Default admin user seeded.');
	}
}

