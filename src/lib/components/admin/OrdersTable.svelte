<script lang="ts">
	import type { OrderDetail } from '#lib/types';
	import { enhance } from '$app/forms';
	import { Ticket, ExternalLink, Eye, Send, XCircle } from 'lucide-svelte';
	import Badge from '../ui/Badge.svelte';

	interface Props {
		orders: OrderDetail[];
		onOpenProofModal: (order: OrderDetail) => void;
		onOpenRejectModal: (orderId: string) => void;
	}

	let { orders, onOpenProofModal, onOpenRejectModal }: Props = $props();

	let processingOrderId = $state<string | null>(null);

	function formatRupiah(amount: number) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			maximumFractionDigits: 0
		}).format(amount);
	}

	function formatDate(isoString: string) {
		return new Intl.DateTimeFormat('id-ID', {
			dateStyle: 'medium',
			timeStyle: 'short'
		}).format(new Date(isoString));
	}
</script>

<div class="bg-zinc-900 border-2 border-zinc-800 shadow-[6px_6px_0px_#000] overflow-hidden">
	{#if orders.length === 0}
		<div class="py-16 text-center space-y-2 font-mono">
			<Ticket class="w-10 h-10 text-zinc-700 mx-auto" />
			<h3 class="text-base font-bold text-zinc-300 uppercase tracking-wider">Tidak Ada Pesanan Ditemukan</h3>
			<p class="text-xs text-zinc-500">Belum ada pesanan dengan filter status yang dipilih.</p>
		</div>
	{:else}
		<div class="overflow-x-auto">
			<table class="w-full text-left border-collapse font-mono text-sm">
				<thead>
					<tr
						class="border-b-2 border-zinc-800 bg-zinc-950 text-xs uppercase font-black text-zinc-400"
					>
						<th class="py-3.5 px-4 tracking-wider">Pesanan</th>
						<th class="py-3.5 px-4 tracking-wider">Pembeli</th>
						<th class="py-3.5 px-4 tracking-wider">Item & Nominal</th>
						<th class="py-3.5 px-4 text-center tracking-wider">Bukti Transfer</th>
						<th class="py-3.5 px-4 tracking-wider">Status</th>
						<th class="py-3.5 px-4 text-right tracking-wider">Aksi Crew</th>
					</tr>
				</thead>
				<tbody class="divide-y-2 divide-zinc-800/80">
					{#each orders as order (order.id)}
						<tr class="hover:bg-zinc-800/40 transition">
							<!-- Order Number & Date -->
							<td class="py-4 px-4 align-top">
								<div class="font-black text-red-500 text-xs">
									#{order.orderNumber}
								</div>
								<div class="text-[11px] text-zinc-500 mt-0.5">
									{formatDate(order.createdAt)}
								</div>
								<a
									href="/order/{order.orderNumber}"
									target="_blank"
									class="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white mt-1 underline decoration-zinc-600"
								>
									<span>Invoice Web</span>
									<ExternalLink class="w-3 h-3 text-red-500" />
								</a>
							</td>

							<!-- Customer Info -->
							<td class="py-4 px-4 align-top font-sans">
								<div class="font-bold text-zinc-100">{order.customerName}</div>
								<div class="font-mono text-xs text-zinc-400">{order.customerEmail}</div>
								<div class="font-mono text-xs text-zinc-500 mt-0.5">{order.customerPhone}</div>
							</td>

							<!-- Items & Amount -->
							<td class="py-4 px-4 align-top">
								<div class="font-black text-white text-base">
									{formatRupiah(order.totalAmount)}
								</div>
								<div class="text-xs text-zinc-400 mt-1 space-y-0.5">
									{#each order.items as it}
										<div class="text-[11px] font-bold">{it.quantity}x {it.tierName}</div>
									{/each}
								</div>
							</td>

							<!-- Payment Proof Image -->
							<td class="py-4 px-4 align-top text-center">
								{#if order.paymentProofUrl}
									<button
										type="button"
										onclick={() => onOpenProofModal(order)}
										class="group relative inline-block border-2 border-zinc-700 hover:border-red-500 transition shadow-[2px_2px_0px_#000] cursor-pointer"
									>
										<img
											src={order.paymentProofUrl}
											alt="Bukti Transfer"
											class="w-16 h-16 object-cover bg-black"
										/>
										<div
											class="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white"
										>
											<Eye class="w-4 h-4 text-red-400" />
										</div>
									</button>
									<span class="block text-[10px] text-zinc-400 mt-1 font-bold"
										>KLIK PERBESAR</span
									>
								{:else}
									<span class="text-xs text-zinc-600 italic">BELUM ADA</span>
								{/if}
							</td>

							<!-- Status Badge -->
							<td class="py-4 px-4 align-top">
								{#if order.status === 'PENDING_PAYMENT'}
									<Badge variant="warning">BELUM BAYAR</Badge>
								{:else if order.status === 'AWAITING_VERIFICATION'}
									<Badge variant="info">PERLU VERIFIKASI</Badge>
								{:else if order.status === 'VERIFIED'}
									<Badge variant="success">LUNAS / TERBIT</Badge>
								{:else if order.status === 'REJECTED'}
									<Badge variant="danger">DITOLAK</Badge>
								{/if}
							</td>

							<!-- Actions -->
							<td class="py-4 px-4 align-top text-right space-y-2">
								{#if order.status === 'AWAITING_VERIFICATION' || order.status === 'PENDING_PAYMENT'}
									<div class="flex items-center justify-end gap-2">
										<!-- Verify Button -->
										<form
											method="POST"
											action="/admin?/verify"
											use:enhance={() => {
												processingOrderId = order.id;
												return async ({ update }) => {
													processingOrderId = null;
													await update();
												};
											}}
										>
											<input type="hidden" name="orderId" value={order.id} />
											<button
												type="submit"
												disabled={processingOrderId === order.id}
												class="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs uppercase tracking-wider border border-red-500 shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
											>
												<Send class="w-3.5 h-3.5" />
												<span>
													{#if processingOrderId === order.id}
														MEMPROSES...
													{:else}
														VERIFIKASI & KIRIM TIKET
													{/if}
												</span>
											</button>
										</form>

										<!-- Reject Button -->
										<button
											type="button"
											onclick={() => onOpenRejectModal(order.id)}
											class="p-1.5 bg-zinc-800 hover:bg-red-950 hover:border-red-600 border border-zinc-700 text-zinc-300 hover:text-red-400 transition cursor-pointer"
											title="Tolak pembayaran"
										>
											<XCircle class="w-4 h-4" />
										</button>
									</div>
								{:else if order.status === 'VERIFIED'}
									<div class="text-xs text-emerald-400 font-bold uppercase tracking-wider">
										✓ E-Ticket Terkirim
									</div>
								{:else}
									<span class="text-xs text-zinc-500 font-mono">-</span>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
