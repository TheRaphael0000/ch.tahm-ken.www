<script lang="ts">
	let { children, class: propClasses = '', ...props } = $props();
</script>

<article
	{...props}
	class={['m-auto', 'xl:w-7xl', 'bg-bg-light', 'p-10', 'border', 'border-white/75', propClasses]}
>
	{@render children()}
</article>
