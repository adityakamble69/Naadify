<script>
	/** @type {'none' | 'rain' | 'fog'} */
	export let mode = 'none';

	// Pre-computed once so the drops don't reshuffle on every re-render.
	const drops = Array.from({ length: 70 }, () => ({
		left: Math.random() * 100,
		duration: 0.5 + Math.random() * 0.6,
		delay: Math.random() * 2,
		opacity: 0.15 + Math.random() * 0.45,
		height: 40 + Math.random() * 60
	}));
</script>

{#if mode === 'rain'}
	<div class="pointer-events-none absolute inset-0 overflow-hidden z-[5]">
		{#each drops as d, i (i)}
			<span
				class="drop"
				style="
					left: {d.left}%;
					height: {d.height}px;
					opacity: {d.opacity};
					animation-duration: {d.duration}s;
					animation-delay: {d.delay}s;
				"
			></span>
		{/each}
	</div>
{:else if mode === 'fog'}
	<div class="pointer-events-none absolute inset-0 overflow-hidden z-[5]">
		<div class="fog-layer fog-layer-1"></div>
		<div class="fog-layer fog-layer-2"></div>
	</div>
{/if}

<style>
	.drop {
		position: absolute;
		top: -12%;
		width: 1px;
		background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.6));
		animation-name: fall;
		animation-timing-function: linear;
		animation-iteration-count: infinite;
	}

	@keyframes fall {
		from {
			transform: translateY(0);
		}
		to {
			transform: translateY(115vh);
		}
	}

	.fog-layer {
		position: absolute;
		inset: -20%;
		background: radial-gradient(ellipse at center, rgba(255, 255, 255, 0.22), transparent 60%);
		filter: blur(30px);
		animation: drift 20s ease-in-out infinite alternate;
	}

	.fog-layer-2 {
		top: 10%;
		animation-duration: 26s;
		animation-direction: alternate-reverse;
		opacity: 0.65;
	}

	@keyframes drift {
		from {
			transform: translateX(-8%);
		}
		to {
			transform: translateX(8%);
		}
	}
</style>
