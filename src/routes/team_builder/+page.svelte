<script lang="ts">
	import { Button, InputText } from '$lib/components';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import {
		champions,
		championsMap,
		getChampions,
		getChallengeRequirements,
		challengesGroups,
		challengesSite,
		ensureChallengeLevelRank
	} from '$lib/challenges';
	import { goto } from '$app/navigation';
	import HelpText from '$lib/components/HelpText.svelte';
	import Pill from '$lib/components/Pill.svelte';
	import PlayerSearch from '$lib/components/PlayerSearch.svelte';
	import ChampionPool from '$lib/components/ChampionPool.svelte';

	const selectedChampions: string[] = $state([]);
	let challengesSelected: any[] = $state([]);
	let textfilterChampions: string = $state('');

	let challengesCompleted: number = $derived.by(() => {
		let i = 0;
		for (let challenge of challengesSite) {
			const summonerChallenge = playerChallengesMap?.get(challenge?.id);
			const value = summonerChallenge?.value ?? 0;
			const threshold = challenge.thresholds.MASTER.value;
			i += Math.min(value, threshold);
		}
		return i;
	});

	let challengesTotal: number = $derived.by(() => {
		let i = 0;
		for (let challenge of challengesSite) {
			const threshold = challenge.thresholds.MASTER.value;
			i += threshold;
		}
		return challengesCompleted;
	});

	let showCompleted: boolean = $state(true);

	let playerData: any = $state(undefined);

	const playerChallengesMap: Map<number, any> = $derived.by(
		() => new Map(playerData?.challenges?.challenges?.map((c: any) => [c?.challengeId, c]))
	);
	const topChampions: string[] = $derived.by(() =>
		getChampions(challengesSelected).map((c) => c.id)
	);

	const championsForUnSelectedChallenges = $derived.by(() => {
		const challengesChampions = getChampions(challengesSelected);
		return champions.filter((c) => !challengesChampions.includes(c));
	});

	const lowOpacityChampions = $derived(
		challengesSelected.length <= 0 ? [] : championsForUnSelectedChallenges.map((c) => c.id)
	);
	const canSelect = $derived(selectedChampions.length < 5);

	let championsFiltered = $derived.by(() => {
		return champions.filter((c) =>
			c.name.toLocaleLowerCase().includes(textfilterChampions?.toLocaleLowerCase())
		);
	});

	function filterKey(event: any) {
		if (event.key == 'Enter' && championsFiltered.length == 1) {
			let id = championsFiltered?.at(0)?.id ?? '';

			if (selectedChampions.includes(id)) {
				selectedChampions.splice(selectedChampions.indexOf(id), 1);
			} else {
				if (canSelect) selectedChampions.push(id);
			}

			textfilterChampions = '';
		}
	}

	function clear(event: any) {
		selectedChampions.splice(0, selectedChampions.length);
		challengesSelected = challengesSelected.filter((a) => false);
	}

	function optimize(event: any) {
		event.preventDefault();
		let url = `optimizer?challenges=${challengesSelected.map((c) => c.id).join(',')}&champions=${selectedChampions.join(',')}`;
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
<div class="flex flex-col gap-3 p-3 2xl:flex-row">
	<div class="flex flex-col gap-3">
		<div class="flex flex-wrap items-center justify-start gap-3 2xl:flex-nowrap">
			<PlayerSearch bind:playerData></PlayerSearch>
			{#if playerData}
				<Pill class="my-auto">
					{challengesCompleted}/{challengesTotal}
				</Pill>

				<div>
					<Button
						title="Show/Hide completed challenges"
						onclick={() => (showCompleted = !showCompleted)}
					>
						{#if showCompleted}
							Hide Completed
						{:else}
							Show Completed
						{/if}
					</Button>
				</div>
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
					{@const mainPlayerChallengeLevel = ensureChallengeLevelRank(mainPlayerChallenge?.level)}
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
							selectedChampions.includes(champion.id)
						)}
						{@const missingDots = Math.max(
							getChallengeRequirements(challenge) - championsSelectedChallenge.length,
							0
						)}
						{@const playerChallenge = playerChallengesMap?.get(challenge?.id)}
						{@const playerChallengeLevel = ensureChallengeLevelRank(playerChallenge?.level)}
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
					{/each}
				{/each}
			</tbody>
		</table>
	</div>
	<div class="flex flex-col gap-3">
		<div class="flex flex-wrap items-center justify-center gap-3 2xl:flex-nowrap">
			<InputText
				title="Search for champions, enter allows you to selected when only one champion matches the search"
				placeholder="Search champion..."
				bind:value={textfilterChampions}
				onkeypress={filterKey}
			/>
			<div class="flex items-center gap-3">
				{#each Array.from(Array(5).keys()) as i}
					{@const championSelected = selectedChampions.at(i) ?? ''}
					{@const champion = championsMap.get(championSelected)}

					<div class={['h-10', 'w-10', champion == undefined ? 'p-2.75' : '']}>
						{#if champion == undefined}
							<div class="v-full h-full rounded-full bg-white/50"></div>
						{:else}
							<button
								class="cursor-pointer"
								onclick={() => selectedChampions.splice(selectedChampions.indexOf(champion.id), 1)}
							>
								<img
									src={`/img/cache/datadragon/champion/${champion?.image.full}`}
									alt={champion.name}
								/>
							</button>
						{/if}
					</div>
				{/each}
			</div>
			<Button title="Clear selections" onclick={clear}>Clear</Button>
			<!-- <Button class="m-3" title="Copy a link to your current selection to the clipboard">
					Share
				</Button> -->
			<Button
				title="Find compositions that satify the current selection (selected champions and challenges)."
				onclick={optimize}
			>
				Optimize selection
			</Button>
		</div>

		<ChampionPool
			{playerData}
			{canSelect}
			{textfilterChampions}
			{topChampions}
			{selectedChampions}
			{lowOpacityChampions}
		/>
	</div>
</div>
