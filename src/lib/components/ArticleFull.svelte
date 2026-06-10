<script lang="ts">
	let { children, class: propClasses = '', ...props } = $props();
</script>

<article {...props} class={['bg-black/60', 'p-6', propClasses]}>
	{@render children()}
</article>
