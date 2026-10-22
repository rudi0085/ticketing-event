<script lang="ts">
	import type { PageProps } from './$types';
	import type { OrderDetail } from '#lib/types';
	import { CheckCircle2, AlertCircle } from 'lucide-svelte';
	import {
		AdminStatsGrid,
		OrderFilterTabs,
		OrdersTable,
		ProofReviewModal,
		RejectModal
	} from '#lib/components';

	let { data, form }: PageProps = $props();

	// Modal State (Svelte 5 Runes)
	let selectedOrderForModal = $state<OrderDetail | null>(null);
	let rejectingOrderId = $state<string | null>(null);
</script>

<div class="space-y-8 font-sans">
	<!-- Page Header -->
	<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-zinc-800 pb-5">
		<div>
			<div class="inline-block px-2 py-0.5 bg-red-600 text-white font-mono text-[10px] font-black uppercase tracking-wider rotate-[-1deg] mb-1">
				DISPATCH PANEL // TICKETING
			</div>
			<h1 class="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight uppercase">
				Verifikasi Pembayaran & Penerbitan Tiket
			</h1>
			<p class="font-mono text-xs text-zinc-400 mt-1">
				Tinjau bukti transfer manual penonton, setujui untuk otomatis mengirim E-Ticket resmi ke email pembeli.
			</p>
		</div>
	</div>

	<!-- Alert Messages -->
	{#if form?.success}
		<div
			class="p-4 bg-emerald-950/80 border-2 border-emerald-600 text-emerald-200 font-mono text-xs flex items-center gap-3 shadow-[4px_4px_0px_#000]"
		>
			<CheckCircle2 class="w-5 h-5 text-emerald-400 shrink-0" />
			<span>[BERHASIL]: {form.message}</span>
		</div>
	{:else if form?.error}
		<div
			class="p-4 bg-red-950/80 border-2 border-red-700 text-red-200 font-mono text-xs flex items-center gap-3 shadow-[4px_4px_0px_#000]"
		>
			<AlertCircle class="w-5 h-5 text-red-400 shrink-0" />
			<span>[ERROR]: {form.error}</span>
		</div>
	{/if}

	<!-- 1. Modular Stats Grid -->
	<AdminStatsGrid stats={data.stats} />

	<!-- 2. Modular Filter Tabs -->
	<OrderFilterTabs
		currentFilter={data.currentFilter}
		totalOrders={data.stats.totalOrders}
		pendingCount={data.stats.pendingCount}
	/>

	<!-- 3. Modular Orders Table -->
	<OrdersTable
		orders={data.orders}
		onOpenProofModal={(order) => (selectedOrderForModal = order)}
		onOpenRejectModal={(orderId) => (rejectingOrderId = orderId)}
	/>
</div>

<!-- 4. Modular Proof Review Modal -->
<ProofReviewModal
	order={selectedOrderForModal}
	onClose={() => (selectedOrderForModal = null)}
/>

<!-- 5. Modular Rejection Reason Modal -->
<RejectModal
	orderId={rejectingOrderId}
	onClose={() => (rejectingOrderId = null)}
/>
