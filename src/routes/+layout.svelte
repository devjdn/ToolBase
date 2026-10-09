<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import Header from '#lib/components/header/Header.svelte';
	import * as Sidebar from '#lib/components/ui/sidebar/index.js';
	import AppSidebar from '#lib/components/ui/sidebar/AppSidebar.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import type { LayoutProps } from './$types';
	import NavigationIndicator from '#lib/components/navigation-indicator/NavigationIndicator.svelte';
	import { Toaster } from '#lib/components/ui/sonner/index.js';
	import ToolDetailDialog from '#lib/components/tool-detail-dialog/ToolDetailDialog.svelte';
	import { searchOpen } from '#lib/stores/search.js';
	import * as Tooltip from '#lib/components/ui/tooltip/index.js';
	import { onMount, type Component } from 'svelte';

	let { children, data }: LayoutProps = $props();

	let SearchPalette = $state<Component | null>(null);

	onMount(async () => {
		SearchPalette = (await import('#lib/components/search/SearchPalette.svelte')).default;
	});

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
{#if SearchPalette}
	<SearchPalette />
{/if}

<div class="[--header-height:calc(--spacing(12))]">
	<NavigationIndicator />
	<Tooltip.Provider>
		<Sidebar.Provider class="flex flex-col">
			<Header user={data.user} />

			<div class="flex flex-1">
				<AppSidebar />
				<Sidebar.Inset>
					{@render children()}
				</Sidebar.Inset>
			</div>
		</Sidebar.Provider>
		<ToolDetailDialog />
	</Tooltip.Provider>
</div>
