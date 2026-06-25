<script module>
	import { writable } from 'svelte/store';
	export const searchOpen = writable(false);
</script>

<script lang="ts">
	import * as Dialog from '../ui/dialog/index';
	import Search from '@lucide/svelte/icons/search';
	import * as Kbd from '../ui/kbd/index';
	import SearchResults from './SearchResults.svelte';
	import type {
		SearchApiResponse,
		SearchResult,
		SearchResultCategory,
		SearchResultPage,
		SearchResultTool
	} from './types';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';
	import { goto } from '$app/navigation';
	import { tick } from 'svelte';
	import { selectedTool } from '$lib/stores/global-tool-dialog';

	const isMobile = new IsMobile();

	let query = $state('');
	let dbResults = $state<SearchResult[]>([]);
	let debounceTimer: ReturnType<typeof setTimeout>;
	let abortController: AbortController | null = null;
	let lastQuery = '';

	const staticPages: SearchResultPage[] = [
		{
			type: 'page',
			label: 'Home',
			path: '/',
			action: () => {
				searchOpen.set(false);
				tick().then(() => goto('/'));
			}
		},
		{
			type: 'page',
			label: 'Usage Guide',
			path: '/guide',
			action: () => {
				searchOpen.set(false);
				tick().then(() => goto('/guide'));
			}
		},
		{
			type: 'page',
			label: 'Request to Edit',
			path: '/request-to-edit',
			action: () => {
				searchOpen.set(false);
				tick().then(() => goto('/request-to-edit'));
			}
		}
	];

	async function search(q: string) {
		if (q === lastQuery) return;
		lastQuery = q;

		if (q.trim().length < 2) {
			dbResults = [];
			return;
		}

		abortController?.abort();
		abortController = new AbortController();

		try {
			const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
				signal: abortController.signal
			});
			const { toolResults, categoryResults }: SearchApiResponse = await res.json();

			// console.log('toolResults', toolResults);
			// console.log('categoryResults', categoryResults);

			dbResults = [
				...toolResults.map(
					(t): SearchResultTool => ({
						type: 'tool',
						label: t.name,
						tool: t,
						action: () => {
							selectedTool.set(t);
							searchOpen.set(false);
						}
					})
				),

				...categoryResults.map(
					(c): SearchResultCategory => ({
						type: 'category',
						label: c.name,
						categorySlug: c.slug,
						path: `/category/${c.slug}`,
						action: () => {
							searchOpen.set(false);
							tick().then(() => goto(`/category/${c.slug}`));
						}
					})
				)
			];
		} catch (e) {
			if ((e as Error).name !== 'AbortError') console.error(e);
		}
	}

	const filteredPages = $derived(staticPages.filter((p) => p.label.toLowerCase().includes(query.toLowerCase())));

	const results = $derived(query.trim().length < 2 ? staticPages : [...dbResults, ...filteredPages]);

	$effect(() => {
		const q = query;
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => search(q), 200);
	});

	$effect(() => {
		console.log(results);
	});
</script>

<Dialog.Root bind:open={$searchOpen}>
	<Dialog.Content showCloseButton={isMobile.current} class="gap-0 p-0 md:max-w-lg">
		<div class="flex items-center gap-3 border-b px-4 py-5">
			<Search class="size-5 shrink-0 text-muted-foreground" />
			<input
				class="h-6 w-full border-0 bg-transparent p-0 text-popover-foreground caret-inherit placeholder:text-muted-foreground focus:ring-0"
				type="text"
				placeholder="Search ToolBase..."
				bind:value={query}
			/>
			{#if !isMobile.current}
				<Kbd.Root>Esc</Kbd.Root>
			{/if}
		</div>
		<SearchResults {results} />
	</Dialog.Content>
</Dialog.Root>
