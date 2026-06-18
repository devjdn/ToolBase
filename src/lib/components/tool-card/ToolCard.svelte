<script lang="ts">
	import type { Tool } from '$lib/types';
	import type { EditToolSchema } from '$lib/zod-schemas';
	import type { SuperValidated } from 'sveltekit-superforms';
	import ToolDetailDialog from '../tool-detail-dialog/ToolDetailDialog.svelte';
	import { Button } from '../ui/button/index';
	import { ArrowUpRight } from '@lucide/svelte';

	let {
		tool,
		showCategory = false,
		data
	}: {
		tool: Tool;
		showCategory?: boolean;
		data: SuperValidated<EditToolSchema>;
	} = $props();
</script>

<ToolDetailDialog {tool} {data}>
	{#snippet trigger(props)}
		<div {...props} class="flex aspect-9/10 cursor-pointer flex-col justify-start gap-3 rounded-xl border bg-card p-3">
			<div class="tool-logo grid aspect-square flex-1 place-items-center">
				{#if tool.logoUrl}
					<div class="grid aspect-square h-24 place-items-center rounded-md border bg-white">
						<img src={tool.logoUrl} alt={tool.name} class="size-18 object-contain" />
					</div>
				{:else}
					<div class="size-18 rounded-lg bg-muted"></div>
				{/if}
			</div>
			<div class="flex flex-row items-end justify-between gap-3">
				<div class="min-w-0 flex-1">
					<p class="text-sm font-book">{tool.name}</p>
					{#if showCategory && tool.category}
						<p class="text-xs text-muted-foreground">{tool.category.name}</p>
					{:else if tool.description}
						<p class="max-w-full truncate text-xs text-muted-foreground">{tool.description}</p>
					{/if}
				</div>

				<Button href={tool.url} target="_blank" size="icon-sm" onclick={(e) => e.stopPropagation()}>
					<span class="sr-only">Open Tool URL</span>
					<ArrowUpRight />
				</Button>
			</div>
		</div>{/snippet}
</ToolDetailDialog>
