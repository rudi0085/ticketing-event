<script lang="ts">
	import type { TicketTierDetail } from '#lib/types';
	import { Plus, Minus, Tag } from 'lucide-svelte';
	import Badge from '../ui/Badge.svelte';

	interface Props {
		tier: TicketTierDetail;
		quantity: number;
		onUpdateQuantity: (delta: number) => void;
	}

	let { tier, quantity, onUpdateQuantity }: Props = $props();

	let isSoldOut = $derived(tier.availableQuota <= 0);

	function formatRupiah(amount: number) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			maximumFractionDigits: 0
		}).format(amount);
	}
</script>

<div
	class="relative p-6 border-2 transition-all {quantity > 0
		? 'bg-zinc-900 border-red-600 shadow-[6px_6px_0px_#dc2626]'
		: 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 shadow-[4px_4px_0px_#000]'}"
>
	<!-- Ticket Category Top Tag -->
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
		<div class="space-y-2">
			<div class="flex items-center gap-3">
				<h3 class="text-xl font-black uppercase tracking-tight text-white">{tier.name}</h3>
				{#if isSoldOut}
					<Badge variant="danger" rotate>OUT OF BLOOD // SOLD OUT</Badge>
				{:else}
					<span
						class="px-2.5 py-0.5 text-[10px] font-mono uppercase bg-zinc-800 text-zinc-300 border border-zinc-700"
					>
						KUOTA: SISA {tier.availableQuota}
					</span>
				{/if}
			</div>

			<p class="text-xs text-zinc-400 leading-relaxed max-w-md font-sans">
				{tier.description || 'Akses masuk moshpit konser musik punk.'}
			</p>

			<div class="text-2xl font-black text-red-500 font-mono tracking-tight pt-1">
				{formatRupiah(tier.price)}
			</div>
		</div>

		<!-- Brutalist Quantity Selector -->
		<div class="flex items-center gap-3 self-end sm:self-center">
			{#if isSoldOut}
				<span class="text-xs font-mono font-bold uppercase text-red-600 bg-red-950/60 px-3 py-1 border border-red-900">
					TIKET HABIS
				</span>
			{:else}
				<div class="flex items-center bg-zinc-900 border-2 border-zinc-700 p-1 shadow-[2px_2px_0px_#000]">
					<button
						type="button"
						onclick={() => onUpdateQuantity(-1)}
						disabled={quantity <= 0}
						class="w-9 h-9 flex items-center justify-center bg-zinc-950 border border-zinc-800 hover:border-red-600 hover:text-white text-zinc-300 disabled:opacity-30 disabled:hover:border-zinc-800 transition font-bold cursor-pointer"
						aria-label="Kurangi tiket"
					>
						<Minus class="w-4 h-4" />
					</button>

					<span class="w-12 text-center font-mono font-black text-base text-white select-none">
						{quantity}
					</span>

					<button
						type="button"
						onclick={() => onUpdateQuantity(1)}
						disabled={quantity >= Math.min(4, tier.availableQuota)}
						class="w-9 h-9 flex items-center justify-center bg-zinc-950 border border-zinc-800 hover:border-red-600 hover:text-white text-zinc-300 disabled:opacity-30 disabled:hover:border-zinc-800 transition font-bold cursor-pointer"
						aria-label="Tambah tiket"
					>
						<Plus class="w-4 h-4" />
					</button>
				</div>
			{/if}
		</div>
	</div>
</div>
