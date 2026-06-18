<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index';
	import type { Tool } from '$lib/types';
	import type { Snippet } from 'svelte';
	import { Button } from '../ui/button/index';
	import { Copy, Check } from '@lucide/svelte/icons';
	import { scale } from 'svelte/transition';
	import DeleteToolButton from '../delete-tool/DeleteToolButton.svelte';
	import EditToolDialog from '../edit-tool/EditToolDialog.svelte';
	import type { EditToolSchema } from '$lib/zod-schemas';
	import type { SuperValidated } from 'sveltekit-superforms';

	let {
		tool,
		trigger,
		data
	}: {
		tool: Tool;
		trigger: Snippet<[Record<string, unknown>]>;
		data: SuperValidated<EditToolSchema>;
	} = $props();

	let open = $state(false);

	let copied = $state(false);

	async function copyToolUrl() {
		copied = true;
		await navigator.clipboard.writeText(tool.url);
		setTimeout(() => (copied = false), 1000);
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
		{#snippet child({ props })}
			{@render trigger(props)}
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Content class="w-full max-w-[calc(100%-0.75rem)] sm:max-w-4xl">
		<Dialog.Header class="flex-row items-center gap-3">
			{#if tool.logoUrl}
				<div
					class="grid size-12 shrink-0 place-items-center rounded-md border bg-secondary dark:border-transparent dark:bg-white"
				>
					<img src={tool.logoUrl} alt={tool.name} class="size-9 object-contain" />
				</div>
			{/if}
			<Dialog.Title class="text-xl font-medium">{tool.name}</Dialog.Title>
		</Dialog.Header>
		<div class="flex flex-col gap-6">
			<div class="flex flex-1 flex-col gap-6">
				{#if tool.description}
					<p class="max-w-prose text-sm text-muted-foreground">{tool.description}</p>
				{/if}

				<div class="flex flex-wrap gap-1.5">
					<Button class="relative w-30" variant="outline" size="lg" onclick={copied ? null : copyToolUrl}>
						<div class="relative h-5">
							{#if copied}
								<div
									in:scale={{ duration: 200 }}
									out:scale={{ duration: 200 }}
									class="absolute inset-0 flex items-center justify-center gap-2"
								>
									<Check class="stroke-green-600 dark:stroke-green-400" />
									<span>Copied!</span>
								</div>
							{:else}
								<div
									in:scale={{ duration: 200 }}
									out:scale={{ duration: 200 }}
									class="absolute inset-0 flex items-center justify-center gap-2"
								>
									<Copy />
									<span>Copy URL</span>
								</div>
							{/if}
						</div>
					</Button>

					<EditToolDialog {tool} {data} />

					<DeleteToolButton {tool} {open} />
				</div>
			</div>
			<!-- implement images here when done, do an if statement as well -->
		</div>
	</Dialog.Content>
</Dialog.Root>
