<script lang="ts">
	let { children, class: propClasses = '', ...props } = $props();
</script>

<article {...props} class={['bg-bg-light', 'p-10', propClasses]}>
	{@render children()}
</article>
