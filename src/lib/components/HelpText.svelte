<script lang="ts">
	let { children, propClasses = '' } = $props();
</script>

<span class={['cursor-help', 'border-b border-dashed border-white', propClasses]}>
	{@render children()}
</span>
