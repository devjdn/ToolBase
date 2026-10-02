<script lang="ts">
	import Search from '@lucide/svelte/icons/search';
	import Button from '../ui/button/button.svelte';
	import * as Kbd from '../ui/kbd/index';
	import { searchOpen } from '$lib/stores/search';
</script>

<Button variant="ghost" size="icon" class="md:hidden" aria-label="Search ToolBase" onclick={() => searchOpen.set(true)}>
	<Search class="text-muted-foreground" absoluteStrokeWidth strokeWidth={2.5} />
</Button>

<Button variant="secondary" size="default" class="hidden w-72 pr-1.5 md:flex" onclick={() => searchOpen.set(true)}>
	<Search class="text-muted-foreground" absoluteStrokeWidth strokeWidth={2.5} />

	<span class="text-nowrap text-muted-foreground">Search ToolBase...</span>
	<Kbd.Root class="ml-auto bg-secondary-raised">⌘ K</Kbd.Root>
</Button>
