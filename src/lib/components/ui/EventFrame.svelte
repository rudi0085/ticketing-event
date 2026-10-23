<script lang="ts">
	import frame from '#lib/assets/brand/frame.webp';
</script>

<!--
	Satu bingkai utuh (kiri + bawah + kanan tersambung) yang menempel di tepi viewport.
	Dilengkapi layer efek gelap di atas ornamen agar teks konten & footer tetap terbaca jelas.
-->
<div class="fixed inset-x-0 bottom-0 z-0 pointer-events-none select-none" aria-hidden="true">
	<div class="relative w-full">
		<img
			src={frame}
			alt=""
			class="block w-full h-[38vh] md:h-auto md:max-h-[72vh] object-cover md:object-fill object-bottom brightness-75 contrast-105"
		/>
		<!-- Efek gelap di atas gambar ornamen bawah agar tulisan di footer terlihat kontras & jelas -->
		<div
			class="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-zinc-950/50 to-transparent"
		></div>
		<div
			class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/75 via-black/40 to-transparent"
		></div>
	</div>
</div>
