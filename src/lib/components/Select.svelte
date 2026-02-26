<script lang="ts">
	import { inputClass } from './style';

	let { children, class: propClasses = '', value = $bindable(), ...props } = $props();
</script>

<select {...props} class={[inputClass, propClasses]} bind:value>
	{@render children()}
</select>
