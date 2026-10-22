<script lang="ts">
	import type { PageProps } from './$types';
	import { ArrowLeft, Ticket, ExternalLink, Copy, Check, FileText } from 'lucide-svelte';
	import { OrderStatusBanner, BankTransferCard, ProofUploader, Badge } from '#lib/components';

	let { data, form }: PageProps = $props();

	let copiedAmount = $state(false);

	function copyAmount() {
		navigator.clipboard.writeText(data.order.totalAmount.toString());
		copiedAmount = true;
		setTimeout(() => (copiedAmount = false), 2000);
	}

	function formatRupiah(amount: number) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			maximumFractionDigits: 0
		}).format(amount);
	}
</script>

<svelte:head>
	<title>ORDER #{data.order.orderNumber} - {data.event.title}</title>
</svelte:head>

<div class="min-h-screen bg-zinc-950 text-zinc-100 py-10 px-4">
	<div class="max-w-3xl mx-auto space-y-6">
		<!-- Back to Event -->
		<a
			href="/"
			class="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-zinc-400 hover:text-red-500 transition"
		>
			<ArrowLeft class="w-4 h-4" />
			<span>Kembali ke Gig Info // Distro Gate</span>
		</a>

		<!-- Modular Order Status Banner -->
		<OrderStatusBanner
			status={data.order.status}
			customerEmail={data.order.customerEmail}
			rejectionReason={data.order.rejectionReason}
		/>

		<!-- Order Details Invoice Container -->
		<div class="bg-zinc-900 border-2 border-zinc-800 p-6 sm:p-8 shadow-[6px_6px_0px_#000] space-y-6 relative">
			<!-- Invoice Header -->
			<div
				class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-zinc-800 pb-5"
			>
				<div>
					<div class="inline-block px-2 py-0.5 bg-red-600 text-white font-mono text-[10px] font-black uppercase tracking-wider rotate-[-1deg] mb-1">
						INVOICE MANIFEST // OFFICIAL
					</div>
					<h1 class="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
						#{data.order.orderNumber}
					</h1>
				</div>
				<div class="sm:text-right font-mono">
					<span class="text-[10px] text-zinc-500 uppercase tracking-widest block">PEMESAN TIKET</span>
					<span class="text-sm font-black text-zinc-100 block">{data.order.customerName}</span>
					<span class="text-xs text-red-400 block">{data.order.customerEmail}</span>
					{#if data.order.customerPhone}
						<span class="text-xs text-zinc-500 block">{data.order.customerPhone}</span>
					{/if}
				</div>
			</div>

			<!-- Items Ordered Table -->
			<div class="space-y-3">
				<h3 class="font-mono text-xs font-black text-zinc-300 uppercase tracking-widest flex items-center gap-2">
					<FileText class="w-4 h-4 text-red-500" />
					<span>Rincian Pass & Tiket Dipesan</span>
				</h3>
				<div class="divide-y-2 divide-zinc-800 bg-zinc-950 border-2 border-zinc-800 p-4 shadow-[3px_3px_0px_#000]">
					{#each data.order.items as item}
						<div class="py-3 flex justify-between items-center text-sm">
							<div>
								<span class="font-mono font-black text-zinc-100 uppercase tracking-wider">
									{item.tierName || 'Tiket'}
								</span>
								<span class="font-mono text-xs text-zinc-500 block mt-0.5">
									{item.quantity} x {formatRupiah(item.unitPrice)}
								</span>
							</div>
							<div class="font-mono font-bold text-zinc-200">
								{formatRupiah(item.subtotal)}
							</div>
						</div>
					{/each}

					<!-- Total Row -->
					<div
						class="pt-4 mt-2 flex flex-wrap justify-between items-center gap-2 text-base font-black text-white"
					>
						<span class="font-mono uppercase tracking-wider text-xs sm:text-sm text-zinc-300">
							Total Tagihan Transfer
						</span>
						<div class="flex items-center gap-2">
							<span class="font-mono text-xl sm:text-2xl text-red-500 font-black">
								{formatRupiah(data.order.totalAmount)}
							</span>
							<button
								type="button"
								onclick={copyAmount}
								class="p-2 bg-zinc-800 hover:bg-red-600 text-zinc-200 hover:text-white transition border border-zinc-700 cursor-pointer"
								title="Salin nominal transfer"
							>
								{#if copiedAmount}
									<Check class="w-4 h-4 text-emerald-400" />
								{:else}
									<Copy class="w-4 h-4" />
								{/if}
							</button>
						</div>
					</div>
				</div>
			</div>

			<!-- Modular Bank Account Info (Shown if not yet verified) -->
			{#if data.order.status !== 'VERIFIED'}
				<BankTransferCard bankInfo={data.bankInfo} />
			{/if}

			<!-- Modular Upload Payment Proof Form -->
			{#if data.order.status === 'PENDING_PAYMENT' || data.order.status === 'REJECTED'}
				<ProofUploader errorMessage={form?.error} />
			{/if}

			<!-- Uploaded Proof Preview (if AWAITING_VERIFICATION) -->
			{#if data.order.status === 'AWAITING_VERIFICATION' && data.order.paymentProofUrl}
				<div class="border-t-2 border-zinc-800 pt-5 space-y-3">
					<div class="flex items-center justify-between">
						<h3 class="font-mono text-xs font-black text-zinc-300 uppercase tracking-wider">
							Bukti Transfer Terkirim // Menunggu Verifikasi Crew
						</h3>
						<span class="font-mono text-[10px] text-amber-500 uppercase tracking-widest animate-pulse">
							REVIEW IN PROGRESS
						</span>
					</div>
					<div class="p-3 bg-zinc-950 border-2 border-zinc-800 inline-block shadow-[4px_4px_0px_#000]">
						<img
							src={data.order.paymentProofUrl}
							alt="Bukti Transfer"
							class="max-h-60 rounded-none object-contain"
						/>
					</div>
					<p class="font-mono text-xs text-zinc-400">
						Crew panitia sedang mencocokkan mutasi bank. Begitu diverifikasi, E-Ticket resmi akan langsung diterbitkan di halaman ini dan dikirim ke email <strong>{data.order.customerEmail}</strong>.
					</p>
				</div>
			{/if}

			<!-- Issued Tickets List (if VERIFIED) -->
			{#if data.order.status === 'VERIFIED' && data.order.tickets && data.order.tickets.length > 0}
				<div class="border-t-2 border-zinc-800 pt-6 space-y-4">
					<div class="flex items-center justify-between">
						<h3 class="font-mono text-sm font-black text-emerald-400 uppercase tracking-wider flex items-center gap-2">
							<Ticket class="w-5 h-5 text-emerald-400" />
							<span>E-Ticket Resmi Anda Telah Terbit!</span>
						</h3>
						<span class="font-mono text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-700 px-2 py-0.5 uppercase tracking-widest font-black">
							VALID PASS
						</span>
					</div>

					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{#each data.order.tickets as ticket}
							<div
								class="p-4 bg-zinc-950 border-2 border-zinc-800 hover:border-red-600 transition shadow-[4px_4px_0px_#000] space-y-3"
							>
								<div class="flex justify-between items-start">
									<div>
										<span class="font-mono text-[10px] text-zinc-400 uppercase tracking-wider block">
											{ticket.tierName}
										</span>
										<div class="font-mono font-black text-red-500 text-sm tracking-wider">
											{ticket.ticketCode}
										</div>
									</div>
									<Badge variant="success">{ticket.status}</Badge>
								</div>

								<a
									href="/ticket/{ticket.ticketCode}"
									class="w-full py-2.5 px-3 bg-red-600 hover:bg-red-500 text-white font-mono font-black text-xs uppercase tracking-wider transition border border-red-500 shadow-[2px_2px_0px_#000] flex items-center justify-center gap-1.5"
								>
									<span>Buka E-Ticket Digital // PASS</span>
									<ExternalLink class="w-3.5 h-3.5" />
								</a>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
