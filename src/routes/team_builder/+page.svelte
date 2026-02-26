<script lang="ts">
	import { Button, InputText, Select, Option } from '$lib/components';
	import regions from 'data/regions.json';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import {
		champions,
		championsMap,
		getChampions,
		getChallengeRequirements,
		challengesGroups,
		challengesSite
	} from '$lib/challenges';
	import { goto } from '$app/navigation';
	import HelpText from '$lib/components/HelpText.svelte';
	import Pill from '$lib/components/Pill.svelte';

	const championsSelected: string[] = $state([]);
	let challengesSelected: any[] = $state([]);
	let summoner: string = $state('');
	let region: string = $state('');
	let icon: string = $state('');
	let globalLevel: string = $state('');
	let championFilter: string = $state('');

	let challengesCompleted: number = $state(0);
	let challengesTotal: number = $state(0);
	let showCompleted: boolean = $state(true);

	const numberFormat = new Intl.NumberFormat();

	const championsKeyForSelectedChallenges = $derived(
		getChampions(challengesSelected).map((c) => c.key)
	);
	let playerData: any = $state(undefined);
	const playerMasteriesMap: Map<string, any> = $derived.by(
		() => new Map(playerData?.champion_masteries?.map((c: any) => [c?.championId?.toString(), c]))
	);
	const playerChallengesMap: Map<number, any> = $derived.by(
		() => new Map(playerData?.challenges?.challenges?.map((c: any) => [c?.challengeId, c]))
	);
	const canAdd = $derived(championsSelected.length < 5);
	let championsFiltered = $derived.by(() => {
		return champions.filter((c) =>
			c.name.toLocaleLowerCase().includes(championFilter?.toLocaleLowerCase())
		);
	});
	const championsOrdered = $derived(orderChampions(championsFiltered));

	if (browser) {
		summoner = page.url.searchParams.get('summoner')?.replace('-', '#') ?? '';
		region = page.url.searchParams.get('region') ?? '';
	}

	$effect(() => {
		if (browser) {
			if (region === '') {
				region = localStorage.getItem('region') || 'EUW1'; // set default region to EUW1 rather than none
			}
			localStorage.setItem('region', region);
		}
	});

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
						globalLevel = playerData.challenges.totalPoints.level.toLocaleLowerCase();
						icon = playerData.summoner.profileIconId;
						challengesCompleted = 0;
						challengesTotal = 0;
						for (let challenge of challengesSite) {
							const summonerChallenge = playerChallengesMap?.get(challenge?.id);
							const value = summonerChallenge?.value ?? 0;
							const threshold = challenge.thresholds.MASTER.value;
							challengesCompleted += Math.min(value, threshold);
							challengesTotal += threshold;
						}
					}
				})();
			} else {
				playerData = undefined;
				summoner = '';
				region = '';
			}
		}
	});

	function orderChampions(champions: any) {
		// order by name first
		let order = champions.toSorted((a: any, b: any) => {
			if (championsKeyForSelectedChallenges.length > 0) {
				const challengeA = championsKeyForSelectedChallenges.includes(a?.key) ? 1 : 0;
				const challengeB = championsKeyForSelectedChallenges.includes(b?.key) ? 1 : 0;
				const challengeDiff = challengeB - challengeA;
				if (challengeDiff != 0) return challengeDiff;
			}

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
		});

		return order;
	}

	function filterKey(event: any) {
		if (event.key == 'Enter' && championsFiltered.length == 1) {
			championClick(undefined, championsFiltered?.at(0)?.id ?? '');
			championFilter = '';
		}
	}

	function championClick(event: any, id: string) {
		if (championsSelected.includes(id)) {
			championsSelected.splice(championsSelected.indexOf(id), 1);
		} else {
			if (canAdd) championsSelected.push(id);
		}
	}

	function clear(event: any) {
		championsSelected.splice(0, championsSelected.length);
		challengesSelected = challengesSelected.filter((a) => false);
	}

	function search(event: any) {
		event.preventDefault();
		let url = `${page.url.pathname}?region=${region}&summoner=${summoner.replace('#', '-')}`;
		goto(url);
	}

	function optimize(event: any) {
		event.preventDefault();
		let url = `optimizer?challenges=${challengesSelected.map((c) => c.id).join(',')}&champions=${championsSelected.join(',')}`;
		goto(url);
	}
</script>

<svelte:head>
	<title>Team Builder - Tahm-Ken.ch</title>
	<meta
		name="description"
		content="Team builder for Harmony and Globtrotter challenges in League of Legends"
	/>
</svelte:head>

{#snippet helpText()}
	<HelpText>?</HelpText>
{/snippet}

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="team_builder px-6">
	<div class="col1">
		<div class="my-2 flex w-full justify-center gap-3">
			<form class="flex" onsubmit={search}>
				<Select class="rounded-r-none" bind:value={region}>
					{#each regions as region}
						<Option value={region.id}>{region.abbreviation}</Option>
					{/each}
				</Select>
				<InputText
					class="-ml-px rounded-none {playerData == undefined ? 'text-red-500' : 'text-green-500'}"
					title="Search your account"
					placeholder="Summoner name#tag..."
					bind:value={summoner}
				/>
				<Button class="-ml-px rounded-l-none" type="submit">
					<i class="fa-solid fa-fw fa-magnifying-glass"></i>
				</Button>
			</form>
			{#if playerData}
				<img
					class="h-10 max-h-10 w-10 max-w-10"
					src={`/img/cache/datadragon/profileicon/${icon}.png`}
					alt={'icon' + icon}
				/>
				<img
					class="h-10 max-h-10 w-10 max-w-10"
					src="/img/challengecrystal/{globalLevel}.ls_c2.png"
					alt={globalLevel}
				/>
				<Pill class="my-auto">
					{challengesCompleted}/{challengesTotal}
				</Pill>

				<Button
					title="Show/Hide completed challenges"
					onclick={() => (showCompleted = !showCompleted)}
				>
					{#if showCompleted}
						<i class="fa-solid fa-fw fa-eye"></i>
					{:else}
						<i class="fa-solid fa-fw fa-eye-slash"></i>
					{/if}
				</Button>
			{/if}
		</div>

		<table class="mb-auto w-full">
			<thead>
				<tr>
					<th class="px-2"></th>
					<th class="px-2 text-right">&nbsp;&nbsp;#</th>
					<th class="px-2 text-left">Challenges</th>
					<th class="px-2 text-left">Label</th>
					<th class="px-2"></th>
					<th class="px-2 text-left">Selection</th>
				</tr>
			</thead>
			<tbody>
				{#each challengesGroups as challengeGroup}
					{@const main = challengeGroup.main}
					{@const mainPlayerChallenge = playerChallengesMap?.get(main?.id)}
					{@const mainPlayerChallengeLevel = mainPlayerChallenge?.level ?? 'IRON'}
					<tr>
						<td class="px-2"></td>
						<td class="px-2"></td>
						<th class="px-2 text-left">{main.name}</th>
						<td class="px-2"></td>
						<td class="px-2 text-left">
							<Tooltip text={helpText}>
								{main.description}
							</Tooltip>
						</td>
						{#if playerData}
							<td class="px-2 text-center"> </td>
							<td>
								<img
									class="h-6 max-h-6 w-6 max-w-6"
									src={`/img/cache/datadragon/challenges-images/${main.id}-${mainPlayerChallengeLevel}.png`}
									alt={mainPlayerChallengeLevel}
								/>
							</td>
							<td></td>
						{/if}
					</tr>
					{#each challengeGroup.challenges as challenge}
						{@const championsChallenge = getChampions([challenge])}
						{@const championsSelectedChallenge = championsChallenge.filter((champion: any) =>
							championsSelected.includes(champion.id)
						)}
						{@const missingDots = Math.max(
							getChallengeRequirements(challenge) - championsSelectedChallenge.length,
							0
						)}
						{@const playerChallenge = playerChallengesMap?.get(challenge?.id)}
						{@const playerChallengeLevel = playerChallenge?.level ?? 'IRON'}
						{@const playerChallengeValue = playerChallenge?.value ?? 0}
						{@const threshold = challenge.thresholds.MASTER.value}
						{@const showRow = showCompleted || playerChallengeValue < threshold}

						{#if showRow}
							<tr class:text-amber-400={missingDots <= 0}>
								<td class="px-2 pt-0.5 text-right"
									><input
										type="checkbox"
										id={`challenge_cb_${challenge.internalId}`}
										class="cursor-pointer"
										bind:group={challengesSelected}
										value={challenge}
									/></td
								>
								<td class="px-2 text-right">
									<label
										for={`challenge_cb_${challenge.internalId}`}
										class="cursor-pointer"
										style="width:30px; display inline-block;"
									>
										{getChampions([...challengesSelected, challenge]).length}
									</label>
								</td>
								<td class="px-2 text-left">
									<label
										for={`challenge_cb_${challenge.internalId}`}
										class="cursor-pointer text-nowrap"
									>
										{challenge.name}
									</label>
								</td>
								<td class="px-2 text-left">
									<label
										for={`challenge_cb_${challenge.internalId}`}
										class="cursor-pointer text-nowrap"
									>
										{challenge.label}
									</label>
								</td>
								<td class="px-2 text-left">
									<Tooltip text={helpText}>
										{challenge.description}
									</Tooltip>
								</td>
								<td class="px-2 text-left">
									<div class="flex items-center">
										{#each championsSelectedChallenge as championSelectedChallenge}
											<div class="mx-0.5 h-5 w-5">
												<img
													src={`/img/cache/datadragon/champion/${championSelectedChallenge?.image.full}`}
													alt={championSelectedChallenge?.name}
												/>
											</div>
										{/each}
										{#each Array(missingDots) as i}
											<div class="mx-0.5 h-5 w-5 p-1.25">
												<div class="v-full h-full rounded-full bg-white/50"></div>
											</div>
										{/each}
									</div>
								</td>

								{#if playerData}
									<td>
										<img
											class="h-6 max-h-6 w-6 max-w-6"
											src={`/img/cache/datadragon/challenges-images/${challenge.id}-${playerChallengeLevel}.png`}
											alt={playerChallengeLevel}
										/>
									</td>
									<td class="px-2 text-center">
										{#if playerChallengeValue >= threshold}
											{playerChallengeValue}
										{:else}
											{playerChallengeValue} / {threshold}
										{/if}
									</td>
								{/if}
							</tr>
						{/if}
					{:else}
						<tr>
							<td>You've finished!</td>
						</tr>
					{/each}
				{/each}
			</tbody>
		</table>
	</div>
	<div class="col2">
		<div class="w-full">
			<div class="my-2 flex justify-center gap-2">
				<InputText
					title="Search for champions, enter allows you to selected when only one champion matches the search"
					placeholder="Search champion..."
					bind:value={championFilter}
					onkeypress={filterKey}
				/>
				<div class="flex items-center gap-3">
					{#each Array.from(Array(5).keys()) as i}
						{@const championSelected = championsSelected.at(i) ?? ''}
						{@const champion = championsMap.get(championSelected)}

						<div class={['h-10', 'w-10', champion == undefined ? 'p-2.75' : '']}>
							{#if champion == undefined}
								<div class="v-full h-full rounded-full bg-white/50"></div>
							{:else}
								<button class="cursor-pointer" onclick={(e) => championClick(e, champion.id)}>
									<img
										src={`/img/cache/datadragon/champion/${champion?.image.full}`}
										alt={champion.name}
									/>
								</button>
							{/if}
						</div>
					{/each}
				</div>
				<Button title="Clear selections" onclick={clear}>
					<i class="fa-solid fa-fw fa-trash"></i> Clear
				</Button>
				<!-- <Button class="m-3" title="Copy a link to your current selection to the clipboard">
					<i class="fa-solid fa-share"></i> Share
				</Button> -->
				<Button
					title="Find compositions that satify the current selection (selected champions and challenges)."
					onclick={optimize}
				>
					<i class="fa-solid fa-wand-magic-sparkles"></i> Optimize selection
				</Button>
			</div>
		</div>

		<div class="flex w-full flex-wrap content-start justify-center">
			{#each championsOrdered as champion}
				{@const playerChampion = playerMasteriesMap?.get(champion?.key)}
				{@const level = playerChampion?.championLevel}
				<Tooltip>
					{#snippet text()}
						<button
							class="relative m-1 ring-amber-400 transition-all duration-75"
							class:ring-2={championsSelected.includes(champion.id)}
							class:cursor-pointer={canAdd || championsSelected.includes(champion.id)}
							onclick={(e) => championClick(e, champion.id)}
							class:opacity-35={!championsKeyForSelectedChallenges.includes(champion.key) &&
								championsKeyForSelectedChallenges.length != 0}
						>
							<img
								src={`/img/cache/datadragon/champion/${champion.image.full}`}
								alt={champion.name}
								class="w-16"
							/>
							<div
								class={[
									'absolute right-0 bottom-0 rounded-tl-[50%] px-2 pt-0.5 text-sm font-bold',
									{ 'bg-pink-800/80': level >= 10 },
									{ 'bg-yellow-700/80': level == 9 },
									{ 'bg-fuchsia-800/80': level == 8 },
									{ 'bg-blue-800/80': level == 7 },
									{ 'bg-green-600/80': level == 6 },
									{ 'bg-sky-700/80': level == 5 },
									{ 'bg-black/80': level < 5 }
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
								Lvl.{numberFormat.format(level)} ({numberFormat.format(
									playerChampion.championPoints
								)} pts)
							</div>
						{/if}
					</div>
				</Tooltip>
			{/each}
		</div>
	</div>
</div>

<style>
	.team_builder {
		display: grid;
		gap: 5px;
		grid-template-columns: 678px auto;
		grid-template-areas: 'col1 col2';
	}

	@media screen and (max-width: 1000px) {
		.col1 {
			grid-area: 1 / span 2 !important;
		}
		.col2 {
			grid-area: 2 / span 2 !important;
		}
	}

	@media screen and (min-width: 1000px) {
		.col1 {
			grid-area: col1;
		}
		.col2 {
			grid-area: col2;
		}
	}
</style>
