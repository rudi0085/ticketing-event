<script lang="ts">
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

<div class="bg-zinc-950 border border-zinc-800/80 rounded-lg p-5 sticky top-24 space-y-5">
	<div class="border-b border-zinc-900 pb-3">
		<h3 class="text-sm font-semibold text-white tracking-tight uppercase">
			Detail Pemesan
		</h3>
		<p class="text-xs text-zinc-500 mt-0.5">
			Tiket digital dan bukti pembayaran akan dikirim via email.
		</p>
	</div>

	<!-- Input Fields -->
	<div class="space-y-3.5 text-xs">
		<div>
			<label for="name" class="block font-medium text-zinc-300 mb-1">
				Nama Lengkap
			</label>
			<input
				id="name"
				type="text"
				name="customerName"
				required
				bind:value={customerName}
				placeholder="Nama lengkap sesuai KTP"
				class="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 focus:border-zinc-500 rounded text-white placeholder-zinc-500 outline-none transition text-sm"
			/>
		</div>

		<div>
			<label for="email" class="block font-medium text-zinc-300 mb-1">
				Email
			</label>
			<input
				id="email"
				type="email"
				name="customerEmail"
				required
				bind:value={customerEmail}
				placeholder="nama@email.com"
				class="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 focus:border-zinc-500 rounded text-white placeholder-zinc-500 outline-none transition text-sm"
			/>
		</div>

		<div>
			<label for="phone" class="block font-medium text-zinc-300 mb-1">
				Nomor WhatsApp / HP
			</label>
			<input
				id="phone"
				type="tel"
				name="customerPhone"
				required
				bind:value={customerPhone}
				placeholder="08xxxxxxxxxx"
				class="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 focus:border-zinc-500 rounded text-white placeholder-zinc-500 outline-none transition text-sm"
			/>
		</div>
	</div>

	<!-- Price Summary -->
	<div class="border-t border-zinc-900 pt-3 space-y-2 text-xs">
		<div class="flex justify-between text-zinc-400">
			<span>Jumlah Tiket</span>
			<span class="font-medium text-white">{totalTickets}</span>
		</div>
		<div class="flex justify-between items-baseline pt-1">
			<span class="font-medium text-zinc-300">Total Pembayaran</span>
			<span class="font-mono text-base font-semibold text-white">{formatRupiah(totalPrice)}</span>
		</div>
	</div>

	<!-- Action Button -->
	<button
		type="submit"
		disabled={totalTickets === 0 || isSubmitting}
		class="w-full py-3 px-4 font-semibold text-xs tracking-wider uppercase text-zinc-950 bg-white hover:bg-zinc-200 rounded disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
	>
		{#if isSubmitting}
			<span>Memproses...</span>
		{:else}
			<span>Lanjut ke Pembayaran</span>
		{/if}
	</button>

	<p class="text-[11px] text-zinc-500 text-center">
		Konfirmasi pembayaran dilakukan melalui transfer bank resmi.
	</p>
</div>
