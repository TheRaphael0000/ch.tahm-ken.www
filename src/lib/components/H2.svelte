<script lang="ts">
	let { children, class: propClasses = '', ...props } = $props();
</script>

<h2 {...props} class={'mt-4 text-2xl' + propClasses}>
	{@render children()}
</h2>
