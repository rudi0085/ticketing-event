<script lang="ts">
	import { enhance } from '$app/forms';
	import { UploadCloud, FileImage, ShieldCheck, RefreshCw } from 'lucide-svelte';

	interface Props {
		errorMessage?: string;
	}

	let { errorMessage }: Props = $props();

	let previewImage = $state<string | null>(null);
	let isUploading = $state(false);

	function handleFileSelect(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				previewImage = reader.result as string;
			};
			reader.readAsDataURL(file);
		}
	}
</script>

<form
	method="POST"
	action="?/uploadProof"
	enctype="multipart/form-data"
	use:enhance={() => {
		isUploading = true;
		return async ({ update }) => {
			isUploading = false;
			await update();
		};
	}}
	class="border-t-2 border-zinc-800 pt-6 space-y-4"
>
	<div class="flex items-center justify-between">
		<h3 class="font-mono text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
			<FileImage class="w-4 h-4 text-red-500" />
			<span>Unggah Bukti Transfer Bank</span>
		</h3>
		<span class="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
			FORMAT: JPG, PNG, WEBP (MAX 5MB)
		</span>
	</div>

	{#if errorMessage}
		<div class="p-3 bg-red-950/80 border-2 border-red-700 text-red-200 font-mono text-xs flex items-center gap-2">
			<span class="font-bold">[GAGAL]:</span>
			<span>{errorMessage}</span>
		</div>
	{/if}

	<!-- Brutalist Upload Dropzone -->
	<div
		class="border-2 border-dashed border-zinc-700 hover:border-red-500 bg-zinc-950 p-6 sm:p-8 text-center cursor-pointer transition relative group shadow-[4px_4px_0px_#000]"
	>
		<input
			type="file"
			name="proofFile"
			accept="image/png, image/jpeg, image/jpg, image/webp"
			required
			onchange={handleFileSelect}
			class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
		/>

		{#if previewImage}
			<div class="space-y-4">
				<div class="relative inline-block border-2 border-zinc-700 bg-zinc-900 p-2 shadow-[4px_4px_0px_#000]">
					<img
						src={previewImage}
						alt="Preview Bukti Transfer"
						class="max-h-64 mx-auto object-contain"
					/>
					<div class="absolute -top-3 -right-3 bg-red-600 text-white font-mono text-[10px] font-black px-2 py-0.5 rotate-[3deg] shadow">
						SIAP KIRIM
					</div>
				</div>
				<div class="font-mono text-xs text-red-400 font-bold uppercase tracking-wider flex items-center justify-center gap-1.5">
					<RefreshCw class="w-3.5 h-3.5" />
					<span>Klik atau seret file lain untuk mengganti gambar</span>
				</div>
			</div>
		{:else}
			<div class="space-y-3 py-4">
				<div class="w-14 h-14 mx-auto bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center text-zinc-400 group-hover:text-red-500 group-hover:border-red-500 transition shadow-[2px_2px_0px_#000]">
					<UploadCloud class="w-7 h-7" />
				</div>
				<div>
					<div class="font-mono text-sm font-black text-zinc-100 uppercase tracking-wider">
						Pilih Foto Bukti Transfer / Drop File ke Sini
					</div>
					<div class="font-mono text-xs text-zinc-500 mt-1">
						Struk ATM, Screenshot M-Banking, atau Notifikasi Transfer
					</div>
				</div>
				<div class="inline-block px-3 py-1 bg-zinc-900 border border-zinc-800 font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
					DRAG & DROP IMAGE FILE
				</div>
			</div>
		{/if}
	</div>

	<!-- Submit Button -->
	<button
		type="submit"
		disabled={isUploading}
		class="w-full py-3.5 px-6 font-mono font-black text-sm uppercase tracking-wider text-white bg-red-600 hover:bg-red-500 active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-50 transition border-2 border-red-500 shadow-[4px_4px_0px_#000] flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
	>
		{#if isUploading}
			<span class="animate-pulse">Mengirim Bukti Transfer ke Crew Admin...</span>
		{:else}
			<ShieldCheck class="w-4 h-4" />
			<span>Kirim Bukti Pembayaran Sekarang // SUBMIT</span>
		{/if}
	</button>
</form>
