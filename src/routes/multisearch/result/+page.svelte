<script lang="ts">
	import { page } from '$app/state';
	import { championsMapKey, challengesSite } from '$lib/challenges';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import { browser } from '$app/environment';
	import HelpText from '$lib/components/HelpText.svelte';

	let multisearch: any = $state();
	let order: Map<number, { completion: number; mae: number }> = $state(new Map());
	let completion: Map<string, number> = $state(new Map());
	let showMasteries: boolean = $state(false);

	let orderedMultiSearch = $derived.by(() => {
		return multisearch?.toSorted((a: any, b: any) => {
			const aCompletion = completion.get(a.account.puuid) ?? 0;
			const bCompletion = completion.get(b.account.puuid) ?? 0;
			return aCompletion - bCompletion;
		});
	});

	let ordredChallenges = $derived.by(() => {
		return challengesSite?.toSorted((a, b) => {
			const aOrder = order.get(a.id);
			const bOrder = order.get(b.id);
			if (aOrder?.completion != bOrder?.completion)
				return (aOrder?.completion ?? 0) - (bOrder?.completion ?? 0);
			return (bOrder?.mae ?? 0) - (aOrder?.mae ?? 0);
		});
	});

	$effect(() => {
		if (browser) {
			const urlParams = page.url.searchParams;
			const summoners = urlParams.get('summoners');
			const region = urlParams.get('region');

			if (!summoners || !region) {
				return;
			}

			(async () => {
				const response = await fetch(`/api/player_data/${region}/${summoners}`);
				multisearch = await response.json();
				order = computeOrder();
				completion = computeCompletion();
			})();
		}
	});

	function computeOrder() {
		const output = new Map<number, { completion: number; mae: number }>();

		for (let challenge of challengesSite) {
			const line = { completion: 0, mae: 0 };
			for (let summoner of multisearch) {
				const summonerChallenge = summoner.challenges.challenges.find(
					(c: any) => c.challengeId == challenge.id
				);
				const value = summonerChallenge?.value ?? 0;
				const threshold = challenge.thresholds.MASTER.value;
				if (value >= threshold) line.completion += 1;
				else line.mae += (threshold - value) / multisearch.length;
			}
			challenge.completion = line;
			output.set(challenge.id, line);
		}
		return output;
	}

	function computeCompletion() {
		const output = new Map<string, number>();
		for (let summoner of multisearch) {
			let completed = 0;
			let total = 0;
			for (let challenge of challengesSite) {
				const summonerChallenge = summoner.challenges.challenges.find(
					(c: any) => c.challengeId == challenge.id
				);
				const value = summonerChallenge?.value ?? 0;
				const threshold = challenge.thresholds.MASTER.value;
				total += threshold;
				completed += Math.min(value, threshold);
			}
			output.set(summoner.account.puuid, completed / total);
		}
		return output;
	}
</script>

<p><i>Hover to see the challenge name</i></p>

<p class="text-right">
	<label>
		Show masteries
		<input type="checkbox" bind:checked={showMasteries} />
	</label>
</p>

<table>
	<thead>
		<tr>
			<th class="py-2 text-left" colspan="4">Summoners</th>
			<th class="py-2 text-left">Challenges</th>
		</tr>
	</thead>
	<tbody>
		{#each orderedMultiSearch as summoner}
			{@const account = summoner.account}
			{@const challenges = summoner.challenges}
			{@const globalLevel = challenges.totalPoints.level.toLocaleLowerCase()}
			{@const icon = summoner.summoner.profileIconId}
			{@const championMasteries = summoner.champion_masteries.toSorted(
				(c: any) => -c.championLevel
			)}

			<tr>
				<td>
					<img
						class="h-10 max-h-10 w-10 max-w-10"
						src={`/img/cache/datadragon/profileicon/${icon}.png`}
						alt={'icon' + icon}
					/>
				</td>
				<td class="px-2">
					<span class="whitespace-nowrap">{account.gameName}</span><span
						class="text-xs text-gray-500">#{account.tagLine}</span
					>
				</td>

				<td class="px-2 text-right">
					{(100 * (completion.get(summoner.account.puuid) ?? 0)).toFixed(1)}%
				</td>

				<td>
					<img
						class="h-10 max-h-10 w-10 max-w-10"
						src="/img/challengecrystal/{globalLevel}.ls_c2.png"
						alt={globalLevel}
					/>
				</td>

				<td class="flex flex-row flex-wrap">
					{#each ordredChallenges as challenge}
						{@const allChallenges = challenges.challenges}
						{@const summonerChallenge = allChallenges.find(
							(c: any) => c.challengeId == challenge.id
						)}
						{@const challengeLevel = summonerChallenge?.level ?? 'IRON'}
						<div class="flex flex-col">
							<div class="relative">
								<Tooltip>
									{#snippet text()}
										<span class="absolute right-1 bottom-0 text-right"
											>{summonerChallenge?.value ?? '0'}</span
										>
										<img
											class="h-9 max-h-9 w-9 max-w-9"
											src={`/img/cache/datadragon/challenges-images/${challenge.id}-${challengeLevel}.png`}
											alt={challengeLevel}
										/>
									{/snippet}
									<div class="text-nowrap">{challenge.name}: {challenge.label}</div>
								</Tooltip>
							</div>

							{#if showMasteries}
								{#each Array(3) as a, i}
									{@const hasChamps = challenge.availableIds.length > 0}
									{@const championMasteriesChallenge = championMasteries.filter((c: any) =>
										hasChamps
											? challenge.availableIds.includes(c.championId)
											: championsMapKey.keys()
									)}
									{@const masteries = championMasteriesChallenge.at(i)}
									{@const championId = masteries?.championId?.toString()}
									{@const champion = championsMapKey?.get(championId)}
									{@const level = masteries?.championLevel}
									<div class="relative h-9 max-h-9 w-9 max-w-9 text-center">
										{#if champion}
											<img src={`/img/cache/${champion?.image?.full}`} alt={champion?.name} />
											<div
												class={[
													'absolute right-0 bottom-0 rounded-tl-[50%] bg-black/50 px-1 pt-0.5 text-xs font-bold'
												]}
											>
												{level}
											</div>
										{/if}
									</div>
								{/each}
							{/if}
						</div>
					{/each}
				</td>
			</tr>
		{/each}
		<tr class="h-3 border-b"> </tr>
		<tr>
			<td class="py-2 italic" colspan="4">
				Completion
				<Tooltip>
					{#snippet text()}
						<HelpText>?</HelpText>
					{/snippet}
					Number of players who completed the challenge.
				</Tooltip>
			</td>

			<td class="flex flex-row flex-wrap">
				{#each ordredChallenges as challenge}
					<div class="h-9 max-h-9 w-9 max-w-9 text-center">
						{order.get(challenge.id)?.completion.toFixed(0)}
					</div>
				{/each}
			</td>
		</tr>
		<tr>
			<td class="py-2 italic" colspan="4"
				>MAE
				<Tooltip>
					{#snippet text()}
						<HelpText>?</HelpText>
					{/snippet}
					Mean absolute error: The average missing challenges to master.
				</Tooltip>
			</td>
			<td class="flex flex-row flex-wrap">
				{#each ordredChallenges as challenge}
					<div class="h-9 max-h-9 w-9 max-w-9 text-center">
						{order.get(challenge.id)?.mae.toFixed(1)}
					</div>
				{/each}
			</td>
		</tr>
	</tbody>
</table>
