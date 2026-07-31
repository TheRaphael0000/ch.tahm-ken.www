<script lang="ts">
	import { challengesById, challengesRanks } from '$lib/challenges';
	import { numberFormat } from '$lib/utils';
	import Tooltip from './Tooltip.svelte';

	const { id, level, label = '', title2 = '', class: className = '' } = $props();

	const challenge = $derived(challengesById.get(id));

	const specialRules = new Map<number, number>([
		[401107, 401105],
		[401207, 401201],
		[401208, 401202],
		[401209, 401203],
		[401210, 401204],
		[401211, 401205],
		[401212, 401206]
	]);

	const imageId = $derived(specialRules?.get(id) ?? id);
</script>

<Tooltip>
	{#snippet text()}
		<div class={['relative', 'cursor-pointer', className]}>
			<span class={['absolute', 'right-1', 'bottom-0', 'text-right']}>
				{label}
			</span>
			<img
				src={`/img/cache/datadragon/challenges-images/${imageId}-${level}.png`}
				alt={challenge.name}
			/>
		</div>
	{/snippet}
	<div class="flex flex-col gap-3 text-left">
		<div class="text-lg font-bold">
			{challenge.name}
			{#if title2}
				({title2})
			{/if}
		</div>
		{@html challenge.description}
		<div class="flex gap-2">
			{#each challengesRanks as r}
				{@const ri = challenge.thresholds[r]}
				{#if ri}
					<div class="flex flex-col items-center">
						<img
							class="h-15 w-15"
							src={`/img/cache/datadragon/challenges-images/${imageId}-${r}.png`}
							alt={challenge.name}
						/>
						{numberFormat.format(ri?.value)}
					</div>
				{/if}
			{/each}
		</div>
	</div>
</Tooltip>
