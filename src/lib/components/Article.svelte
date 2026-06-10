<script lang="ts">
	let { children, class: propClasses = '', ...props } = $props();
</script>

<article {...props} class={['m-auto', 'xl:w-7xl', 'bg-black/60', 'p-10', propClasses]}>
	{@render children()}
</article>
