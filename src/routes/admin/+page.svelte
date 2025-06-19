<script lang="ts">
	import { enhance } from '$app/forms';
	let { data, form } = $props();
	import toast, { Toaster } from 'svelte-french-toast';

	const isSuccess = $derived(form?.success === 'true');
	const errorMsg = $derived(form?.success === 'false' ? form.error : null);

	$effect(() => {
		if (isSuccess) {
			toast.success('Changes successfully applied!');
		} else if (errorMsg) {
			toast.error(`Error: ${errorMsg}`);
		}
	});
</script>

<Toaster />

<div class="m-4 mb-0 inline-block text-white">
	<div class="inline-block">
		<h1 class="text-3xl">Editing {data.settings.webringName}:</h1>

		<div class="mt-8">
			<p class="text-2xl underline">Settings</p>
			<form
				method="POST"
				use:enhance={() => {
					return ({ update }) => {
						update({ reset: false });
					};
				}}
			>
				<label class="mt-2 mb-2 block"
					><span class="font-bold">Webring Name</span>
					<input
						class="block w-xl text-black"
						name="webringName"
						value={data.settings.webringName}
						maxlength="100"
						required
					/>
				</label>

				<label class="block"
					><span class="font-bold">Redirect Link</span>
					<input
						class="block w-xl text-black"
						type="url"
						name="redirectLink"
						value={data.settings.redirectLink}
						required
					/>
				</label>

				<span class="mt-2 mb-2 block font-bold"
					>When users hit the index page, redirect (to the link above) or show a list of everyone's
					sites?</span
				>

				<label class="mr-4">
					<input
						type="radio"
						name="showLandingPage"
						value="false"
						checked={data.settings.showLandingPage === 'false'}
						required
					/>
					Redirect
				</label>
				<label>
					<input
						type="radio"
						name="showLandingPage"
						value="true"
						checked={data.settings.showLandingPage === 'true'}
						required
					/>
					Show Index Page
				</label>

				<span class="mt-2 mb-2 block font-bold">Hide the wordmark on index page?</span>

				<label class="mr-4">
					<input
						type="radio"
						name="hideWordmark"
						value="false"
						checked={data.settings.hideWordmark === 'false'}
						required
					/>
					No
				</label>
				<label>
					<input
						type="radio"
						name="hideWordmark"
						value="true"
						checked={data.settings.hideWordmark === 'true'}
						required
					/>
					Yes :(
				</label>
				<button
					class="mt-4 block cursor-pointer bg-blue-500 p-4 transition-colors duration-75 hover:bg-blue-600"
					>Update</button
				>
			</form>
		</div>

		<!-- <label
			>Webring Name
			<input class="text-black" value={data.settings.web} />
		</label>

		<label
			>Webring Name
			<input class="text-black" value={data.settings.redirectLink} />
		</label>
	</form> -->
	</div>
</div>
