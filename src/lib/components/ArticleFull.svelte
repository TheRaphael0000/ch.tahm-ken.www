<script lang="ts">
	let { children, class: propClasses = '', ...props } = $props();
</script>

<article {...props} class={['bg-bg-light', 'p-10', 'border', 'border-white/75', propClasses]}>
	{@render children()}
</article>
