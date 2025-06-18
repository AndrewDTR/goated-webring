<script lang="ts">
	import { PUBLIC_HIDE_WORDMARK, PUBLIC_WEBRING_NAME } from '$env/static/public';
	let { data } = $props();
</script>

<svelte:head>
	<title>{PUBLIC_WEBRING_NAME}</title>
</svelte:head>

<div class="m-4 mb-0 inline-block text-white">
	<div class="inline-block">
		<h1 class="text-3xl">{PUBLIC_WEBRING_NAME}</h1>
		<p class="text-md text-right italic">
			...has {data.sites.length}
			{data.sites.length === 1 ? 'site:' : 'sites:'}
		</p>
	</div>
	<!-- warning -->
	{#if data.sameLinkError}
		<div class="mt-2 mb-1 rounded-sm bg-[#94813959] p-2">
			<p class="text-xl font-bold">⚠ Warning!</p>
			<p>
				This site has its "show landing page" option turned off, but the link it's attempting to
				redirect to is the same link it's hosted on. This would cause an infinite loop, so it's
				turned off for now. Please turn "show landing page" on or change your redirect link to an
				external page (both options in the .env file).
			</p>
		</div>
	{/if}
</div>

<div class="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
	{#each data.sites as site, index}
		<a href={site.site} class="block">
			<div
				class="h-full w-full rounded-sm border-2 border-gray-500 bg-gray-300 p-6 text-center text-2xl transition-all duration-100 hover:bg-[#858d9f]"
			>
				<p>{new URL(site.site).host}</p>
			</div>
		</a>
	{/each}
</div>

{#if PUBLIC_HIDE_WORDMARK.toLowerCase() != 'true'}
	<a
		class="fixed right-0 bottom-0 border-2 bg-white p-2 transition-all duration-100 hover:bg-[#959595]"
		href="https://github.com/AndrewDTR/goated-webring"
	>
		<p>🐐 made with goated webring</p>
	</a>
{/if}
