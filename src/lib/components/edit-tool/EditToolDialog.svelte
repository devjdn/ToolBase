<script lang="ts">
	import * as Dialog from '../ui/dialog/index';
	import { Input } from '../ui/input/index';
	import { Label } from '../ui/label/index';
	import { Textarea } from '../ui/textarea/index';
	import { Button } from '../ui/button/index';
	import * as Form from '../ui/form/index';
	import * as Tooltip from '../ui/tooltip/index';
	import { Pencil } from '@lucide/svelte';
	import { page } from '$app/state';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { editToolSchema, type EditToolSchema } from '$lib/zod-schemas';
	import type { Tool } from '$lib/types';
	import { toast } from 'svelte-sonner';
	import { selectedTool } from '$lib/stores/global-tool-dialog';

	let {
		tool,
		data
	}: {
		tool: Tool;
		data: SuperValidated<EditToolSchema>;
	} = $props();

	let open = $state(false);

	// svelte-ignore state_referenced_locally
	const form = superForm(data, {
		validators: zod4Client(editToolSchema),
		validationMethod: 'oninput',
		onUpdated: ({ form: f }) => {
			if (f.message?.type === 'success') {
				toast.success(f.message.text);
				open = false;
				selectedTool.set(null);
			}
			if (f.message?.type === 'error') toast.error(f.message.text);
		}
	});

	$effect(() => {
		if (open && tool.id) {
			form.reset({
				data: {
					id: tool.id,
					name: tool.name,
					url: tool.url,
					description: tool.description ?? '',
					categoryId: tool.category?.id ?? ''
				}
			});
		}
	});

	const { form: formData, enhance, submitting } = form;
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
		{#snippet child({ props })}
			<Tooltip.Root>
				<Tooltip.Trigger>
					<Button {...props} variant="caution" size="icon-lg">
						<Pencil />
						<span class="sr-only">Edit</span>
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content sideOffset={6}>
					<span>Edit</span>
				</Tooltip.Content>
			</Tooltip.Root>
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Content class="gap-0 p-0 lg:max-w-4xl">
		<Dialog.Header class="p-6">
			<Dialog.Title>Edit Tool</Dialog.Title>
			<Dialog.Description>Update the details for {tool.name}.</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="/?/editTool" enctype="multipart/form-data" id="edit-tool-form" use:enhance>
			<input type="hidden" name="id" value={tool.id} />
			<div class="flex flex-col gap-6 p-6 not-lg:mb-8 lg:grid lg:grid-cols-2 lg:gap-x-12">
				<Form.Field {form} name="name" class="lg:col-span-1">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Name</Form.Label>
							<Input {...props} bind:value={$formData.name} required />
						{/snippet}
					</Form.Control>
				</Form.Field>
				<Form.Field {form} name="url" class="lg:col-span-1">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>URL</Form.Label>
							<Input {...props} bind:value={$formData.url} type="url" required />
						{/snippet}
					</Form.Control>
				</Form.Field>
				<Form.Field {form} name="description" class="lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:flex lg:flex-col">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>
								Description <span class="text-xs text-muted-foreground">(optional)</span>
							</Form.Label>
							<Textarea
								{...props}
								bind:value={$formData.description}
								class="max-h-47 resize-none lg:flex-1 lg:overflow-y-auto"
								rows={3}
							/>
						{/snippet}
					</Form.Control>
				</Form.Field>
				<Form.Field {form} name="categoryId" class="lg:col-span-1">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Category</Form.Label>
							{#await page.data.categories}
								<select disabled class="...">
									<option>Loading...</option>
								</select>
							{:then categories}
								<select
									required
									bind:value={$formData.categoryId}
									{...props}
									class="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
								>
									{#each categories as category (category.id)}
										<option value={category.id}>{category.name}</option>
									{/each}
								</select>
							{/await}
						{/snippet}
					</Form.Control>
				</Form.Field>
				<div class="flex flex-col gap-1.5 lg:col-span-1">
					<Label>Logo <span class="text-xs text-muted-foreground">(optional — replaces existing)</span></Label>
					<Input name="logo" type="file" accept="image/webp,image/svg+xml" />
					{#if tool.logoUrl}
						<p class="text-xs text-muted-foreground">A logo is already set. Only upload if you want to replace it.</p>
					{/if}
				</div>
			</div>
		</form>
		<Dialog.Footer class="border-t bg-muted p-6">
			<Button type="button" variant="outline" onclick={() => (open = false)}>Cancel</Button>
			<Button type="submit" form="edit-tool-form" disabled={$submitting}>
				{$submitting ? 'Saving...' : 'Save Changes'}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
