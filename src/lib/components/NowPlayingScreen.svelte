<script>
	import { createEventDispatcher } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import { player } from '$lib/stores/player.js';
	import MarqueeText from './MarqueeText.svelte';
	import ProgressBar from './ProgressBar.svelte';
	import VolumeControl from './VolumeControl.svelte';

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

	function handleKeydown(e) {
		if (e.key === 'Escape') dispatch('close');
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<div
	class="fixed inset-0 z-50 flex flex-col overflow-hidden bg-base"
	transition:fade={{ duration: 220 }}
>
	<!-- Blurred, oversized album art as an ambient backdrop -->
	{#if currentTrack}
		<div
			class="absolute inset-0 bg-cover bg-center scale-110 blur-3xl opacity-50"
			style="background-image: url({currentTrack.thumbnail});"
		></div>
	{/if}
	<div class="absolute inset-0 bg-black/50"></div>
	<div
		class="pointer-events-none absolute inset-0"
		style="background: linear-gradient(180deg, rgba(7,10,18,0.65) 0%, rgba(7,10,18,0.15) 30%, rgba(7,10,18,0.15) 70%, rgba(7,10,18,0.75) 100%);"
	></div>

	<div
		class="relative z-10 flex flex-col h-full w-full px-5 sm:px-8 pt-5 sm:pt-6 pb-6 sm:pb-8"
		in:fly={{ y: 24, duration: 320, delay: 60 }}
	>
		<!-- Top bar: minimize + share/queue -->
		<div class="flex items-center justify-between shrink-0">
			<button
				type="button"
				on:click={() => dispatch('close')}
				aria-label="Minimize player"
				class="glass-btn w-10 h-10 sm:w-11 sm:h-11 text-white/80 hover:text-white"
			>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
					<polyline points="6 9 12 15 18 9"></polyline>
				</svg>
			</button>

			<span class="mono-label !text-[10px]">now playing</span>

			<div class="flex items-center gap-2">
				<button
					type="button"
					on:click={shareTrack}
					aria-label={shareCopied ? 'Copied' : 'Share'}
					class="glass-btn w-10 h-10 sm:w-11 sm:h-11 text-white/80 hover:text-white"
				>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
						<line x1="8.6" y1="10.5" x2="15.4" y2="6.5" /><line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
					</svg>
				</button>
				<button
					type="button"
					on:click={() => dispatch('queue')}
					aria-label="Queue"
					class="glass-btn w-10 h-10 sm:w-11 sm:h-11 text-white/80 hover:text-white"
				>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
						<line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="14" y2="18" />
					</svg>
				</button>
			</div>
		</div>

		<!-- Center: cover art -->
		<div class="flex-1 flex items-center justify-center min-h-0 py-4 sm:py-6">
			<div
				class="glass glass-strong rounded-3xl overflow-hidden shadow-glass-lg aspect-square w-full max-w-[min(78vw,420px)] sm:max-w-[420px]"
			>
				{#if currentTrack}
					<img src={currentTrack.thumbnail} alt="" class="w-full h-full object-cover" />
				{/if}
			</div>
		</div>

		<!-- Bottom: title, progress, controls -->
		<div class="w-full max-w-xl mx-auto shrink-0 flex flex-col gap-5 sm:gap-6">
			<div class="text-center px-2">
				<MarqueeText
					text={currentTrack?.title ?? 'Loading…'}
					className="text-xl sm:text-2xl font-semibold justify-center text-center"
				/>
				<p class="text-sm text-white/50 truncate mt-1">
					{currentTrack ? `Credits: ${currentTrack.artist}` : ''}
				</p>
			</div>

			<ProgressBar on:seek={(e) => dispatch('seek', e.detail)} />

			<div class="flex items-center justify-center gap-5 sm:gap-6">
				<button
					type="button"
					on:click={() => dispatch('prev')}
					aria-label="Previous track"
					class="glass-btn w-12 h-12 sm:w-14 sm:h-14 text-white/70 hover:text-white"
				>
					<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
						<path d="M6 6h2v12H6zm3.5 6L18 6v12z" />
					</svg>
				</button>

				<button
					type="button"
					on:click={() => dispatch('toggle')}
					aria-label={$player.isPlaying ? 'Pause' : 'Play'}
					class="glass-btn w-16 h-16 sm:w-[4.5rem] sm:h-[4.5rem] text-white shadow-accent-glow shadow-[0_0_28px_var(--tw-shadow-color)]"
				>
					{#if $player.isBuffering}
						<span class="w-6 h-6 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
					{:else if $player.isPlaying}
						<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
							<rect x="6" y="5" width="4" height="14" rx="1" />
							<rect x="14" y="5" width="4" height="14" rx="1" />
						</svg>
					{:else}
						<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
							<path d="M8 5v14l11-7z" />
						</svg>
					{/if}
				</button>

				<button
					type="button"
					on:click={() => dispatch('next')}
					aria-label="Next track"
					class="glass-btn w-12 h-12 sm:w-14 sm:h-14 text-white/70 hover:text-white"
				>
					<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
						<path d="M16 6h2v12h-2zM6 6l8.5 6L6 18z" />
					</svg>
				</button>
			</div>

			<div class="flex justify-center">
				<VolumeControl on:volumechange={(e) => dispatch('volumechange', e.detail)} />
			</div>
		</div>
	</div>
</div>
