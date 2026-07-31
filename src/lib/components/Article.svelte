<script lang="ts">
	let { children, class: propClasses = '', ...props } = $props();
</script>

<article
	{...props}
	class={['m-auto', 'xl:w-7xl', 'bg-bg-light', 'p-10', 'shadow-border', propClasses]}
>
	{@render children()}
</article>
