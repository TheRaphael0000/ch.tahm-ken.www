<script lang="ts">
	import { Article, H1 } from '$lib/components';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import init, { optimize_selection } from 'wasm-optimizer/wasm_optimizer.js';
	import { championsMap } from '$lib/challenges';

	console.log(championsMap);


	let challenges: string = $state('');
	let champions: string = $state('');
	let compositions: any = $state('');

	if (browser) {
		challenges = page.url.searchParams.get('challenges') ?? '';
		champions = page.url.searchParams.get('champions') ?? '';
	}

	onMount(async () => {
		await init();

		const champions_array = champions.split(",").map(c => championsMap.get(c)?.key ?? "");
		const challenges_array =  new Int32Array(challenges.split(",").map(c => Number(c)));

		let compositions_ = optimize_selection(challenges_array, champions_array);
		console.log(compositions_)
		compositions = compositions_;
	});
</script>

<svelte:head>
	<title>Compositions - Tahm-Ken.ch</title>
	<meta
		name="description"
		content="Compositions for Harmony and Globtrotter challenges in League of Legends"
	/>
</svelte:head>

<Article>
	<H1>Compositions</H1>

	<div class="flex flex-col gap-1">
		{#each compositions as composition}
		<div class="flex">
			{#each composition as champion}
			<img
				class="w-[50px] h-[50px]"
				src={`/img/cache/datadragon/champion/${champion}.png`}
				alt={champion}
			/>
			{/each}
		</div>
		{/each}
	</div>

	<p>This page is still work in progress...</p>
</Article>
