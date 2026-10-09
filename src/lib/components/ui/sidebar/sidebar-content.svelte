<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '#lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLElement>> = $props();
</script>

<div
	bind:this={ref}
	data-slot="sidebar-content"
	data-sidebar="content"
	class={cn(
		'flex flex-col gap-1.5 [--radius:var(--radius-xl)] group-data-[collapsible=icon]:overflow-hidden md:flex-1 md:overflow-auto',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
