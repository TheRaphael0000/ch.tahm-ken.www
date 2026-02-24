<script lang="ts">
	import { Article, H1 } from '$lib/components';

	let { children } = $props();
</script>

<Article>
	<H1>Multisearch</H1>

	{@render children()}
</Article>
