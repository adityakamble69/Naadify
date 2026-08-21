<script>
	import { searchVideos, YouTubeApiError } from '$lib/utils/youtubeApi.js';
	import { queue } from '$lib/stores/queue.js';
	import MarqueeText from './MarqueeText.svelte';

	let queryInput = '';
	/** @type {import('$lib/utils/youtubeApi.js').Track[]} */
	let results = [];
	let loading = false;
	let errorMessage = '';
	/** @type {Record<string, boolean>} */
	let addedIds = {};

	function errorText(err) {
		if (err instanceof YouTubeApiError) {
			switch (err.code) {
				case 'missing_key':
					return 'No YouTube API key configured yet.';
				case 'quota_exceeded':
					return 'YouTube search quota exceeded for today — try again tomorrow.';
				case 'invalid_key':
					return 'YouTube API key looks invalid or restricted.';
				case 'network':
					return "Couldn't reach YouTube — check your connection.";
				default:
					return 'Search failed. Please try again.';
			}
		}
		return 'Search failed. Please try again.';
	}

	async function runSearch() {
		const q = queryInput.trim();
		if (!q || loading) return;

		loading = true;
		errorMessage = '';
		try {
			results = await searchVideos(q);
			if (results.length === 0) {
				errorMessage = 'No results found.';
			}
		} catch (err) {
			results = [];
			errorMessage = errorText(err);
		} finally {
			loading = false;
		}
	}

	function onSubmit(e) {
		e.preventDefault();
		runSearch();
	}

	function add(track) {
		queue.addToQueue(track);
		addedIds = { ...addedIds, [track.id]: true };
	}
</script>

<div class="flex flex-col h-full">
	<p class="mono-label mb-3 px-1">// search.videos()</p>

	<form on:submit={onSubmit} class="flex items-center gap-2 mb-3 px-1">
		<input
			type="text"
			bind:value={queryInput}
			placeholder="Search a song or artist…"
			class="flex-1 min-w-0 bg-white/5 border border-white/15 rounded-full px-4 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-accent transition-colors"
		/>
		<button
			type="submit"
			disabled={loading || !queryInput.trim()}
			aria-label="Search"
			class="glass-btn w-9 h-9 shrink-0 text-white/80 hover:text-white disabled:opacity-40 disabled:hover:scale-100"
		>
			{#if loading}
				<span class="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"
				></span>
			{:else}
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
					<circle cx="11" cy="11" r="7"></circle>
					<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
				</svg>
			{/if}
		</button>
	</form>

	{#if errorMessage}
		<div class="glass rounded-2xl px-3 py-2 mb-3 mx-1 text-xs text-white/70 font-mono">
			{errorMessage}
		</div>
	{/if}

	<div class="flex-1 overflow-y-auto flex flex-col gap-1.5 pr-1 -mr-1">
		{#each results as track (track.id)}
			<div class="flex items-center gap-3 p-2.5 rounded-2xl">
				<img
					src={track.thumbnail}
					alt=""
					loading="lazy"
					class="w-10 h-10 rounded-lg object-cover shrink-0 bg-white/10"
				/>
				<span class="min-w-0 flex-1">
					<MarqueeText text={track.title} className="text-sm text-white/90" />
					<span class="block text-xs text-white/40 truncate">{track.artist}</span>
				</span>
				<button
					type="button"
					on:click={() => add(track)}
					disabled={addedIds[track.id]}
					class="mono-label !text-[10px] shrink-0 hover:text-white transition-colors disabled:text-accent disabled:hover:text-accent"
				>
					{addedIds[track.id] ? 'added ✓' : 'add +'}
				</button>
			</div>
		{/each}
	</div>
</div>
