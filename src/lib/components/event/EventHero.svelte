<script lang="ts">
	import type { EventDetail } from '#lib/types';
	import brandLogo from '#lib/assets/brand/logo.webp';
	import posterImage from '#lib/assets/brand/poster.png';

	interface Props {
		event: EventDetail;
	}

	let { event }: Props = $props();

	function formatDate(isoString: string) {
		return new Intl.DateTimeFormat('id-ID', {
			weekday: 'long',
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			timeZoneName: 'short'
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

<section class="relative border-b border-zinc-900/80 py-10 sm:py-16">
	<div class="relative z-10 max-w-6xl mx-auto px-6 sm:px-12 md:px-16 lg:px-20">
		<div class="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
			<!-- Poster Centerpiece dari TEMPLATE.pdf -->
			<div class="md:col-span-5 lg:col-span-5">
				<div class="rounded-lg overflow-hidden border border-amber-500/25 bg-zinc-950 shadow-2xl shadow-black/90">
					<img
						src={posterImage}
						alt="Poster Konser Sound From Tiger"
						class="w-full h-auto object-cover aspect-[595/842] block"
					/>
				</div>
			</div>

			<!-- Editorial Event Information -->
			<div class="md:col-span-7 lg:col-span-7 space-y-6">
				<div>
					<div class="mb-4">
						<img
							src={brandLogo}
							alt="Sound From Tiger"
							class="h-14 sm:h-18 w-auto object-contain"
						/>
					</div>
					<h1 class="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight [text-shadow:0_2px_16px_rgb(0_0_0/0.9)]">
						{event.title}
					</h1>
				</div>

				<!-- Structured Editorial Metadata -->
				<div class="border-y border-white/10 bg-zinc-950/60 backdrop-blur-sm px-4 py-5 rounded space-y-3.5 text-xs sm:text-sm font-mono">
					<div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
						<span class="text-zinc-400 uppercase tracking-wider text-xs">Jadwal Konser</span>
						<span class="text-white font-medium">{formatDate(event.eventDate)}</span>
					</div>
					<div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
						<span class="text-zinc-400 uppercase tracking-wider text-xs">Lokasi Venue</span>
						<span class="text-white font-medium">{event.venueName}</span>
					</div>
					<div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
						<span class="text-zinc-400 uppercase tracking-wider text-xs">Harga Tiket</span>
						<span class="text-amber-400 font-semibold">Mulai dari {formatRupiah(startingPrice)}</span>
					</div>
				</div>

				<!-- Description -->
				<p class="text-zinc-200 text-sm leading-relaxed font-sans [text-shadow:0_1px_10px_rgb(0_0_0/0.9)]">
					{event.description}
				</p>

				<!-- Direct Call to Action -->
				<div class="pt-2">
					<a
						href="#tickets"
						class="inline-flex items-center justify-center px-6 py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase font-mono tracking-wider rounded transition-colors shadow-lg shadow-black/50"
					>
						Pilih Tiket Konser &darr;
					</a>
				</div>
			</div>
		</div>
	</div>
</section>
