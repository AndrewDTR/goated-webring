<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	let { data, form } = $props();
	import toast, { Toaster } from 'svelte-french-toast';

	const isSuccess = $derived(form?.success === 'true');
	const errorMsg = $derived(form?.success === 'false' ? form.error : null);

	$effect(() => {
		async function handleEffect() {
			if (form?.type === 'settings') {
				if (isSuccess) {
					toast.success('Changes successfully applied!', { duration: 2500 });
				} else if (errorMsg) {
					toast.error(`Error: ${errorMsg}`, { duration: 2500 });
				}
			}

			if (form?.type === 'invite') {
				if (isSuccess) {
					await copyText(form.code ?? '');
					toast.success('Invite copied to clipboard!', { duration: 2500 });
				} else if (errorMsg) {
					toast.error(`Error: ${errorMsg}`, { duration: 2500 });
				}
			}
		}
		handleEffect();
	});

	async function copyText(text: string) {
		try {
			await navigator.clipboard.writeText(text);
		} catch (err) {
			console.error('Failed to copy: ', err);
		}
	}

	async function deleteHelper(id: number) {
		await fetch('/admin/delete', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id })
		});
		await invalidateAll();
	}
</script>

<Toaster />

<div class="m-4 mb-0 inline-block text-white">
	<div class="inline-block">
		<h1 class="text-3xl">Editing {data.settings.webringName}:</h1>

		<div class="mt-8">
			<p class="text-2xl underline">Settings</p>
			<form
				method="POST"
				action="?/settings"
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
				<button class="mt-4 block cursor-pointer bg-blue-500 p-4 transition-colors duration-75"
					>Update</button
				>
			</form>

			<p class="mt-4 text-2xl underline">Invites</p>

			<table class="mt-4 w-full table-auto border-collapse">
				<thead>
					<tr class="bg-gray-800 text-white">
						<th class="px-4 py-2 text-left">Invite</th>
						<th class="px-4 py-2 text-left">Expires On</th>
						<th class="px-4 py-2 text-left"></th>
					</tr>
				</thead>
				<tbody>
					{#if data.invites.length == 0}
						<tr class="transition-colors odd:bg-gray-600 even:bg-gray-500">
							<td class="px-4 py-2">No Invites</td>
							<td class="px-4 py-2">...</td>
							<td class="px-4 py-2"></td>
						</tr>
					{:else}
						{#each data.invites as invite}
							<tr class="transition-colors odd:bg-gray-600 even:bg-gray-500">
								<td class="px-4 py-2">{invite.code}</td>
								{#if invite.expiresAt === -1}
									<td class="px-4 py-2">Never Expires</td>
								{:else}
									<td class="px-4 py-2">{new Date(invite.expiresAt).toLocaleString()}</td>
								{/if}
								<td class="px-4 py-2"
									><button
										class="cursor-pointer font-bold underline transition-colors duration-75 hover:text-red-400"
										onclick={async () => await deleteHelper(invite.id)}>Delete</button
									></td
								>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>

			<p class="mt-4 text-xl underline">Create an Invite</p>

			<form
				method="POST"
				action="?/invite"
				use:enhance={() => {
					return ({ update }) => {
						update({ reset: false });
					};
				}}
			>
				<span class="mt-2 mb-2 block font-bold">How long should the invite last?</span>

				<select class="w-auto text-black" name="duration" id="duration">
					<option value="30m">30 minutes</option>
					<option value="1h">1 hour</option>
					<option value="6h">6 hours</option>
					<option value="12h">12 hours</option>
					<option value="1d">1 day</option>
					<option value="7d">7 days</option>
					<option value="forever">Forever</option>
				</select>

				<span class="mt-2 mb-2 block font-bold">How many uses should the invite have?</span>

				<label>
					<input type="radio" name="uses" value="1" required />
					One
				</label>
				<label class="ml-4">
					<input type="radio" name="uses" value="-1" required />
					Unlimited
				</label>
				<button class="mt-4 block cursor-pointer bg-blue-500 p-4 transition-colors duration-75"
					>Create</button
				>
			</form>
		</div>
	</div>
</div>
