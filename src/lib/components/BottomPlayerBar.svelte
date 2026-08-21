<script>
	import { player } from '$lib/stores/player.js';
	import { createEventDispatcher } from 'svelte';
	import MarqueeText from './MarqueeText.svelte';
	import VolumeControl from './VolumeControl.svelte';
	import GlassCard from './GlassCard.svelte';

	/** @type {{id:string,title:string,artist:string,thumbnail:string}[]} */
	export let playlist = [];

	const dispatch = createEventDispatcher();
	$: currentTrack = playlist[$player.currentIndex] ?? playlist[0];

	let shareCopied = false;
	let volumeOpen = false;
	let volumeWrapperEl;

	function handleWindowClick(e) {
		if (volumeOpen && volumeWrapperEl && !volumeWrapperEl.contains(e.target)) {
			volumeOpen = false;
		}
	}

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

<svelte:window on:click={handleWindowClick} />

<div class="fixed bottom-0 left-0 right-0 z-30 flex justify-center p-4 sm:p-5">
	<div
		class="glass glass-strong glass-liquid rounded-3xl px-4 py-3 sm:px-5 sm:py-3.5 w-full max-w-xl flex items-center gap-3 sm:gap-4 animate-fadeScaleIn"
	>
		<!-- Album thumb — tap to open the fullscreen player -->
		<button
			type="button"
			on:click={() => dispatch('expand')}
			aria-label="Open fullscreen player"
			class="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl overflow-hidden shrink-0 bg-white/10 transition-transform hover:scale-105 active:scale-95"
		>
			{#if currentTrack}
				<img src={currentTrack.thumbnail} alt="" class="w-full h-full object-cover" />
			{/if}
		</button>

		<!-- Title + progress — tap to open the fullscreen player -->
		<div
			class="min-w-0 flex-1 cursor-pointer"
			role="button"
			tabindex="0"
			on:click={() => dispatch('expand')}
			on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && dispatch('expand')}
		>
			<div class="flex items-center justify-between gap-2 mb-1">
				<MarqueeText
					text={currentTrack?.title ?? 'Loading…'}
					className="text-sm font-medium min-w-[56px]"
				/>
				<div class="flex items-center gap-1.5 xs:gap-2.5 shrink-0">
					<button
						type="button"
						class="mono-label !text-[10px] hover:text-white transition-colors flex items-center gap-1"
						on:click|stopPropagation={shareTrack}
						aria-label={shareCopied ? 'Copied' : 'Share'}
					>
						<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0">
							<circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
							<line x1="8.6" y1="10.5" x2="15.4" y2="6.5" /><line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
						</svg>
						<span class="hidden xs:inline">{shareCopied ? 'copied!' : 'share'}</span>
					</button>
					<button
						type="button"
						class="mono-label !text-[10px] hover:text-white transition-colors flex items-center gap-1"
						on:click|stopPropagation={() => dispatch('queue')}
						aria-label="Queue"
					>
						<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="shrink-0">
							<line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="14" y2="18" />
						</svg>
						<span class="hidden xs:inline">queue</span>
					</button>
					<button
						type="button"
						class="text-white/50 hover:text-white transition-colors flex items-center"
						on:click|stopPropagation={() => dispatch('expand')}
						aria-label="Open fullscreen player"
					>
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0">
							<polyline points="4 14 4 20 10 20" /><polyline points="20 10 20 4 14 4" />
							<line x1="4" y1="20" x2="10" y2="14" /><line x1="20" y1="4" x2="14" y2="10" />
						</svg>
					</button>
				</div>
			</div>
			<p class="text-xs text-white/40 truncate mb-1.5 hidden sm:block">
				{currentTrack ? `Credits: ${currentTrack.artist}` : ''}
			</p>
			<div on:click|stopPropagation on:keydown|stopPropagation role="presentation">
				<slot name="progress" />
			</div>
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

			<!-- Volume — desktop-only quick access popover; mobile uses the
			     fullscreen player's VolumeControl instead (no room down here). -->
			<div class="relative hidden sm:block" bind:this={volumeWrapperEl}>
				<button
					type="button"
					on:click={() => (volumeOpen = !volumeOpen)}
					aria-label="Volume"
					aria-expanded={volumeOpen}
					class="glass-btn w-9 h-9 text-white/70 hover:text-white"
				>
					{#if $player.volume === 0}
						<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
							<line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>
						</svg>
					{:else}
						<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
							<path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
						</svg>
					{/if}
				</button>

				{#if volumeOpen}
					<div class="absolute bottom-full right-0 mb-2 z-10">
						<GlassCard
							rounded="rounded-2xl"
							padding="p-3"
							extraClass="w-36 animate-fadeScaleIn"
						>
							<VolumeControl on:volumechange={(e) => dispatch('volumechange', e.detail)} />
						</GlassCard>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
