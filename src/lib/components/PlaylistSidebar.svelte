<script>
	import { player } from '$lib/stores/player.js';
	import { createEventDispatcher } from 'svelte';
	import MarqueeText from './MarqueeText.svelte';

	/** @type {{id:string,title:string,artist:string,thumbnail:string}[]} */
	export let playlist = [];

	const dispatch = createEventDispatcher();
	const accent = 'border-accent';
</script>

<div class="flex flex-col h-full">
	<p class="mono-label mb-3 px-1">// queue.list()</p>
	<div class="flex-1 overflow-y-auto flex flex-col gap-1.5 pr-1 -mr-1">
		{#each playlist as track, i (track.id + i)}
			<button
				type="button"
				on:click={() => dispatch('select', i)}
				class="group flex items-center gap-3 p-2.5 rounded-2xl text-left transition-all duration-150 border-l-2 {i ===
				$player.currentIndex
					? `${accent} bg-white/10`
					: 'border-transparent hover:bg-white/5'}"
			>
				<span
					class="mono-label !text-[10px] w-5 text-center shrink-0 {i === $player.currentIndex
						? 'text-white'
						: ''}"
				>
					{i === $player.currentIndex && $player.isPlaying ? '▶' : String(i + 1).padStart(2, '0')}
				</span>

				<img
					src={track.thumbnail}
					alt=""
					loading="lazy"
					class="w-10 h-10 rounded-lg object-cover shrink-0 bg-white/10"
				/>

				<span class="min-w-0 flex-1">
					<MarqueeText
						text={track.title}
						className="text-sm {i === $player.currentIndex
							? 'text-white font-medium'
							: 'text-white/80'}"
					/>
					<span class="block text-xs text-white/40 truncate">{track.artist}</span>
				</span>
			</button>
		{/each}
	</div>
</div>
