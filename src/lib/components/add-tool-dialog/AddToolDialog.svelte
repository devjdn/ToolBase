<script lang="ts">
	import * as Dialog from '../ui/dialog/index';
	import { Input } from '../ui/input/index';
	import { Textarea } from '../ui/textarea/index';
	import { Button } from '../ui/button/index';
	import * as Form from '../ui/form/index';
	import type { LayoutData } from '../../../routes/$types';
	import type { Snippet } from 'svelte';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { addToolSchema, type AddToolSchema } from '$lib/zod-schemas';
	import { Label } from '../ui/label/index';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';

	let {
		categories,
		trigger,
		data
	}: {
		categories: LayoutData['categories'];
		trigger: Snippet<[Record<string, unknown>]>;
		data: SuperValidated<AddToolSchema>;
	} = $props();

	let open = $state(false);

	// svelte-ignore state_referenced_locally
	const form = superForm(data, {
		validators: zod4Client(addToolSchema),
		validationMethod: 'oninput',
		onUpdate: ({ form: f, cancel }) => {
			if (f.message?.type === 'success') {
				cancel();
				toast.success(f.message.text);
				form.reset({ data: { name: '', url: '', description: '', categoryId: '' } });
				open = false;
				invalidateAll();
			}
		},
		onUpdated: ({ form: f }) => {
			if (f.message?.type === 'error') toast.error(f.message.text);
		}
	});

	const { form: formData, enhance, submitting } = form;
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
		{#snippet child({ props })}
			{@render trigger(props)}
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Content class="lg:h-full lg:max-h-125 lg:max-w-4xl">
		<Dialog.Header>
			<Dialog.Title>Add to ToolBase</Dialog.Title>
			<Dialog.Description class="max-w-prose">
				To add a new tool to ToolBase, fill out the form below. Please try to avoid leaving any fields blank.
			</Dialog.Description>
		</Dialog.Header>

		<form
			method="POST"
			action="/?/addTool"
			enctype="multipart/form-data"
			use:enhance
			class="flex flex-col justify-between"
		>
			<div class="flex flex-col gap-y-6 py-3 not-lg:mb-8 lg:grid lg:grid-cols-2 lg:gap-x-12">
				<Form.Field {form} name="name" class="lg:col-span-1">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Name</Form.Label>
							<Input {...props} bind:value={$formData.name} placeholder="SvelteKit" required />
						{/snippet}
					</Form.Control>
				</Form.Field>
				<Form.Field {form} name="url" class="lg:col-span-1">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>URL</Form.Label>
							<Input
								{...props}
								bind:value={$formData.url}
								type="url"
								placeholder="https://svelte.dev/docs/kit"
								required
							/>
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
								placeholder="A brief description..."
								class="resize-none lg:flex-1 lg:overflow-y-auto"
								rows={3}
							/>
						{/snippet}
					</Form.Control>
				</Form.Field>
				<Form.Field {form} name="categoryId" class="lg:col-span-1">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label for="categoryId">Category</Form.Label>
							<select
								required
								bind:value={$formData.categoryId}
								{...props}
								class="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
							>
								<option value="" disabled selected>Select a category</option>
								{#each categories as category (category.id)}
									<option value={category.id}>{category.name}</option>
								{/each}
							</select>
						{/snippet}
					</Form.Control>
				</Form.Field>
				<div class="flex flex-col gap-1.5 lg:col-span-1">
					<Label class="text-sm font-medium">Logo <span class="text-xs text-muted-foreground">(optional)</span></Label>
					<Input name="logo" type="file" accept="image/webp,image/svg+xml" />
				</div>
			</div>
			<Dialog.Footer>
				<Button type="button" variant="outline" onclick={() => (open = false)}>Cancel</Button>
				<Button type="submit" disabled={$submitting}>
					{$submitting ? 'Adding...' : 'Add Tool'}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
