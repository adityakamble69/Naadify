import { writable } from 'svelte/store';

/**
 * User-built queue (from search results, later playlist imports too).
 * When non-empty, PlayerScreen prefers this over the static playlist.js.
 * Persisted to localStorage so a reload doesn't wipe what you added.
 */

const STORAGE_KEY = 'naadify_queue';

/** @typedef {{ id: string, title: string, artist: string, thumbnail: string }} Track */

function loadInitial() {
	if (typeof window === 'undefined') return [];
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		const parsed = raw ? JSON.parse(raw) : [];
		return Array.isArray(parsed) ? parsed : [];
	} catch (err) {
		return [];
	}
}

function persist(tracks) {
	if (typeof window === 'undefined') return;
	try {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tracks));
	} catch (err) {
		// storage full/blocked — fail silently, queue still works in-memory
	}
}

const { subscribe, update, set } = writable(/** @type {Track[]} */ (loadInitial()));

/** @param {Track} track */
function addToQueue(track) {
	update((tracks) => {
		if (tracks.some((t) => t.id === track.id)) return tracks; // no dupes
		const next = [...tracks, track];
		persist(next);
		return next;
	});
}

/** @param {number} index */
function removeFromQueue(index) {
	update((tracks) => {
		const next = tracks.filter((_, i) => i !== index);
		persist(next);
		return next;
	});
}

function clearQueue() {
	persist([]);
	set([]);
}

/** @param {Track[]} tracks */
function replaceQueue(tracks) {
	persist(tracks);
	set(tracks);
}

export const queue = { subscribe, addToQueue, removeFromQueue, clearQueue, replaceQueue };
