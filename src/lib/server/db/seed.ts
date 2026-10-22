import { db } from './index';
import { events, ticketTiers, adminUsers } from './schema';
import { eq } from 'drizzle-orm';

export async function seedDatabase() {
	console.log('🌱 Checking seed data...');

	// 1. Check existing event
	const existingEvents = await db.select().from(events).limit(1);
	if (existingEvents.length === 0) {
		console.log('📌 Seeding default event and ticket tiers...');
		const [newEvent] = await db
			.insert(events)
			.values({
				title: 'Indonesia Tech Innovator Summit 2026',
				slug: 'tech-innovator-summit-2026',
				description:
					'Konferensi teknologi & developer tahunan terbesar yang membahas Artificial Intelligence, Cloud Native, dan Modern Web Engineering bersama praktisi industri terkemuka.',
				venueName: 'Jakarta Convention Center (JCC) Hall B, Senayan',
				eventDate: new Date('2026-11-15T09:00:00+07:00'),
				bannerUrl:
					'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80'
			})
			.returning();

		await db.insert(ticketTiers).values([
			{
				eventId: newEvent.id,
				name: 'Early Bird',
				description: 'Akses penuh ke semua sesi konferensi dengan harga promo terbatas.',
				price: 75000,
				quota: 50,
				soldCount: 0,
				isActive: true
			},
			{
				eventId: newEvent.id,
				name: 'Presale Regular',
				description: 'Akses seluruh sesi konferensi + sertifikat digital & e-badge.',
				price: 125000,
				quota: 150,
				soldCount: 0,
				isActive: true
			},
			{
				eventId: newEvent.id,
				name: 'VIP All-Access',
				description:
					'Tempat duduk baris terdepan, exclusive goodie bag, networking lunch bersama speaker, & akses recording selamanya.',
				price: 275000,
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

