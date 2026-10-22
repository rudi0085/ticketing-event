<script lang="ts">
	import type { BankInfo } from '#lib/types';
	import { Building2, Copy, Check, AlertCircle } from 'lucide-svelte';

	interface Props {
		bankInfo: BankInfo;
	}

	let { bankInfo }: Props = $props();

	let copiedAccount = $state(false);

	function copyAccount() {
		navigator.clipboard.writeText(bankInfo.accountNumber);
		copiedAccount = true;
		setTimeout(() => (copiedAccount = false), 2000);
	}
</script>

<div
	class="p-5 sm:p-6 bg-zinc-900 border-2 border-zinc-800 rounded-none shadow-[4px_4px_0px_#000] space-y-4 relative overflow-hidden"
>
	<!-- Top accent badge -->
	<div class="flex flex-wrap items-center justify-between gap-2 border-b-2 border-zinc-800 pb-3">
		<div class="flex items-center gap-2">
			<span class="p-1.5 bg-red-600 text-white font-mono text-xs font-black rotate-[-1deg]">
				WIRE // DIRECT
			</span>
			<span class="font-mono text-xs font-bold text-zinc-300 uppercase tracking-wider">
				Rekening Tujuan Transfer Manual
			</span>
		</div>
		<span class="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
			VERIFIKASI MANUAL 1x24 JAM
		</span>
	</div>

	<!-- Bank Details Grid -->
	<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm pt-1">
		<div class="p-3 bg-zinc-950 border border-zinc-800">
			<span class="font-mono text-[10px] text-zinc-500 uppercase block tracking-wider">Nama Bank</span>
			<span class="font-black text-white text-base tracking-wide">{bankInfo.bankName}</span>
		</div>

		<div class="p-3 bg-zinc-950 border border-zinc-800 sm:col-span-1">
			<span class="font-mono text-[10px] text-zinc-500 uppercase block tracking-wider">Nomor Rekening</span>
			<div class="flex items-center justify-between gap-2 font-mono font-black text-red-500 text-base sm:text-lg">
				<span class="tracking-wider">{bankInfo.accountNumber}</span>
				<button
					type="button"
					onclick={copyAccount}
					class="p-1.5 bg-zinc-800 hover:bg-red-600 text-zinc-200 hover:text-white transition border border-zinc-700 cursor-pointer"
					title="Salin nomor rekening"
				>
					{#if copiedAccount}
						<Check class="w-4 h-4 text-emerald-400" />
					{:else}
						<Copy class="w-4 h-4" />
					{/if}
				</button>
			</div>
		</div>

		<div class="p-3 bg-zinc-950 border border-zinc-800">
			<span class="font-mono text-[10px] text-zinc-500 uppercase block tracking-wider">Atas Nama Rekening</span>
			<span class="font-bold text-zinc-200 text-sm tracking-wide block truncate">{bankInfo.accountName}</span>
		</div>
	</div>

	<!-- Advisory Notice -->
	<div class="flex items-start gap-2.5 p-3 bg-zinc-950/70 border-l-4 border-red-600 text-[11px] text-zinc-400 font-mono">
		<AlertCircle class="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
		<span>
			Pastikan nominal transfer sesuai dengan total tagihan tiket hingga digit terakhir. Setelah transfer berhasil, ambil foto/screenshot struk bukti transfer dan unggah pada form di bawah.
		</span>
	</div>
</div>
