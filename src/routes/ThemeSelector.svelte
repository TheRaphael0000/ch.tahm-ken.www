<script lang="ts">
	import { Select, Option } from '$lib/components';
	import Button from '$lib/components/Button.svelte';

	const valid_img = [
		['TahmKench_0.jpg', 'Original'],
		['TahmKench_1.jpg', 'Master Chef'],
		['TahmKench_2.jpg', 'Urf Kench'],
		['TahmKench_3.jpg', 'Coin Emperor'],
		['TahmKench_11.jpg', 'Arcana'],
		['TahmKench_20.jpg', 'High Noon'],
		['TahmKench_30.jpg', 'Shan Hai Scrolls']
	];

	let isVisible: boolean = $state(false);
	let { background = $bindable() } = $props();

	// ensure that the background is a valid one
	if (!valid_img.some((f) => f[0] == background)) {
		background = valid_img[0][0];
	}
</script>

<div>
	<a
		href="."
		onclick={(event) => {
			event.preventDefault();
			isVisible = !isVisible;
		}}>Site Theme</a
	>

	{#if isVisible}
		<div
			class="fixed top-1/3 left-1/2 z-100 my-3 -translate-x-1/2 -translate-y-1/2 transform rounded-md bg-black p-5 shadow shadow-white"
		>
			<div class="flex flex-col gap-5">
				<label>
					Background:
					<Select bind:value={background}>
						{#each valid_img as [img, name]}
							<Option value={img}>{name}</Option>
						{/each}
					</Select>
				</label>

				<div class="text-center">
					<Button onclick={() => (isVisible = false)}>Close</Button>
				</div>
			</div>
		</div>
	{/if}
</div>
