<script lang="ts">
	import type { PageProps } from './$types';
	import { enhance } from '$app/forms';
	import {
		QrCode,
		CheckCircle2,
		AlertTriangle,
		UserCheck,
		Search,
		ShieldCheck,
		Flame
	} from 'lucide-svelte';

	let { form }: PageProps = $props();

	let manualQrInput = $state('');
	let isSubmitting = $state(false);
</script>

<svelte:head>
	<title>GATE SCANNER - Admin Check-in</title>
</svelte:head>

<div class="max-w-2xl mx-auto space-y-6 font-mono">
	<!-- Header -->
	<div class="text-center space-y-2">
		<div class="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600 text-white font-black text-xs uppercase tracking-widest rotate-[-1deg] shadow-[2px_2px_0px_#000]">
			<Flame class="w-3.5 h-3.5" />
			<span>DAY OF GIG // GATE ENTRY</span>
		</div>
		<h1 class="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
			Pemindai Check-in Tiket Gerbang
		</h1>
		<p class="text-xs text-zinc-400">
			Pindai QR code tiket penonton atau tempel hash QR untuk memvalidasi akses masuk moshpit/venue.
		</p>
	</div>

	<!-- Check-in Result Notification -->
	{#if form?.success && form?.ticket}
		<div class="p-6 bg-zinc-950 border-4 border-emerald-500 text-emerald-100 shadow-[6px_6px_0px_#059669] space-y-4">
			<div class="flex items-center gap-3">
				<div class="p-2 bg-emerald-950 text-emerald-300 border-2 border-emerald-600">
					<UserCheck class="w-8 h-8" />
				</div>
				<div>
					<span class="text-xs font-black uppercase tracking-wider text-emerald-400 block">
						STATUS: VALID & DITERIMA // ADMITTED
					</span>
					<h3 class="text-xl sm:text-2xl font-black text-white uppercase">{form.ticket.customerName}</h3>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-3 text-xs p-3 bg-zinc-900 border border-zinc-800">
				<div>
					<span class="text-zinc-500 block font-bold text-[10px] uppercase">Kategori Tiket</span>
					<span class="text-sm font-black text-white">{form.ticket.tierName}</span>
				</div>
				<div>
					<span class="text-zinc-500 block font-bold text-[10px] uppercase">Kode Tiket</span>
					<span class="text-sm font-mono font-black text-red-500">{form.ticket.ticketCode}</span>
				</div>
			</div>

			<p class="text-xs text-emerald-300 font-bold text-center">
				{form.message}
			</p>
		</div>
	{:else if form?.error}
		<div class="p-6 bg-zinc-950 border-4 border-red-600 text-red-100 shadow-[6px_6px_0px_#dc2626] space-y-3">
			<div class="flex items-center gap-3">
				<div class="p-2 bg-red-950 text-red-300 border-2 border-red-600">
					<AlertTriangle class="w-8 h-8" />
				</div>
				<div>
					<span class="text-xs font-black uppercase tracking-wider text-red-400 block">
						PERINGATAN CHECK-IN // DITOLAK
					</span>
					<h3 class="text-lg font-black text-white uppercase">{form.error}</h3>
				</div>
			</div>

			{#if form && 'ticket' in form && form.ticket}
				<div class="text-xs p-3 bg-zinc-900 border border-zinc-800 space-y-1">
					<div>Penonton: <strong class="text-white">{form.ticket.customerName}</strong> ({form.ticket.tierName})</div>
					<div>Kode Tiket: <span class="font-mono text-red-400 font-bold">{form.ticket.ticketCode}</span></div>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Manual Input / Barcode Scanner Card -->
	<div class="bg-zinc-900 border-2 border-zinc-800 p-6 shadow-[6px_6px_0px_#000] space-y-5">
		<h2 class="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
			<Search class="w-4 h-4 text-red-500" />
			<span>Scan atau Masukkan Hash QR Tiket</span>
		</h2>

		<form
			method="POST"
			action="?/checkIn"
			use:enhance={() => {
				isSubmitting = true;
				return async ({ update }) => {
					isSubmitting = false;
					await update();
				};
			}}
			class="space-y-4"
		>
			<div>
				<label for="qr-hash" class="block font-bold text-xs uppercase tracking-wider text-zinc-400 mb-1.5">
					Hash QR Code / Scanner Input
				</label>
				<input
					id="qr-hash"
					type="text"
					name="qrHash"
					required
					bind:value={manualQrInput}
					placeholder="Arahkan scanner ke sini atau tempel hash QR..."
					class="w-full px-4 py-3 bg-zinc-950 border-2 border-zinc-800 focus:border-red-600 focus:ring-0 text-white font-mono text-sm placeholder-zinc-600 outline-none transition rounded-none"
				/>
				<span class="text-[11px] text-zinc-500 mt-1 block">
					Dukungan scanner USB / Bluetooth barcode scanner atau pemindai kamera browser.
				</span>
			</div>

			<button
				type="submit"
				disabled={isSubmitting || !manualQrInput}
				class="w-full py-3.5 font-mono font-black text-xs uppercase tracking-wider text-white bg-red-600 hover:bg-red-500 active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-50 transition border-2 border-red-500 shadow-[4px_4px_0px_#000] flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
			>
				<ShieldCheck class="w-4 h-4" />
				<span>{isSubmitting ? 'MEMVALIDASI...' : 'VALIDASI TIKET SEKARANG // CHECK-IN'}</span>
			</button>
		</form>
	</div>
</div>
