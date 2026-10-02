<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index';
	import * as Tooltip from '$lib/components/ui/tooltip/index';
	import { Button } from '../ui/button/index';
	import { Copy, Check, MoveUpRight } from '@lucide/svelte/icons';
	import { scale } from 'svelte/transition';
	import DeleteToolButton from '../delete-tool/DeleteToolButton.svelte';
	import EditToolDialog from '../edit-tool/EditToolDialog.svelte';
	import { page } from '$app/state';
	import { selectedTool } from '$lib/stores/global-tool-dialog';
	import ReportToolDialog from '../report-tool-dialog/ReportToolDialog.svelte';

	let open = $state(false);

	let copied = $state(false);

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
		<Dialog.Content class="w-full gap-9 lg:max-w-4xl" onOpenAutoFocus={(e) => e.preventDefault()}>
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
			<div class="flex flex-col gap-12">
				<div class="flex flex-col gap-1.5">
					<p class="text-xs text-muted-foreground md:text-sm">Description</p>
					{#if $selectedTool.description}
						<p class="max-w-prose text-sm wrap-break-word md:text-base">
							{$selectedTool.description}
						</p>
					{/if}
				</div>

				<div class="flex flex-wrap gap-1">
					<Tooltip.Root>
						<Tooltip.Trigger>
							<Button class="relative" variant="secondary" size="icon-lg" onclick={copied ? null : copyToolUrl}>
								<div class="relative h-5">
									{#if copied}
										<div
											in:scale={{ duration: 200 }}
											out:scale={{ duration: 200 }}
											class="absolute inset-0 flex items-center justify-center"
										>
											<Check class="stroke-green-600 dark:stroke-green-400" />
											<span class="sr-only">Copied!</span>
										</div>
									{:else}
										<div
											in:scale={{ duration: 200 }}
											out:scale={{ duration: 200 }}
											class="absolute inset-0 flex items-center justify-center"
										>
											<Copy />
											<span class="sr-only">Copy URL</span>
										</div>
									{/if}
								</div>
							</Button>
						</Tooltip.Trigger>
						<Tooltip.Content sideOffset={6}>
							<span>Copy URL</span>
						</Tooltip.Content>
					</Tooltip.Root>

					<Tooltip.Root>
						<Tooltip.Trigger>
							<Button class="relative" variant="secondary" size="icon-lg" href={$selectedTool.url} target="_blank">
								<MoveUpRight />
								<span class="sr-only">Visit tool</span>
							</Button>
						</Tooltip.Trigger>
						<Tooltip.Content sideOffset={6}>
							<span>Visit tool</span>
						</Tooltip.Content>
					</Tooltip.Root>

					{#if page.data.user && ['editor', 'admin'].includes(page.data.user?.role ?? '')}
						<EditToolDialog tool={$selectedTool} />
						<DeleteToolButton {open} tool={$selectedTool} />
					{/if}

					<ReportToolDialog tool={$selectedTool} />
				</div>
				<!-- implement images here when done, do an if statement as well -->
			</div>
		</Dialog.Content>
	{/if}
</Dialog.Root>
