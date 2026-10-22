<script lang="ts">
	import { ArrowRight, Ticket, User, Mail, Phone } from 'lucide-svelte';

	interface Props {
		totalTickets: number;
		totalPrice: number;
		customerName?: string;
		customerEmail?: string;
		customerPhone?: string;
		isSubmitting?: boolean;
	}

	let {
		totalTickets,
		totalPrice,
		customerName = $bindable(''),
		customerEmail = $bindable(''),
		customerPhone = $bindable(''),
		isSubmitting = $bindable(false)
	}: Props = $props();

	function formatRupiah(amount: number) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			maximumFractionDigits: 0
		}).format(amount);
	}
</script>

<div
	class="bg-zinc-950 border-2 border-zinc-800 p-6 sticky top-24 shadow-[6px_6px_0px_#000] space-y-6"
>
	<!-- Header -->
	<div class="border-b-2 border-zinc-900 pb-4">
		<span class="text-[10px] font-mono uppercase tracking-widest text-red-500 block mb-1">
			// DATA PEMESANAN
		</span>
		<h3 class="text-xl font-black uppercase text-white tracking-tight flex items-center gap-2">
			<Ticket class="w-5 h-5 text-red-500" />
			<span>DATA DIRI PENONTON</span>
		</h3>
	</div>

	<!-- Input Fields -->
	<div class="space-y-4 text-xs font-mono">
		<div>
			<label for="name" class="block uppercase font-bold text-zinc-300 mb-1.5 flex items-center gap-1.5">
				<User class="w-3.5 h-3.5 text-red-500" />
				<span>Nama Lengkap <span class="text-red-500">*</span></span>
			</label>
			<input
				id="name"
				type="text"
				name="customerName"
				required
				bind:value={customerName}
				placeholder="NAMA LENGKAP PENONTON"
				class="w-full px-3.5 py-3 bg-zinc-900 border-2 border-zinc-800 focus:border-red-600 text-white placeholder-zinc-600 outline-none transition font-sans text-sm"
			/>
		</div>

		<div>
			<label for="email" class="block uppercase font-bold text-zinc-300 mb-1.5 flex items-center gap-1.5">
				<Mail class="w-3.5 h-3.5 text-red-500" />
				<span>Alamat Email <span class="text-red-500">*</span></span>
			</label>
			<input
				id="email"
				type="email"
				name="customerEmail"
				required
				bind:value={customerEmail}
				placeholder="email@domain.com"
				class="w-full px-3.5 py-3 bg-zinc-900 border-2 border-zinc-800 focus:border-red-600 text-white placeholder-zinc-600 outline-none transition font-sans text-sm"
			/>
			<span class="text-[10px] text-zinc-500 mt-1 block">
				E-Ticket QR Code resmi akan dikirim otomatis ke email ini.
			</span>
		</div>

		<div>
			<label for="phone" class="block uppercase font-bold text-zinc-300 mb-1.5 flex items-center gap-1.5">
				<Phone class="w-3.5 h-3.5 text-red-500" />
				<span>Nomor WhatsApp / HP <span class="text-red-500">*</span></span>
			</label>
			<input
				id="phone"
				type="tel"
				name="customerPhone"
				required
				bind:value={customerPhone}
				placeholder="0812XXXXXXXX"
				class="w-full px-3.5 py-3 bg-zinc-900 border-2 border-zinc-800 focus:border-red-600 text-white placeholder-zinc-600 outline-none transition font-sans text-sm"
			/>
		</div>
	</div>

	<!-- Order Calculation Box -->
	<div class="border-t-2 border-zinc-900 pt-4 space-y-2 text-xs font-mono">
		<div class="flex justify-between text-zinc-400">
			<span>TIKET TERPILIH</span>
			<span class="font-bold text-white">{totalTickets} TIKET</span>
		</div>
		<div class="flex justify-between text-sm font-black text-white pt-2 border-t border-zinc-900">
			<span class="uppercase">TOTAL HARGA</span>
			<span class="text-red-500 text-xl font-mono">{formatRupiah(totalPrice)}</span>
		</div>
	</div>

	<!-- Brutalist Checkout Action Button -->
	<button
		type="submit"
		disabled={totalTickets === 0 || isSubmitting}
		class="w-full py-4 px-6 font-black uppercase text-sm font-mono tracking-wider text-white bg-red-600 hover:bg-red-500 border-2 border-red-500 shadow-[4px_4px_0px_#fff] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-red-600 disabled:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
	>
		{#if isSubmitting}
			<span class="animate-pulse">MEMPROSES PESANAN...</span>
		{:else}
			<span>LANJUT KE PEMBAYARAN</span>
			<ArrowRight class="w-4 h-4" />
		{/if}
	</button>

	<p class="text-[10px] font-mono text-center text-zinc-500">
		// PEMBAYARAN MANUAL VIA TRANSFER BANK LANGSUNG KE REKENING PANITIA
	</p>
</div>
