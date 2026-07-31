<script lang="ts">
	import manifest_json from 'data/cache/datadragon/manifest.json';
	import lcu_version from 'data/lcu/version.json';
	import quotes from 'data/quotes.json';
	import { onMount } from 'svelte';

	import { Link } from '$lib/components';
	const version = import.meta.env.VITE_BUILD_VERSION ?? 'N/A';

	let quote: string = $state('');

	let footerNav = [
		{
			text: 'discord',
			href: 'https://discord.gg/aHs3uDraNU'
		},
		{
			text: 'paypal',
			href: 'https://www.paypal.com/ncp/payment/KA8SQSKTDTDFQ'
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

	function updateQuote() {
		quote = quotes?.at(Math.random() * quotes.length) ?? '';
	}

	onMount(updateQuote);
	setInterval(updateQuote, 10000);
</script>

<div class="m-3 flex flex-col gap-y-3 text-center">
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
</div>
