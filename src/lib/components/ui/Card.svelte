<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
		class?: string;
		accent?: 'red' | 'white' | 'none';
	}

	let { children, class: className = '', accent = 'none' }: Props = $props();

	const accentStyles = {
		none: 'border-2 border-zinc-800 shadow-[4px_4px_0px_#000]',
		red: 'border-2 border-red-600 shadow-[4px_4px_0px_#dc2626]',
		white: 'border-2 border-zinc-100 shadow-[4px_4px_0px_#ffffff]'
	};
</script>

<div class="bg-zinc-900/90 rounded-none {accentStyles[accent]} {className}">
	{@render children?.()}
</div>
