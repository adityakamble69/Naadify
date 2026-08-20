<script>
	import { player } from '$lib/stores/player.js';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	let previousVolume = 70;

	function handleInput(e) {
		const value = Number(e.target.value);
		dispatch('volumechange', value);
	}

	function toggleMute() {
		if ($player.volume > 0) {
			previousVolume = $player.volume;
			dispatch('volumechange', 0);
		} else {
			dispatch('volumechange', previousVolume || 70);
		}
	}
</script>

<div class="flex items-center gap-2 w-full sm:w-32">
	<button
		type="button"
		on:click={toggleMute}
		class="text-white/60 hover:text-white transition-colors shrink-0"
		aria-label={$player.volume > 0 ? 'Mute' : 'Unmute'}
	>
		{#if $player.volume === 0}
			<!-- muted icon -->
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
		{:else}
			<!-- volume icon -->
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
		{/if}
	</button>

	<div class="relative flex-1 h-1.5">
		<div class="absolute inset-0 rounded-full bg-white/10"></div>
		<div
			class="absolute inset-y-0 left-0 rounded-full bg-white/60"
			style="width: {$player.volume}%"
		></div>
		<input
			type="range"
			min="0"
			max="100"
			value={$player.volume}
			on:input={handleInput}
			aria-label="Volume"
			class="absolute inset-0 w-full opacity-0 cursor-pointer"
		/>
	</div>
</div>
