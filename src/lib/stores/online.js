import { writable } from 'svelte/store';
import { browser } from '$app/environment';

/**
 * Simulated live "online now" counter — purely cosmetic, no real
 * presence tracking. Starts at a random baseline and gently drifts
 * up/down every few seconds so it feels alive.
 */
function createOnlineStore() {
	const initial = 800 + Math.floor(Math.random() * 700);
	const { subscribe, update } = writable(initial);

	if (browser) {
		setInterval(() => {
			update((n) => {
				const delta = Math.floor(Math.random() * 7) - 3; // -3..+3
				const next = n + delta;
				return next < 50 ? 50 : next;
			});
		}, 4000);
	}

	return { subscribe };
}

export const onlineCount = createOnlineStore();
