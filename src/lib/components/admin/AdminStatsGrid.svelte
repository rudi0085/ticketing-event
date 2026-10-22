<script lang="ts">
	import { CircleDollarSign, Ticket, Clock, ShoppingBag, Flame } from 'lucide-svelte';

	interface Stats {
		totalRevenue: number;
		totalSoldTickets: number;
		pendingCount: number;
		totalOrders: number;
	}

	interface Props {
		stats: Stats;
	}

	let { stats }: Props = $props();

	function formatRupiah(amount: number) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			maximumFractionDigits: 0
		}).format(amount);
	}
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
	<!-- Card 1: Revenue -->
	<div class="p-5 bg-zinc-900 border-2 border-zinc-800 shadow-[4px_4px_0px_#000] space-y-3 relative overflow-hidden">
		<div class="flex justify-between items-center text-zinc-400">
			<span class="text-[10px] font-bold uppercase tracking-widest">TOTAL PENDAPATAN</span>
			<div class="p-1.5 bg-zinc-950 text-red-500 border border-zinc-700">
				<CircleDollarSign class="w-4 h-4" />
			</div>
		</div>
		<div class="text-2xl font-black text-white">
			{formatRupiah(stats.totalRevenue)}
		</div>
		<div class="text-[11px] text-zinc-500">
			Dari pembayaran terverifikasi
		</div>
	</div>

	<!-- Card 2: Sold Tickets -->
	<div class="p-5 bg-zinc-900 border-2 border-zinc-800 shadow-[4px_4px_0px_#000] space-y-3">
		<div class="flex justify-between items-center text-zinc-400">
			<span class="text-[10px] font-bold uppercase tracking-widest">TIKET TERJUAL</span>
			<div class="p-1.5 bg-zinc-950 text-red-500 border border-zinc-700">
				<Ticket class="w-4 h-4" />
			</div>
		</div>
		<div class="text-2xl font-black text-white">
			{stats.totalSoldTickets} <span class="text-sm font-bold text-zinc-400">PASS</span>
		</div>
		<div class="text-[11px] text-zinc-500">
			Telah diterbitkan & dikirim
		</div>
	</div>

	<!-- Card 3: Pending Verification -->
	<div
		class="p-5 bg-zinc-900 border-2 space-y-3 transition {stats.pendingCount > 0
			? 'border-red-600 shadow-[4px_4px_0px_#dc2626]'
			: 'border-zinc-800 shadow-[4px_4px_0px_#000]'}"
	>
		<div class="flex justify-between items-center">
			<span class="text-[10px] font-bold uppercase tracking-widest {stats.pendingCount > 0 ? 'text-red-400' : 'text-zinc-400'}">
				PERLU VERIFIKASI
			</span>
			<div class="p-1.5 bg-zinc-950 {stats.pendingCount > 0 ? 'text-red-500 border-red-700' : 'text-zinc-500 border-zinc-700'} border">
				<Clock class="w-4 h-4 {stats.pendingCount > 0 ? 'animate-spin' : ''}" />
			</div>
		</div>
		<div class="text-2xl font-black {stats.pendingCount > 0 ? 'text-red-500' : 'text-white'}">
			{stats.pendingCount} <span class="text-sm font-bold text-zinc-400">PESANAN</span>
		</div>
		<div class="text-[11px] text-zinc-500">
			{stats.pendingCount > 0 ? '⚠️ Menunggu persetujuan crew' : 'Semua beres diperiksa'}
		</div>
	</div>

	<!-- Card 4: Total Orders -->
	<div class="p-5 bg-zinc-900 border-2 border-zinc-800 shadow-[4px_4px_0px_#000] space-y-3">
		<div class="flex justify-between items-center text-zinc-400">
			<span class="text-[10px] font-bold uppercase tracking-widest">TOTAL PESANAN</span>
			<div class="p-1.5 bg-zinc-950 text-zinc-300 border border-zinc-700">
				<ShoppingBag class="w-4 h-4" />
			</div>
		</div>
		<div class="text-2xl font-black text-white">
			{stats.totalOrders}
		</div>
		<div class="text-[11px] text-zinc-500">
			Semua riwayat pemesanan
		</div>
	</div>
</div>
