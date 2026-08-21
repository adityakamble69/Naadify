<script>
	import { player } from '$lib/stores/player.js';
	import { onlineCount } from '$lib/stores/online.js';
</script>

<div
	class="fixed top-0 left-0 right-0 z-30 flex flex-wrap items-center gap-2 p-4 sm:p-5"
>
	<!-- Live status + live online count -->
	<div class="glass rounded-full px-4 py-2 flex items-center gap-2 font-mono text-xs">
		<span
			class="w-2 h-2 rounded-full {$player.isPlaying ? 'bg-accent animate-pulseGlow' : 'bg-white/30'}"
		></span>
		<span class="text-white/70">
			status: <span class="text-white">{$player.isPlaying ? 'playing' : 'paused'}</span>
		</span>
	</div>

	<div class="glass rounded-full px-4 py-2 flex items-center gap-2 font-mono text-xs">
		<span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulseGlow"></span>
		<span class="text-white/70">
			<span class="text-white">{$onlineCount.toLocaleString()}</span> online
		</span>
	</div>
</div>
