<script>
	import { fetchPlaylistItems, extractPlaylistId, YouTubeApiError } from '$lib/utils/youtubeApi.js';
	import { queue } from '$lib/stores/queue.js';

	let urlInput = '';
	let loading = false;
	let errorMessage = '';
	let successMessage = '';
	/** @type {import('$lib/utils/youtubeApi.js').Track[]} */
	let importedTracks = [];

	function errorText(err) {
		if (err instanceof YouTubeApiError) {
			switch (err.code) {
				case 'missing_key':
					return 'No YouTube API key configured yet.';
				case 'quota_exceeded':
					return 'YouTube API quota exceeded for today — try again tomorrow.';
				case 'invalid_key':
					return 'YouTube API key looks invalid or restricted.';
				case 'not_found':
					return err.message;
				case 'network':
					return "Couldn't reach YouTube — check your connection.";
				default:
					return 'Import failed. Please try again.';
			}
		}
		return 'Import failed. Please try again.';
	}

	async function runImport() {
		const raw = urlInput.trim();
		if (!raw || loading) return;

		const playlistId = extractPlaylistId(raw);
		if (!playlistId) {
			errorMessage = "That doesn't look like a valid playlist link or id.";
			successMessage = '';
			importedTracks = [];
			return;
		}

		loading = true;
		errorMessage = '';
		successMessage = '';
		importedTracks = [];

		try {
			importedTracks = await fetchPlaylistItems(playlistId);
		} catch (err) {
			errorMessage = errorText(err);
		} finally {
			loading = false;
		}
	}

	function onSubmit(e) {
		e.preventDefault();
		runImport();
	}

	function replaceQueueWithImport() {
		queue.replaceQueue(importedTracks);
		successMessage = `Replaced queue with ${importedTracks.length} track${importedTracks.length === 1 ? '' : 's'}.`;
		importedTracks = [];
		urlInput = '';
	}

	function appendToQueue() {
		for (const track of importedTracks) {
			queue.addToQueue(track);
		}
		successMessage = `Added ${importedTracks.length} track${importedTracks.length === 1 ? '' : 's'} to queue.`;
		importedTracks = [];
		urlInput = '';
	}
</script>

<div class="flex flex-col h-full">
	<p class="mono-label mb-3 px-1">// playlist.import()</p>

	<form on:submit={onSubmit} class="flex items-center gap-2 mb-3 px-1">
		<input
			type="text"
			bind:value={urlInput}
			placeholder="Paste a YouTube playlist link…"
			class="flex-1 min-w-0 bg-white/5 border border-white/15 rounded-full px-4 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-accent transition-colors"
		/>
		<button
			type="submit"
			disabled={loading || !urlInput.trim()}
			aria-label="Import playlist"
			class="glass-btn w-9 h-9 shrink-0 text-white/80 hover:text-white disabled:opacity-40 disabled:hover:scale-100"
		>
			{#if loading}
				<span class="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"
				></span>
			{:else}
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
					<path d="M12 5v14M5 12l7 7 7-7" />
				</svg>
			{/if}
		</button>
	</form>

	{#if errorMessage}
		<div class="glass rounded-2xl px-3 py-2 mb-3 mx-1 text-xs text-white/70 font-mono">
			{errorMessage}
		</div>
	{/if}

	{#if successMessage}
		<div class="glass rounded-2xl px-3 py-2 mb-3 mx-1 text-xs text-accent font-mono">
			{successMessage}
		</div>
	{/if}

	{#if importedTracks.length > 0}
		<div class="flex items-center justify-between mb-2 px-1">
			<span class="text-xs text-white/40">{importedTracks.length} tracks found</span>
			<div class="flex items-center gap-3">
				<button
					type="button"
					class="mono-label !text-[10px] hover:text-white transition-colors"
					on:click={appendToQueue}
				>
					append +
				</button>
				<button
					type="button"
					class="mono-label !text-[10px] hover:text-white transition-colors"
					on:click={replaceQueueWithImport}
				>
					replace queue
				</button>
			</div>
		</div>

		<div class="flex-1 overflow-y-auto flex flex-col gap-1.5 pr-1 -mr-1">
			{#each importedTracks as track (track.id)}
				<div class="flex items-center gap-3 p-2.5 rounded-2xl">
					<img
						src={track.thumbnail}
						alt=""
						loading="lazy"
						class="w-10 h-10 rounded-lg object-cover shrink-0 bg-white/10"
					/>
					<span class="min-w-0 flex-1">
						<span class="block text-sm truncate text-white/90">{track.title}</span>
						<span class="block text-xs text-white/40 truncate">{track.artist}</span>
					</span>
				</div>
			{/each}
		</div>
	{/if}
</div>
