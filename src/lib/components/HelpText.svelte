<script lang="ts">
	let { children, propClasses = '' } = $props();
</script>

<span class={['cursor-help', 'border-b-1 border-dashed border-white', propClasses]}>
	{@render children()}
</span>
