<script lang="ts">
	import ToolCard from '$lib/components/tool-card/ToolCard.svelte';
	import ToolCardSkeleton from '$lib/components/tool-card/ToolCardSkeleton.svelte';
	import PaginationBar from '$lib/components/pagination/PaginationBar.svelte';
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>ToolBase</title>
</svelte:head>

<div class="@container mx-auto flex w-full max-w-7xl flex-1 flex-col space-y-6">
	<section class="category-header">
		<h1 class="text-[clamp(1.8rem,1.1rem+2vw,2rem)] font-semibold tracking-tight">Home</h1>
	</section>

	{#await data.tools}
		<section class="tools-section flex-1">
			<ul class="grid grid-cols-2 gap-4 @xl:grid-cols-3 @3xl:grid-cols-4 @5xl:grid-cols-5">
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
				<p class="text-xs text-muted-foreground">Add the first tool to ToolBase</p>
			</div>
		{:else}
			<section class="tools-section flex-1">
				<ul class="grid grid-cols-2 gap-4 @xl:grid-cols-3 @3xl:grid-cols-4 @5xl:grid-cols-5">
					{#each tools as tool (tool.id)}
						<li>
							<ToolCard {tool} showCategory />
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
