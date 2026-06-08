<script lang="ts">
	let { children, class: propClasses = '', ...props } = $props();
</script>

<article {...props} class={["m-6",'bg-black/50', 'p-6', 'rounded-md', propClasses]}>
	{@render children()}
</article>
