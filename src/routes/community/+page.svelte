<script lang="ts">
	import { H1, Article, Link, H2 } from '$lib/components';
	import Community from './Community.svelte';
	import DiscordCommunity from './DiscordCommunity.svelte';
	import discord_invites from 'data/cache/discord.cache.json';
</script>

<svelte:head>
	<title>Community - Tahm-Ken.ch</title>
	<meta
		name="description"
		content="League of Legends challenges communities affiliated with Tahm-Ken.ch"
	/>
</svelte:head>

<Article>
	<H1>Community</H1>

	<H2>League of Legends challenges communities on discord</H2>
	<p>Looking for teammates to complete challenges? Here are a few Discord communities.</p>

	<!-- League Challenges -->
	<DiscordCommunity community={discord_invites.FJXAvqxw6T} />
	<!-- League Desafíos LoL ESP -->
	<DiscordCommunity community={discord_invites.cKGS6ASyuZ} />
	<!-- Achievement Hunting -->
	<DiscordCommunity community={discord_invites.yapEVysv3b} />

	<H2>League of Legends challenges websites</H2>
	<p>Useful websites for challenges completion.</p>

	<!-- challenges.darkintaqt -->
	<Community
		href="https://challenges.darkintaqt.com/"
		name="Challenge Tracker"
		src="/img/challenges_darkintaqt_com.png"
		buttonText="Visit Website"
		text="League of Legends Challenge Tracker & Leaderboards by DarkIntaqt.com"
	/>
	<!-- loldb -->
	<Community
		href="https://loldb.info/"
		name="LoLDB"
		src="/img/loldb_info.png"
		buttonText="Visit Website"
		text="LoLDB, the complete League of Legends database with champions, skins, chromas, items, mythic shop content, and more!"
	/>

	<H2>Developement Discord</H2>

	<p>
		If you encounter any <b>bugs</b> or have <b>suggestions</b> for website <b>improvements</b>,
		please let us know on our
		<Link href="https://discord.gg/aHs3uDraNU">discord</Link>. or by mail
		<Link href="mailto:contact@tahm-ken.ch">contact@tahm-ken.ch</Link>.
	</p>

	<!-- Tahm-Ken.ch -->
	<DiscordCommunity community={discord_invites.aHs3uDraNU} />
	<p class="text-sm text-gray-500">
		You can ask on the Tahm-Ken.ch Discord server if you want to add your challenge community on the
		site (it doesn't need to be a Discord server). You must be admin of this community.
	</p>
</Article>
