<script lang="ts">
	import type { PageProps } from './$types';
	import { enhance } from '$app/forms';
	import brandLogo from '#lib/assets/brand/logo.webp';
	import skyBanner from '#lib/assets/brand/sky.webp';
	import { EventHero, TierCard, BookingSidebar, EventFrame } from '#lib/components';

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
	<title>{data.event.title} - Tiket Konser Resmi</title>
</svelte:head>

<div class="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between selection:bg-zinc-800 selection:text-white relative">
	<!-- Full Page Fixed Stage Frame (Edge-to-Edge Left, Right & Bottom Viewport Frame) -->
	<EventFrame />

	<!-- Top Sky Backdrop dari Poster (menyatukan Header & Hero) -->
	<div
		class="absolute inset-x-0 top-0 h-[560px] sm:h-[660px] z-0 pointer-events-none select-none overflow-hidden"
		aria-hidden="true"
	>
		<img
			src={skyBanner}
			alt=""
			class="w-full h-full object-cover object-top opacity-90"
		/>
		<!-- Gradasi gelap lembut agar teks di Header & Hero tetap tajam dan menyatu ke background bawah -->
		<div
			class="absolute inset-0 bg-gradient-to-b from-black/45 via-zinc-950/65 to-zinc-950"
		></div>
	</div>

	<!-- Header dengan nuansa langit poster & aksen hangat -->
	<header class="sticky top-0 z-20 border-b border-amber-500/20 bg-zinc-950/70 backdrop-blur-md overflow-hidden">
		<!-- Lapisan langit tipis pada sticky header saat di-scroll -->
		<div class="absolute inset-0 pointer-events-none select-none opacity-45" aria-hidden="true">
			<img
				src={skyBanner}
				alt=""
				class="w-full h-36 object-cover object-top"
			/>
			<div class="absolute inset-0 bg-gradient-to-r from-zinc-950/80 via-zinc-950/55 to-zinc-950/80"></div>
			<div class="absolute inset-0 bg-gradient-to-b from-black/40 to-zinc-950/85"></div>
		</div>

		<div class="relative z-10 max-w-6xl mx-auto px-6 sm:px-12 md:px-16 lg:px-20 h-20 flex items-center justify-between">
			<!-- Brand Identity -->
			<a href="/" class="flex items-center gap-3.5 group">
				<img
					src={brandLogo}
					alt="Sound From Tiger"
					class="h-10 sm:h-12 w-auto object-contain"
				/>
				<div class="hidden sm:flex flex-col">
					<span class="font-black text-sm sm:text-base tracking-tight text-white leading-none [text-shadow:0_2px_10px_rgb(0_0_0/0.9)]">
						SOUND FROM TIGER
					</span>
					<span class="text-[10px] font-mono uppercase tracking-widest text-amber-400/90 mt-1">
						Official Live Concert 2026
					</span>
				</div>
			</a>

			<div class="flex items-center gap-3 sm:gap-5 text-xs font-mono">
				<a
					href="#tickets"
					class="px-3.5 py-2 rounded bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 hover:text-amber-200 border border-amber-500/30 font-semibold tracking-wider transition"
				>
					BELI TIKET
				</a>
				<a
					href="/admin"
					class="text-zinc-200 hover:text-white bg-zinc-950/75 hover:bg-zinc-900 transition px-3 py-2 rounded border border-zinc-700/80 hover:border-zinc-500"
				>
					PORTAL CREW
				</a>
			</div>
		</div>
	</header>

	<!-- Main Content Area -->
	<main class="flex-grow relative z-10">
		<!-- Event Hero Component with Centerpiece Poster -->
		<EventHero event={data.event} />

		<!-- Ticket Selection & Booking Section -->
		<section id="tickets" class="py-12 sm:py-16 border-b border-zinc-900/80">
			<div class="max-w-6xl mx-auto px-6 sm:px-12 md:px-16 lg:px-20">
				<div class="mb-8 [text-shadow:0_2px_14px_rgb(0_0_0/0.95)]">
					<h2 class="text-xl sm:text-2xl font-bold uppercase text-white tracking-tight">
						Pilih Tiket
					</h2>
					<p class="text-zinc-300 mt-1 text-xs sm:text-sm">
						Pilih tier tiket dan isi data diri pemesan. Maksimal 4 tiket per transaksi.
					</p>
				</div>

				{#if form?.error}
					<div
						class="max-w-2xl mb-6 p-3 bg-red-950/40 border border-red-900/60 rounded text-red-200 text-xs font-mono"
					>
						{form.error}
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

					<!-- Left Column: Tier Cards -->
					<div class="lg:col-span-7 space-y-3">
						{#each data.event.tiers as tier (tier.id)}
							<TierCard
								{tier}
								quantity={quantities[tier.id] || 0}
								onUpdateQuantity={(delta) => updateQuantity(tier.id, delta, tier.availableQuota)}
							/>
						{/each}
					</div>

					<!-- Right Column: Booking Sidebar -->
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

	<!-- Footer dengan layer efek gelap di atas ornamen agar seluruh tulisan terlihat jelas -->
	<footer class="relative z-10 border-t border-zinc-800/80 pt-16 pb-36 sm:pb-48 md:pb-56 text-zinc-200 text-xs font-mono overflow-hidden">
		<!-- Efek gelap tambahan khusus di area footer di atas gambar ornamen -->
		<div
			class="absolute inset-0 bg-gradient-to-t from-black/90 via-zinc-950/75 to-zinc-950/40 pointer-events-none"
			aria-hidden="true"
		></div>

		<div class="relative z-10 max-w-6xl mx-auto px-6 sm:px-12 md:px-16 lg:px-20 text-center space-y-4 [text-shadow:0_2px_16px_rgb(0_0_0/1)]">
			<img
				src={brandLogo}
				alt="Sound From Tiger"
				class="h-10 sm:h-12 w-auto mx-auto object-contain"
			/>
			<div class="space-y-1">
				<p class="font-extrabold text-sm sm:text-base tracking-tight uppercase text-white">
					{data.event.title}
				</p>
				<p class="text-zinc-200 text-xs font-sans font-medium">
					Official Underground Live Concert &bull; Jakarta 2026
				</p>
			</div>

			<div class="flex items-center justify-center gap-6 text-xs text-zinc-200 font-mono pt-1">
				<a href="#tickets" class="hover:text-amber-400 transition font-semibold">TIKET</a>
				<span class="text-zinc-500">&bull;</span>
				<a href="/admin" class="hover:text-amber-400 transition font-semibold">CREW PORTAL</a>
			</div>

			<p class="text-[11px] text-zinc-300 pt-1">
				&copy; {new Date().getFullYear()} {data.event.title}. ALL RIGHTS RESERVED.
			</p>
		</div>
	</footer>
</div>
