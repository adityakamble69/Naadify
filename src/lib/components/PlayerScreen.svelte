<script>
	import { player } from '$lib/stores/player.js';
	import { playlist } from '$lib/data/playlist.js';
	import { weather } from '$lib/stores/weather.js';
	import YouTubePlayer from './YouTubePlayer.svelte';
	import TopBar from './TopBar.svelte';
	import BottomPlayerBar from './BottomPlayerBar.svelte';
	import ProgressBar from './ProgressBar.svelte';
	import PlaylistSidebar from './PlaylistSidebar.svelte';
	import GlassCard from './GlassCard.svelte';
	import WeatherFX from './WeatherFX.svelte';
	import WeatherToggle from './WeatherToggle.svelte';

	let ytPlayerRef;
	let queueOpen = false;

	function togglePlay() {
		if ($player.isPlaying) {
			ytPlayerRef?.pause();
		} else {
			ytPlayerRef?.play();
		}
	}

	function nextTrack() {
		const next = ($player.currentIndex + 1) % playlist.length;
		ytPlayerRef?.loadTrack(next, true);
	}

	function prevTrack() {
		const prev = ($player.currentIndex - 1 + playlist.length) % playlist.length;
		ytPlayerRef?.loadTrack(prev, true);
	}

	function selectTrack(e) {
		ytPlayerRef?.loadTrack(e.detail, true);
		queueOpen = false;
	}

	function handleSeek(e) {
		ytPlayerRef?.seekTo(e.detail);
	}
</script>

<YouTubePlayer bind:this={ytPlayerRef} {playlist} />

<div class="min-h-screen w-full relative overflow-hidden bg-base">
	<!-- Full-bleed background -->
	<div
		class="absolute inset-0 bg-cover bg-center scale-105"
		style="background-image: url('/images/bg.jpg');"
	></div>
	<div class="absolute inset-0 bg-black/25"></div>
	<div
		class="pointer-events-none absolute inset-0"
		style="background: linear-gradient(180deg, rgba(7,10,18,0.55) 0%, rgba(7,10,18,0) 20%, rgba(7,10,18,0) 70%, rgba(7,10,18,0.6) 100%);"
	></div>

	<WeatherFX mode={$weather} />

	<TopBar />

	<!-- Big hero logo, over the background -->
	<div
		class="pointer-events-none absolute inset-x-0 top-20 sm:top-28 flex justify-center px-6 z-10"
	>
		<img
			src="/images/logo.png"
			alt="Naadify"
			class="w-full max-w-[280px] sm:max-w-[460px] h-auto drop-shadow-[0_6px_24px_rgba(0,0,0,0.55)] animate-fadeScaleIn"
		/>
	</div>

	<div class="min-h-screen w-full"></div>

	<WeatherToggle />

	<BottomPlayerBar
		{playlist}
		on:toggle={togglePlay}
		on:next={nextTrack}
		on:prev={prevTrack}
		on:queue={() => (queueOpen = true)}
	>
		<svelte:fragment slot="progress">
			<ProgressBar on:seek={handleSeek} />
		</svelte:fragment>
	</BottomPlayerBar>

	<!-- Queue drawer -->
	{#if queueOpen}
		<div class="fixed inset-0 z-40 flex items-end sm:items-center sm:justify-end">
			<button
				type="button"
				class="absolute inset-0 bg-black/55 backdrop-blur-sm cursor-default"
				aria-label="Close queue"
				on:click={() => (queueOpen = false)}
			></button>

			<GlassCard
				rounded="rounded-t-3xl sm:rounded-3xl"
				padding="p-5"
				extraClass="relative w-full sm:w-80 sm:mr-5 sm:mb-5 max-h-[70vh] sm:max-h-[80vh] flex animate-fadeScaleIn"
			>
				<PlaylistSidebar {playlist} on:select={selectTrack} />
			</GlassCard>
		</div>
	{/if}
</div>
