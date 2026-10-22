<script lang="ts">
	import type { PageProps } from './$types';
	import { enhance } from '$app/forms';
	import brandLogo from '#lib/assets/brand/logo.webp';
	import { Lock, Mail, ShieldAlert, ArrowLeft, KeyRound } from 'lucide-svelte';

	let { form }: PageProps = $props();

	let email = $state('admin@eventorganizer.com');
	let password = $state('adminpassword123');
	let isLoading = $state(false);
</script>

<svelte:head>
	<title>CREW ACCESS - Admin Login</title>
</svelte:head>

<div class="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
	<!-- Background grid overlay -->
	<div
		class="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"
	></div>

	<div class="w-full max-w-md space-y-6 relative z-10">
		<a
			href="/"
			class="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-zinc-400 hover:text-red-500 transition"
		>
			<ArrowLeft class="w-4 h-4" />
			<span>Kembali ke Beranda Acara</span>
		</a>

		<!-- Backstage Pass Box -->
		<div class="bg-zinc-900 border-2 border-zinc-800 p-8 shadow-[8px_8px_0px_#000] space-y-6">
			<div class="text-center space-y-3">
				<div class="inline-block relative">
					<img
						src={brandLogo}
						alt="Festival Logo"
						class="w-16 h-16 mx-auto object-contain bg-zinc-950 p-1 border-2 border-zinc-700 shadow-[3px_3px_0px_#dc2626]"
					/>
					<div class="absolute -bottom-2 -right-3 bg-red-600 text-white font-mono text-[9px] font-black uppercase px-1.5 py-0.5 rotate-[4deg]">
						STAFF ONLY
					</div>
				</div>

				<div>
					<h1 class="text-xl sm:text-2xl font-black font-mono tracking-tight text-white uppercase">
						PANITIA & CREW LOGIN
					</h1>
					<p class="font-mono text-xs text-zinc-400 mt-1">
						Portal verifikasi bukti transfer & pengelolaan tiket gig.
					</p>
				</div>
			</div>

			{#if form?.error}
				<div
					class="p-3 bg-red-950/80 border-2 border-red-700 text-red-200 font-mono text-xs flex items-center gap-2.5"
				>
					<ShieldAlert class="w-4 h-4 shrink-0 text-red-400" />
					<span>{form.error}</span>
				</div>
			{/if}

			<form
				method="POST"
				action="?/login"
				use:enhance={() => {
					isLoading = true;
					return async ({ update }) => {
						isLoading = false;
						await update();
					};
				}}
				class="space-y-4 font-mono text-sm"
			>
				<div>
					<label for="admin-email" class="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
						Email Panitia / Crew
					</label>
					<div class="relative">
						<Mail class="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
						<input
							id="admin-email"
							type="email"
							name="email"
							required
							bind:value={email}
							class="w-full pl-10 pr-3.5 py-2.5 bg-zinc-950 border-2 border-zinc-800 focus:border-red-600 focus:ring-0 text-white placeholder-zinc-600 outline-none transition rounded-none text-xs"
						/>
					</div>
				</div>

				<div>
					<label for="admin-pwd" class="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
						Password Kredensial
					</label>
					<div class="relative">
						<Lock class="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
						<input
							id="admin-pwd"
							type="password"
							name="password"
							required
							bind:value={password}
							class="w-full pl-10 pr-3.5 py-2.5 bg-zinc-950 border-2 border-zinc-800 focus:border-red-600 focus:ring-0 text-white placeholder-zinc-600 outline-none transition rounded-none text-xs"
						/>
					</div>
				</div>

				<button
					type="submit"
					disabled={isLoading}
					class="w-full py-3.5 font-mono font-black text-xs uppercase tracking-wider text-white bg-red-600 hover:bg-red-500 active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-50 transition border-2 border-red-500 shadow-[4px_4px_0px_#000] flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
				>
					{#if isLoading}
						<span class="animate-pulse">MEMVERIFIKASI AKSES CREW...</span>
					{:else}
						<KeyRound class="w-4 h-4" />
						<span>MASUK KE DASHBOARD CREW // ENTER</span>
					{/if}
				</button>
			</form>

			<div
				class="p-3 bg-zinc-950 border border-zinc-800 font-mono text-[11px] text-zinc-400 space-y-1"
			>
				<div class="font-bold text-zinc-300 uppercase tracking-wider">Default Kredensial Demo:</div>
				<div>Email: <code class="text-red-400">admin@eventorganizer.com</code></div>
				<div>Sandi: <code class="text-red-400">adminpassword123</code></div>
			</div>
		</div>
	</div>
</div>
