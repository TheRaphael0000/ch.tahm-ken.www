<script lang="ts">
	import { H1, H2, Link } from '$lib/components';
	import Article from '$lib/components/Article.svelte';
	import Button from '$lib/components/Button.svelte';
	import supporters from 'data/supporters.json';
</script>

<svelte:head>
	<title>Support us - Tahm-Ken.ch</title>
	<meta name="description" content="Support the developer of the website" />
</svelte:head>

<Article>
	<H1>Support us</H1>
	<p>
		Tahm-Ken.ch is <b>open-source</b> and <b>ad-free</b>, and we do not use cookies or collect any
		personal data. The only exception is page visit statistics, which are tracked using an
		open-source, privacy-focused solution (<Link href="https://github.com/umami-software/umami"
			>Umami</Link
		>).
	</p>
	<p>If you'd like to support our work you can use the following link:</p>

	<div class="flex items-center justify-center">

		<a href="https://www.paypal.com/ncp/payment/KA8SQSKTDTDFQ" class="my-auto" target="_blank">
			<Button class="border-0 bg-blue-400">Support</Button>
		</a>
	</div>

	<p>
		For those concerned about tracking and advertisements, we recommend reading this insightful
		article:
		<Link href="https://lichess.org/ads">Lichess on Ads.</Link>
	</p>

	<H2>Supporters</H2>
	<ul class="flex flex-col items-center gap-2 text-lg">
		{#each supporters as supporter}
			<li>{supporter}</li>
		{/each}
	</ul>
	<p class="text-center text-sm text-gray-500">
		Supporters don't have to be listed in this list nor provide a real account name.
	</p>
</Article>
