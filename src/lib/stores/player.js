import { writable } from 'svelte/store';

/**
 * Central playback state, driven by YouTubePlayer.svelte and read by
 * PlayerControls / ProgressBar / PlaylistSidebar / VolumeControl.
 */
export const player = writable({
	currentIndex: 0,
	isPlaying: false,
	isReady: false, // YT player finished initializing
	isBuffering: false,
	currentTime: 0,
	duration: 0,
	volume: 70 // 0-100
});
