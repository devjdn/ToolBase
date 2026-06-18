<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/header/Header.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/ui/sidebar/AppSidebar.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import type { LayoutProps } from './$types';
	import NavigationIndicator from '$lib/components/navigation-indicator/NavigationIndicator.svelte';

	let { children, data }: LayoutProps = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<ModeWatcher />

<div class="[--header-height:calc(--spacing(10))]">
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
