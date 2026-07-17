<script lang="ts">
	import type { Tool } from '$lib/types';
	import { Button } from '../ui/button/index';
	import { ArrowUpRight } from '@lucide/svelte';
	import { categoryIcons, defaultIcon } from '$lib/categoryIcons';
	import { selectedTool } from '$lib/stores/global-tool-dialog';
	import * as Tooltip from '$lib/components/ui/tooltip/index';

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
	class="group @container flex aspect-9/11 shrink-0 cursor-pointer flex-col justify-start gap-3 rounded-2xl bg-card p-3 transition-all hover:bg-accent"
>
	<div class="tool-logo flex flex-1 items-center justify-center select-none">
		{#if tool.logoUrl}
			<div class="grid aspect-square size-18 place-items-center rounded-xl @[200px]:size-24 dark:bg-white">
				<img src={tool.logoUrl} alt={tool.name} class="size-12 object-contain @[200px]:size-18" />
			</div>
		{:else}
			{@const Icon = tool.category ? (categoryIcons[tool.category.slug] ?? defaultIcon) : defaultIcon}
			<div class="grid size-24 place-items-center rounded-lg">
				<Icon class="size-18 text-muted-foreground" />
			</div>
		{/if}
	</div>
	<div class="flex h-10 flex-row items-end justify-between gap-3">
		<div class="min-w-0 flex-1 select-none">
			<p class="text-sm font-medium @[200px]:text-base">{tool.name}</p>
			{#if showCategory && tool.category}
				<p class="text-xs text-muted-foreground">{tool.category.name}</p>
			{/if}
		</div>

		<Tooltip.Root>
			<Tooltip.Trigger>
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
			</Tooltip.Trigger>
			<Tooltip.Content>
				<span>Visit Tool URL</span>
			</Tooltip.Content>
		</Tooltip.Root>
	</div>
</div>
