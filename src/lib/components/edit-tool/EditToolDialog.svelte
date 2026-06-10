<script lang="ts">
	import * as Dialog from '../ui/dialog/index';
	import { Input } from '../ui/input/index';
	import { Label } from '../ui/label/index';
	import { Textarea } from '../ui/textarea/index';
	import { enhance } from '$app/forms';
	import type { Tool } from '$lib/types';
	import { Button } from '../ui/button/index';
	import { Pencil } from '@lucide/svelte';
	import { page } from '$app/state';

	let {
		tool
	}: {
		tool: Tool;
	} = $props();

	let open = $state(false);

	let loading = $state(false);
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="outline" size="lg">
				<Pencil />
				<span>Edit</span>
			</Button>
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Content class="max-w-sm">
		<Dialog.Header>
			<Dialog.Title>Edit Tool</Dialog.Title>
			<Dialog.Description>Update the details for {tool.name}.</Dialog.Description>
		</Dialog.Header>
		<form
			method="POST"
			action="/?/editTool"
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
			<input type="hidden" name="id" value={tool.id} />
			<div class="flex flex-col gap-3 py-3">
				<div class="flex flex-col gap-1.5">
					<Label for="name">Name</Label>
					<Input id="name" name="name" value={tool.name} required />
				</div>
				<div class="flex flex-col gap-1.5">
					<Label for="url">URL</Label>
					<Input id="url" name="url" type="url" value={tool.url} required />
				</div>
				<div class="flex flex-col gap-1.5">
					<Label for="description">Description <span class="text-xs text-muted-foreground">(optional)</span></Label>
					<Textarea id="description" name="description" value={tool.description ?? ''} class="resize-none" rows={3} />
				</div>
				<div class="flex flex-col gap-1.5">
					<Label for="categoryId">Category</Label>
					<select
						id="categoryId"
						name="categoryId"
						required
						value={tool.category?.id}
						class="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
					>
						{#each page.data.categories as category (category.id)}
							<option value={category.id}>{category.name}</option>
						{/each}
					</select>
				</div>
				<div class="flex flex-col gap-1.5">
					<Label for="logo"
						>Logo <span class="text-xs text-muted-foreground">(optional — replaces existing)</span></Label
					>
					<Input id="logo" name="logo" type="file" accept="image/webp,image/svg+xml" />
					{#if tool.logoUrl}
						<p class="text-xs text-muted-foreground">A logo is already set. Only upload if you want to replace it.</p>
					{/if}
				</div>
			</div>
			<Dialog.Footer>
				<Button type="button" variant="outline" onclick={() => (open = false)}>Cancel</Button>
				<Button type="submit" disabled={loading}>
					{loading ? 'Saving...' : 'Save Changes'}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
