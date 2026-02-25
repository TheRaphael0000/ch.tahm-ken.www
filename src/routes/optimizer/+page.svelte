<script lang="ts">
	import { Article, H1 } from '$lib/components';
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { championsMap, championsMapKey, challenges, challengesById } from '$lib/challenges';
	import Button from '$lib/components/Button.svelte';
	import OptimizerWorker from '$lib/optimizer_worker?worker';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import HelpText from '$lib/components/HelpText.svelte';

	let url_challenges: string = $state('');
	let url_champions: string = $state('');
	let compositions: Map<number, any> = $state(new Map());
	let selected_limit: number = $state(35000);
	let computed_limit: number = $state(0);
	let selected_qte: number = $state(0);
	let showing: number = $state(50);
	let computing: boolean = $state(true);
	const challenges_ids = challenges.map((c) => c.id);
	let worker: Worker;

	let challenges_qte: number[] = $derived.by(() => {
		return [...compositions.keys()].sort().reverse();
	});

	let computed = $derived.by(() => {
		return compositions
			.values()
			.map((v) => v.length)
			.reduce((partialSum, a) => partialSum + a, 0);
	});

	let challenges_array = $derived.by(() => {
		return new Int32Array(url_challenges.split(',').map((c) => Number(c))).filter((k) =>
			challenges_ids.includes(k)
		);
	});

	let champions_array = $derived.by(() => {
		return new Int32Array(
			url_champions.split(',').map((c) => Number(championsMap.get(c)?.key) ?? -1)
		).filter((k) => championsMapKey.has(k.toString()));
	});

	if (browser) {
		url_challenges = page.url.searchParams.get('challenges') ?? '';
		url_champions = page.url.searchParams.get('champions') ?? '';
	}

	onMount(async () => {
		optimize();
	});

	onDestroy(() => {
		worker?.terminate();
	});

	function optimize() {
		worker?.terminate();
		computing = true;
		computed_limit = selected_limit;
		compositions = new Map();
		worker = new OptimizerWorker();
		worker.onmessage = (e) => {
			compositions = e.data;
			selected_qte = challenges_qte.at(0) ?? 0;
			computing = false;
			worker.terminate();
		};

		worker.postMessage({ challenges_array, champions_array, limit: selected_limit });
	}
</script>

<svelte:head>
	<title>Optimizer - Tahm-Ken.ch</title>
	<meta
		name="description"
		content="Compositions for Harmony and Globtrotter challenges in League of Legends"
	/>
</svelte:head>

{#snippet showChallenge(challenge: any, classes: string)}
	<div class="flex gap-3">
		<img
			class="h-6 max-h-6 w-6 max-w-6"
			src={`/img/cache/datadragon/challenges-images/${challenge.id}-GOLD.png`}
			alt={challenge.id}
		/>
		<div class={classes}>
			{challenge.name}
		</div>
		<div>
			({challenge.label})
		</div>
	</div>
{/snippet}

<Article>
	<H1>Optimizer</H1>

	<div class="flex gap-10">
		<Tooltip>
			{#snippet text()}
				<HelpText>Usage ?</HelpText>
			{/snippet}
			<p>
				This optimizer will find composition that match your selection (champions or challenges) on
				the team builder page
			</p>
			<ul class="list-disc pl-10">
				<li>Select challenges to ensure that these challenges are present in the composition</li>
				<li>
					Select champions to find which champions to add to your composition to maximize the number
					of challenges you can get.
				</li>
			</ul>
			<p>You can hover a composition to show the challenges.</p>
			<p>Tips</p>
			<ul class="list-disc pl-10">
				<li>
					Select the composition (champion images) and hit CTRL+C to copy the champion names to your
					clipboard
				</li>
				<li>
					Selecting a single 5 champions challenge is generally enough to find optimal composition
					in a few miliseconds
				</li>
			</ul>
		</Tooltip>

		<Tooltip>
			{#snippet text()}
				<HelpText>Technical information ?</HelpText>
			{/snippet}
			<p>
				This page uses your CPU to crunch compositions according to the selected criteria (Code
				compiled in WebAssembly)
			</p>
			<p>
				As far as I know this optimization problem is O(2^n), more exactly nCr(#champions,
				#composition_size)
			</p>
			<p>
				There are roughly 1 billion possible compositions in League of Legends, but with this
				algorithm you can reduce the exploration space to explore only compositions that match
				selected challenges
			</p>
			<p>
				Not every challenges are compatible (obviously). To know which challenges are compatible you
				can use the team builder. Two challenges are compatible if their champions set intersection
				is
			</p>
			<p>The algorithm stops when:</p>
			<ul class="list-dist pl-10">
				<li>
					Every composition matching your criteria are found (<span class="text-green-400"
						>Optimal result</span
					>)
				</li>
				<li>
					When the algorithm finds enough composition such that the Early stop limit is reached (<span
						class="text-red-400">Best effort/Non-optimal result</span
					>)
				</li>
			</ul>
			<p>You can increase the early stop to crunch more compositions.</p>
		</Tooltip>
	</div>

	<div>
		<p>Criteria</p>
		{#each challenges_array as challengesKey}
			{@const challenge = challengesById.get(challengesKey)}
			<div class="m-3">
				{@render showChallenge(challenge, '')}
			</div>
		{/each}
		{#each champions_array as championKey}
			{@const champion = championsMapKey.get(championKey.toString())}
			<div class="m-3 flex gap-3">
				<img
					class="h-6 w-6"
					src={`/img/cache/datadragon/champion/${champion?.id}.png`}
					alt={champion?.name}
				/>
				<div>{champion?.name}</div>
			</div>
		{/each}
	</div>

	<div class="flex justify-between">
		<form class="inline" onsubmit={optimize}>
			<label>
				Compositions limit (Early stop):
				<input type="number" bind:value={selected_limit} step="10000" min="10000" />
			</label>
			<Button type="submit">Compute</Button>
		</form>

		<label>
			Showing
			<input type="number" bind:value={showing} step="50" min="10" max="1000" />
		</label>
	</div>
	{#if !computing}
		<div class={computed < computed_limit ? 'text-green-400' : 'text-red-400'}>
			Compositions computed: {computed}
			{#if computed < computed_limit}
				(Optimal)
			{:else}
				(Best-effort)
			{/if}
		</div>
	{/if}

	<div class="flex flex-wrap justify-center">
		{#each challenges_qte as qte}
			<label class="m-2">
				<input type="radio" name="challenges" value={qte} bind:group={selected_qte} />
				{qte} challenges ({compositions.get(qte).length})
			</label>
		{/each}
	</div>
	{#if !computing}
		{@const compositions_i = compositions.get(selected_qte)}
		<div class="flex flex-wrap justify-center gap-x-10 gap-y-2">
			{#each compositions_i?.slice(0, showing) as row}
				{@const championKeys = row[0]}
				{@const challengesKeys = row[1]}
				<Tooltip>
					{#snippet text()}
						<div class="flex">
							{#each championKeys.sort() as championKey}
								{@const champion = championsMapKey.get(`${championKey}`)}
								<img
									class="h-12 w-12"
									src={`/img/cache/datadragon/champion/${champion?.id}.png`}
									alt={champion?.name + ' '}
								/>
							{/each}
						</div>
					{/snippet}
					<div class="flex flex-col gap-2">
						{#each challengesKeys.sort() as challengesKey}
							{@const challenge = challengesById.get(challengesKey)}
							{@render showChallenge(
								challenge,
								[...challenges_array].includes(challengesKey) ? 'text-orange-300' : 'text-green-300'
							)}
						{/each}
					</div>
				</Tooltip>
			{:else}
				No result found! You have selected incompatible challenges.
			{/each}
		</div>
	{:else}
		<div class="flex justify-center">Computing...</div>
	{/if}
</Article>
