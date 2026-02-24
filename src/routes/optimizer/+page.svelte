<script lang="ts">
	import { Article, H1 } from '$lib/components';
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { championsMap, championsMapKey, challenges } from '$lib/challenges';
	import Button from '$lib/components/Button.svelte';
	import OptimizerWorker from '$lib/optimizer_worker?worker';

	let url_challenges: string = $state('');
	let url_champions: string = $state('');
	let compositions: Map<number, any> = $state(new Map());
	let limit: number = $state(35000);
	let showing: number = $state(100);
	let computing: boolean = $state(true);
	const challenges_ids = challenges.map((c) => c.id);
	const worker = new OptimizerWorker();

	let challenges_qte: number[] = $derived.by(() => {
		return [...compositions.keys()].sort().reverse();
	});

	if (browser) {
		url_challenges = page.url.searchParams.get('challenges') ?? '';
		url_champions = page.url.searchParams.get('champions') ?? '';
	}

	onMount(async () => {
		optimize();
	});

	onDestroy(() => {
		worker.terminate();
	});

	function optimize() {
		computing = true;
		compositions = new Map();
		const challenges_array = new Int32Array(url_challenges.split(',').map((c) => Number(c))).filter(
			(k) => challenges_ids.includes(k)
		);
		const champions_array = new Int32Array(
			url_champions.split(',').map((c) => Number(championsMap.get(c)?.key) ?? -1)
		).filter((k) => championsMapKey.has(k.toString()));

		worker.onmessage = (e) => {
			compositions = e.data;
			computing = false;
			worker.terminate();
		};

		worker.postMessage({ challenges_array, champions_array, limit });
	}
</script>

<svelte:head>
	<title>Optimizer - Tahm-Ken.ch</title>
	<meta
		name="description"
		content="Compositions for Harmony and Globtrotter challenges in League of Legends"
	/>
</svelte:head>

<Article>
	<H1>Optimizer</H1>

	<div class="flex justify-between">
		<label>
			Computing
			<input type="number" bind:value={limit} step="10000" min="1" />
			<Button onclick={optimize}>Compute</Button>
			<!-- <div>Computed: {compositions?.length ?? 0}</div> -->
		</label>

		<label>
			Showing
			<input type="number" bind:value={showing} step="100" min="10" max="10000" />
		</label>
	</div>
	{#if !computing}
		{#each challenges_qte as qte}
			{@const compositions_i = compositions.get(qte)}
			<h1>{qte} challenges</h1>
			<div class="flex flex-wrap justify-center gap-x-10 gap-y-1">
				{#each compositions_i as row}
					{@const championKeys = row[0]}
					{@const challengesKeys = row[1]}
					<div class="flex">
						{#each championKeys as championKey}
							{@const champion = championsMapKey.get(`${championKey}`)?.id}
							<img
								class="h-12 w-12"
								src={`/img/cache/datadragon/champion/${champion}.png`}
								alt={championKey}
							/>
						{/each}
					</div>
				{/each}
			</div>
		{:else}
			<div class="flex justify-center">No result found...</div>
		{/each}
	{:else}
		<div class="flex justify-center">Computing...</div>
	{/if}
</Article>
