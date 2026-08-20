<script>
	import { selection } from '$lib/stores/selection.js';
	import GlassCard from './GlassCard.svelte';

	/**
	 * Passing the click straight through keeps us inside the browser's
	 * "user gesture" window, which is what allows YouTube to autoplay
	 * with sound right after — no second prompt needed.
	 * @param {'male' | 'female'} value
	 */
	function choose(value) {
		selection.choose(value);
	}
</script>

<div
	class="min-h-screen w-full flex items-center justify-center px-5 relative overflow-hidden bg-base"
>
	<!-- ambient backdrop glow -->
	<div
		class="pointer-events-none absolute inset-0"
		style="background: radial-gradient(circle at 50% 30%, rgba(63,160,255,0.16), transparent 60%);"
	></div>

	<GlassCard
		rounded="rounded-3xl"
		padding="p-8 sm:p-10"
		extraClass="w-full max-w-md animate-fadeScaleIn relative"
	>
		<div class="text-center mb-8">
			<p class="mono-label mb-3">// syntaxbeats.init()</p>
			<h1 class="font-body font-bold text-2xl sm:text-3xl leading-tight">
				Pick your <span class="text-crt-glow">vibe</span> to start coding
			</h1>
			<p class="text-sm text-white/50 mt-2 font-body">One tap — music starts instantly.</p>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<button
				type="button"
				on:click={() => choose('male')}
				class="group glass rounded-2.5xl p-6 flex flex-col items-center gap-3 transition-all duration-200 hover:bg-white/10 hover:-translate-y-1 focus-visible:-translate-y-1"
			>
				<span
					class="w-14 h-14 rounded-full glass-btn text-2xl group-hover:shadow-[0_0_24px_var(--tw-shadow-color)] shadow-male-glow"
				>
					🙋‍♂️
				</span>
				<span class="font-semibold text-base">Male</span>
				<span class="mono-label !text-[10px]">select_theme(&quot;male&quot;)</span>
			</button>

			<button
				type="button"
				on:click={() => choose('female')}
				class="group glass rounded-2.5xl p-6 flex flex-col items-center gap-3 transition-all duration-200 hover:bg-white/10 hover:-translate-y-1 focus-visible:-translate-y-1"
			>
				<span
					class="w-14 h-14 rounded-full glass-btn text-2xl group-hover:shadow-[0_0_24px_var(--tw-shadow-color)] shadow-female-glow"
				>
					🙋‍♀️
				</span>
				<span class="font-semibold text-base">Female</span>
				<span class="mono-label !text-[10px]">select_theme(&quot;female&quot;)</span>
			</button>
		</div>
	</GlassCard>
</div>
