<script lang="ts">
	import {
		challengesById,
		champions,
		championsMapKey,
		ensureChallengeLevelRank
	} from '$lib/challenges';
	import { InputText } from '$lib/components';
	import Button from '$lib/components/Button.svelte';
	import ChallengeHover from '$lib/components/ChallengeHover.svelte';
	import ChampionPool from '$lib/components/ChampionPool.svelte';
	import HelpText from '$lib/components/HelpText.svelte';
	import Pill from '$lib/components/Pill.svelte';
	import PlayerSearch from '$lib/components/PlayerSearch.svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import { masteryLevelToColor, numberFormat } from '$lib/utils';

	let playerData: any = $state(undefined);
	let textfilterChampions: string = $state('');

	const playerMasteriesMap: Map<string, any> = $derived.by(
		() => new Map(playerData?.champion_masteries?.map((c: any) => [c?.championId?.toString(), c]))
	);
	const playerChallengesMap: Map<number, any> = $derived.by(
		() => new Map(playerData?.challenges?.challenges?.map((c: any) => [c?.challengeId, c]))
	);

	const masteryPoints = {
		1: 1,
		2: 1800,
		3: 6000,
		4: 12600,
		5: 21600,
		6: 31600,
		7: 42600,
		8: 53600,
		9: 64600,
		10: 75600
	};

	const championsMasteryPoints = $derived(
		champions.map((c) => playerMasteriesMap.get(c.key)?.championPoints ?? 0)
	);
	const totalchampionsMasteryPoints = $derived(
		championsMasteryPoints.reduce((a: number, b: number) => a + b, 0)
	);

	const guruChallenge = challengesById.get(401100);
	const guruChallenges = [
		// Catch 'em All
		{ challengeId: 401101, missingPoints: () => computeMissingPoints(champions, 100000, 150) },
		// Wise Master
		{
			challengeId: 401102,
			missingPoints: () =>
				Math.max(
					0,
					challengesById.get(401102)?.thresholds?.MASTER?.value - totalchampionsMasteryPoints
				)
		},
		// One-Trick
		{
			challengeId: 401103,
			missingPoints: () =>
				Math.max(
					0,
					challengesById.get(401103)?.thresholds?.MASTER?.value -
						Math.max(...championsMasteryPoints)
				)
		},
		// Master Yourself
		{
			challengeId: 401104,
			missingPoints: () =>
				computeMissingPoints(
					champions,
					masteryPoints[5],
					challengesById.get(401104)?.thresholds?.MASTER?.value
				)
		},
		// Master the Enemy (Legacy)
		{
			challengeId: 401105,
			missingPoints: () =>
				computeMissingPoints(
					champions,
					masteryPoints[7],
					challengesById.get(401105)?.thresholds?.MASTER?.value
				)
		},
		// Jack of All Champs
		{ challengeId: 401106, missingPoints: () => -1 },
		// Master the Enemy
		{
			challengeId: 401107,
			missingPoints: () =>
				computeMissingPoints(
					champions,
					masteryPoints[10],
					challengesById.get(401107)?.thresholds?.MASTER?.value
				)
		}
	];
	const guruLevel = $derived(
		ensureChallengeLevelRank(playerChallengesMap?.get(guruChallenge.id)?.level)
	);

	const virtuosoChallenge = challengesById.get(401200);
	const virtuosoLevel = $derived(
		ensureChallengeLevelRank(playerChallengesMap?.get(virtuosoChallenge.id)?.level)
	);
	const virtuosoChallenges = [
		['Assassins', 401201, 401207],
		['Fighters', 401202, 401208],
		['Mages', 401203, 401209],
		['Marksmen', 401204, 401210],
		['Supports', 401205, 401211],
		['Tanks', 401206, 401212]
	];

	const masteryLevels = $derived(
		champions.map((c) => playerMasteriesMap.get(c.key)?.championLevel ?? 0) ?? []
	);
	const defaultMasteryFilter = [10, 9, 8, 7, 6, 5, 4];
	const defaultVirtuosoFilter: number[] = [];
	let masteryFilter: number[] = $state(defaultMasteryFilter);
	let virtuosoFilter: number[] = $state(defaultVirtuosoFilter);

	function resetFilters() {
		masteryFilter = defaultMasteryFilter;
		virtuosoFilter = defaultVirtuosoFilter;
	}

	function computeMissingPoints(
		challengeChampions: any[],
		targetPointsPerChampions: number,
		championsNeeded: number
	) {
		const championsMissingPoints = challengeChampions.map(
			(c: any) =>
				targetPointsPerChampions -
				Math.min(playerMasteriesMap.get(c.key)?.championPoints ?? 0, targetPointsPerChampions)
		);
		const totalMissingPoints = championsMissingPoints
			.sort()
			.slice(0, championsNeeded)
			.reduce((a, b) => a + b, 0);
		return totalMissingPoints;
	}

	const championsFilteredByLevel = $derived.by(() => {
		return new Set<string>(
			champions
				.filter((c) => {
					let level = playerMasteriesMap.get(c.key)?.championLevel ?? 0;
					return (
						masteryFilter.includes(level) ||
						(level >= 10 && masteryFilter.includes(10)) ||
						(level <= 4 && masteryFilter.includes(4))
					);
				})
				.map((c) => c.id)
		);
	});

	const championsFilteredByRole = $derived.by(() => {
		if (virtuosoFilter.length <= 0) return new Set<string>(champions.map((c) => c.id));

		let selectedChallengesAvailableIds = virtuosoFilter.map(
			(cid) =>
				new Set<string>(
					challengesById
						.get(cid)
						.availableIds.map((a: number) => championsMapKey.get(a.toString())?.id)
				)
		);

		let intersection = selectedChallengesAvailableIds.reduce(
			(a, b) => a.intersection(b),
			selectedChallengesAvailableIds.reduce((a, b) => a.union(b), new Set())
		);

		return intersection;
	});

	const topChampions: string[] = $derived.by(() => {
		return Array.from(championsFilteredByLevel.intersection(championsFilteredByRole));
	});

	const lowOpacityChampions: string[] = $derived.by(() => {
		return champions.filter((c) => !topChampions.includes(c.id)).map((c) => c.id);
	});
</script>

<svelte:head>
	<title>Masteries - Tahm-Ken.ch</title>
	<meta name="description" content="Masteries Overview. Guru and Virtuoso challenges" />
</svelte:head>

<div class="flex flex-col gap-3 lg:flex-row lg:items-start">
	<div class="flex flex-col gap-3">
		<div class="px-6">
			<PlayerSearch bind:playerData>
				<Button onclick={resetFilters}>Clear</Button>
			</PlayerSearch>
		</div>
		<div class=" bg-bg-light shadow-border flex flex-col gap-3 p-6">
			<!-- Filters -->
			<div class="flex justify-center gap-3">
				<Tooltip>
					{#snippet text()}
						<label class="flex items-center justify-center gap-1">
							<input type="checkbox" value={10} bind:group={masteryFilter} />
							<Pill bg={masteryLevelToColor(10)} fg="text-white" class="min-w-10">
								{masteryLevels.filter((l: number) => l >= 10).length}
							</Pill>
						</label>
					{/snippet}
					Mastery 10+
				</Tooltip>

				{#each [9, 8, 7, 6, 5] as li}
					<Tooltip>
						{#snippet text()}
							<label class="flex items-center justify-center gap-1">
								<input type="checkbox" value={li} bind:group={masteryFilter} />
								<Pill bg={masteryLevelToColor(li)} fg="text-white" class="min-w-10">
									{masteryLevels.filter((l: number) => l == li).length}
								</Pill>
							</label>
						{/snippet}
						Mastery {li}
					</Tooltip>
				{/each}

				<Tooltip>
					{#snippet text()}
						<label class="flex items-center justify-center gap-1">
							<input type="checkbox" value={4} bind:group={masteryFilter} />
							<Pill bg={masteryLevelToColor(4)} fg="text-white" class="min-w-10">
								{masteryLevels.filter((l: number) => l <= 4).length}
							</Pill>
						</label>
					{/snippet}
					Mastery 4-
				</Tooltip>
			</div>

			<!-- Guru -->
			<div class="flex flex-col items-center">
				<div>
					{guruChallenge?.name}
				</div>
				<div class="flex items-center">
					{playerChallengesMap?.get(guruChallenge.id)?.value ?? 0} /
					{guruChallenge?.thresholds?.MASTER?.value ?? 0}

					<div class="ml-2 h-5 w-5">
						<ChallengeHover id={virtuosoChallenge.id} level={virtuosoLevel} />
					</div>
				</div>

				<table class="w-full">
					<thead>
						<tr>
							<th class="text-left">Challenge</th>
							<th class="text-right">Completion</th>
							<th class="text-right">Missing Points</th>
						</tr>
					</thead>
					<tbody>
						{#each guruChallenges as { challengeId, missingPoints }}
							{@const challengeNew = challengesById.get(challengeId as number)}
							{@const playerDataChallengeNew = playerChallengesMap.get(challengeNew.id)}
							{@const playerChallengeLevelNew = ensureChallengeLevelRank(
								playerDataChallengeNew?.level
							)}
							<tr>
								<td>{challengeNew.name}</td>

								<td>
									<label class="flex items-center justify-end">
										{numberFormat.format(playerDataChallengeNew?.value ?? 0)} /
										{numberFormat.format(challengeNew?.thresholds?.MASTER?.value ?? 0)}

										<div class="ml-2 h-5 w-5">
											<ChallengeHover id={challengeNew.id} level={playerChallengeLevelNew} />
										</div>
									</label>
								</td>
								<td class="text-right">
									{#if missingPoints() < 0}
										N/A
									{:else}
										{numberFormat.format(missingPoints())} pts
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<!-- Virtoso -->
			<div class="flex flex-col items-center">
				<div>
					{virtuosoChallenge?.name}
				</div>
				<div class="flex items-center">
					{playerChallengesMap?.get(virtuosoChallenge.id)?.value ?? 0} /
					{virtuosoChallenge?.thresholds?.MASTER?.value ?? 0}

					<div class="ml-2 h-5 w-5">
						<ChallengeHover id={virtuosoChallenge.id} level={virtuosoLevel} />
					</div>
				</div>

				<table class="w-full whitespace-nowrap">
					<thead>
						<tr>
							<th></th>
							<th></th>
							<th class="text-left">Role</th>
							<th class="text-right">Legacy (7+)</th>
							<th class="text-right">New (10+)</th>
							<th class="text-right">
								<Tooltip
									>{#snippet text()}
										<HelpText>Missing points</HelpText>
									{/snippet}
									<div class="w-100 text-left font-normal">
										Sum of the closest champions to reach mastery 10 for the challenge.
									</div>
								</Tooltip>
							</th>
						</tr>
					</thead>
					<tbody>
						{#each virtuosoChallenges as [label, legacyId, newId]}
							{@const challengeLegacy = challengesById.get(legacyId as number)}
							{@const playerDataChallengeLegacy = playerChallengesMap.get(challengeLegacy.id)}
							{@const playerChallengeLevelLegacy = ensureChallengeLevelRank(
								playerDataChallengeLegacy?.level
							)}

							{@const challengeNew = challengesById.get(newId as number)}
							{@const playerDataChallengeNew = playerChallengesMap.get(challengeNew.id)}
							{@const playerChallengeLevelNew = ensureChallengeLevelRank(
								playerDataChallengeNew?.level
							)}
							{@const challengeChampions = champions.filter((champion) =>
								challengeNew.availableIds.includes(parseInt(champion.key))
							)}
							{@const missingPoints = computeMissingPoints(
								challengeChampions,
								masteryPoints[10],
								challengeNew?.thresholds?.MASTER?.value
							)}
							<tr>
								<td>
									<input
										id={legacyId as string}
										type="checkbox"
										value={legacyId as number}
										bind:group={virtuosoFilter}
									/>
								</td>
								<td>
									<label for={legacyId as string} class="flex">
										{challengeNew.availableIds.length}
									</label>
								</td>
								<td>
									<label for={legacyId as string} class="flex">
										{label}
									</label>
								</td>
								<td>
									<label for={legacyId as string} class="flex items-center justify-end">
										{playerDataChallengeLegacy?.value ?? 0} /
										{challengeLegacy?.thresholds?.MASTER?.value ?? 0}

										<div class="ml-2 h-5 w-5">
											<ChallengeHover id={challengeLegacy.id} level={playerChallengeLevelLegacy} />
										</div>
									</label>
								</td>
								<td>
									<label for={legacyId as string} class="flex items-center justify-end">
										{playerDataChallengeNew?.value ?? 0} /
										{challengeNew?.thresholds?.MASTER?.value ?? 0}

										<div class="ml-2 h-5 w-5">
											<ChallengeHover id={challengeNew.id} level={playerChallengeLevelNew} />
										</div>
									</label>
								</td>
								<td class="text-right">
									<label for={legacyId as string} class="flex justify-end">
										{numberFormat.format(missingPoints)} pts
									</label>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
	<div class="flex w-full flex-col items-center justify-start gap-3">
		<div class="flex flex-wrap justify-center">
			<InputText
				title="Search for champions, enter allows you to selected when only one champion matches the search"
				placeholder="Search champion..."
				bind:value={textfilterChampions}
			/>
		</div>
		<ChampionPool {playerData} {lowOpacityChampions} {topChampions} {textfilterChampions}
		></ChampionPool>
	</div>
</div>
