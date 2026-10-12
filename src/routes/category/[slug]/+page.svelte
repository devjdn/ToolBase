<script lang="ts">
	import ToolCard from '#lib/components/tool-card/ToolCard.svelte';
	import PaginationBar from '#lib/components/pagination/PaginationBar.svelte';
	import { page } from '$app/state';
	import { getTools } from '#lib/remote-functions/tools.remote.js';
	import { getPageNumber } from '#lib/utils.js';

	const pageNumber = $derived(getPageNumber(page.url.searchParams));

	const { category, tools, pagination } = $derived(await getTools({ page: pageNumber, slug: page.params.slug }));
</script>

<svelte:head>
	<title>{category?.name} | ToolBase</title>
	<meta name="description" content="A collection of tools for {category?.name}" />
</svelte:head>

<div class="@container mx-auto flex w-full max-w-7xl flex-1 flex-col space-y-6">
	<section class="category-header">
		<h1>{category?.name}</h1>
	</section>

	{#if tools.length === 0}
		<div class="flex flex-1 flex-col items-center justify-center gap-1 leading-tight">
			<p class="text-sm font-medium">No tools yet</p>
			<p class="text-xs text-muted-foreground">Add the first tool to {category?.name}</p>
		</div>
	{:else}
		<section class="tools-section flex-1">
			<ul class="card-grid">
				{#each tools as tool (tool.id)}
					<li>
						<ToolCard {tool} />
					</li>
				{/each}
			</ul>
		</section>

		<PaginationBar currentPage={pagination.page} totalPages={pagination.totalPages} pageSize={pagination.pageSize} />
	{/if}
</div>
