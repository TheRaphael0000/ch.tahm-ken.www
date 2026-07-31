<script lang="ts">
	import { Button } from '$lib/components';

	let { src, href, name, text, buttonText } = $props();
</script>

<div
	class="my-6 flex flex-col items-center justify-between border border-white/75 px-8 py-6 text-white sm:flex-row"
>
	<img {src} alt={name} class="h-25 w-25 rounded-full" />
	<div class="m-6 flex w-full flex-col">
		<h2 class="text-xl">
			{name}
		</h2>
		<div>
			{text}
		</div>
	</div>
	<a {href} class="my-auto" target="_blank">
		<Button>{buttonText}</Button>
	</a>
</div>
