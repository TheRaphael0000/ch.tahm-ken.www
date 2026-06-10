<script>
	import { H1, H2, Article, Link } from '$lib/components';
</script>

<svelte:head>
	<title>Tahm-Ken.ch</title>
	<meta
		name="description"
		content="Tools to help you complete challenges in League of Legends! (Harmony, Globetrotter, Guru, Virtuoso)"
	/>
</svelte:head>

<Article>
	<H1>Welcome to Tahm-Ken.ch</H1>

	<p>This website is designed to help you complete challenges in League of Legends!</p>

	<H2>Tools</H2>
	<p></p>
	<ul class="ml-8 list-disc">
		<li>
			<Link href="/multisearch">Multisearch</Link>
			<br />
			Copy-paste your lobby join messages and find out which <b>Harmony</b> and <b>Globetrotter</b> challenges
			are missing from your premade group.
		</li>
		<li>
			<Link href="/team_builder">Team Builder</Link>
			<br />
			Discover and optimize which champions to pick to complete your <b>Harmony</b> and
			<b>Globetrotter</b> challenges.
		</li>
		<li>
			<Link href="/masteries">Masteries</Link>
			<br />
			Keeping track of your champions masteries for the <b>Guru</b> and <b>Virtuoso</b> challenges.
		</li>
	</ul>
</Article>
