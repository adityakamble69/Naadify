<script>
	import { player } from '$lib/stores/player.js';
	import { formatTime } from '$lib/utils/youtube.js';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let seeking = false;
	let seekValue = 0;

	$: progress = $player.duration
		? (seeking ? seekValue : $player.currentTime) / $player.duration
		: 0;

	function handleInput(e) {
		seeking = true;
		seekValue = Number(e.target.value);
	}

	function handleCommit(e) {
		const value = Number(e.target.value);
		dispatch('seek', value);
		seeking = false;
	}
</script>

<div class="w-full flex items-center gap-3 font-mono text-[11px] text-white/50">
	<span class="w-10 text-right tabular-nums">
		{formatTime(seeking ? seekValue : $player.currentTime)}
	</span>

	<div class="relative flex-1 h-2 group">
		<div class="absolute inset-0 rounded-full bg-white/10"></div>
		<div
			class="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-crt to-crt-glow transition-[width] duration-150"
			style="width: {progress * 100}%"
		></div>
		<input
			type="range"
			min="0"
			max={$player.duration || 0}
			step="0.1"
			value={seeking ? seekValue : $player.currentTime}
			on:input={handleInput}
			on:change={handleCommit}
			aria-label="Seek"
			class="absolute inset-0 w-full opacity-0 cursor-pointer"
		/>
		<div
			class="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-glass opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
			style="left: calc({progress * 100}% - 6px)"
		></div>
	</div>

	<span class="w-10 tabular-nums">{formatTime($player.duration)}</span>
</div>
