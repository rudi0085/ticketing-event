<script lang="ts">
	import type { OrderStatus } from '#lib/types';
	import { CheckCircle2, Clock, AlertTriangle, ShieldCheck } from 'lucide-svelte';

	interface Props {
		status: OrderStatus;
		customerEmail?: string;
		rejectionReason?: string | null;
	}

	let { status, customerEmail = '', rejectionReason = null }: Props = $props();
</script>

{#if status === 'PENDING_PAYMENT'}
	<div
		class="p-5 bg-amber-400 text-zinc-950 border-4 border-black shadow-[6px_6px_0px_#000] flex items-start gap-4"
	>
		<Clock class="w-7 h-7 text-zinc-950 shrink-0 mt-0.5" />
		<div class="space-y-1">
			<span class="text-[10px] font-mono uppercase font-black tracking-widest block bg-black text-amber-400 px-2 py-0.5 w-fit">
				STATUS // MENUNGGU PEMBAYARAN
			</span>
			<h2 class="font-black text-lg uppercase tracking-tight text-zinc-950">
				TRANSFER MANUAL SEBELUM TIKET HANGUS
			</h2>
			<p class="text-xs sm:text-sm font-medium leading-relaxed text-zinc-900">
				Lakukan transfer bank sesuai nominal pas, lalu upload foto struk transfer di bawah ini agar panitia dapat memverifikasi tiketmu.
			</p>
		</div>
	</div>
{:else if status === 'AWAITING_VERIFICATION'}
	<div
		class="p-5 bg-zinc-900 text-zinc-100 border-4 border-zinc-200 shadow-[6px_6px_0px_#dc2626] flex items-start gap-4"
	>
		<Clock class="w-7 h-7 text-red-500 shrink-0 mt-0.5 animate-spin" />
		<div class="space-y-1">
			<span class="text-[10px] font-mono uppercase font-black tracking-widest block bg-red-600 text-white px-2 py-0.5 w-fit">
				STATUS // DALAM ANTRIAN VERIFIKASI
			</span>
			<h2 class="font-black text-lg uppercase tracking-tight text-white">
				BUKTI DITERIMA — SEDANG DICEK PANITIA
			</h2>
			<p class="text-xs sm:text-sm font-sans text-zinc-300 leading-relaxed">
				Struk transfer Anda telah masuk. Panitia sedang mencocokkan mutasi bank. Begitu diverifikasi, E-Ticket resmi akan otomatis dikirim ke <strong>{customerEmail}</strong>.
			</p>
		</div>
	</div>
{:else if status === 'VERIFIED'}
	<div
		class="p-5 bg-zinc-100 text-zinc-950 border-4 border-black shadow-[6px_6px_0px_#dc2626] flex items-start gap-4"
	>
		<ShieldCheck class="w-7 h-7 text-red-600 shrink-0 mt-0.5" />
		<div class="space-y-1">
			<span class="text-[10px] font-mono uppercase font-black tracking-widest block bg-red-600 text-white px-2 py-0.5 w-fit">
				STATUS // LUNAS & TERBIT
			</span>
			<h2 class="font-black text-lg uppercase tracking-tight text-zinc-950">
				PEMBAYARAN RESMI DITERIMA! SELAMAT BERGABUNG DI MOSHPIT
			</h2>
			<p class="text-xs sm:text-sm font-sans text-zinc-800 leading-relaxed">
				Tiket resmi Anda telah terbit dan dikirimkan ke <strong>{customerEmail}</strong>. QR Code siap dipindai di pintu masuk venue.
			</p>
		</div>
	</div>
{:else if status === 'REJECTED'}
	<div
		class="p-5 bg-red-600 text-white border-4 border-black shadow-[6px_6px_0px_#000] flex items-start gap-4"
	>
		<AlertTriangle class="w-7 h-7 text-white shrink-0 mt-0.5" />
		<div class="space-y-1">
			<span class="text-[10px] font-mono uppercase font-black tracking-widest block bg-black text-red-500 px-2 py-0.5 w-fit">
				STATUS // PEMBAYARAN DITOLAK
			</span>
			<h2 class="font-black text-lg uppercase tracking-tight text-white">
				BUKTI TRANSFER TIDAK VALID
			</h2>
			<p class="text-xs sm:text-sm font-sans leading-relaxed text-red-100">
				Catatan Panitia: <em>"{rejectionReason || 'Nominal atau struk tidak sesuai mutasi.'}"</em>. Harap periksa dan unggah ulang bukti yang benar.
			</p>
		</div>
	</div>
{/if}
