<script lang="ts">
	import { enhance } from '$app/forms';
	import { AlertTriangle, X } from 'lucide-svelte';

	interface Props {
		orderId: string | null;
		onClose: () => void;
	}

	let { orderId, onClose }: Props = $props();

	let rejectionReason = $state('Bukti transfer tidak sesuai dengan mutasi rekening bank.');
	let isSubmitting = $state(false);
</script>

{#if orderId}
	<div
		class="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 font-mono"
	>
		<div
			class="bg-zinc-900 border-2 border-red-600 max-w-md w-full p-6 shadow-[8px_8px_0px_#000] space-y-5 relative"
		>
			<button
				type="button"
				onclick={onClose}
				class="absolute right-5 top-5 p-1.5 bg-zinc-800 hover:bg-red-600 border border-zinc-700 text-zinc-300 hover:text-white transition cursor-pointer"
				aria-label="Tutup modal"
			>
				<X class="w-5 h-5" />
			</button>

			<div class="space-y-1">
				<div class="inline-flex items-center gap-1.5 px-2 py-0.5 bg-red-600 text-white font-mono text-[10px] font-black uppercase rotate-[-1deg]">
					<AlertTriangle class="w-3 h-3" />
					<span>REJECT ORDER</span>
				</div>
				<h3 class="text-lg font-black text-white uppercase tracking-tight">
					Tolak Bukti Pembayaran
				</h3>
				<p class="text-xs text-zinc-400">
					Tuliskan alasan penolakan agar pembeli dapat memperbaikinya di invoice web mereka.
				</p>
			</div>

			<form
				method="POST"
				action="/admin?/reject"
				use:enhance={() => {
					isSubmitting = true;
					return async ({ update }) => {
						isSubmitting = false;
						onClose();
						await update();
					};
				}}
				class="space-y-4"
			>
				<input type="hidden" name="orderId" value={orderId} />

				<div>
					<label for="reason" class="block font-bold text-xs uppercase tracking-wider text-zinc-300 mb-1.5">
						Alasan Penolakan
					</label>
					<textarea
						id="reason"
						name="reason"
						rows="3"
						required
						bind:value={rejectionReason}
						class="w-full p-3 bg-zinc-950 border-2 border-zinc-800 focus:border-red-600 focus:ring-0 text-white text-xs outline-none transition rounded-none font-mono"
					></textarea>
				</div>

				<div class="flex items-center justify-end gap-2 pt-2 border-t-2 border-zinc-800">
					<button
						type="button"
						onclick={onClose}
						class="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
					>
						Batal
					</button>

					<button
						type="submit"
						disabled={isSubmitting}
						class="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider border border-red-500 shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] transition cursor-pointer disabled:opacity-50"
					>
						{isSubmitting ? 'MEMPROSES...' : 'TOLAK PESANAN // CONFIRM'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
