import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const STORAGE_KEY = 'syntaxbeats:selection';

function createSelectionStore() {
	const initial = browser ? sessionStorage.getItem(STORAGE_KEY) : null;
	const { subscribe, set } = writable(initial /* 'male' | 'female' | null */);

	return {
		subscribe,
		/** @param {'male' | 'female'} value */
		choose(value) {
			if (browser) sessionStorage.setItem(STORAGE_KEY, value);
			set(value);
		},
		reset() {
			if (browser) sessionStorage.removeItem(STORAGE_KEY);
			set(null);
		}
	};
}

export const selection = createSelectionStore();
