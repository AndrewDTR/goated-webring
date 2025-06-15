<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>goated webring</title>
</svelte:head>

<h1>🐐 goated webring</h1>

{#each data.sites as site, index}
	<div class="outline-4">
		<a href={site.site}>{data.emojis[index]} {site.site}</a>
	</div>
{/each}
