<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	// console.log(data.tools);
</script>

<svelte:head>
	<title>ToolBase</title>
</svelte:head>

<main>
	{#if data.tools.length === 0}
		<p>No tools found.</p>
	{:else}
		<ul>
			{#each data.tools as tool (tool.id)}
				<li>
					<strong>{tool.name}</strong>
					{#if tool.description}
						<p>{tool.description}</p>
					{/if}
					{#if tool.category}
						<span>{tool.category.name}</span>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}
</main>
