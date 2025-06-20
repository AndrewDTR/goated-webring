<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="text-white">
	<h1 class="mt-4 text-2xl">🐐 Error {page.status}</h1>
	<p>{page.error?.message}</p>

	<a
		class="mt-4 inline-block bg-blue-500 p-4 transition-colors duration-75 hover:bg-blue-600"
		href="/">Back to home</a
	>
</div>
