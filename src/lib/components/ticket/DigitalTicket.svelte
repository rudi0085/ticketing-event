<script lang="ts">
	import type { TicketDetail } from '#lib/types';
	import brandLogo from '#lib/assets/brand/logo.webp';
	import { Calendar, MapPin, Printer, CheckCircle2, AlertTriangle, ShieldCheck, Flame } from 'lucide-svelte';

	interface Props {
		ticket: TicketDetail;
		qrDataUrl: string;
	}

	let { ticket, qrDataUrl }: Props = $props();

	function formatDate(isoString?: string) {
		if (!isoString) return '-';
		return new Intl.DateTimeFormat('id-ID', {
			dateStyle: 'full',
			timeStyle: 'short'
		}).format(new Date(isoString));
	}

	function handlePrint() {
		window.print();
	}
</script>

<div class="space-y-6">
	<!-- Action bar (hidden in print) -->
	<div class="flex items-center justify-between print:hidden">
		<div class="flex items-center gap-2">
			<span class="p-1 bg-red-600 text-white font-mono text-[10px] font-black uppercase rotate-[-2deg]">
				PASS #01
			</span>
			<span class="font-mono text-xs text-zinc-400 uppercase tracking-widest">
				TIKET RESMI MASUK VENUE
			</span>
		</div>

		<button
			type="button"
			onclick={handlePrint}
			class="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 font-mono text-xs font-bold uppercase tracking-wider border-2 border-zinc-700 shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] transition cursor-pointer"
		>
			<Printer class="w-3.5 h-3.5 text-red-500" />
			<span>Cetak / Simpan PDF</span>
		</button>
	</div>

	<!-- Physical-style Punk Concert Stub Card -->
	<div
		class="bg-zinc-900 border-2 border-zinc-700 overflow-hidden shadow-[8px_8px_0px_#000] print:border-2 print:border-black print:shadow-none relative"
	>
		<!-- Ticket Stub Header with Brand Logo -->
		<div class="bg-black border-b-2 border-zinc-800 p-6 relative overflow-hidden">
			<!-- Subtle red glow background -->
			<div class="absolute -top-12 -right-12 w-40 h-40 bg-red-600/20 blur-3xl rounded-full pointer-events-none"></div>

			<div class="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
				<div class="flex items-center gap-3">
					<img
						src={brandLogo}
						alt="Event Logo"
						class="w-12 h-12 object-contain bg-zinc-950 p-1 border-2 border-zinc-700 shadow-[2px_2px_0px_#dc2626]"
					/>
					<div>
						<div class="inline-flex items-center gap-1.5 px-2 py-0.5 bg-red-600 text-white font-mono text-[9px] font-black uppercase tracking-widest rotate-[-1deg]">
							<Flame class="w-3 h-3" />
							<span>OFFICIAL MOSHPIT PASS</span>
						</div>
						<h1 class="text-xl sm:text-2xl font-black font-mono tracking-tight text-white uppercase mt-1">
							{ticket.eventTitle}
						</h1>
					</div>
				</div>

				<!-- Ticket Status Badge -->
				<div class="shrink-0">
					{#if ticket.status === 'ACTIVE'}
						<div class="px-3 py-1 bg-emerald-950 border-2 border-emerald-600 text-emerald-300 font-mono text-xs font-black uppercase tracking-widest rotate-[1deg] shadow-[2px_2px_0px_#000] flex items-center gap-1.5">
							<CheckCircle2 class="w-3.5 h-3.5 text-emerald-400" />
							<span>VALID // ACTIVE</span>
						</div>
					{:else if ticket.status === 'CHECKED_IN'}
						<div class="px-3 py-1 bg-zinc-950 border-2 border-zinc-600 text-zinc-400 font-mono text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
							<CheckCircle2 class="w-3.5 h-3.5" />
							<span>SUDAH CHECK-IN</span>
						</div>
					{:else}
						<div class="px-3 py-1 bg-red-950 border-2 border-red-600 text-red-300 font-mono text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
							<AlertTriangle class="w-3.5 h-3.5" />
							<span>VOID // BATAL</span>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- Perforated Tear Notch Line -->
		<div class="relative bg-zinc-900 h-8 flex items-center justify-between">
			<!-- Left Cutout Notch -->
			<div
				class="w-6 h-8 bg-zinc-950 border-r-2 border-t-2 border-b-2 border-zinc-700 rounded-r-full -ml-[2px] print:bg-white print:border-black"
			></div>
			<!-- Dashed Tear Line -->
			<div class="flex-grow border-b-2 border-dashed border-zinc-700 mx-3"></div>
			<!-- Right Cutout Notch -->
			<div
				class="w-6 h-8 bg-zinc-950 border-l-2 border-t-2 border-b-2 border-zinc-700 rounded-l-full -mr-[2px] print:bg-white print:border-black"
			></div>
		</div>

		<!-- Ticket Body -->
		<div class="p-6 sm:p-8 space-y-6">
			<!-- Tier & Admit Row -->
			<div class="flex flex-wrap items-center justify-between gap-4 p-4 bg-zinc-950 border-2 border-zinc-800 shadow-[3px_3px_0px_#000]">
				<div>
					<span class="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">
						KATEGORI TIKET
					</span>
					<span class="font-mono text-xl sm:text-2xl font-black text-red-500 uppercase tracking-wider block">
						{ticket.tierName}
					</span>
				</div>

				<div class="text-right">
					<span class="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">
						AKSES GERBANG
					</span>
					<span class="font-mono text-sm font-black text-white uppercase tracking-widest block">
						ADMIT ONE // FESTIVAL
					</span>
				</div>
			</div>

			<!-- Attendee Info Grid -->
			<div
				class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-zinc-950 border border-zinc-800 font-mono text-xs"
			>
				<div>
					<span class="text-[10px] text-zinc-500 uppercase tracking-wider block">NAMA PEMEGANG TIKET</span>
					<span class="font-black text-white text-sm block mt-0.5">{ticket.customerName || '-'}</span>
				</div>
				<div>
					<span class="text-[10px] text-zinc-500 uppercase tracking-wider block">EMAIL PEMESAN</span>
					<span class="font-bold text-zinc-300 text-sm block mt-0.5 truncate">{ticket.customerEmail || '-'}</span>
				</div>
			</div>

			<!-- Event Metadata -->
			<div class="space-y-3 font-mono text-xs">
				<div class="flex items-start gap-3 p-3 bg-zinc-950/60 border border-zinc-800">
					<Calendar class="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
					<div>
						<span class="text-[10px] text-zinc-500 uppercase tracking-wider block">WAKTU & TANGGAL GIG</span>
						<span class="font-bold text-zinc-200 block">{formatDate(ticket.eventDate)}</span>
					</div>
				</div>

				<div class="flex items-start gap-3 p-3 bg-zinc-950/60 border border-zinc-800">
					<MapPin class="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
					<div>
						<span class="text-[10px] text-zinc-500 uppercase tracking-wider block">VENUE & LOKASI</span>
						<span class="font-bold text-zinc-200 block">{ticket.venueName || '-'}</span>
					</div>
				</div>
			</div>

			<!-- QR Code Centerpiece Section -->
			<div class="text-center pt-4 border-t-2 border-zinc-800 print:border-black space-y-4">
				<div class="inline-block p-4 bg-white border-4 border-black shadow-[6px_6px_0px_#dc2626]">
					<img
						src={qrDataUrl}
						alt="QR Code Tiket"
						class="w-56 h-56 mx-auto block object-contain"
					/>
				</div>

				<div class="space-y-1">
					<span class="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">
						KODE IDENTIFIKASI TIKET
					</span>
					<div class="font-mono text-2xl font-black text-red-500 tracking-widest">
						{ticket.ticketCode}
					</div>
				</div>

				<div class="max-w-md mx-auto p-3 bg-zinc-950 border border-zinc-800 font-mono text-[11px] text-zinc-400">
					Tunjukkan QR code ini di gerbang masuk venue kepada gate crew. Satu QR code hanya berlaku untuk 1 kali check-in. Jangan bagikan kode ini kepada orang lain.
				</div>
			</div>
		</div>
	</div>
</div>
