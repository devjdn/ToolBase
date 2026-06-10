<script lang="ts">
	import ToolCard from '$lib/components/tool-card/ToolCard.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	// console.log(data.tools);
</script>

<svelte:head>
	<title>ToolBase</title>
</svelte:head>

<div class="@container mx-auto flex w-full max-w-7xl flex-1 flex-col space-y-6">
	<section class="category-header">
		<h1 class="text-[clamp(1.5rem,1.1rem+2vw,2rem)] font-medium tracking-tight">Home</h1>
	</section>

	{#if data.tools.length === 0}
		<div class="flex flex-1 flex-col items-center justify-center gap-1 leading-tight">
			<p class="text-sm font-medium">No tools yet</p>
			<p class="text-xs text-muted-foreground">Add the first tool to ToolBase</p>
		</div>
	{:else}
		<section class="tools-section flex-1">
			<ul class="grid grid-cols-2 gap-3 @xl:grid-cols-3 @3xl:grid-cols-4 @5xl:grid-cols-5">
				{#each data.tools as tool (tool.id)}
					<li>
						<ToolCard {tool} showCategory />
					</li>
				{/each}
			</ul>
		</section>
	{/if}
</div>
