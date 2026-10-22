<script lang="ts">
	import type { PageProps } from './$types';
	import { enhance } from '$app/forms';
	import brandLogo from '#lib/assets/brand/logo.webp';
	import { EventHero, TierCard, BookingSidebar } from '#lib/components';
	import { Shield, Sparkles } from 'lucide-svelte';

	let { data, form }: PageProps = $props();

	// Svelte 5 Runes for interactive state
	let quantities = $state<Record<string, number>>({});
	let customerName = $state('');
	let customerEmail = $state('');
	let customerPhone = $state('');
	let isSubmitting = $state(false);

	// Initialize quantity record if not present
	$effect(() => {
		if (data.event?.tiers) {
			for (const tier of data.event.tiers) {
				if (quantities[tier.id] === undefined) {
					quantities[tier.id] = 0;
				}
			}
		}
	});

	function updateQuantity(tierId: string, delta: number, maxQuota: number) {
		const current = quantities[tierId] || 0;
		const next = Math.max(0, Math.min(maxQuota, current + delta));
		quantities[tierId] = next;
	}

	// Derived calculations
	let totalTickets = $derived(
		Object.values(quantities).reduce((acc, count) => acc + count, 0)
	);

	let totalPrice = $derived.by(() => {
		if (!data.event?.tiers) return 0;
		return data.event.tiers.reduce((acc, tier) => {
			const qty = quantities[tier.id] || 0;
			return acc + qty * tier.price;
		}, 0);
	});

	let itemsJsonPayload = $derived.by(() => {
		return JSON.stringify(
			Object.entries(quantities)
				.filter(([_, qty]) => qty > 0)
				.map(([tierId, quantity]) => ({ tierId, quantity }))
		);
	});
</script>

<svelte:head>
	<title>{data.event.title} - TIKET KONSER RESMI</title>
</svelte:head>

<div class="min-h-screen bg-black text-zinc-100 flex flex-col justify-between">
	<!-- Navbar with Authentic Brand Logo -->
	<header class="border-b-4 border-zinc-900 bg-zinc-950 sticky top-0 z-40">
		<div class="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
			<!-- Logo & Brand Name -->
			<a href="/" class="flex items-center gap-3 group">
				<div class="p-1 bg-zinc-900 border-2 border-zinc-700 shadow-[3px_3px_0px_#dc2626] group-hover:scale-105 transition">
					<img src={brandLogo} alt="Logo" class="h-10 w-auto object-contain invert brightness-125" />
				</div>
				<div class="hidden sm:block">
					<span class="font-black text-lg tracking-tighter uppercase text-white block leading-none">
						PUNK DISPATCH
					</span>
					<span class="font-mono text-[9px] uppercase tracking-widest text-red-500">
						// OFFICIAL TICKETING
					</span>
				</div>
			</a>

			<div class="flex items-center gap-4 text-xs font-mono font-bold uppercase">
				<a
					href="#tickets"
					class="px-4 py-2 border-2 border-zinc-700 hover:border-red-600 hover:bg-zinc-900 text-zinc-300 hover:text-white transition hidden sm:inline-block shadow-[2px_2px_0px_#000]"
				>
					PILIH TIKET
				</a>
				<a
					href="/admin"
					class="px-4 py-2 bg-zinc-900 hover:bg-red-600 text-zinc-200 hover:text-white border-2 border-zinc-700 hover:border-red-500 transition shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px]"
				>
					PORTAL CREW / ADMIN
				</a>
			</div>
		</div>
	</header>

	<!-- Main Content Area -->
	<main class="flex-grow">
		<!-- Modular Event Hero Component -->
		<EventHero event={data.event} />

		<!-- Ticket Selection & Booking Section -->
		<section id="tickets" class="py-16 bg-zinc-950 border-b-4 border-zinc-900">
			<div class="max-w-6xl mx-auto px-4">
				<div class="max-w-2xl mb-12">
					<span class="text-xs font-mono uppercase tracking-widest text-red-500 block mb-1">
						// LINEUP & PASUKAN MOSHPIT
					</span>
					<h2 class="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
						PILIH KATEGORI TIKET
					</h2>
					<p class="text-zinc-400 mt-2 text-xs sm:text-sm font-sans">
						Pilih tier tiket di bawah ini, lengkapi data penonton, lalu lakukan transfer bank manual.
						E-Ticket resmi QR Code akan dikirimkan otomatis ke inbox email Anda.
					</p>
				</div>

				{#if form?.error}
					<div
						class="max-w-3xl mb-8 p-4 bg-red-950 border-2 border-red-600 text-red-200 text-xs font-mono uppercase flex items-center gap-3 shadow-[4px_4px_0px_#000]"
					>
						<span class="w-3 h-3 bg-red-500 animate-ping"></span>
						<span>ERROR: {form.error}</span>
					</div>
				{/if}

				<form
					method="POST"
					action="?/checkout"
					use:enhance={() => {
						isSubmitting = true;
						return async ({ update }) => {
							isSubmitting = false;
							await update();
						};
					}}
					class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
				>
					<!-- Hidden input passing items payload -->
					<input type="hidden" name="items" value={itemsJsonPayload} />

					<!-- Left Column: Modular Tier Cards -->
					<div class="lg:col-span-7 space-y-4">
						{#each data.event.tiers as tier (tier.id)}
							<TierCard
								{tier}
								quantity={quantities[tier.id] || 0}
								onUpdateQuantity={(delta) => updateQuantity(tier.id, delta, tier.availableQuota)}
							/>
						{/each}
					</div>

					<!-- Right Column: Modular Booking Sidebar -->
					<div class="lg:col-span-5">
						<BookingSidebar
							{totalTickets}
							{totalPrice}
							bind:customerName
							bind:customerEmail
							bind:customerPhone
							bind:isSubmitting
						/>
					</div>
				</form>
			</div>
		</section>
	</main>

	<!-- Footer -->
	<footer class="border-t-4 border-zinc-900 py-10 bg-black text-zinc-500 text-xs font-mono text-center">
		<div class="max-w-6xl mx-auto px-4 space-y-3">
			<img src={brandLogo} alt="Logo" class="h-10 w-auto mx-auto object-contain invert opacity-60" />
			<p>&copy; {new Date().getFullYear()} {data.event.title}. INDEPENDENT UNDERGROUND GIG TICKETING.</p>
			<p class="text-[10px] text-zinc-600">
				BUILT WITH SVELTEKIT 3, SVELTE 5 RUNES, DRIZZLE ORM, AND RESEND DISPATCH.
			</p>
		</div>
	</footer>
</div>
