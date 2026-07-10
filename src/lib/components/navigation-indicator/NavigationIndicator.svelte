<script lang="ts">
	import { navigating } from '$app/state';

	let visible = $state(false);
	let complete = $state(false);

	$effect(() => {
		if (navigating.type) {
			visible = true;
			complete = false;
		} else if (visible) {
			complete = true;
			setTimeout(() => {
				visible = false;
				complete = false;
			}, 400);
		}
	});
</script>

{#if visible}
	<div class="absolute top-(--header-height) left-0 z-50 w-full overflow-hidden">
		<div
			class="h-0.5 bg-neutral-500 transition-[width] duration-500 ease-out"
			style="width: {complete ? '100%' : '60%'}"
		></div>
	</div>
{/if}
