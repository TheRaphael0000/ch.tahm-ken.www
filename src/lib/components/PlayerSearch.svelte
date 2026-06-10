<script lang="ts">
	import { Button, Option, Select, InputText } from '$lib/components';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import regions from 'data/regions.json';
	import Tooltip from './Tooltip.svelte';
	import { numberFormat } from '$lib/utils';

	let { children = undefined, playerData = $bindable(undefined) } = $props();

	let region: string = $state('');
	let summoner: string = $state('');

	if (browser) {
		summoner = page.url.searchParams.get('summoner')?.replace('-', '#') ?? '';
		region = page.url.searchParams.get('region') ?? '';
	}

	$effect(() => {
		if (browser) {
			const urlSummoner = page.url.searchParams.get('summoner') ?? '';
			const urlRegion = page.url.searchParams.get('region') ?? '';

			if (urlSummoner && urlRegion) {
				(async () => {
					const response = await fetch(`/api/player_data/${urlRegion}/${urlSummoner}`);
					playerData = (await response.json()).at(0);
					if (playerData) {
						summoner = `${playerData?.account?.gameName}#${playerData?.account?.tagLine}`;
					}
				})();
			} else {
				playerData = undefined;
				summoner = '';
				region = '';
			}
		}
	});

	$effect(() => {
		if (browser) {
			if (region === '') {
				region = localStorage.getItem('region') || 'EUW1'; // set default region to EUW1 rather than none
				summoner = localStorage.getItem('summoner') || '';
			}
			localStorage.setItem('region', region);
			localStorage.setItem('summoner', summoner);
		}
	});

	function search(event: any) {
		event.preventDefault();
		let url = `${page.url.pathname}?region=${region}&summoner=${summoner.replace('#', '-')}`;
		goto(url);
	}
</script>

<div>
	<div class="flex w-full gap-3">
		<form class="flex" onsubmit={search}>
			<Select bind:value={region}>
				{#each regions as region}
					<Option value={region.id}>{region.abbreviation}</Option>
				{/each}
			</Select>
			<InputText
				class="-ml-px {playerData == undefined ? 'text-red-500' : 'text-green-500'}"
				title="Search your account"
				placeholder="Summoner name#tag..."
				bind:value={summoner}
			/>
			<Button class="-ml-px" type="submit">Search</Button>
		</form>
		{#if playerData}
			<img
				class="h-10 max-h-10 w-10 max-w-10"
				src={`/img/cache/datadragon/profileicon/${playerData?.summoner?.profileIconId}.png`}
				alt={'icon' + playerData?.summoner?.profileIconId}
			/>
			<Tooltip>
				{numberFormat.format(playerData.challenges.totalPoints.current)} / {numberFormat.format(
					playerData.challenges.totalPoints.max
				)}
				{#snippet text()}
					<img
						class="h-10 max-h-10 w-10 max-w-10"
						src="/img/challengecrystal/{playerData?.challenges?.totalPoints?.level?.toLocaleLowerCase() ??
							'iron'}.ls_c2.png"
						alt={playerData?.challenges?.totalPoints?.level?.toLocaleLowerCase() ?? 'iron'}
					/>
				{/snippet}
			</Tooltip>
		{/if}
		{#if children}
			{@render children()}
		{/if}
	</div>
</div>
