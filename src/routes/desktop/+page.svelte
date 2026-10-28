<script lang="ts">
	import { H1, H2, Link } from '$lib/components';
	import ArrowDown from '$lib/components/ArrowDown.svelte';
	import ArrowTopRight from '$lib/components/ArrowTopRight.svelte';
	import Arrow from '$lib/components/ArrowTopRight.svelte';
	import Article from '$lib/components/Article.svelte';
	import Button from '$lib/components/Button.svelte';
	import ChallengeHover from '$lib/components/ChallengeHover.svelte';
	import Pill from '$lib/components/Pill.svelte';
	import { onMount } from 'svelte';

	const githubAPI = 'https://api.github.com/repos/TheRaphael0000/aram_masteries/releases/latest';

	let downloadLink: string | null = null;
	let version: string | null = null;
	onMount(() => {
		fetch(githubAPI)
			.then((r) => r.json())
			.then((r) => {
				downloadLink = r.assets[0].browser_download_url;
				version = r.tag_name;
			});
	});
</script>

<svelte:head>
	<title>Desktop Tools - Tahm-Ken.ch</title>
	<meta
		name="description"
		content="Tahm-Ken.ch Desktop tools using the LCU to leverage your challenge experience"
	/>
</svelte:head>

<Article>
	<H1 id="desktop_tools">Desktop Tools</H1>

	<H2 id="aram_masteries"
		>ARAM Masteries <Pill bg="bg-green-500/80" fg="text-white" class="min-w-10">beta</Pill></H2
	>

	<div class="flex flex-col gap-8">
		<div>
			<p>
				A fast and tiny program to quickly see your champions masteries in ARAM. It shows the
				progress of the "All Random All Champions" challenge.
			</p>

			<p>
				Under the hood, it directly communicates with the League of Legends Client API (<Link
					href="https://riot-api-libraries.readthedocs.io/en/latest/lcu.html"
					>League Client Update, LCU</Link
				>)
			</p>
		</div>

		<!-- <ChallengeHover id={"00"} level={'iron'} /> -->

		<div class="flex flex-col items-center gap-1">
			<div class="flex flex-row items-center justify-center gap-3">
				<a
					href={downloadLink ?? 'https://github.com/TheRaphael0000/aram_masteries/releases/latest'}
				>
					<Button class="bg-blue-400">Download {version ?? 'page'} <ArrowDown></ArrowDown></Button>
				</a>
				<a href="https://github.com/TheRaphael0000/aram_masteries" target="_blank">
					<Button>Source Code <ArrowTopRight></ArrowTopRight></Button>
				</a>
				<a href="https://github.com/TheRaphael0000/aram_masteries/releases" target="_blank">
					<Button>Releases <ArrowTopRight></ArrowTopRight></Button>
				</a>
			</div>
			<div class="text-center text-sm text-gray-500 italic">
				You may have a warning when you start the program for the first time since it's <b>not signed</b>.
				<br />
				Just click "More info", "Run anyway".
				<br/>
				The program is <b>open source</b>, so feel free to check it or compile it yourself.
			</div>
		</div>

		<div class="flex flex-col items-center gap-2">
			<img src="img/aram_masteries_showcase.png" alt="screenshot of the program" />
			<i class="block">Screenshot of the tool during ARAM draft</i>
		</div>
	</div>
</Article>
