<script lang="ts">
	import type { Snippet } from 'svelte';
	import { X } from 'lucide-svelte';

	interface Props {
		isOpen: boolean;
		onClose: () => void;
		title?: string;
		maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
		children?: Snippet;
		footer?: Snippet;
	}

	let {
		isOpen,
		onClose,
		title,
		maxWidth = 'lg',
		children,
		footer
	}: Props = $props();

	const maxWidthClasses = {
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg',
		xl: 'max-w-xl',
		'2xl': 'max-w-2xl'
	};

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && isOpen) {
			onClose();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
	<div
		class="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
		role="dialog"
		aria-modal="true"
	>
		<div
			class="bg-zinc-950 border-2 border-red-600 w-full {maxWidthClasses[maxWidth]} p-6 sm:p-8 shadow-[8px_8px_0px_#000] space-y-6 relative my-8"
		>
			<!-- Close button -->
			<button
				type="button"
				onclick={onClose}
				class="absolute right-4 top-4 p-2 bg-zinc-900 border-2 border-zinc-700 hover:border-red-600 hover:bg-red-600 text-zinc-300 hover:text-white transition shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px]"
				aria-label="Tutup modal"
			>
				<X class="w-4 h-4" />
			</button>

			{#if title}
				<div class="pr-10 border-b-2 border-zinc-900 pb-3">
					<span class="text-[10px] font-mono uppercase tracking-widest text-red-500 block mb-0.5"
						>// DIALOG SISTEM</span
					>
					<h3 class="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">{title}</h3>
				</div>
			{/if}

			<div>
				{@render children?.()}
			</div>

			{#if footer}
				<div class="pt-4 border-t-2 border-zinc-900 flex items-center justify-end gap-3">
					{@render footer()}
				</div>
			{/if}
		</div>
	</div>
{/if}
