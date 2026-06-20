<script lang="ts">
	import ToolCard from '$lib/components/tool-card/ToolCard.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>{data.category.name} | ToolBase</title>
	<meta name="description" content="A collection of tools for {data.category.name}" />
</svelte:head>

<div class="@container mx-auto flex w-full max-w-7xl flex-1 flex-col space-y-6">
	<section class="category-header">
		<h1 class="text-[clamp(1.5rem,1.1rem+2vw,2rem)] font-semibold tracking-tight">{data.category.name}</h1>
	</section>

	{#if data.tools.length === 0}
		<div class="flex flex-1 flex-col items-center justify-center gap-1 leading-tight">
			<p class="text-sm font-medium">No tools yet</p>
			<p class="text-xs text-muted-foreground">Add the first tool to {data.category.name}</p>
		</div>
	{:else}
		<section class="tools-section flex-1">
			<ul class="grid grid-cols-2 gap-3 @xl:grid-cols-3 @3xl:grid-cols-4 @5xl:grid-cols-5">
				{#each data.tools as tool (tool.id)}
					<li>
						<ToolCard {tool} data={data.editForm} />
					</li>
				{/each}
			</ul>
		</section>
	{/if}
</div>
