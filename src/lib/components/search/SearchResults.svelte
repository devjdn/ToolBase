<script lang="ts">
	import type { SearchResult, SearchResultType } from './types';
	import FileText from '@lucide/svelte/icons/file-text';
	import Folder from '@lucide/svelte/icons/folder';
	import { categoryIcons, defaultIcon } from '$lib/categoryIcons';
	import Button from '../ui/button/button.svelte';
	import { tick } from 'svelte';
	import { Skeleton } from '../ui/skeleton/index';
	import { ArrowUpRight } from '@lucide/svelte';

	let { results, isLoading }: { results: SearchResult[]; isLoading: boolean } = $props();

	const headings: Record<SearchResultType, string> = {
		tool: 'Tools',
		page: 'Pages',
		category: 'Categories'
	};

	const grouped = $derived(
		results.reduce(
			(acc, result) => {
				const group = (acc[result.type] ??= []);
				group.push(result);
				return acc;
			},
			{} as Partial<Record<SearchResultType, SearchResult[]>>
		)
	);

	const flatResults = $derived((Object.values(grouped) as SearchResult[][]).flat());

	let highlightedIndex = $state<number | null>(null);
	let scrollContainer: HTMLDivElement | undefined = $state();

	$effect(() => {
		void flatResults.length;
		highlightedIndex = null;
	});

	$effect(() => {
		const idx = highlightedIndex;

		tick().then(() => {
			scrollContainer?.querySelector(`[data-index="${idx}"]`)?.scrollIntoView({
				block: 'nearest'
			});
		});
	});

	$effect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === 'ArrowDown') {
				e.preventDefault();
				highlightedIndex = highlightedIndex === null ? 0 : (highlightedIndex + 1) % flatResults.length;
			} else if (e.key === 'ArrowUp') {
				e.preventDefault();
				highlightedIndex =
					highlightedIndex === null
						? flatResults.length - 1
						: (highlightedIndex - 1 + flatResults.length) % flatResults.length;
			} else if (e.key === 'Enter') {
				e.preventDefault();
				if (highlightedIndex !== null) flatResults[highlightedIndex]?.action();
			}
		};

		window.addEventListener('keydown', handler);

		return () => window.removeEventListener('keydown', handler);
	});
</script>

<div bind:this={scrollContainer} class="h-96 space-y-6 overflow-y-auto px-2 py-6">
	{#if isLoading}
		<div class="space-y-3">
			<p class="px-3 text-xs text-muted-foreground">Searching...</p>
			<div class="flex flex-col gap-0.5">
				{#each { length: 5 } as _, i (i)}
					<Skeleton class="flex h-9 w-full items-center gap-3" />
				{/each}
			</div>
		</div>
	{:else if flatResults.length > 0}
		{#each Object.entries(grouped) as [type, items] (type)}
			<div class="space-y-1.5">
				<p class="px-3 text-xs text-muted-foreground">
					{headings[type as SearchResultType]}
				</p>

				<div class="flex flex-col">
					{#each items as result (`${result.type}-${result.label}`)}
						{@const flatIndex = flatResults.indexOf(result)}
						{@const isHighlighted = flatIndex === highlightedIndex}
						{@const Icon =
							result.type === 'tool'
								? result.tool.category
									? (categoryIcons[result.tool.category.slug] ?? defaultIcon)
									: defaultIcon
								: result.type === 'category'
									? (categoryIcons[result.categorySlug] ?? Folder)
									: FileText}

						<div class="flex flex-row gap-0.5">
							<Button
								data-index={flatIndex}
								variant={isHighlighted ? 'secondary' : 'ghost'}
								size="lg"
								class="w-full flex-1 px-3"
								onclick={result.action}
							>
								{#if result.type === 'tool' && result.tool.logoUrl}
									<div class="grid aspect-square size-5 place-items-center rounded-sm dark:bg-white">
										<img class="aspect-square size-4" src={result.tool.logoUrl} alt={result.tool.name} />
									</div>
								{:else}
									<Icon class="text-muted-foreground" />
								{/if}

								<span class="flex-1 truncate text-left">
									{result.label}
								</span>

								{#if result.type === 'tool' && result.tool.category}
									<span class="text-xs text-muted-foreground">
										{result.tool.category.name}
									</span>
								{:else if result.type === 'page'}
									<span class="text-xs text-muted-foreground">
										{result.path}
									</span>
								{:else if result.type === 'category'}
									<span class="text-xs text-muted-foreground">
										/{result.categorySlug}
									</span>
								{/if}
							</Button>

							{#if result.type === 'tool'}
								<Button
									size="icon-lg"
									variant="ghost"
									aria-label="Open tool in a new tab"
									href={result.tool.url}
									target="_blank"
								>
									<ArrowUpRight />
								</Button>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/each}
	{:else}
		<div class="flex size-full flex-col items-center justify-center gap-1 leading-tight">
			<p class="text-sm font-medium">No matches found</p>
			<p class="max-w-prose text-xs text-muted-foreground">
				Try a different term related to your search. If a tool is missing, feel free to add it to ToolBase.
			</p>
		</div>
	{/if}
</div>
