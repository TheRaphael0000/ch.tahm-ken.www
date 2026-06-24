<script lang="ts">
	import { Link } from '$lib/components';
	import Article from '$lib/components/Article.svelte';
	import H1 from '$lib/components/H1.svelte';
	import InputText from '$lib/components/InputText.svelte';
	import PlayerSearch from '$lib/components/PlayerSearch.svelte';

	let playerData: any = $state(undefined);

	$inspect(playerData);
	let url = $derived.by(() => {
		if (playerData) {
			return `https://tahm-ken.ch/api/decay_calendar/EUW1/${playerData?.account?.gameName}-${playerData?.account?.tagLine}/Tahm-Ken.ch%20-%20Decay.ics`;
		} else return '';
	});
</script>

<Article>
	<H1>Decay Calendar</H1>
	<p>
		This tool allows you to generate a dynamic ".ics" calendar. The calendar will contain an Event
		at the date your ranked queues are decaying (Ranked solo queue or Ranked flex queue). Decay is only enabled for diamond+. <Link href="https://support.riotgames.com/en-us/league-of-legends/gameplay/placements-promotions-series-demotions-and-decay">Riot FAQ on Decay</Link>
	</p>
	<p>
		<b>Do not download the calendar file and double click on it, this will not make the calendar dynamical.</b> The calendar at this URL will update
		whenever you increase your decay, in other words, when you play a ranked game. Add this URL as an "Internet Calendar"/"CalDav" to your favourite calendar
		app. I personally use <Link href="https://www.thunderbird.net/">Thunderbird</Link>, but this format is compabible with most calendar app on desktop
		or mobile. I recommand you to setup the calendar as "Read only", since the server will reject any update request.
	</p>

	<div class="mt-10 flex flex-col gap-10">
		<PlayerSearch bind:playerData></PlayerSearch>

		<div>
			<div>Read only Calendar URL:</div>
			<InputText disabled class="w-full" value={url}></InputText>
		</div>
	</div>
</Article>
