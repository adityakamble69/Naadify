import { writable } from 'svelte/store';

/**
 * Purely visual weather overlay for the background.
 * @type {import('svelte/store').Writable<'none' | 'rain' | 'fog'>}
 */
export const weather = writable('none');
