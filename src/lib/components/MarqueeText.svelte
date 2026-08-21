<script>
	import { onMount, tick } from 'svelte';

	/** The text to display / scroll if it overflows */
	export let text = '';
	/** Extra classes for typography (font-size, weight, color) — no need to
	 *  include `truncate` or `whitespace-nowrap`, that's handled internally */
	export let className = '';
	/** Scroll speed in pixels/second — bigger number = faster roll */
	export let speed = 45;

	let containerEl;
	let measureEl;
	let overflowing = false;
	let duration = 8;
	let ro;

	async function measure() {
		await tick();
		if (!containerEl || !measureEl) return;
		const containerWidth = containerEl.clientWidth;
		const textWidth = measureEl.scrollWidth;
		overflowing = textWidth > containerWidth + 2;
		if (overflowing) {
			duration = Math.max(textWidth / speed, 4);
		}
	}

	// re-measure whenever the text itself changes (new track, new search result, etc.)
	$: text, measure();

	onMount(() => {
		measure();
		if (typeof ResizeObserver !== 'undefined' && containerEl) {
			ro = new ResizeObserver(() => measure());
			ro.observe(containerEl);
		}
		return () => ro?.disconnect();
	});
</script>

<div bind:this={containerEl} class="marquee-viewport {className}">
	<!-- invisible measuring node: always full-width, never wraps -->
	<span bind:this={measureEl} class="marquee-measure" aria-hidden="true">{text}</span>

	{#if overflowing}
		<div class="marquee-track" style="--marquee-duration: {duration}s">
			<span class="marquee-seg">{text}</span>
			<span class="marquee-seg" aria-hidden="true">{text}</span>
		</div>
	{:else}
		<span class="block truncate">{text}</span>
	{/if}
</div>

<style>
	.marquee-viewport {
		position: relative;
		overflow: hidden;
		min-width: 0;
	}
	.marquee-measure {
		visibility: hidden;
		position: absolute;
		top: 0;
		left: 0;
		white-space: nowrap;
		pointer-events: none;
	}
	.marquee-track {
		display: flex;
		width: max-content;
		animation: marqueeScroll var(--marquee-duration, 8s) linear infinite;
		animation-delay: 1.2s;
	}
	.marquee-viewport:hover .marquee-track {
		animation-play-state: paused;
	}
	.marquee-seg {
		white-space: nowrap;
		padding-right: 2.5rem;
	}
	@keyframes marqueeScroll {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-50%);
		}
	}
</style>
