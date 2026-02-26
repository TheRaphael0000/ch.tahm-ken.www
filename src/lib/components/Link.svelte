<script lang="ts">
	let { children, class: propClasses = '', ...props } = $props();
</script>

<a {...props} class={['no-underline', 'hover:underline', 'text-blue-500', propClasses]}
	>{@render children()}</a
>
