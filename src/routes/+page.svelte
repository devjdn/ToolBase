<script lang="ts">
	import ToolCard from '$lib/components/tool-card/ToolCard.svelte';
	import PaginationBar from '$lib/components/pagination/PaginationBar.svelte';
	import { page } from '$app/state';
	import { getTools } from '$lib/remote-functions/tools.remote';
	import { getPageNumber } from '$lib/utils';

	const pageNumber = $derived(getPageNumber(page.url));
</script>

<svelte:head>
	<title>ToolBase</title>
</svelte:head>

<div class="@container mx-auto flex w-full max-w-7xl flex-1 flex-col space-y-6">
	<section class="category-header">
		<h1 class="text-[clamp(1.8rem,1.1rem+2vw,2rem)] font-semibold tracking-tight">Home</h1>
	</section>

	<svelte:boundary>
		{@const { tools, pagination } = await getTools({ page: pageNumber })}

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

			<PaginationBar currentPage={pagination.page} totalPages={pagination.totalPages} pageSize={pagination.pageSize} />
		{/if}

		{#snippet failed()}
			<div class="flex flex-1 flex-col items-center justify-center gap-1 leading-tight">
				<p class="text-sm font-medium">Something went wrong</p>
				<p class="text-xs text-muted-foreground">Failed to load tools</p>
			</div>
		{/snippet}
	</svelte:boundary>
</div>
