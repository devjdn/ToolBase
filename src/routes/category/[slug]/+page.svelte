<script lang="ts">
	import ToolCard from '#lib/components/tool-card/ToolCard.svelte';
	import ToolCardSkeleton from '#lib/components/tool-card/ToolCardSkeleton.svelte';
	import PaginationBar from '#lib/components/pagination/PaginationBar.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>{data.category.name} | ToolBase</title>
	<meta name="description" content="A collection of tools for {data.category.name}" />
</svelte:head>

<div class="@container mx-auto flex w-full max-w-7xl flex-1 flex-col space-y-6">
	<section class="category-header">
		<h1 class="text-[clamp(1.8rem,1.1rem+2vw,2rem)] font-semibold tracking-tight">{data.category.name}</h1>
	</section>

	{#await data.tools}
		<section class="tools-section flex-1">
			<ul class="grid grid-cols-2 gap-x-4 gap-y-6 @3xl:grid-cols-3 @5xl:grid-cols-5">
				{#each { length: 8 } as _, i (i)}
					<li>
						<ToolCardSkeleton />
					</li>
				{/each}
			</ul>
		</section>
	{:then tools}
		{#if tools.length === 0}
			<div class="flex flex-1 flex-col items-center justify-center gap-1 leading-tight">
				<p class="text-sm font-medium">No tools yet</p>
				<p class="text-xs text-muted-foreground">Add the first tool to {data.category.name}</p>
			</div>
		{:else}
			<section class="tools-section flex-1">
				<ul class="grid grid-cols-2 gap-x-4 gap-y-6 @3xl:grid-cols-3 @4xl:grid-cols-4 @6xl:grid-cols-5">
					{#each tools as tool (tool.id)}
						<li>
							<ToolCard {tool} />
						</li>
					{/each}
				</ul>
			</section>

			{#await data.pagination then pagination}
				<PaginationBar
					currentPage={pagination.page}
					totalPages={pagination.totalPages}
					pageSize={pagination.pageSize}
				/>
			{/await}
		{/if}
	{:catch}
		<div class="flex flex-1 flex-col items-center justify-center gap-1 leading-tight">
			<p class="text-sm font-medium">Something went wrong</p>
			<p class="text-xs text-muted-foreground">Failed to load tools</p>
		</div>
	{/await}
</div>
