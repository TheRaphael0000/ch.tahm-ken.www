<script lang="ts">
	let { children, class: propClasses = '', ...props } = $props();
</script>

<h1 {...props} class={'mb-7 text-3xl tracking-tighter' + propClasses}>
	{@render children()}
</h1>
