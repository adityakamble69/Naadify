<script>
	import { onDestroy, onMount } from 'svelte';
	import { player } from '$lib/stores/player.js';
	import { loadYouTubeAPI } from '$lib/utils/youtube.js';

	/** @type {{id:string,title:string,artist:string}[]} */
	export let playlist = [];

	let containerId = 'yt-player-' + Math.random().toString(36).slice(2);
	let ytPlayer;
	let pollInterval;
	let mounted = false;

	// Exposed so the parent (PlayerScreen) can drive playback imperatively.
	export function play() {
		ytPlayer?.playVideo?.();
	}
	export function pause() {
		ytPlayer?.pauseVideo?.();
	}
	export function seekTo(seconds) {
		ytPlayer?.seekTo?.(seconds, true);
	}
	export function setVolume(vol) {
		ytPlayer?.setVolume?.(vol);
	}
	export function loadTrack(index, autoplay = true) {
		const track = playlist[index];
		if (!track || !ytPlayer) return;
		player.update((p) => ({ ...p, currentIndex: index, currentTime: 0, isBuffering: true }));
		if (autoplay) {
			ytPlayer.loadVideoById(track.id);
		} else {
			ytPlayer.cueVideoById(track.id);
		}
	}

	onMount(async () => {
		mounted = true;
		const YT = await loadYouTubeAPI();
		if (!mounted || !playlist.length) return;

		ytPlayer = new YT.Player(containerId, {
			height: '1',
			width: '1',
			videoId: playlist[0].id,
			playerVars: {
				autoplay: 1,
				controls: 0,
				disablekb: 1,
				modestbranding: 1,
				rel: 0,
				playsinline: 1
			},
			events: {
				onReady: (e) => {
					e.target.setVolume(70);
					e.target.playVideo();
					player.update((p) => ({ ...p, isReady: true }));

					pollInterval = setInterval(() => {
						if (!ytPlayer?.getCurrentTime) return;
						player.update((p) => ({
							...p,
							currentTime: ytPlayer.getCurrentTime() || 0,
							duration: ytPlayer.getDuration() || 0
						}));
					}, 500);
				},
				onStateChange: (e) => {
					// 1 = playing, 2 = paused, 3 = buffering, 0 = ended
					if (e.data === YT.PlayerState.PLAYING) {
						player.update((p) => ({ ...p, isPlaying: true, isBuffering: false }));
					} else if (e.data === YT.PlayerState.PAUSED) {
						player.update((p) => ({ ...p, isPlaying: false }));
					} else if (e.data === YT.PlayerState.BUFFERING) {
						player.update((p) => ({ ...p, isBuffering: true }));
					} else if (e.data === YT.PlayerState.ENDED) {
						nextTrack();
					}
				}
			}
		});
	});

	function nextTrack() {
		player.update((p) => {
			const next = (p.currentIndex + 1) % playlist.length;
			loadTrack(next, true);
			return p;
		});
	}

	onDestroy(() => {
		mounted = false;
		if (pollInterval) clearInterval(pollInterval);
		ytPlayer?.destroy?.();
	});
</script>

<!-- Hidden — we render our own glass UI on top of this invisible player -->
<div id={containerId} class="sr-only" aria-hidden="true"></div>

<style>
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
	}
</style>
