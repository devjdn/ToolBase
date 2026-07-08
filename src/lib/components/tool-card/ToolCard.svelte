<script lang="ts">
	import type { Tool } from '$lib/types';
	import { Button } from '../ui/button/index';
	import { ArrowUpRight } from '@lucide/svelte';
	import { categoryIcons, defaultIcon } from '$lib/categoryIcons';
	import { selectedTool } from '$lib/stores/global-tool-dialog';

	let {
		tool,
		showCategory = false
	}: {
		tool: Tool;
		showCategory?: boolean;
	} = $props();
</script>

<div
	role="button"
	tabindex="0"
	onclick={() => selectedTool.set(tool)}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			selectedTool.set(tool);
		}
	}}
	class="group flex shrink-0 aspect-9/11 cursor-pointer flex-col justify-start gap-3 rounded-2xl bg-card p-3 transition-all hover:bg-accent"
>
	<div class="tool-logo flex justify-center items-center flex-1">
		{#if tool.logoUrl}
			<div class="grid aspect-square size-18 place-items-center rounded-xl md:size-24 dark:bg-white">
				<img src={tool.logoUrl} alt={tool.name} class="size-12 object-contain md:size-18" />
			</div>
		{:else}
			{@const Icon = tool.category ? (categoryIcons[tool.category.slug] ?? defaultIcon) : defaultIcon}
			<div class="grid size-24 place-items-center rounded-lg">
				<Icon class="size-18 text-muted-foreground" />
			</div>
		{/if}
	</div>
	<div class="flex flex-row items-end justify-between gap-3 h-10">
		<div class="min-w-0 flex-1">
			<p class="text-sm font-medium md:text-base">{tool.name}</p>
			{#if showCategory && tool.category}
				<p class="text-xs text-muted-foreground">{tool.category.name}</p>
			{/if}
		</div>

		<Button
			href={tool.url}
			variant="secondary-raised"
			target="_blank"
			size="icon-sm"
			onclick={(e) => e.stopPropagation()}
		>
			<span class="sr-only">Open Tool URL</span>
			<ArrowUpRight />
		</Button>
	</div>
</div>
