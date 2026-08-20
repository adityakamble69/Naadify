/**
 * App playlist — replace the `id` with the real YouTube video ID
 * (the part after "v=" in a YouTube URL, e.g. https://youtube.com/watch?v=XXXXXXXXXXX)
 *
 * `thumbnail` is auto-derived from the id, so you usually don't need to touch it.
 *
 * Add/remove as many songs as you want — the player reads this array directly.
 */

/**
 * @typedef {{ id: string, title: string, artist: string }} Track
 */

/** @type {Track[]} */
const rawPlaylist = [
	{ id: 'REPLACE_WITH_YOUTUBE_ID_1', title: 'Song Title 1', artist: 'Artist Name' },
	{ id: 'REPLACE_WITH_YOUTUBE_ID_2', title: 'Song Title 2', artist: 'Artist Name' },
	{ id: 'REPLACE_WITH_YOUTUBE_ID_3', title: 'Song Title 3', artist: 'Artist Name' },
	{ id: 'REPLACE_WITH_YOUTUBE_ID_4', title: 'Song Title 4', artist: 'Artist Name' }
];

export const playlist = rawPlaylist.map((track) => ({
	...track,
	thumbnail: `https://img.youtube.com/vi/${track.id}/hqdefault.jpg`
}));
