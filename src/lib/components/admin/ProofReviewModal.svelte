<script lang="ts">
	import type { OrderDetail } from '#lib/types';
	import { enhance } from '$app/forms';
	import { CheckCircle2, X } from 'lucide-svelte';

	interface Props {
		order: OrderDetail | null;
		onClose: () => void;
	}

	let { order, onClose }: Props = $props();
	let isSubmitting = $state(false);

	function formatRupiah(amount: number) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			maximumFractionDigits: 0
		}).format(amount);
	}
</script>

{#if order}
	<div
		class="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 font-mono"
	>
		<div
			class="bg-zinc-900 border-2 border-red-600 max-w-2xl w-full p-6 shadow-[8px_8px_0px_#000] space-y-6 relative max-h-[90vh] overflow-y-auto"
		>
			<button
				type="button"
				onclick={onClose}
				class="absolute right-5 top-5 p-1.5 bg-zinc-800 hover:bg-red-600 border border-zinc-700 text-zinc-300 hover:text-white transition cursor-pointer"
				aria-label="Tutup modal"
			>
				<X class="w-5 h-5" />
			</button>

			<div>
				<div class="inline-block px-2 py-0.5 bg-red-600 text-white font-mono text-[10px] font-black uppercase tracking-wider rotate-[-1deg] mb-1">
					BUKTI TRANSFER // VERIFIKASI
				</div>
				<h3 class="text-xl font-black text-white tracking-tight">
					Pesanan #{order.orderNumber}
				</h3>
				<div class="text-xs text-zinc-400 mt-1">
					{order.customerName} ({order.customerEmail}) — Total: <strong class="text-red-500 font-bold"
						>{formatRupiah(order.totalAmount)}</strong
					>
				</div>
			</div>

			<!-- Image container -->
			<div class="bg-black p-3 border-2 border-zinc-800 text-center shadow-[4px_4px_0px_#000]">
				{#if order.paymentProofUrl}
					<img
						src={order.paymentProofUrl}
						alt="Bukti Transfer Resolusi Penuh"
						class="max-h-[55vh] mx-auto object-contain"
					/>
				{/if}
			</div>

			<!-- Action inside Modal -->
			<div class="flex items-center justify-end gap-3 pt-3 border-t-2 border-zinc-800">
				<button
					type="button"
					onclick={onClose}
					class="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
				>
					Tutup
				</button>

				{#if order.status !== 'VERIFIED'}
					<form
						method="POST"
						action="/admin?/verify"
						use:enhance={() => {
							isSubmitting = true;
							return async ({ update }) => {
								isSubmitting = false;
								onClose();
								await update();
							};
						}}
					>
						<input type="hidden" name="orderId" value={order.id} />
						<button
							type="submit"
							disabled={isSubmitting}
							class="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider border border-red-500 shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
						>
							<CheckCircle2 class="w-4 h-4" />
							<span>{isSubmitting ? 'MEMPROSES...' : 'SETUJUI & KIRIM TIKET SEKARANG'}</span>
						</button>
					</form>
				{/if}
			</div>
		</div>
	</div>
{/if}
