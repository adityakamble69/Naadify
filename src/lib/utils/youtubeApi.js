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
	 * @param {'missing_key'|'quota_exceeded'|'invalid_key'|'network'|'unknown'} code
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
