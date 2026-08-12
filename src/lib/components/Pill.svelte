<script lang="ts">
	let {
		children,
		fg = 'text-black',
		bg = 'bg-white/90',
		class: propClasses = '',
		...props
	} = $props();
</script>

<div
	{...props}
	class={[
		'inline-block',
		'rounded-3xl',
		'px-2',
		'text-sm',
		'font-semibold',
		'text-center',
		fg,
		bg,
		propClasses
	]}
>
	{@render children()}
</div>
