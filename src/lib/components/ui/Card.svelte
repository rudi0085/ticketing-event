<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
		class?: string;
		accent?: 'red' | 'white' | 'none';
	}

	let { children, class: className = '', accent = 'none' }: Props = $props();

	const accentStyles = {
		none: 'border border-zinc-800 shadow-lg shadow-black/40',
		red: 'border border-amber-500/50 shadow-lg shadow-amber-500/10',
		white: 'border border-zinc-700 shadow-lg shadow-black/40'
	};
</script>

<div class="bg-zinc-900/60 backdrop-blur-md rounded-2xl {accentStyles[accent]} {className}">
	{@render children?.()}
</div>
