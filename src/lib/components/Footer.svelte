<script>
	import InfoModal from './InfoModal.svelte';

	let openModal = null; // 'about' | 'faq' | 'support' | null
</script>

<footer
	class="relative z-10 w-full flex flex-col items-center gap-5 px-6 pt-16 pb-40 sm:pb-44 md:pt-24 md:pb-48 text-center"
>
	<p class="mono-label !text-[10px] sm:!text-[11px]">// naadify.footer()</p>

	<div class="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
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

	<p class="text-xs text-white/30 font-mono">Naadify — music for coders</p>
</footer>

{#if openModal === 'about'}
	<InfoModal title="About Naadify" on:close={() => (openModal = null)}>
		<p>
			Naadify is a lightweight, no-login music player built for long coding
			sessions — open it up, and it keeps playing while you build.
		</p>
		<p class="text-white/50 text-xs font-mono">
			// edit this copy in Footer.svelte
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
