<script lang="ts">
	import * as Pagination from '$lib/components/ui/pagination/index';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	let {
		currentPage,
		totalPages,
		pageSize = 24
	}: {
		currentPage: number;
		totalPages: number;
		pageSize?: number;
	} = $props();

	function onPageChange(newPage: number) {
		const url = new URL(page.url);
		url.searchParams.set('page', String(newPage));
		goto(url.toString(), { keepFocus: false, noScroll: false });
	}
</script>

{#if totalPages > 1}
	<Pagination.Root count={totalPages * pageSize} perPage={pageSize} page={currentPage} {onPageChange}>
		{#snippet children({ pages, currentPage })}
			<Pagination.Content class="mt-8 not-md:mb-8">
				<Pagination.Item>
					<Pagination.Previous />
				</Pagination.Item>
				{#each pages as p (p.key)}
					{#if p.type === 'ellipsis'}
						<Pagination.Item>
							<Pagination.Ellipsis />
						</Pagination.Item>
					{:else}
						<Pagination.Item>
							<Pagination.Link page={p} isActive={currentPage === p.value}>
								{p.value}
							</Pagination.Link>
						</Pagination.Item>
					{/if}
				{/each}
				<Pagination.Item>
					<Pagination.Next />
				</Pagination.Item>
			</Pagination.Content>
		{/snippet}
	</Pagination.Root>
{/if}
