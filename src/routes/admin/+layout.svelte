<script lang="ts">
	import type { LayoutProps } from './$types';
	import { page } from '$app/state';
	import brandLogo from '#lib/assets/brand/logo.webp';
	import {
		ClipboardList,
		QrCode,
		ExternalLink,
		LogOut,
		ShieldCheck,
		Flame
	} from 'lucide-svelte';

	let { data, children }: LayoutProps = $props();
</script>

<svelte:head>
	<title>CREW HQ - Festival Admin</title>
</svelte:head>

{#if !data.isAuthenticated}
	{@render children()}
{:else}
	<div class="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-mono">
		<!-- Admin Navbar -->
		<header class="border-b-2 border-zinc-800 bg-zinc-900 sticky top-0 z-40">
			<div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
				<!-- Logo & Title -->
				<div class="flex items-center gap-6">
					<a href="/admin" class="flex items-center gap-3 text-white hover:text-red-500 transition group">
						<img
							src={brandLogo}
							alt="Brand Logo"
							class="w-9 h-9 object-contain bg-zinc-950 p-1 border border-zinc-700 shadow-[2px_2px_0px_#dc2626]"
						/>
						<div>
							<div class="flex items-center gap-1.5">
								<span class="font-black text-sm tracking-tight text-white uppercase">
									CREW HQ
								</span>
								<span class="text-[9px] bg-red-600 text-white font-bold px-1 py-0.2 rotate-[-2deg]">
									STAFF
								</span>
							</div>
							<span class="text-[10px] text-zinc-500 tracking-widest block -mt-0.5">
								DISTORTION CONTROL
							</span>
						</div>
					</a>

					<!-- Nav Links (Desktop) -->
					<nav class="hidden md:flex items-center gap-2 text-xs font-bold">
						<a
							href="/admin"
							class="px-3.5 py-2 transition flex items-center gap-2 border-2 {page.url.pathname === '/admin' ? 'bg-red-600 text-white border-red-500 shadow-[2px_2px_0px_#000]' : 'text-zinc-400 hover:text-white bg-zinc-950 border-zinc-800'}"
						>
							<ClipboardList class="w-4 h-4" />
							<span>PESANAN & VERIFIKASI</span>
						</a>

						<a
							href="/admin/check-in"
							class="px-3.5 py-2 transition flex items-center gap-2 border-2 {page.url.pathname === '/admin/check-in' ? 'bg-red-600 text-white border-red-500 shadow-[2px_2px_0px_#000]' : 'text-zinc-400 hover:text-white bg-zinc-950 border-zinc-800'}"
						>
							<QrCode class="w-4 h-4" />
							<span>SCANNER GATE CHECK-IN</span>
						</a>
					</nav>
				</div>

				<!-- Right Actions -->
				<div class="flex items-center gap-3">
					<a
						href="/"
						target="_blank"
						class="text-xs font-bold px-3 py-1.5 border-2 border-zinc-800 bg-zinc-950 hover:border-zinc-600 text-zinc-300 hover:text-white transition hidden sm:flex items-center gap-1.5"
					>
						<span>Buka Web Acara</span>
						<ExternalLink class="w-3.5 h-3.5 text-red-500" />
					</a>

					<form method="POST" action="/admin/logout">
						<button
							type="submit"
							class="text-xs font-bold px-3 py-1.5 border-2 border-zinc-800 bg-zinc-950 hover:bg-red-950 hover:border-red-700 hover:text-red-300 text-zinc-300 transition flex items-center gap-1.5 cursor-pointer"
							title="Keluar dari sesi admin"
						>
							<LogOut class="w-3.5 h-3.5" />
							<span class="hidden sm:inline">LOGOUT</span>
						</button>
					</form>
				</div>
			</div>
		</header>

		<!-- Subnav for Mobile -->
		<div class="md:hidden flex border-b-2 border-zinc-800 bg-zinc-900 px-4 py-2 gap-2 text-xs font-bold overflow-x-auto">
			<a
				href="/admin"
				class="px-3 py-1.5 border {page.url.pathname === '/admin' ? 'bg-red-600 text-white border-red-500' : 'text-zinc-400 bg-zinc-950 border-zinc-800'}"
			>
				Pesanan & Verifikasi
			</a>
			<a
				href="/admin/check-in"
				class="px-3 py-1.5 border {page.url.pathname === '/admin/check-in' ? 'bg-red-600 text-white border-red-500' : 'text-zinc-400 bg-zinc-950 border-zinc-800'}"
			>
				Scanner Check-in
			</a>
		</div>

		<!-- Main Admin Content Area -->
		<main class="flex-grow max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 font-sans">
			{@render children()}
		</main>
	</div>
{/if}
