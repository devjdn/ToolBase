<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { categoryIcons, defaultIcon } from '$lib/categoryIcons';
	import type { LayoutData } from '../../../../routes/$types';
	import { page } from '$app/state';
	import clsx from 'clsx';
	import { LayoutGrid, Signpost, UserRoundPen } from '@lucide/svelte';

	let {
		ref = $bindable(null),
		categories,
		...restProps
	}: ComponentProps<typeof Sidebar.Root> & { categories: LayoutData['categories'] } = $props();
</script>

<Sidebar.Root bind:ref class="top-(--header-height) h-[calc(100svh-var(--header-height))]!" {...restProps}>
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>Core</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton variant={page.url.pathname === `/` ? 'primary' : 'ghost'}>
							{#snippet child({ props })}
								<a data-sveltekit-preload-code="hover" href="/" {...props}>
									<LayoutGrid size={16} />
									<span>Home</span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton variant={page.url.pathname === `/guide` ? 'primary' : 'ghost'}>
							{#snippet child({ props })}
								<a data-sveltekit-preload-code="hover" href="/guide" {...props}>
									<Signpost size={16} />
									<span>Usage Guide</span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
		<Sidebar.Group>
			<Sidebar.GroupLabel>Categories</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each categories as category (category.id)}
						{@const Icon = categoryIcons[category.slug] ?? defaultIcon}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton variant={page.url.pathname === `/category/${category.slug}` ? 'primary' : 'ghost'}>
								{#snippet child({ props })}
									<a {...props} data-sveltekit-preload-code="hover" href="/category/{category.slug}">
										<Icon size={16} />
										<span>{category.name}</span>
										<span
											class={clsx('ml-auto text-xs text-neutral-400 tabular-nums', {
												'text-white dark:text-black': page.url.pathname === `/category/${category.slug}`
											})}>{category.toolCount}</span
										>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
	<Sidebar.Footer>
		<p class="text-xs text-muted-foreground">&copy; 2026 JDN. All rights reserved.</p>
	</Sidebar.Footer>
</Sidebar.Root>
