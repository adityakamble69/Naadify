<script>
	import { player } from '$lib/stores/player.js';
	import { onlineCount } from '$lib/stores/online.js';
	import InfoModal from './InfoModal.svelte';

	let openModal = null; // 'about' | 'faq' | 'support' | null
</script>

<div
	class="fixed top-0 left-0 right-0 z-30 flex flex-wrap items-center justify-between gap-2 p-4 sm:p-5"
>
	<!-- Left: live status + live online count -->
	<div class="flex items-center gap-2 flex-wrap">
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

	<!-- Right: about / faq / support -->
	<div class="flex items-center gap-2">
		<button
			type="button"
			on:click={() => (openModal = 'about')}
			class="glass rounded-full px-4 py-2 text-xs sm:text-sm font-medium hover:bg-white/10 transition-colors"
		>
			About
		</button>
		<button
			type="button"
			on:click={() => (openModal = 'faq')}
			class="glass rounded-full px-4 py-2 text-xs sm:text-sm font-medium hover:bg-white/10 transition-colors"
		>
			FAQ
		</button>
		<button
			type="button"
			on:click={() => (openModal = 'support')}
			class="glass rounded-full px-4 py-2 text-xs sm:text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-1.5"
		>
			<span>♥</span> Support us
		</button>
	</div>
</div>

{#if openModal === 'about'}
	<InfoModal title="About Naadify" on:close={() => (openModal = null)}>
		<p>
			Naadify is a lightweight, no-login music player built for long coding
			sessions — open it up, and it keeps playing while you build.
		</p>
		<p class="text-white/50 text-xs font-mono">
			// edit this copy in TopBar.svelte
		</p>
	</InfoModal>
{:else if openModal === 'faq'}
	<InfoModal title="FAQ" on:close={() => (openModal = null)}>
		<div>
			<p class="text-white font-medium mb-1">Why did the music start on its own?</p>
			<p>
				Your first tap on the page is what unlocks autoplay — the browser only
				allows it right after a real click, so it starts immediately instead of
				asking again.
			</p>
		</div>
		<div>
			<p class="text-white font-medium mb-1">Can I change songs?</p>
			<p>Open the queue from the player bar and tap any track to jump to it.</p>
		</div>
	</InfoModal>
{:else if openModal === 'support'}
	<InfoModal title="Support us" on:close={() => (openModal = null)}>
		<p>
			If Naadify keeps you company while you code, sharing it with a fellow
			developer is the best kind of support.
		</p>
		<p class="text-white/50 text-xs font-mono">
			// add a real link (Buy Me a Coffee / UPI / GitHub) here
		</p>
	</InfoModal>
{/if}
