<script lang="ts">
	let { text, children } = $props();
	let visible = $state(false);

	function handleMouseEnter() {
		visible = true;
	}

	function handleMouseLeave() {
		visible = false;
	}
</script>

<span onmouseenter={handleMouseEnter} onmouseleave={handleMouseLeave} role="tooltip">
	{@render text()}

	{#if visible}
		<div class="pointer-events-none absolute z-10 rounded-md bg-black/85 px-3 py-2">
			{@render children()}
		</div>
	{/if}
</span>
