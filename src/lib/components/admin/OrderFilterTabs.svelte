<script lang="ts">
	interface Props {
		currentFilter: string;
		totalOrders: number;
		pendingCount: number;
	}

	let { currentFilter, totalOrders, pendingCount }: Props = $props();
</script>

<div class="flex gap-2 border-b-2 border-zinc-800 pb-3 overflow-x-auto font-mono text-xs font-bold">
	<a
		href="/admin"
		class="px-4 py-2 transition whitespace-nowrap border-2 {currentFilter === 'ALL'
			? 'bg-red-600 text-white border-red-500 shadow-[2px_2px_0px_#000]'
			: 'text-zinc-400 hover:text-white bg-zinc-900 border-zinc-800 hover:border-zinc-700'}"
	>
		SEMUA ({totalOrders})
	</a>

	<a
		href="/admin?status=AWAITING_VERIFICATION"
		class="px-4 py-2 transition whitespace-nowrap flex items-center gap-1.5 border-2 {currentFilter ===
		'AWAITING_VERIFICATION'
			? 'bg-red-600 text-white border-red-500 shadow-[2px_2px_0px_#000]'
			: 'text-zinc-400 hover:text-white bg-zinc-900 border-zinc-800 hover:border-zinc-700'}"
	>
		<span>PERLU VERIFIKASI</span>
		{#if pendingCount > 0}
			<span class="px-1.5 py-0.2 text-[10px] bg-white text-black font-black">
				{pendingCount}
			</span>
		{/if}
	</a>

	<a
		href="/admin?status=VERIFIED"
		class="px-4 py-2 transition whitespace-nowrap border-2 {currentFilter === 'VERIFIED'
			? 'bg-emerald-600 text-white border-emerald-500 shadow-[2px_2px_0px_#000]'
			: 'text-zinc-400 hover:text-white bg-zinc-900 border-zinc-800 hover:border-zinc-700'}"
	>
		LUNAS / TERBIT
	</a>

	<a
		href="/admin?status=PENDING_PAYMENT"
		class="px-4 py-2 transition whitespace-nowrap border-2 {currentFilter === 'PENDING_PAYMENT'
			? 'bg-amber-600 text-white border-amber-500 shadow-[2px_2px_0px_#000]'
			: 'text-zinc-400 hover:text-white bg-zinc-900 border-zinc-800 hover:border-zinc-700'}"
	>
		BELUM UPLOAD BUKTI
	</a>

	<a
		href="/admin?status=REJECTED"
		class="px-4 py-2 transition whitespace-nowrap border-2 {currentFilter === 'REJECTED'
			? 'bg-zinc-800 text-red-400 border-red-600 shadow-[2px_2px_0px_#000]'
			: 'text-zinc-400 hover:text-white bg-zinc-900 border-zinc-800 hover:border-zinc-700'}"
	>
		DITOLAK
	</a>
</div>
