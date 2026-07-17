<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index';
	import { Button } from '$lib/components/ui/button/index';
	import { submitReport } from '$lib/remote-functions/reports.remote';
	import type { Tool } from '$lib/types';
	import Flag from '@lucide/svelte/icons/flag';
	import { Label } from '$lib/components/ui/label/index';
	import { Textarea } from '$lib/components/ui/textarea/index';
	import { toast } from 'svelte-sonner';
	import { selectedTool } from '$lib/stores/global-tool-dialog';
	import * as Tooltip from '$lib/components/ui/tooltip/index';

	let { tool }: { tool: Tool } = $props();
	let open = $state(false);

	$effect(() => {
		if (!open) {
			submitReport.fields.set({ reason: '' });
		}
	});
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
		{#snippet child({ props })}
			<Tooltip.Root>
				<Tooltip.Trigger>
					<Button {...props} variant="destructive" size="icon-lg">
						<Flag />
						<span class="sr-only">Report</span>
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content sideOffset={6}>
					<span>Report</span>
				</Tooltip.Content>
			</Tooltip.Root>
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Content class="gap-0 p-0 lg:max-w-xl">
		<Dialog.Header class="p-6">
			<Dialog.Title>Report Tool</Dialog.Title>
			<Dialog.Description>Submit a report for {tool.name}.</Dialog.Description>
		</Dialog.Header>

		<form
			id="report-form"
			class="flex flex-col gap-6 p-6"
			{...submitReport.enhance(async (form) => {
				submitReport.fields.toolId.set(tool.id);
				try {
					if (await form.submit()) {
						open = false;
						toast.success('Report submitted. Thank you for the heads up!');
						selectedTool.set(null);
					} else {
						toast.error('Submission failed. Please check the forms for any errors.');
					}
				} catch (error) {
					toast.error('Failed to submit report. Please try again.');
				}
			})}
		>
			<input {...submitReport.fields.toolId.as('hidden', tool.id)} />

			<div class="flex flex-col gap-1.5">
				<Label for="reason">Reason</Label>

				<Textarea
					{...submitReport.fields.reason.as('text')}
					placeholder="Please tell us what is wrong with this tool..."
					rows={4}
					class="h-48 resize-none"
				/>

				{#each submitReport.fields.reason.issues() ?? [] as issue (issue.path)}
					<p class="text-sm text-destructive">{issue.message}</p>
				{/each}
			</div>
		</form>

		<Dialog.Footer class="border-t bg-muted p-6">
			<Button type="button" variant="outline" onclick={() => (open = false)}>Cancel</Button>
			<Button type="submit" form="report-form" disabled={!!submitReport.pending}>
				{submitReport.pending ? 'Submitting...' : 'Submit Report'}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
