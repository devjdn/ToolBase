<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index';
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button/index';
	import Trash2 from '@lucide/svelte/icons/trash-2';

	import type { Tool } from '$lib/types';

	let { tool, open = $bindable(false) }: { tool: Tool; open: boolean } = $props();
</script>

<AlertDialog.Root>
	<AlertDialog.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="destructive" size="lg">
				<Trash2 />
				<span>Delete</span>
			</Button>
		{/snippet}
	</AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Delete {tool.name}?</AlertDialog.Title>
			<AlertDialog.Description>
				This will permanently remove {tool.name} from ToolBase. This action cannot be undone.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<form
				method="POST"
				action="/?/deleteTool"
				use:enhance={() => {
					return async ({ result, update }) => {
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
				<AlertDialog.Action type="submit">Delete</AlertDialog.Action>
			</form>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
