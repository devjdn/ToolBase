<script lang="ts">
	import * as Dialog from '../ui/dialog/index';
	import { Input } from '../ui/input/index';
	import { Label } from '../ui/label/index';
	import { Textarea } from '../ui/textarea/index';
	import { enhance } from '$app/forms';
	import type { LayoutData } from '../../../routes/$types';
	import type { Snippet } from 'svelte';
	import { Button } from '../ui/button/index';

	let {
		categories,
		trigger
	}: {
		categories: LayoutData['categories'];
		trigger: Snippet<[Record<string, unknown>]>;
	} = $props();

	let loading = $state(false);
	let open = $state(false);
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
		{#snippet child({ props })}
			{@render trigger(props)}
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Content class="max-w-sm">
		<Dialog.Header>
			<Dialog.Title>Add to ToolBase</Dialog.Title>
			<Dialog.Description
				>To add a new tool to ToolBase, fill out the form below. Please try to avoid leaving any fields blank.</Dialog.Description
			>
		</Dialog.Header>

		<form
			method="POST"
			action="/?/addTool"
			enctype="multipart/form-data"
			use:enhance={() => {
				loading = true;

				return async ({ result, update }) => {
					loading = false;
					if (result.type === 'success') {
						open = false;
						await update();
					} else {
						await update();
					}
				};
			}}
		>
			<div class="flex flex-col gap-3 py-3">
				<div class="flex flex-col gap-1.5">
					<Label for="name">Name</Label>
					<Input id="name" name="name" placeholder="SvelteKit" required />
				</div>
				<div class="flex flex-col gap-1.5">
					<Label for="url">URL</Label>
					<Input id="url" name="url" type="url" placeholder="https://svelte.dev/docs/kit" required />
				</div>
				<div class="flex flex-col gap-1.5">
					<Label for="description">Description <span class="text-xs text-muted-foreground">(optional)</span></Label>
					<Textarea
						id="description"
						name="description"
						placeholder="A brief description..."
						class="resize-none"
						rows={3}
					/>
				</div>
				<div class="flex flex-col gap-1.5">
					<Label for="categoryId">Category</Label>
					<select
						id="categoryId"
						name="categoryId"
						required
						class="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
					>
						<option value="" disabled selected>Select a category</option>
						{#each categories as category (category.id)}
							<option value={category.id}>{category.name}</option>
						{/each}
					</select>
				</div>
				<div class="flex flex-col gap-1.5">
					<Label for="logo">Logo <span class="text-xs text-muted-foreground">(optional)</span></Label>
					<Input id="logo" name="logo" type="file" accept="image/webp,image/svg+xml" />
				</div>
			</div>
			<Dialog.Footer>
				<Button type="button" variant="outline" onclick={() => (open = false)}>Cancel</Button>
				<Button type="submit" disabled={loading}>
					{loading ? 'Adding...' : 'Add Tool'}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
