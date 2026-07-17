<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/header/Header.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index';
	import AppSidebar from '$lib/components/ui/sidebar/AppSidebar.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import type { LayoutProps } from './$types';
	import NavigationIndicator from '$lib/components/navigation-indicator/NavigationIndicator.svelte';
	import { Toaster } from '$lib/components/ui/sonner/index';
	import ToolDetailDialog from '$lib/components/tool-detail-dialog/ToolDetailDialog.svelte';
	import SearchPalette, { searchOpen } from '$lib/components/search/SearchPalette.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index';

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

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fpsuymmshooskqzbygzx.supabase.co" />
	<link rel="dns-prefetch" href="https://fpsuymmshooskqzbygzx.supabase.co" />
	<meta
		name="description"
		content="ToolBase is a developer platform dedicated to allowing the community to share and discover tools for building, primarily, web applications."
	/>
</svelte:head>

<svelte:window onkeydown={handleKeyDown} />

<ModeWatcher />
<Toaster richColors closeButton />
<SearchPalette />

<div class="[--header-height:calc(--spacing(12))]">
	<NavigationIndicator />
	<Tooltip.Provider>
		<Sidebar.Provider class="flex flex-col">
			<Header categories={data.categories} />

			<div class="flex flex-1">
				<AppSidebar categories={data.categories} />
				<Sidebar.Inset>
					{@render children()}
				</Sidebar.Inset>
			</div>
		</Sidebar.Provider>
		<ToolDetailDialog data={data.editForm} />
	</Tooltip.Provider>
</div>
