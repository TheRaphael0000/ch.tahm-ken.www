<script lang="ts">
	import Tooltip from './Tooltip.svelte';

	import { champions } from '$lib/challenges';
	import { masteryLevelToColor, numberFormat } from '$lib/utils';

	let {
		playerData,
		canSelect = false,
		selectedChampions = $bindable([]),
		textfilterChampions = '',
		topChampions = $bindable([]),
		lowOpacityChampions = $bindable([]),
		hiddenChampions = $bindable([]),
		champoionsSortFunction = defaultChampionsSort
	} = $props();

	let championsFiltered = $derived.by(() => {
		return champions
			.filter((c) => !hiddenChampions.includes(c.id))
			.filter((c) => c.name.toLocaleLowerCase().includes(textfilterChampions?.toLocaleLowerCase()));
	});

	const playerMasteriesMap: Map<string, any> = $derived.by(
		() => new Map(playerData?.champion_masteries?.map((c: any) => [c?.championId?.toString(), c]))
	);

	const championsOrdered = $derived(champoionsSortFunction(championsFiltered));

	function defaultChampionsSort(champions: any) {
		let order = champions
			.toSorted((a: any, b: any) => {
				if (playerMasteriesMap.size > 0) {
					const playerChampionA = playerMasteriesMap?.get(a?.key);
					const playerChampionB = playerMasteriesMap?.get(b?.key);

					const levelA = playerChampionA?.championLevel ?? 0;
					const levelB = playerChampionB?.championLevel ?? 0;
					const levelDiff = levelB - levelA;
					if (levelDiff != 0) return levelDiff;

					const pointA = playerChampionA?.championPoints ?? 0;
					const pointB = playerChampionB?.championPoints ?? 0;
					const pointDiff = pointB - pointA;

					if (pointDiff != 0) return pointDiff;
				}
				return a.name.localeCompare(b.name);
			})
			.toSorted((a: any, b: any) => {
				const topA = topChampions.includes(a?.id) ? 0 : 1;
				const topB = topChampions.includes(b?.id) ? 0 : 1;
				const topDiff = topA - topB;
				if (topDiff != 0) return topDiff;
			});

		return order;
	}

	function championClick(event: any, id: string) {
		if (selectedChampions.includes(id)) {
			selectedChampions.splice(selectedChampions.indexOf(id), 1);
		} else {
			if (canSelect) selectedChampions.push(id);
		}
	}
</script>

<div class="flex w-full flex-wrap content-start justify-center">
	{#each championsOrdered as champion}
		{@const playerChampion = playerMasteriesMap?.get(champion?.key)}
		{@const level = playerChampion?.championLevel}
		<Tooltip>
			{#snippet text()}
				<button
					class="relative m-1 ring-amber-400 transition-all duration-75"
					class:ring-2={selectedChampions.includes(champion.id)}
					class:cursor-pointer={canSelect || selectedChampions.includes(champion.id)}
					onclick={(e) => championClick(e, champion.id)}
					class:opacity-35={lowOpacityChampions.includes(champion.id)}
				>
					<img
						src={`/img/cache/datadragon/champion/${champion.image.full}`}
						alt={champion.name}
						class="w-16"
					/>
					<div
						class={[
							'absolute',
							'right-0',
							'bottom-0',
							'rounded-tl-[50%]',
							'px-2',
							'pt-0.5',
							'text-sm',
							'font-bold',
							masteryLevelToColor(level)
						]}
					>
						{level}
					</div>
				</button>
			{/snippet}
			<div>
				<div>{champion.name}</div>
				{#if playerChampion}
					<div>
						Lvl.{numberFormat.format(level)} ({numberFormat.format(playerChampion.championPoints)} pts)
					</div>
				{/if}
			</div>
		</Tooltip>
	{/each}
</div>
