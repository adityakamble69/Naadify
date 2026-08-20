<script>
	import { player } from '$lib/stores/player.js';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
</script>

<div class="flex items-center justify-center gap-4 sm:gap-5">
	<button
		type="button"
		on:click={() => dispatch('prev')}
		class="glass-btn w-11 h-11 text-white/80 hover:text-white"
		aria-label="Previous track"
	>
		<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
			<path d="M6 6h2v12H6zm3.5 6L18 6v12z" />
		</svg>
	</button>

	<button
		type="button"
		on:click={() => dispatch('toggle')}
		class="glass-btn w-16 h-16 text-white shadow-[0_0_28px_rgba(63,160,255,0.35)]"
		aria-label={$player.isPlaying ? 'Pause' : 'Play'}
	>
		{#if $player.isBuffering}
			<span class="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"
			></span>
		{:else if $player.isPlaying}
			<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
				<rect x="6" y="5" width="4" height="14" rx="1" />
				<rect x="14" y="5" width="4" height="14" rx="1" />
			</svg>
		{:else}
			<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
				<path d="M8 5v14l11-7z" />
			</svg>
		{/if}
	</button>

	<button
		type="button"
		on:click={() => dispatch('next')}
		class="glass-btn w-11 h-11 text-white/80 hover:text-white"
		aria-label="Next track"
	>
		<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
			<path d="M16 6h2v12h-2zM6 6l8.5 6L6 18z" />
		</svg>
	</button>
</div>
