<script lang="ts">
	import type { EventDetail } from '#lib/types';
	import brandLogo from '#lib/assets/brand/logo.webp';
	import { Calendar, MapPin, Flame, Skull, Zap, ShieldAlert, Volume2 } from 'lucide-svelte';
	import Badge from '../ui/Badge.svelte';

	interface Props {
		event: EventDetail;
	}

	let { event }: Props = $props();

	function formatDate(isoString: string) {
		return new Intl.DateTimeFormat('id-ID', {
			dateStyle: 'full',
			timeStyle: 'short'
		}).format(new Date(isoString));
	}

	function formatRupiah(amount: number) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			maximumFractionDigits: 0
		}).format(amount);
	}

	let startingPrice = $derived.by(() => {
		if (!event.tiers || event.tiers.length === 0) return 0;
		return Math.min(...event.tiers.map((t) => t.price));
	});
</script>

<section class="relative overflow-hidden pt-8 pb-16 border-b-4 border-zinc-900 bg-zinc-950">
	<!-- Distressed Noise / Grit Grid Lines -->
	<div
		class="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none"
	></div>

	<!-- Blood Red Ambient Glow -->
	<div
		class="absolute -top-32 right-10 w-[500px] h-[400px] bg-red-600/10 blur-[140px] pointer-events-none rounded-full"
	></div>

	<div class="max-w-6xl mx-auto px-4 relative z-10">
		<div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
			<!-- Left: Hero Headline & Gig Details -->
			<div class="lg:col-span-7 space-y-6">
				<!-- Tape Badge -->
				<div class="flex items-center gap-3">
					<Badge variant="warning" rotate class="text-xs">
						<Flame class="w-3.5 h-3.5 text-zinc-950" />
						<span>PUNK ROCK // LIVE GIG 2026</span>
					</Badge>
					<Badge variant="crimson">
						<Volume2 class="w-3.5 h-3.5 text-red-400" />
						<span>MAXIMUM VOLUME</span>
					</Badge>
				</div>

				<!-- Main Title -->
				<div class="space-y-2">
					<h1
						class="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-white leading-[0.95]"
					>
						{event.title}
					</h1>
					<p class="text-xs font-mono tracking-widest text-red-500 uppercase">
						// OFFICIAL INDEPENDENT UNDERGROUND GIG
					</p>
				</div>

				<p class="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
					{event.description}
				</p>

				<!-- Stencil Metadata Cards -->
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
					<div
						class="p-4 bg-zinc-900 border-2 border-zinc-800 shadow-[4px_4px_0px_#000] space-y-1"
					>
						<div class="flex items-center gap-2 text-red-500 font-mono text-xs font-bold uppercase">
							<Calendar class="w-4 h-4" />
							<span>WAKTU KONSER</span>
						</div>
						<div class="text-sm font-black text-white">{formatDate(event.eventDate)}</div>
					</div>

					<div
						class="p-4 bg-zinc-900 border-2 border-zinc-800 shadow-[4px_4px_0px_#000] space-y-1"
					>
						<div class="flex items-center gap-2 text-red-500 font-mono text-xs font-bold uppercase">
							<MapPin class="w-4 h-4" />
							<span>ARENA / VENUE</span>
						</div>
						<div class="text-sm font-black text-white">{event.venueName}</div>
					</div>
				</div>

				<!-- Punk Value Props -->
				<div class="flex flex-wrap gap-5 pt-3 text-xs font-mono text-zinc-400">
					<div class="flex items-center gap-2">
						<Zap class="w-4 h-4 text-red-500" />
						<span class="text-zinc-200">Transfer Manual Tanpa Potongan</span>
					</div>
					<div class="flex items-center gap-2">
						<Skull class="w-4 h-4 text-zinc-300" />
						<span class="text-zinc-200">E-Ticket QR Code Instan ke Email</span>
					</div>
					<div class="flex items-center gap-2">
						<ShieldAlert class="w-4 h-4 text-amber-400" />
						<span class="text-zinc-200">100% Anti Calo</span>
					</div>
				</div>
			</div>

			<!-- Right: Gig Poster Card with Logo -->
			<div class="lg:col-span-5">
				<div
					class="relative bg-zinc-900 border-4 border-zinc-100 shadow-[8px_8px_0px_#dc2626] group transition-all"
				>
					<!-- Top Branding Bar -->
					<div
						class="bg-zinc-950 p-3 border-b-2 border-zinc-800 flex items-center justify-between"
					>
						<div class="flex items-center gap-2">
							<img src={brandLogo} alt="Logo" class="h-6 w-auto object-contain brightness-110" />
							<span class="font-mono text-xs font-bold uppercase tracking-widest text-zinc-300"
								>CONCERT PASS</span
							>
						</div>
						<span class="font-mono text-[10px] bg-red-600 text-white px-2 py-0.5 font-bold uppercase"
							>LIVE 2026</span
						>
					</div>

					<!-- Gig Poster Image -->
					<div class="relative overflow-hidden bg-black h-80 sm:h-96">
						{#if event.bannerUrl}
							<img
								src={event.bannerUrl}
								alt={event.title}
								class="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 group-hover:grayscale-0 transition duration-700"
							/>
						{/if}
						<div
							class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"
						></div>

						<!-- Center Stamp / Brand Overlay -->
						<div class="absolute inset-0 flex items-center justify-center p-6 pointer-events-none">
							<div
								class="border-4 border-dashed border-red-600/80 p-4 rotate-[-8deg] bg-black/50 backdrop-blur-xs text-center"
							>
								<img src={brandLogo} alt="Logo" class="h-16 w-auto mx-auto object-contain invert drop-shadow-[0_2px_10px_rgba(220,38,38,0.8)]" />
								<span class="font-mono text-[11px] font-black uppercase text-red-500 tracking-widest block mt-1">
									OFFICIAL PASS
								</span>
							</div>
						</div>
					</div>

					<!-- Bottom Price Banner -->
					<div
						class="p-4 bg-zinc-950 border-t-2 border-zinc-800 flex items-center justify-between"
					>
						<div>
							<span class="text-[10px] font-mono uppercase text-zinc-500 block"
								>HARGA MULAI DARI</span
							>
							<span class="text-2xl font-black text-white font-mono"
								>{formatRupiah(startingPrice)}</span
							>
						</div>
						<a
							href="#tickets"
							class="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase font-mono tracking-wider shadow-[3px_3px_0px_#fff] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
						>
							AMBIL TIKET &darr;
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
