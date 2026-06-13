<script lang="ts">
	import '../app.css';
	import quotes from 'data/quotes.json';
	import manifest_json from 'data/cache/datadragon/manifest.json';
	import lcu_version from 'data/lcu/version.json';
	import { page } from '$app/state';
	import { onMount, setContext } from 'svelte';
	import { browser } from '$app/environment';
	import { Link } from '$lib/components';
	import Nav from './_components/Nav.svelte';

	let { children } = $props();
	const version = import.meta.env.VITE_BUILD_VERSION ?? 'N/A';

	onMount(() => {
		if (typeof umami !== 'undefined') {
			umami.track('appLoad', { version: version });
		} else {
			console.info('umami not loaded');
		}
	});

	let currentPath = $derived(page.url.pathname);
	let background: string = $state(
		browser ? (localStorage.getItem('background') ?? 'TahmKench_0.jpg') : ''
	);

	setContext<ThemeContext>('theme', {
		get background() {
			return background;
		}
	});

	$effect(() => {
		if (background) {
			localStorage.setItem('background', background);
		}
	});

	let footerNav = [
		{
			text: 'discord',
			href: 'https://discord.gg/aHs3uDraNU'
		},
		{
			text: 'ko-fi',
			href: 'https://ko-fi.com/theraphael0000'
		},
		{
			text: 'github',
			href: 'https://github.com/TheRaphael0000/ch.tahm-ken.www/'
		},
		{
			text: 'contact@tahm-ken.ch',
			href: 'mailto:contact@tahm-ken.ch'
		}
	];

	let quote: string = $state('');

	function updateQuote() {
		quote = quotes?.at(Math.random() * quotes.length) ?? '';
	}

	onMount(updateQuote);
	setInterval(updateQuote, 10000);
</script>

<svelte:head>
	{#if import.meta.env.PROD}
		<script
			defer
			src="https://tasty.tahm-ken.ch/script.js"
			data-website-id="c77ef602-e758-4984-a350-8543de40f3cb"
			data-performance="true"
		></script>
	{/if}
</svelte:head>

<header>
	<div
		class="bg_img"
		style:background-image={background ? `url(/img/cache/datadragon/splash/${background})` : ''}
	></div>
	<Nav {currentPath} bind:background />
</header>

<main class="p-6">
	{@render children()}
</main>

<footer class="m-3 flex flex-col gap-y-3 text-center">
	<div>
		<cite>{quote}</cite> &mdash; The River King
	</div>

	<div class="flex flex-wrap justify-center gap-x-3">
		{#each footerNav as link}
			<a aria-label={link.text} href={link.href} target="_blank" class="text-sm">
				{link.text}
			</a>
		{/each}
	</div>

	<div class="text-sm text-gray-500">
		Build
		<Link
			href="https://github.com/TheRaphael0000/ch.tahm-ken.www/commits/{version}"
			target="_blank"
		>
			{version}
		</Link>
		/ DD
		<Link href="https://ddragon.leagueoflegends.com/cdn/dragontail-{manifest_json.dd}.tgz">
			{manifest_json.dd}
		</Link>
		/ LCU
		{lcu_version}
	</div>
	<div class="text-sm text-gray-500">
		Tahm-Ken.ch isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games
		or anyone officially involved in producing or managing Riot Games properties.
		<br />
		Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.
	</div>
</footer>

<style>
	.bg_img {
		position: fixed;
		background-position: center;
		background-size: cover;
		width: 100%;
		height: 100%;
		filter: blur(2px) saturate(200%);
		transform: scale(1.2) scaleX(-1);
		opacity: 0.2;
		z-index: -1;
	}
</style>
