<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index';
	import { Button } from '../ui/button/index';
	import { Copy, Check, ArrowUpRight } from '@lucide/svelte/icons';
	import { scale } from 'svelte/transition';
	import DeleteToolButton from '../delete-tool/DeleteToolButton.svelte';
	import EditToolDialog from '../edit-tool/EditToolDialog.svelte';
	import type { EditToolSchema } from '$lib/zod-schemas';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { page } from '$app/state';
	import { selectedTool } from '$lib/stores/global-tool-dialog';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';
	import clsx from 'clsx';

	let {
		data
	}: {
		data: SuperValidated<EditToolSchema>;
	} = $props();

	let open = $state(false);

	let copied = $state(false);

	const isMobile = new IsMobile();

	async function copyToolUrl() {
		copied = true;
		await navigator.clipboard.writeText($selectedTool!.url);
		setTimeout(() => (copied = false), 1000);
	}
</script>

<Dialog.Root
	open={$selectedTool !== null}
	onOpenChange={(open) => {
		if (!open) {
			selectedTool.set(null);
		}
	}}
>
	{#if $selectedTool}
		<Dialog.Content class="w-full max-w-[calc(100%-0.75rem)] sm:max-w-4xl">
			<Dialog.Header class="flex-row items-center gap-3">
				{#if $selectedTool.logoUrl}
					<div
						class="grid size-12 shrink-0 place-items-center rounded-md border bg-secondary dark:border-transparent dark:bg-white"
					>
						<img src={$selectedTool.logoUrl} alt={$selectedTool.name} class="size-9 object-contain" />
					</div>
				{/if}
				<Dialog.Title class="text-xl font-medium">{$selectedTool.name}</Dialog.Title>
			</Dialog.Header>
			<div class="flex flex-col gap-6">
				<div class="flex flex-1 flex-col gap-6">
					{#if $selectedTool.description}
						<p class="max-w-prose text-sm text-muted-foreground">{$selectedTool.description}</p>
					{/if}

					<div class="flex flex-wrap gap-1.5">
						<Button
							class="relative md:w-30"
							variant="secondary"
							size={isMobile.current ? 'icon-lg' : 'lg'}
							href={$selectedTool.url}
							target="_blank"
						>
							<ArrowUpRight />
							<span class="not-md:hidden">Open URL</span>
						</Button>
						<Button
							class="relative md:w-30"
							variant="outline"
							size={isMobile.current ? 'icon-lg' : 'lg'}
							onclick={copied ? null : copyToolUrl}
						>
							<div class="relative h-5">
								{#if copied}
									<div
										in:scale={{ duration: 200 }}
										out:scale={{ duration: 200 }}
										class="absolute inset-0 flex items-center justify-center gap-2"
									>
										<Check class="stroke-green-600 dark:stroke-green-400" />
										<span class={clsx({ hidden: isMobile.current })}>Copied!</span>
									</div>
								{:else}
									<div
										in:scale={{ duration: 200 }}
										out:scale={{ duration: 200 }}
										class="absolute inset-0 flex items-center justify-center gap-2"
									>
										<Copy />
										<span class={clsx({ hidden: isMobile.current })}>Copy URL</span>
									</div>
								{/if}
							</div>
						</Button>

						{#if page.data.user && ['editor', 'admin'].includes(page.data.user?.role ?? '')}
							<EditToolDialog tool={$selectedTool} {data} />
							<DeleteToolButton {open} tool={$selectedTool} />
						{/if}
					</div>
				</div>
				<!-- implement images here when done, do an if statement as well -->
			</div>
		</Dialog.Content>
	{/if}
</Dialog.Root>
