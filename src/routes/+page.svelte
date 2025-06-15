<script lang="ts">
	import { PUBLIC_HIDE_WORDMARK, PUBLIC_WEBRING_NAME } from '$env/static/public';
	let { data } = $props();
</script>

<svelte:head>
	<title>{PUBLIC_WEBRING_NAME}</title>
</svelte:head>

<div class="m-4 mb-0 inline-block text-white">
	<h1 class="text-3xl">{PUBLIC_WEBRING_NAME}</h1>
	<p class="text-md">{data.sites.length} sites</p>
</div>

<div class="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
	{#each data.sites as site, index}
		<a href={site.site} class="block">
			<div
				class="h-full w-full rounded-sm border-2 border-gray-500 bg-gray-300 p-6 text-center text-2xl transition-all duration-100 hover:bg-[#a1aabc]"
			>
				<p>{new URL(site.site).host}</p>
			</div>
		</a>
	{/each}
</div>

{#if PUBLIC_HIDE_WORDMARK.toLowerCase() == 'false'}
	<a
		class="fixed right-0 bottom-0 border-2 bg-white p-2 transition-all hover:bg-gray-400"
		href="https://github.com/AndrewDTR/goated-webring"
	>
		<p>🐐 made with goated webring</p>
	</a>
{/if}
