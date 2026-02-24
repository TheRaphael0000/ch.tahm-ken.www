<script lang="ts">
	import { Article, H1 } from '$lib/components';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { championsMap, championsMapKey, challenges } from '$lib/challenges';
	import Button from '$lib/components/Button.svelte';
	import OptimizerWorker from '$lib/optimizer_worker?worker';

	let url_challenges: string = $state('');
	let url_champions: string = $state('');
	let compositions: any = $state([]);
	let limit: number = $state(5000);
	let showing: number = $state(100);
	let computing: boolean = $state(true);
	const challenges_ids = challenges.map(c => c.id);

	if (browser) {
		url_challenges = page.url.searchParams.get('challenges') ?? '';
		url_champions = page.url.searchParams.get('champions') ?? '';
	}

	onMount(async () => {
		optimize();
	});

	function optimize()
	{
		computing = true;
		console.log("optimize")
		compositions = [];
		const challenges_array =  new Int32Array(url_challenges.split(",").map(c => Number(c))).filter((k) => challenges_ids.includes(k));
		const champions_array = new Int32Array(url_champions.split(",").map(c => Number(championsMap.get(c)?.key) ?? -1)).filter((k) => championsMapKey.has(k.toString()));

		const worker = new OptimizerWorker();

		worker.onmessage = (e) => {
			console.log("message")
			compositions = e.data;
			computing = false;
			worker.terminate(); // Clean up
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
			<input type="number" bind:value={limit} step="1000000" min="1"/>
			<Button onclick={optimize}>Compute</Button>
			<div>Computed: {compositions?.length ?? 0}</div>
		</label>
		
		<label>
			Showing
			<input type="number" bind:value={showing} step="100" min="10" max="10000"/>
		</label>
	</div>

	<div class="flex flex-wrap gap-x-10 justify-center">
		{#if computing}
			Computing...
		{:else}
		{#each compositions.slice(0, showing) as composition}
		<div class="flex">
			{#each composition as championKey}
			{@const champion = championsMapKey.get(`${championKey}`)?.id}
			<img
			class="w-[50px] h-[50px]"
			src={`/img/cache/datadragon/champion/${champion}.png`}
			alt={championKey}
			/>
			{/each}
		</div>
		{:else}
		No result found...
		{/each}
		{/if}
	</div>
</Article>
