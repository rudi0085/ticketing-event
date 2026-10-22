<script lang="ts">
	import type { PageProps } from './$types';
	import { ArrowLeft } from 'lucide-svelte';
	import { DigitalTicket } from '#lib/components';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>PASS: {data.ticket.ticketCode} - {data.ticket.eventTitle}</title>
</svelte:head>

<div
	class="min-h-screen bg-zinc-950 text-zinc-100 py-10 px-4 print:p-0 print:bg-white print:text-black"
>
	<div class="max-w-xl mx-auto space-y-6">
		<!-- Top Action Bar (hidden in print) -->
		<div class="flex items-center justify-between print:hidden">
			<a
				href="/"
				class="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-zinc-400 hover:text-red-500 transition"
			>
				<ArrowLeft class="w-4 h-4" />
				<span>Beranda Gig // Distro</span>
			</a>
		</div>

		<!-- Modular Digital Ticket Component -->
		<DigitalTicket ticket={data.ticket} qrDataUrl={data.qrDataUrl} />
	</div>
</div>
