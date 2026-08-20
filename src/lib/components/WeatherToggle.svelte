<script>
	import { weather } from '$lib/stores/weather.js';

	/** @param {'rain' | 'fog'} mode */
	function setMode(mode) {
		weather.update((current) => (current === mode ? 'none' : mode));
	}
</script>

<div
	class="fixed bottom-[86px] sm:bottom-[98px] left-1/2 -translate-x-1/2 z-30 flex items-center gap-2"
>
	<button
		type="button"
		on:click={() => setMode('rain')}
		class="glass rounded-full px-3.5 py-1.5 text-xs font-medium flex items-center gap-1.5 transition-colors {$weather ===
		'rain'
			? 'bg-accent/30 text-white'
			: 'text-white/70 hover:bg-white/10'}"
	>
		<span>🌧️</span> Rain
	</button>

	<button
		type="button"
		on:click={() => setMode('fog')}
		class="glass rounded-full px-3.5 py-1.5 text-xs font-medium flex items-center gap-1.5 transition-colors {$weather ===
		'fog'
			? 'bg-accent/30 text-white'
			: 'text-white/70 hover:bg-white/10'}"
	>
		<span>🌫️</span> Fog
	</button>
</div>
