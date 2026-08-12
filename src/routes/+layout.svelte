<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import { onMount, setContext } from 'svelte';
	import { browser } from '$app/environment';
	import Nav from './_components/Nav.svelte';
	import Footer from './_components/Footer.svelte';

	const version = import.meta.env.VITE_BUILD_VERSION ?? 'N/A';

	let { children } = $props();

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

<div
	class="bg_img"
	style:background-image={background ? `url(/img/cache/datadragon/splash/${background})` : ''}
></div>

<header>
	<Nav {currentPath} bind:background />
</header>

<main class="p-6">
	{@render children()}
</main>

<footer>
	<Footer />
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
