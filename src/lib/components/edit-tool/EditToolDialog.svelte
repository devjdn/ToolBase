<script lang="ts">
	import * as Dialog from '../ui/dialog/index';
	import { Input } from '../ui/input/index';
	import { Label } from '../ui/label/index';
	import { Textarea } from '../ui/textarea/index';
	import { Button } from '../ui/button/index';
	import * as Form from '../ui/form/index';
	import { Pencil } from '@lucide/svelte';
	import { page } from '$app/state';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { editToolSchema, type EditToolSchema } from '$lib/zod-schemas';
	import type { Tool } from '$lib/types';
	import { toast } from 'svelte-sonner';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';

	let {
		tool,
		data
	}: {
		tool: Tool;
		data: SuperValidated<EditToolSchema>;
	} = $props();

	let open = $state(false);

	const { current: isMobile } = new IsMobile();

	// svelte-ignore state_referenced_locally
	const form = superForm(data, {
		validators: zod4Client(editToolSchema),
		onUpdated: ({ form }) => {
			if (form.message?.type === 'success') toast.success(form.message.text);
			if (form.message?.type === 'error') toast.error(form.message.text);
		},
		onResult: ({ result }) => {
			if (result.type === 'success') {
				open = false;
			}
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
			<Button {...props} variant="caution" size={isMobile ? 'icon-lg' : 'lg'}>
				<Pencil />
				<span class="not-md:hidden">Edit</span>
			</Button>
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Content class="max-w-sm">
		<Dialog.Header>
			<Dialog.Title>Edit Tool</Dialog.Title>
			<Dialog.Description>Update the details for {tool.name}.</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="/?/editTool" enctype="multipart/form-data" use:enhance>
			<input type="hidden" name="id" value={tool.id} />
			<div class="flex flex-col gap-3 py-3">
				<Form.Field {form} name="name">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Name</Form.Label>
							<Input {...props} bind:value={$formData.name} required />
						{/snippet}
					</Form.Control>
				</Form.Field>
				<Form.Field {form} name="url">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>URL</Form.Label>
							<Input {...props} bind:value={$formData.url} type="url" required />
						{/snippet}
					</Form.Control>
				</Form.Field>
				<Form.Field {form} name="description">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>
								Description <span class="text-xs text-muted-foreground">(optional)</span>
							</Form.Label>
							<Textarea {...props} bind:value={$formData.description} class="resize-none" rows={3} />
						{/snippet}
					</Form.Control>
				</Form.Field>
				<Form.Field {form} name="categoryId">
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
				<div class="flex flex-col gap-1.5">
					<Label>Logo <span class="text-xs text-muted-foreground">(optional — replaces existing)</span></Label>
					<Input name="logo" type="file" accept="image/webp,image/svg+xml" />
					{#if tool.logoUrl}
						<p class="text-xs text-muted-foreground">A logo is already set. Only upload if you want to replace it.</p>
					{/if}
				</div>
			</div>
			<Dialog.Footer>
				<Button type="button" variant="outline" onclick={() => (open = false)}>Cancel</Button>
				<Button type="submit" disabled={$submitting}>
					{$submitting ? 'Saving...' : 'Save Changes'}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
