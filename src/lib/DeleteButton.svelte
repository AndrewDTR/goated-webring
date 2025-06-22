<script>
	let { func } = $props();

	let primed = $state(false);

	function primeDelete() {
		if (primed == false) {
			primed = true;
		} else {
			func();
		}
	}
</script>

<button
	class="cursor-pointer font-bold underline transition-colors duration-75 hover:text-red-400"
	onclick={primeDelete}>{primed ? 'Are you sure?' : 'Delete'}</button
>
