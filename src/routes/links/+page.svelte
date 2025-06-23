<script>
	let { data } = $props();
</script>

<svelte:head>
	<title>Link</title>
</svelte:head>

<h1 class="mt-4 text-2xl text-white underline">You're apart of {data.webringName}!</h1>

<h1 class="mt-2 text-white">To hyperlink, then (etc)</h1>
<!-- TODO include actual instructions on which hyperlinks they should add to their site -->
