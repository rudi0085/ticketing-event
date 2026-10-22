<script lang="ts">
	import type { Snippet } from 'svelte';

	type BadgeVariant = 'default' | 'success' | 'warning' | 'info' | 'danger' | 'crimson';

	interface Props {
		variant?: BadgeVariant;
		rotate?: boolean;
		children?: Snippet;
		class?: string;
	}

	let {
		variant = 'default',
		rotate = false,
		children,
		class: className = ''
	}: Props = $props();

	const variantStyles: Record<BadgeVariant, string> = {
		default: 'bg-zinc-800 text-zinc-300 border-zinc-700',
		success: 'bg-zinc-100 text-zinc-950 font-black border-white',
		warning: 'bg-amber-300 text-zinc-950 font-bold border-amber-400',
		info: 'bg-zinc-800 text-red-400 border-red-900',
		danger: 'bg-red-600 text-white font-bold border-red-500',
		crimson: 'bg-red-950 text-red-300 border-red-800'
	};
</script>

<span
	class="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-none text-[11px] font-mono uppercase tracking-wider border-2 shadow-[2px_2px_0px_#000] {rotate
		? 'rotate-[-2deg]'
		: ''} {variantStyles[variant]} {className}"
>
	{@render children?.()}
</span>
