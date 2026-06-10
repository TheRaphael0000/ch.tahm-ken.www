<script lang="ts">
	import { H1, H2, Link } from '$lib/components';
	import Article from '$lib/components/Article.svelte';
	import donators from 'data/donators.json';
</script>

<svelte:head>
	<title>Donate - Tahm-Ken.ch</title>
	<meta name="description" content="Support the developer of the website" />
</svelte:head>

<Article>
	<H1>Donate</H1>
	<p>
		Tahm-Ken.ch is <b>open-source</b> and <b>ad-free</b>, and we do not use cookies or collect any personal data. The only
		exception is page visit statistics, which are tracked using an open-source, privacy-focused
		solution (<Link href="https://github.com/umami-software/umami">Umami</Link>).
	</p>
	<p>
		If you'd like to support our work, you can donate <Link href="https://ko-fi.com/theraphael0000"
			>here</Link
		>. Donating offers no special advantages, though we can display your name in the Multisearch bar
		placeholder if you wish.
	</p>
	<p>
		For those concerned about tracking and advertisements, we recommend reading this insightful
		article:
		<Link href="https://lichess.org/ads">Lichess on Ads.</Link>
	</p>

	<H2>Donators</H2>
	<ul class="flex flex-col items-center gap-2 text-lg">
		{#each donators as donator}
			<li>{donator}</li>
		{/each}
	</ul>
	<p class="text-center text-sm text-gray-500">
		Donators don't have to be listed in this list nor provide a real account name.
	</p>
</Article>
