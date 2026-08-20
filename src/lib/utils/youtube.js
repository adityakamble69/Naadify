/**
 * Loads the YouTube IFrame Player API script exactly once and resolves
 * when window.YT is ready to use.
 */
let apiPromise;

export function loadYouTubeAPI() {
	if (apiPromise) return apiPromise;

	apiPromise = new Promise((resolve) => {
		if (typeof window === 'undefined') return;

		if (window.YT && window.YT.Player) {
			resolve(window.YT);
			return;
		}

		const tag = document.createElement('script');
		tag.src = 'https://www.youtube.com/iframe_api';
		document.head.appendChild(tag);

		// YouTube calls this global function once the API is ready.
		window.onYouTubeIframeAPIReady = () => {
			resolve(window.YT);
		};
	});

	return apiPromise;
}

export function formatTime(seconds) {
	if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
	const m = Math.floor(seconds / 60);
	const s = Math.floor(seconds % 60)
		.toString()
		.padStart(2, '0');
	return `${m}:${s}`;
}
