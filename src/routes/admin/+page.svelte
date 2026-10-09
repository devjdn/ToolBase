<script lang="ts">
	import ReportAccordion from '#lib/components/report-accordion/ReportAccordion.svelte';
	import { Skeleton } from '#lib/components/ui/skeleton/index.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Admin Dashboard | ToolBase</title>
	<meta name="description" content="Admin dashboard for Toolbase, allowing the admins to manage reports on the site." />
</svelte:head>

<div class="@container mx-auto flex w-full max-w-7xl flex-1 flex-col space-y-6">
	<section class="category-header">
		<h1 class="text-[clamp(1.8rem,1.1rem+2vw,2rem)] font-semibold tracking-tight">Admin Dashboard</h1>
	</section>

	<section class="flex flex-1 flex-col gap-2">
		<h2 class="text-[clamp(1.25rem,1.1rem+2vw,1.5rem)] font-medium tracking-tight">Reports</h2>
		{#await data.reportedTools}
			{#each Array.from({ length: 4 }) as _, i (i)}
				<Skeleton class="h-16 rounded-none not-last:border-b" />
			{/each}
		{:then reportedTools}
			{#if reportedTools.length > 0}
				<ReportAccordion {reportedTools} />
			{:else}
				<div class="flex flex-1 flex-col items-center justify-center gap-1 leading-tight">
					<p class="text-sm font-medium">No reports found</p>
					<p class="text-xs text-muted-foreground">Any tools reported by users will appear here</p>
				</div>
			{/if}
		{/await}
	</section>
</div>
