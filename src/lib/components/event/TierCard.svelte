<script lang="ts">
	import type { TicketTierDetail } from '#lib/types';
	import { Plus, Minus } from 'lucide-svelte';

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
	class="p-4 sm:p-5 rounded-lg border transition-colors {quantity > 0
		? 'bg-zinc-900/90 border-zinc-600'
		: 'bg-zinc-950 border-zinc-800/80 hover:border-zinc-700'}"
>
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
		<div class="space-y-1">
			<div class="flex items-center gap-2.5">
				<h3 class="text-base font-semibold text-white tracking-tight">{tier.name}</h3>
				{#if isSoldOut}
					<span class="text-[10px] font-mono uppercase text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
						Habis
					</span>
				{:else if tier.availableQuota <= 25}
					<span class="text-[10px] font-mono uppercase text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-900/50">
						Sisa {tier.availableQuota}
					</span>
				{/if}
			</div>

			<p class="text-xs text-zinc-400 leading-normal max-w-md">
				{tier.description || 'Akses masuk venue Sound From Tiger.'}
			</p>

			<div class="text-sm font-mono font-medium text-amber-400 pt-1">
				{formatRupiah(tier.price)}
			</div>
		</div>

		<!-- Clean Stepper Selector -->
		<div class="self-end sm:self-center">
			{#if isSoldOut}
				<span class="text-xs font-mono text-zinc-500 uppercase">Habis</span>
			{:else}
				<div class="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded p-1">
					<button
						type="button"
						onclick={() => onUpdateQuantity(-1)}
						disabled={quantity <= 0}
						class="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 rounded disabled:opacity-20 transition cursor-pointer"
						aria-label="Kurangi tiket"
					>
						<Minus class="w-3.5 h-3.5" />
					</button>

					<span class="w-8 text-center font-mono text-sm font-semibold text-white select-none">
						{quantity}
					</span>

					<button
						type="button"
						onclick={() => onUpdateQuantity(1)}
						disabled={quantity >= Math.min(4, tier.availableQuota)}
						class="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 rounded disabled:opacity-20 transition cursor-pointer"
						aria-label="Tambah tiket"
					>
						<Plus class="w-3.5 h-3.5" />
					</button>
				</div>
			{/if}
		</div>
	</div>
</div>
