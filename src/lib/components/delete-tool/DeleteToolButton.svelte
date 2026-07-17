<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index';
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button/index';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import { toast } from 'svelte-sonner';
	import * as Tooltip from '$lib/components/ui/tooltip/index';
	import type { Tool } from '$lib/types';
	import { selectedTool } from '$lib/stores/global-tool-dialog';

	let { tool, open = $bindable(false) }: { tool: Tool; open: boolean } = $props();
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Trigger>
		{#snippet child({ props })}
			<Tooltip.Root>
				<Tooltip.Trigger>
					<Button {...props} variant="destructive" size="icon-lg">
						<Trash2 />
						<span class="sr-only">Delete</span>
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content sideOffset={6}>
					<span>Delete</span>
				</Tooltip.Content>
			</Tooltip.Root>
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
							toast.success(`${tool.name} deleted successfully`);
							selectedTool.set(null);
							await update();
						} else {
							toast.error(`Failed to delete ${tool.name}`);
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
