<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>{data.webringName}</title>
</svelte:head>

<div class="m-4 mb-0 inline-block text-white">
	<div class="inline-block">
		<h1 class="text-3xl">{data.webringName}</h1>
		<p class="text-md text-right italic">
			...has {data.sites.length}
			{data.sites.length === 1 ? 'site:' : 'sites:'}
		</p>
	</div>
</div>

<div class="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
	{#each data.sites as site}
		<a href={site.site} class="block">
			<div
				class="h-full w-full rounded-sm border-2 border-gray-500 bg-gray-300 p-6 text-center text-2xl transition-all duration-50 hover:bg-[#afb7ca]"
			>
				<p>{new URL(site.site).host}</p>
			</div>
		</a>
	{/each}
</div>

{#if data.hideWordmark.toLowerCase() != 'true'}
	<a
		class="fixed right-0 bottom-0 border-2 bg-white p-2 transition-all duration-100 hover:bg-[#dfdfdf]"
		href="https://github.com/AndrewDTR/goated-webring"
	>
		<p>🐐 made with goated webring</p>
	</a>
{/if}
