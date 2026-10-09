<script lang="ts">
	import * as AlertDialog from '#lib/components/ui/alert-dialog/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import { toast } from 'svelte-sonner';
	import * as Tooltip from '#lib/components/ui/tooltip/index.js';
	import type { Tool } from '#lib/types.js';
	import { selectedTool } from '#lib/stores/global-tool-dialog.js';
	import { page } from '$app/state';
	import { refreshAll } from '$app/navigation';
	import { deleteTool, getTools } from '#lib/remote-functions/tools.remote.js';
	import { getCategories } from '#lib/remote-functions/categories.remote.js';
	import { getPageNumber } from '#lib/utils.js';

	let { tool, open = $bindable(false) }: { tool: Tool; open: boolean } = $props();

	let deleting = $state(false);

	async function handleDelete() {
		deleting = true;
		try {
			const onHome = page.url.pathname === '/';
			await deleteTool(tool.id).updates(
				getCategories(),
				...(onHome ? [getTools({ page: getPageNumber(page.url.searchParams) })] : [])
			);
			await refreshAll(); // bridge: remove once category/search/admin are on remote functions
			open = false;
			selectedTool.set(null);
			toast.success(`${tool.name} deleted successfully`);
		} catch {
			toast.error(`Failed to delete ${tool.name}`);
		} finally {
			deleting = false;
		}
	}
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
			<AlertDialog.Cancel disabled={deleting}>Cancel</AlertDialog.Cancel>
			<Button variant="destructive" onclick={handleDelete} disabled={deleting}>
				{deleting ? 'Deleting…' : 'Delete'}
			</Button>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
