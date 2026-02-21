<script lang="ts">
	import '../app.css';
	import quotes from 'data/quotes.json';
	import manifest_json from 'data/cache/datadragon/manifest.json';
	import lcu_version from 'data/lcu/version.json';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import ThemeSelector from './ThemeSelector.svelte';
	import { browser } from '$app/environment';
	import { Link } from '$lib/components';
	const version = import.meta.env.VITE_BUILD_VERSION;

	let currentPath = $derived(page.url.pathname);
	let background: string = $state(
		browser ? (localStorage.getItem('background') ?? 'TahmKench_0.jpg') : ''
	);
	let { children } = $props();

	$effect(() => {
		if (background) {
			localStorage.setItem('background', background);
		}
	});

	let headerNav = [
		{
			href: '/',
			text: 'Tahm-Ken.ch'
		},
		{
			href: '/multisearch',
			text: 'Multisearch'
		},
		{
			href: '/team_builder',
			text: 'Team Builder'
		},
		// {
		// 	href: '/compositions',
		// 	text: 'Compositions'
		// },
		{
			href: '/community',
			text: 'Community'
		}
	];

	let footerNav = [
		{
			text: 'discord',
			href: 'https://discord.gg/aHs3uDraNU',
			class: 'fa-brands fa-discord text-indigo-400'
		},
		{
			text: 'kofi',
			href: 'https://ko-fi.com/theraphael0000',
			class: 'fa-solid fa-heart text-rose-600'
		},
		{
			text: 'github',
			href: 'https://github.com/TheRaphael0000/ch.tahm-ken.www/',
			class: 'fa-brands fa-github text-zinc-50'
		}
	];

	let quote: string = $state('');

	function updateQuote() {
		quote = quotes?.at(Math.random() * quotes.length) ?? '';
	}

	onMount(updateQuote);
	setInterval(updateQuote, 10000);
</script>

<header>
	<div
		class="bg_img"
		style:background-image={background ? `url(/img/cache/datadragon/splash/${background})` : ''}
	></div>
	<nav class="flex flex-col items-center justify-between md:flex-row">
		<div class="mx-7 my-3 flex flex-col items-center gap-2 md:flex-row md:gap-7">
			<a href="/" aria-label="home">
				<img src="/img/favicon.png" alt="logo" class="h-10" />
			</a>
			{#each headerNav as link, i}
				<!-- svelte-ignore a11y_accesskey -->
				<a
					class:border-b-1={currentPath === link.href}
					href={link.href}
					accesskey={(i + 1).toString()}>{link.text}</a
				>
			{/each}
		</div>
		<div class="mx-7 my-3 flex flex-col items-center gap-2 md:flex-row md:gap-7">
			<ThemeSelector bind:background />
		</div>
	</nav>
</header>

<main>
	{@render children()}
</main>

<footer class="p-6 text-center">
	<div>
		<cite>{quote}</cite> &mdash; The River King
	</div>

	<div class="m-2 flex flex-wrap justify-center">
		{#each footerNav as link}
			<a aria-label={link.text} href={link.href} target="_blank" class="m-2 text-3xl">
				<i class={link.class}></i>
			</a>
		{/each}
	</div>

	<div class="text-sm text-gray-500">
		<div>
			Build <Link href="https://github.com/TheRaphael0000/ch.tahm-ken.www/commits/{version}" target="_blank">{version}</Link> / DD <Link href="https://ddragon.leagueoflegends.com/cdn/dragontail-{manifest_json.dd}.tgz">{manifest_json.dd}</Link> / LCU {lcu_version}
		</div>
		<div>
			Tahm-Ken.ch isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot
			Games or anyone officially involved in producing or managing Riot Games properties.
		</div>
		<div>
			Riot Games, and all associated properties are trademarks or registered trademarks of Riot
			Games, Inc.
		</div>
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
