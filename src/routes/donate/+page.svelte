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
		Tahm-Ken.ch is <b>ad-free</b> and we don't collect any personal data. The only exception is page
		visits statistics using an open-source privacy focus solution (<Link
			href="https://github.com/umami-software/umami">Umami</Link
		>).
	</p>
	<p>
		If you'd like to support our work, you can <b>donate</b> here. [<Link
			href="https://ko-fi.com/theraphael0000">Donation on Ko-fi</Link
		>]
	</p>
	<p>
		Donating offers no special advantages, though we can display your name in the Multisearch bar
		placeholder if you wish.
	</p>
	<p>
		For those concerned about tracking and advertisements, we recommend reading this insightful
		article:
		<Link href="https://lichess.org/ads">https://lichess.org/ads</Link>
	</p>

	<H2>Donators</H2>
	<ul class="flex flex-col items-center gap-2 text-lg">
		{#each donators as donator}
			<li>{donator}</li>
		{/each}
	</ul>
	<p class="text-center text-sm text-gray-500">
		You don't have to be listed in the donator list nor provide a real account name for your
		donation.
	</p>
</Article>
