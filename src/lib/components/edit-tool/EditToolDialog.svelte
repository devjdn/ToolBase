<script lang="ts">
	import * as Dialog from '../ui/dialog/index';
	import { Input } from '../ui/input/index';
	import { Label } from '../ui/label/index';
	import { Textarea } from '../ui/textarea/index';
	import { Button } from '../ui/button/index';
	import * as Tooltip from '../ui/tooltip/index';
	import { Skeleton } from '../ui/skeleton';
	import { Pencil } from '@lucide/svelte';
	import { isHttpError } from '@sveltejs/kit';
	import { toast } from 'svelte-sonner';
	import type { Tool } from '#lib/types.js';
	import { selectedTool } from '#lib/stores/global-tool-dialog.js';
	import { getCategories } from '#lib/remote-functions/categories.remote.js';
	import { editTool } from '#lib/remote-functions/tools.remote.js';

	let { tool }: { tool: Tool } = $props();
	let open = $state(false);

	$effect(() => {
		if (open) {
			editTool.fields.set({
				id: tool.id,
				name: tool.name,
				url: tool.url,
				description: tool.description ?? '',
				categoryId: tool.category?.id ?? ''
			});
		}
	});
</script>

{#snippet errors(issues: { message: string }[] | undefined)}
	{#each issues ?? [] as issue (issue.message)}
		<p class="text-sm text-destructive">{issue.message}</p>
	{/each}
{/snippet}

<Dialog.Root bind:open>
	<Dialog.Trigger>
		<Tooltip.Root>
			<Tooltip.Trigger>
				<Button variant="caution" size="icon-lg">
					<Pencil />
					<span class="sr-only">Edit</span>
				</Button>
			</Tooltip.Trigger>
			<Tooltip.Content sideOffset={6}>
				<span>Edit</span>
			</Tooltip.Content>
		</Tooltip.Root>
	</Dialog.Trigger>

	<Dialog.Content class="gap-0 p-0 lg:max-w-4xl">
		<Dialog.Header class="p-6">
			<Dialog.Title>Edit Tool</Dialog.Title>
			<Dialog.Description>Update the details for {tool.name}.</Dialog.Description>
		</Dialog.Header>

		<form
			id="edit-tool-form"
			enctype="multipart/form-data"
			{...editTool.enhance(async (form) => {
				try {
					if (await form.submit()) {
						toast.success(`${editTool.fields.name.value()} updated successfully`);
						open = false;
						selectedTool.set(null);
					} else {
						toast.error('Submission failed. Please check the form for any errors.');
					}
				} catch (e) {
					toast.error(isHttpError(e) ? e.body.message : 'Failed to update tool. Please try again.');
				}
			})}
		>
			<input {...editTool.fields.id.as('hidden', tool.id)} />

			<div class="flex flex-col gap-6 p-6 not-lg:mb-8 lg:grid lg:grid-cols-2 lg:gap-x-12">
				<div class="flex flex-col gap-1.5 lg:col-span-1">
					<Label for="edit-name">Name</Label>
					<Input {...editTool.fields.name.as('text')} id="edit-name" />
					{@render errors(editTool.fields.name.issues())}
				</div>

				<div class="flex flex-col gap-1.5 lg:col-span-1">
					<Label for="edit-url">URL</Label>
					<Input {...editTool.fields.url.as('url')} id="edit-url" />
					{@render errors(editTool.fields.url.issues())}
				</div>

				<div class="flex flex-col gap-1.5 lg:col-start-2 lg:row-span-3 lg:row-start-1">
					<Label for="edit-description">
						Description <span class="text-xs text-muted-foreground">(optional)</span>
					</Label>
					<Textarea
						{...editTool.fields.description.as('text')}
						id="edit-description"
						class="max-h-47 resize-none lg:flex-1 lg:overflow-y-auto"
						rows={3}
					/>
					{@render errors(editTool.fields.description.issues())}
				</div>

				<div class="flex flex-col gap-1.5 lg:col-span-1">
					<Label for="edit-category">Category</Label>
					<svelte:boundary>
						{@const categories = await getCategories()}
						<select
							{...editTool.fields.categoryId.as('select')}
							id="edit-category"
							class="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
						>
							{#each categories as category (category.id)}
								<option value={category.id}>{category.name}</option>
							{/each}
						</select>
						{#snippet pending()}
							<Skeleton class="h-9 w-full" />
						{/snippet}
					</svelte:boundary>
					{@render errors(editTool.fields.categoryId.issues())}
				</div>

				<div class="flex flex-col gap-1.5 lg:col-span-1">
					<Label for="edit-logo">
						Logo <span class="text-xs text-muted-foreground">(optional — replaces existing)</span>
					</Label>
					<Input {...editTool.fields.logo.as('file')} id="edit-logo" accept="image/webp,image/svg+xml" />
					{#if tool.logoUrl}
						<p class="text-xs text-muted-foreground">A logo is already set. Only upload if you want to replace it.</p>
					{/if}
					{@render errors(editTool.fields.logo.issues())}
				</div>
			</div>
		</form>

		<Dialog.Footer class="p-6">
			<Button type="button" variant="outline" onclick={() => (open = false)}>Cancel</Button>
			<Button type="submit" form="edit-tool-form" disabled={!!editTool.pending}>
				{editTool.pending ? 'Saving...' : 'Save Changes'}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
