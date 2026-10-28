<script lang="ts">
	let { children, class: propClasses = [], ...props } = $props();
</script>

<h2 {...props} class={['mt-4', 'mb-2', 'text-2xl', 'tracking-tighter', ...propClasses]}>
	{@render children()}
</h2>
