<script lang="ts">
	import * as DropdownMenu from '../ui/dropdown-menu/index';
	import { Button } from '../ui/button/index';
	import * as Avatar from '../ui/avatar/index';
	import { authClient } from '$lib/auth-client';
	import { Skeleton } from '../ui/skeleton/index';
	import AddToolDialog from '../add-tool-dialog/AddToolDialog.svelte';
	import type { LayoutData } from '../../../routes/$types';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import { useSidebar } from '../ui/sidebar';
	import {
		LogIn,
		LogOut,
		Shield,
		Moon,
		Sun,
		Laptop,
		PanelLeft,
		PanelBottom,
		UserRound
		// UserRoundPen
	} from '@lucide/svelte';
	import { mode, setMode } from 'mode-watcher';
	import { page } from '$app/state';
	import { invalidateAll } from '$app/navigation';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte';
	import SearchTrigger from '../search/SearchTrigger.svelte';
	import Separator from '../ui/separator/separator.svelte';

	let { categories }: { categories: LayoutData['categories'] } = $props();

	const session = authClient.useSession();

	async function signOut() {
		await authClient.signOut();
		await invalidateAll();
	}

	const { toggle } = useSidebar();

	const isMobile = new IsMobile();

	async function signInWithGithub() {
		await authClient.signIn.social({
			provider: 'github'
		});
	}
</script>

<header
	class="sticky top-0 z-50 flex h-12 items-center justify-between gap-4 border-b bg-background/90 px-3 backdrop-blur-sm"
>
	<div class="flex h-6 items-center justify-start">
		<Button variant="ghost" size="icon" aria-label="Toggle Navigation Menu" onclick={toggle}>
			<PanelBottom class="md:hidden" />
			<PanelLeft class="not-md:hidden" />
		</Button>
		<Separator class="mr-3 ml-2 h-9" orientation="vertical" />
		<a href="/" class="group w-fit">
			<p class="text-lg leading-tight font-medium tracking-tighter">ToolBase</p>
		</a>
	</div>

	<div class="flex items-center justify-end gap-1.5">
		<SearchTrigger />

		{#if $session.data}
			<AddToolDialog data={page.data.addForm} {categories}>
				{#snippet trigger(props)}
					<Button size={isMobile.current ? 'icon' : 'default'} {...props}>
						<PlusIcon absoluteStrokeWidth strokeWidth={2.5} />
						<span class="sr-only md:not-sr-only">Add Tool</span>
					</Button>
				{/snippet}
			</AddToolDialog>
		{/if}

		<DropdownMenu.Root>
			<DropdownMenu.Trigger aria-label="Account & Settings">
				{#snippet child({ props })}
					{#if $session.data}
						<Avatar.Root class="size-8 cursor-pointer border" {...props}>
							<Avatar.Image src={$session.data!.user.image ?? ''} alt={$session.data!.user.name} />
							<Avatar.Fallback class="text-xs">
								{$session.data!.user.name?.charAt(0).toUpperCase()}
							</Avatar.Fallback>
						</Avatar.Root>
					{:else if $session.isPending}
						<Skeleton class="size-8 rounded-full border" />
					{:else}
						<Button {...props} variant="secondary" size="icon"><UserRound /></Button>
					{/if}
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="w-48" align="end" alignOffset={9}>
				<DropdownMenu.Group>
					<DropdownMenu.Label>Appearance</DropdownMenu.Label>
					<DropdownMenu.Sub>
						<DropdownMenu.SubTrigger class="capitalize">
							{mode.current}
						</DropdownMenu.SubTrigger>
						<DropdownMenu.SubContent>
							<DropdownMenu.Item onclick={() => setMode('light')}>
								<Sun />
								<span>Light</span>
							</DropdownMenu.Item>
							<DropdownMenu.Item onclick={() => setMode('dark')}>
								<Moon />
								<span>Dark</span>
							</DropdownMenu.Item>
							<DropdownMenu.Item onclick={() => setMode('system')}>
								<Laptop />
								<span>System</span>
							</DropdownMenu.Item>
						</DropdownMenu.SubContent>
					</DropdownMenu.Sub>
				</DropdownMenu.Group>

				<DropdownMenu.Separator />

				{#if $session.data}
					<DropdownMenu.Label>{$session.data.user.email}</DropdownMenu.Label>
					<DropdownMenu.Group>
						<!-- {#if !['editor', 'admin'].includes($session.data.user?.role ?? '')}
							<DropdownMenu.Item>
								<UserRoundPen />
								<span>Request Editor Role</span>
							</DropdownMenu.Item>
						{/if} -->
						{#if $session.data.user?.role === 'admin'}
							<DropdownMenu.Item>
								{#snippet child({ props })}
									<a href="/admin" {...props}>
										<Shield />
										<span>Admin Dashboard</span>
									</a>
								{/snippet}
							</DropdownMenu.Item>
						{/if}
						<DropdownMenu.Item variant="destructive" onclick={signOut}>
							<LogOut />
							<span>Sign Out</span>
						</DropdownMenu.Item>
					</DropdownMenu.Group>
				{:else}
					<DropdownMenu.Label>Account</DropdownMenu.Label>
					<DropdownMenu.Group>
						<DropdownMenu.Item onclick={signInWithGithub}>
							<LogIn />
							<span>Sign In with Github</span>
						</DropdownMenu.Item>
					</DropdownMenu.Group>
				{/if}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</header>
