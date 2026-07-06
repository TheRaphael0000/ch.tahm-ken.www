<script>
	import { onNavigate } from '$app/navigation';
	import ThemeSelector from './ThemeSelector.svelte';

	let headerNav = [
		{
			href: '/',
			text: 'Home'
		},
		{
			href: '/multisearch',
			text: 'Multisearch'
		},
		{
			href: '/team_builder',
			text: 'Team builder'
		},
		{
			href: '/masteries',
			text: 'Masteries'
		},
		{
			href: '/community',
			text: 'Community'
		},
		{
			href: '/support',
			text: 'Support us'
		}
	];

	let { currentPath, background = $bindable() } = $props();

	let toggleMenu = $state(false);

	onNavigate(() => {
		toggleMenu = false;
	});
</script>

<nav
	class="mx-6 my-3 flex flex-col items-start justify-between gap-x-7 gap-y-5 lg:mx-6 lg:flex-row lg:items-center"
>
	<div class="flex flex-row items-start justify-start gap-5 lg:flex lg:w-1/8 lg:items-center">
		<button class="cursor-pointer text-4xl lg:hidden" onclick={() => (toggleMenu = !toggleMenu)}
			>☰</button
		>
		<a href="/" aria-label="home">

			<img src="/img/favicon.svg" alt="logo" class="h-10 min-h-10 w-10 min-w-10" />
		</a>
	</div>
	<div
		class="flex flex-col items-start justify-center gap-2 lg:flex lg:w-6/8 lg:flex-row lg:items-center lg:gap-7"
		class:flex={toggleMenu}
		class:hidden={!toggleMenu}
	>
		{#each headerNav as link, i}
			<!-- svelte-ignore a11y_accesskey -->
			<a
				class:border-b-1={currentPath === link.href}
				class="whitespace-nowrap"
				href={link.href}
				accesskey={(i + 1).toString()}
			>
				{link.text}
			</a>
		{/each}
	</div>
	<div
		class="flex-col items-center justify-end gap-2 lg:flex lg:w-1/8 lg:flex-row"
		class:flex={toggleMenu}
		class:hidden={!toggleMenu}
	>
		<ThemeSelector bind:background />
	</div>
</nav>
