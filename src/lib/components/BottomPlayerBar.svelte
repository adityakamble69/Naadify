<script>
	import { player } from '$lib/stores/player.js';
	import { createEventDispatcher } from 'svelte';

	/** @type {{id:string,title:string,artist:string,thumbnail:string}[]} */
	export let playlist = [];

	const dispatch = createEventDispatcher();
	$: currentTrack = playlist[$player.currentIndex] ?? playlist[0];

	let shareCopied = false;

	async function shareTrack() {
		const text = currentTrack ? `${currentTrack.title} — ${currentTrack.artist}` : 'Naadify';
		const url = typeof window !== 'undefined' ? window.location.href : '';

		if (typeof navigator !== 'undefined' && navigator.share) {
			try {
				await navigator.share({ title: 'Naadify', text, url });
				return;
			} catch (err) {
				// user cancelled or share failed — fall through to clipboard
			}
		}

		if (typeof navigator !== 'undefined' && navigator.clipboard) {
			try {
				await navigator.clipboard.writeText(`${text} ${url}`.trim());
				shareCopied = true;
				setTimeout(() => (shareCopied = false), 1800);
			} catch (err) {
				// clipboard blocked — nothing more we can do silently
			}
		}
	}
</script>

<div class="fixed bottom-0 left-0 right-0 z-30 flex justify-center p-4 sm:p-5">
	<div
		class="glass glass-strong rounded-3xl px-4 py-3 sm:px-5 sm:py-3.5 w-full max-w-xl flex items-center gap-3 sm:gap-4 animate-fadeScaleIn"
	>
		<!-- Album thumb -->
		<div class="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl overflow-hidden shrink-0 bg-white/10">
			{#if currentTrack}
				<img src={currentTrack.thumbnail} alt="" class="w-full h-full object-cover" />
			{/if}
		</div>

		<!-- Title + progress -->
		<div class="min-w-0 flex-1">
			<div class="flex items-baseline justify-between gap-2 mb-1">
				<p class="text-sm font-medium truncate">{currentTrack?.title ?? 'Loading…'}</p>
				<div class="flex items-center gap-2.5 shrink-0">
					<button
						type="button"
						class="mono-label !text-[10px] hover:text-white transition-colors"
						on:click={shareTrack}
					>
						{shareCopied ? 'copied!' : 'share'}
					</button>
					<button
						type="button"
						class="mono-label !text-[10px] hover:text-white transition-colors"
						on:click={() => dispatch('queue')}
					>
						queue
					</button>
				</div>
			</div>
			<p class="text-xs text-white/40 truncate mb-1.5 hidden sm:block">
				{currentTrack ? `Credits: ${currentTrack.artist}` : ''}
			</p>
			<slot name="progress" />
		</div>

		<!-- Controls -->
		<div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
			<button
				type="button"
				on:click={() => dispatch('prev')}
				aria-label="Previous track"
				class="glass-btn w-8 h-8 sm:w-9 sm:h-9 text-white/70 hover:text-white"
			>
				<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
					<path d="M6 6h2v12H6zm3.5 6L18 6v12z" />
				</svg>
			</button>

			<button
				type="button"
				on:click={() => dispatch('toggle')}
				aria-label={$player.isPlaying ? 'Pause' : 'Play'}
				class="glass-btn w-10 h-10 sm:w-11 sm:h-11 text-white shadow-accent-glow shadow-[0_0_20px_var(--tw-shadow-color)]"
			>
				{#if $player.isBuffering}
					<span
						class="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"
					></span>
				{:else if $player.isPlaying}
					<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
						<rect x="6" y="5" width="4" height="14" rx="1" />
						<rect x="14" y="5" width="4" height="14" rx="1" />
					</svg>
				{:else}
					<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
						<path d="M8 5v14l11-7z" />
					</svg>
				{/if}
			</button>

			<button
				type="button"
				on:click={() => dispatch('next')}
				aria-label="Next track"
				class="glass-btn w-8 h-8 sm:w-9 sm:h-9 text-white/70 hover:text-white"
			>
				<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
					<path d="M16 6h2v12h-2zM6 6l8.5 6L6 18z" />
				</svg>
			</button>
		</div>
	</div>
</div>
