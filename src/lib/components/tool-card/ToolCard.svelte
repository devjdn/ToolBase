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
		<div
			{...props}
			class="group flex aspect-9/10 cursor-pointer flex-col justify-start gap-3 rounded-xl bg-card p-3 transition-all hover:bg-accent"
		>
			<div class="tool-logo grid aspect-square flex-1 place-items-center">
				{#if tool.logoUrl}
					<div class="grid aspect-square h-24 place-items-center rounded-md dark:bg-white">
						<img src={tool.logoUrl} alt={tool.name} class="size-18 object-contain" />
					</div>
				{:else}
					<div class="size-18 rounded-lg bg-muted"></div>
				{/if}
			</div>
			<div class="flex flex-row items-end justify-between gap-3">
				<div class="min-w-0 flex-1">
					<p class="font-medium">{tool.name}</p>
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
		</div>{/snippet}
</ToolDetailDialog>
