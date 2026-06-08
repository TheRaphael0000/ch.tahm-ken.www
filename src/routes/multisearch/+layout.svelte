<script lang="ts">
	const { children } = $props();
</script>

<svelte:head>
	<title>Multisearch - Tahm-Ken.ch</title>
	<meta
		name="description"
		content="Multisearch for Harmony and Globtrotter challenges in League of Legends"
	/>
</svelte:head>

{@render children()}
