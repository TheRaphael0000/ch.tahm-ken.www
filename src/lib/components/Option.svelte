<script lang="ts">
	let { children, class: propClasses = '', ...props } = $props();
</script>

<option {...props} class={[propClasses]}>{@render children()}</option>
