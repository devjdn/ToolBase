<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/header/Header.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/ui/sidebar/AppSidebar.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import type { LayoutProps } from './$types';
	import NavigationIndicator from '$lib/components/navigation-indicator/NavigationIndicator.svelte';
	import { Toaster } from '$lib/components/ui/sonner/index';
	import ToolDetailDialog from '$lib/components/tool-detail-dialog/ToolDetailDialog.svelte';
	import SearchPalette, { searchOpen } from '$lib/components/search/SearchPalette.svelte';

	let { children, data }: LayoutProps = $props();

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			searchOpen.update((v) => !v);
		} else if (e.key === 'esc') {
			e.preventDefault();
			searchOpen.set(false);
		}
	}
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<svelte:window onkeydown={handleKeyDown} />

<ModeWatcher />
<Toaster richColors closeButton />
<ToolDetailDialog data={data.editForm} />
<SearchPalette />

<div class="[--header-height:calc(--spacing(12))]">
	<NavigationIndicator />
	<Sidebar.Provider class="flex flex-col">
		<Header categories={data.categories} />

		<div class="flex flex-1">
			<AppSidebar categories={data.categories} />
			<Sidebar.Inset>
				{@render children()}
			</Sidebar.Inset>
		</div>
	</Sidebar.Provider>
</div>
