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
		default: 'bg-zinc-800/80 text-zinc-300 border-zinc-700/80',
		success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
		warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
		info: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
		danger: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
		crimson: 'bg-orange-500/10 text-orange-400 border-orange-500/30'
	};
</script>

<span
	class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium tracking-wide border {rotate
		? 'rotate-[-1deg]'
		: ''} {variantStyles[variant]} {className}"
>
	{@render children?.()}
</span>
