/**
 * Thin wrapper around the YouTube Data API v3 `search` endpoint.
 *
 * Requires `VITE_YOUTUBE_API_KEY` in `.env` (see `.env.example`).
 */

const API_BASE = 'https://www.googleapis.com/youtube/v3';

/**
 * @typedef {{ id: string, title: string, artist: string, thumbnail: string }} Track
 */

export class YouTubeApiError extends Error {
	/**
	 * @param {string} message
	 * @param {'missing_key'|'quota_exceeded'|'invalid_key'|'network'|'not_found'|'unknown'} code
	 */
	constructor(message, code) {
		super(message);
		this.name = 'YouTubeApiError';
		this.code = code;
	}
}

/**
 * Search YouTube for videos matching `query`.
 *
 * @param {string} query
 * @param {number} [maxResults]
 * @returns {Promise<Track[]>}
 */
export async function searchVideos(query, maxResults = 12) {
	const key = import.meta.env.VITE_YOUTUBE_API_KEY;

	if (!key) {
		throw new YouTubeApiError(
			'No YouTube API key configured. Add VITE_YOUTUBE_API_KEY to your .env file.',
			'missing_key'
		);
	}

	const trimmed = query.trim();
	if (!trimmed) return [];

	const url = new URL(`${API_BASE}/search`);
	url.searchParams.set('part', 'snippet');
	url.searchParams.set('type', 'video');
	url.searchParams.set('videoEmbeddable', 'true');
	url.searchParams.set('maxResults', String(maxResults));
	url.searchParams.set('q', trimmed);
	url.searchParams.set('key', key);

	let res;
	try {
		res = await fetch(url.toString());
	} catch (err) {
		throw new YouTubeApiError('Network error while reaching YouTube.', 'network');
	}

	if (!res.ok) {
		let reason = '';
		try {
			const body = await res.json();
			reason = body?.error?.errors?.[0]?.reason ?? body?.error?.status ?? '';
		} catch (err) {
			// body wasn't JSON — ignore, fall through with empty reason
		}

		if (res.status === 403 && /quota/i.test(reason)) {
			throw new YouTubeApiError('YouTube API quota exceeded for today.', 'quota_exceeded');
		}
		if (res.status === 400 || res.status === 403) {
			throw new YouTubeApiError('YouTube API key is invalid or restricted.', 'invalid_key');
		}
		throw new YouTubeApiError(`YouTube API request failed (${res.status}).`, 'unknown');
	}

	const data = await res.json();
	const items = Array.isArray(data.items) ? data.items : [];

	return items
		.filter((item) => item?.id?.videoId)
		.map((item) => ({
			id: item.id.videoId,
			title: item.snippet?.title ?? 'Untitled',
			artist: item.snippet?.channelTitle ?? 'Unknown',
			thumbnail:
				item.snippet?.thumbnails?.medium?.url ??
				`https://img.youtube.com/vi/${item.id.videoId}/hqdefault.jpg`
		}));
}

/**
 * Extract a `list=` playlist id from a pasted YouTube URL, or pass through
 * a bare id if that's what the user pasted instead of a full URL.
 *
 * @param {string} input
 * @returns {string|null}
 */
export function extractPlaylistId(input) {
	const trimmed = input.trim();
	if (!trimmed) return null;

	// Bare playlist id (starts with PL/UU/FL/LL etc., no spaces or slashes).
	if (/^[a-zA-Z0-9_-]{10,}$/.test(trimmed) && !trimmed.includes('/')) {
		return trimmed;
	}

	try {
		const url = new URL(trimmed);
		const listId = url.searchParams.get('list');
		return listId || null;
	} catch (err) {
		return null; // not a valid URL and not a bare id
	}
}

/**
 * Fetch every item in a public/unlisted YouTube playlist, paginating
 * through `playlistItems.list` until all pages are collected.
 *
 * @param {string} playlistId
 * @returns {Promise<Track[]>}
 */
export async function fetchPlaylistItems(playlistId) {
	const key = import.meta.env.VITE_YOUTUBE_API_KEY;

	if (!key) {
		throw new YouTubeApiError(
			'No YouTube API key configured. Add VITE_YOUTUBE_API_KEY to your .env file.',
			'missing_key'
		);
	}

	/** @type {Track[]} */
	const tracks = [];
	let pageToken = '';

	do {
		const url = new URL(`${API_BASE}/playlistItems`);
		url.searchParams.set('part', 'snippet');
		url.searchParams.set('maxResults', '50'); // API max per page
		url.searchParams.set('playlistId', playlistId);
		url.searchParams.set('key', key);
		if (pageToken) url.searchParams.set('pageToken', pageToken);

		let res;
		try {
			res = await fetch(url.toString());
		} catch (err) {
			throw new YouTubeApiError('Network error while reaching YouTube.', 'network');
		}

		if (!res.ok) {
			let reason = '';
			let status = '';
			try {
				const body = await res.json();
				reason = body?.error?.errors?.[0]?.reason ?? '';
				status = body?.error?.status ?? '';
			} catch (err) {
				// body wasn't JSON — ignore, fall through with empty reason
			}

			if (res.status === 403 && /quota/i.test(reason)) {
				throw new YouTubeApiError('YouTube API quota exceeded for today.', 'quota_exceeded');
			}
			if (res.status === 404 || reason === 'playlistNotFound') {
				throw new YouTubeApiError(
					"Playlist not found — it may be private, deleted, or the link is wrong.",
					'not_found'
				);
			}
			if (status === 'PERMISSION_DENIED' || (res.status === 403 && !reason)) {
				throw new YouTubeApiError(
					'This playlist is private and can\u2019t be imported.',
					'not_found'
				);
			}
			if (res.status === 400 || res.status === 403) {
				throw new YouTubeApiError('YouTube API key is invalid or restricted.', 'invalid_key');
			}
			throw new YouTubeApiError(`YouTube API request failed (${res.status}).`, 'unknown');
		}

		const data = await res.json();
		const items = Array.isArray(data.items) ? data.items : [];

		for (const item of items) {
			const videoId = item?.snippet?.resourceId?.videoId;
			if (!videoId) continue; // deleted/private video left in playlist — skip
			tracks.push({
				id: videoId,
				title: item.snippet?.title ?? 'Untitled',
				artist: item.snippet?.videoOwnerChannelTitle ?? item.snippet?.channelTitle ?? 'Unknown',
				thumbnail:
					item.snippet?.thumbnails?.medium?.url ??
					`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
			});
		}

		pageToken = data.nextPageToken ?? '';
	} while (pageToken);

	if (tracks.length === 0) {
		throw new YouTubeApiError('This playlist is empty or has no playable videos.', 'not_found');
	}

	return tracks;
}
