<script lang="ts">
	import Article from '$lib/components/Article.svelte';
	import H1 from '$lib/components/H1.svelte';
	import { getContext } from 'svelte';

	const background = $derived(getContext<ThemeContext>('theme').background);
</script>

<svelte:head>
	<title>404 - Tahm-Ken.ch</title>
	<meta name="description" content="404 error page for tahm-ken.ch" />
</svelte:head>

<Article>
	<H1>404 - Not found</H1>

	{#if background}
		<img src={`img/cache/datadragon/splash/${background}`} alt="Tahm Kench Splash" />
	{/if}
</Article>
