<script>
	import { createEventDispatcher } from 'svelte';
	export let title = '';

	const dispatch = createEventDispatcher();
	function close() {
		dispatch('close');
	}
	function onKeydown(e) {
		if (e.key === 'Escape') close();
	}
</script>

<svelte:window on:keydown={onKeydown} />

<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
	<button
		type="button"
		class="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-default"
		aria-label="Close"
		on:click={close}
	></button>

	<div
		class="glass glass-strong rounded-3xl p-6 sm:p-7 w-full max-w-sm relative animate-fadeScaleIn"
	>
		<div class="flex items-center justify-between mb-4">
			<h3 class="font-body font-semibold text-lg">{title}</h3>
			<button
				type="button"
				on:click={close}
				aria-label="Close"
				class="glass-btn w-8 h-8 text-white/70 hover:text-white shrink-0"
			>
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
			</button>
		</div>
		<div class="text-sm text-white/70 leading-relaxed space-y-3 font-body">
			<slot />
		</div>
	</div>
</div>
