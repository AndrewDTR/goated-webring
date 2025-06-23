<script>
	let { data, form } = $props();
	import { enhance } from '$app/forms';
</script>

<svelte:head>
	<title>Invite</title>
</svelte:head>

<h1 class="mt-4 text-2xl text-white underline">You've been invited to {data.webringName}!</h1>

{#if form?.added === 'false'}
	<h1 class="mt-2 text-white">
		There was an error adding your site: {form?.error} Please try again or check with the owner of the webring.
	</h1>
{:else}
	<div class="mt-4 text-white">
		<form
			method="POST"
			use:enhance={() => {
				return ({ update }) => {
					update({ reset: false });
				};
			}}
		>
			<label class="mt-2 mb-2 block"
				><span class="font-bold">What's the URL of your site?</span>
				<input class="block w-xl text-black" name="siteURL" type="url" required />
			</label>

			<button class="mt-4 block cursor-pointer bg-blue-500 p-4 transition-colors duration-75"
				>Add My Site</button
			>
		</form>
	</div>
{/if}
