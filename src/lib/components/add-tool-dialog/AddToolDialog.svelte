<script lang="ts">
	import * as Dialog from '../ui/dialog/index';
	import { Input } from '../ui/input/index';
	import { Label } from '../ui/label/index';
	import { Textarea } from '../ui/textarea/index';
	import { Button } from '../ui/button/index';
	import { Skeleton } from '../ui/skeleton';
	import { isHttpError } from '@sveltejs/kit';
	import { toast } from 'svelte-sonner';
	import { getCategories } from '#lib/remote-functions/categories.remote.js';
	import { addTool } from '#lib/remote-functions/tools.remote.js';
	import type { Snippet } from 'svelte';

	let { trigger }: { trigger: Snippet<[Record<string, unknown>]> } = $props();
	let open = $state(false);

	$effect(() => {
		if (open) {
			addTool.fields.set({
				name: '',
				url: '',
				description: '',
				categoryId: '',
				logo: undefined
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
		{#snippet child({ props })}
			{@render trigger(props)}
		{/snippet}
	</Dialog.Trigger>

	<Dialog.Content class="gap-0 p-0 lg:max-w-4xl">
		<Dialog.Header class="p-6">
			<Dialog.Title>Add to ToolBase</Dialog.Title>
			<Dialog.Description class="max-w-prose">
				To add a new tool to ToolBase, fill out the form below. Please try to avoid leaving any fields blank.
			</Dialog.Description>
		</Dialog.Header>

		<form
			id="add-tool-form"
			enctype="multipart/form-data"
			{...addTool.enhance(async (form) => {
				try {
					const name = addTool.fields.name.value();
					if (await form.submit()) {
						toast.success(`${name} added to ToolBase`);
						addTool.fields.set({
							name: '',
							url: '',
							description: '',
							categoryId: '',
							logo: undefined
						});
						open = false;
					} else {
						toast.error('Submission failed. Please check the form for any errors.');
					}
				} catch (e) {
					toast.error(isHttpError(e) ? e.body.message : 'Failed to add tool. Please try again.');
				}
			})}
		>
			<div class="flex flex-col gap-y-6 p-6 not-lg:mb-8 lg:grid lg:grid-cols-2 lg:gap-x-12">
				<div class="flex flex-col gap-1.5 lg:col-span-1">
					<Label for="add-name">Name</Label>
					<Input {...addTool.fields.name.as('text')} id="add-name" placeholder="SvelteKit" />
					{@render errors(addTool.fields.name.issues())}
				</div>

				<div class="flex flex-col gap-1.5 lg:col-span-1">
					<Label for="add-url">URL</Label>
					<Input {...addTool.fields.url.as('url')} id="add-url" placeholder="https://svelte.dev/docs/kit" />
					{@render errors(addTool.fields.url.issues())}
				</div>

				<div class="flex flex-col gap-1.5 lg:col-start-2 lg:row-span-3 lg:row-start-1">
					<Label for="add-description">
						Description <span class="text-xs text-muted-foreground">(optional)</span>
					</Label>
					<Textarea
						{...addTool.fields.description.as('text')}
						id="add-description"
						placeholder="A brief description..."
						class="max-h-47 resize-none lg:flex-1 lg:overflow-y-auto"
						rows={3}
					/>
					{@render errors(addTool.fields.description.issues())}
				</div>

				<div class="flex flex-col gap-1.5 lg:col-span-1">
					<Label for="add-category">Category</Label>
					<svelte:boundary>
						{@const categories = await getCategories()}
						<select
							{...addTool.fields.categoryId.as('select')}
							id="add-category"
							class="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
						>
							<option value="" disabled>Select a category</option>
							{#each categories as category (category.id)}
								<option value={category.id}>{category.name}</option>
							{/each}
						</select>
						{#snippet pending()}
							<Skeleton class="h-9 w-full" />
						{/snippet}
					</svelte:boundary>
					{@render errors(addTool.fields.categoryId.issues())}
				</div>

				<div class="flex flex-col gap-1.5 lg:col-span-1">
					<Label for="add-logo">
						Logo <span class="text-xs text-muted-foreground">(optional)</span>
					</Label>
					<Input {...addTool.fields.logo.as('file')} id="add-logo" accept="image/webp,image/svg+xml" />
					{@render errors(addTool.fields.logo.issues())}
				</div>
			</div>
		</form>

		<Dialog.Footer class="p-6">
			<Button type="button" variant="outline" onclick={() => (open = false)}>Cancel</Button>
			<Button type="submit" form="add-tool-form" disabled={!!addTool.pending}>
				{addTool.pending ? 'Adding...' : 'Add Tool'}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
