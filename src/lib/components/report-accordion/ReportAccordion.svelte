<script lang="ts">
	import * as Accordion from '#lib/components/ui/accordion/index.js';
	import type { ReportedTool } from '#lib/types.js';
	import { cn } from '#lib/utils.js';
	import type { ClassValue } from 'tailwind-variants';
	import { Button } from '../ui/button/index';
	import { Check, Trash2, X } from '@lucide/svelte';
	import { resolveReport, dismissReport, removeTool } from '#lib/remote-functions/reports.remote.js';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import { categoryIcons, defaultIcon } from '#lib/categoryIcons.js';

	let { reportedTools }: { reportedTools: ReportedTool[] } = $props();

	const resolve = async (reportId: string) => {
		try {
			await resolveReport({ reportId });
			await invalidateAll();
			toast.success('Report resolved successfully');
		} catch {
			toast.error('Failed to resolve report');
		}
	};

	const dismiss = async (reportId: string) => {
		try {
			await dismissReport({ reportId });
			await invalidateAll();
			toast.success('Report dismissed successfully');
		} catch {
			toast.error('Failed to dismiss report');
		}
	};

	const remove = async (toolId: string) => {
		try {
			await removeTool({ toolId });
			await invalidateAll();
			toast.success('Tool removed successfully');
		} catch {
			toast.error('Failed to remove tool');
		}
	};
</script>

<Accordion.Root type="multiple">
	{#each reportedTools as report (report.reportId)}
		<Accordion.Item class="select-none" value={report.reportId}>
			<Accordion.Trigger>
				{#snippet child({ props })}
					<div
						{...props}
						class={cn(
							props.class as ClassValue,
							'grid w-full cursor-pointer *:not-first:border-l *:not-first:px-3 @3xl:grid-cols-2 @5xl:grid-cols-3'
						)}
					>
						<div class="grid grid-cols-[40px_1fr] items-center justify-start gap-4">
							{#if report.toolLogoUrl}
								<div class="flex size-10 items-center justify-center rounded-sm dark:bg-white">
									<img src={report.toolLogoUrl} alt={report.toolName} loading="lazy" class="size-6" />
								</div>
							{:else}
								{@const Icon = report.categorySlug ? (categoryIcons[report.categorySlug] ?? defaultIcon) : defaultIcon}
								<div class="grid size-10 place-items-center rounded-lg">
									<Icon class="size-6 text-muted-foreground" />
								</div>
							{/if}

							<div class="space-y-0.5">
								<p class="text-xs font-normal text-muted-foreground">Tool</p>
								<p class="text-sm">{report.toolName}</p>
							</div>
						</div>

						<div class="hidden space-y-0.5 @3xl:block">
							<p class="text-xs font-normal text-muted-foreground">Reported By</p>
							<p class="text-sm">{report.reporterName}</p>
						</div>

						<div class="hidden space-y-0.5 @5xl:block">
							<p class="text-xs font-normal text-muted-foreground">Reported at</p>
							<p class="text-sm">{new Date(report.reportedAt).toUTCString()}</p>
						</div>
					</div>
				{/snippet}
			</Accordion.Trigger>
			<Accordion.Content class="my-2.5 flex flex-col gap-6">
				<div class="space-y-1">
					<p class="text-xs font-normal text-muted-foreground">Reason</p>
					<p class="max-w-prose text-sm">{report.reason}</p>
				</div>

				<div class="space-y-1">
					<p class="text-xs font-normal text-muted-foreground">Action</p>

					<div class="flex flex-col *:w-fit">
						<Button variant="ghost" onclick={() => resolve(report.reportId)}>
							<Check class="stroke-green-600 dark:stroke-green-400" />
							<span>Mark report as resolved</span>
						</Button>
						<Button variant="ghost" onclick={() => dismiss(report.reportId)}>
							<X />
							<span>Dismiss Report</span>
						</Button>
						<Button variant="destructive" onclick={() => remove(report.toolId!)}>
							<Trash2 />
							<span>Remove tool from ToolBase</span>
						</Button>
					</div>
				</div>
			</Accordion.Content>
		</Accordion.Item>
	{/each}
</Accordion.Root>
