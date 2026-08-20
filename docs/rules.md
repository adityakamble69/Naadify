# rules.md — SyntaxBeats

## ✅ What We DO
- Use **SvelteKit** conventions — stores for shared state, components for reusable UI.
- Keep the **Selection → Player** transition client-side only (no route change) for
  instant, jank-free UX.
- Use **Tailwind CSS** utility classes for styling; keep custom CSS minimal and only
  for effects Tailwind can't express cleanly (e.g. custom glow keyframes).
- Trigger YouTube playback **inside/right after the user's click** on Male/Female to
  respect browser autoplay policy.
- Keep playlists as simple static JS config files (`playlist.male.js` /
  `playlist.female.js`) — easy for Aditya to edit video IDs later.
- Make every interactive control (play, pause, next, prev, seek, volume) keyboard
  accessible.
- Use semantic HTML where possible even inside Svelte components (`<button>` not
  `<div onclick>`).
- Keep components small and single-responsibility (one file = one job).
- Comment non-obvious logic (especially YouTube IFrame API state handling).
- Update `memory.md` at the end of every work session — what got built, what's next.
- Test on both desktop and mobile viewport before marking a phase "done".

## 🚫 What We AVOID
- No backend/database for v1 — everything is static/client-side.
- No autoplay attempt on page load *without* a prior user click — it will be blocked
  by the browser and will silently fail, breaking the "no second prompt" requirement.
- No raw/unstyled YouTube player UI visible to the user — always wrap with our own
  glass controls.
- No hardcoding male/female bg image paths in multiple places — reference from a
  single config/store.
- No inline styles when a Tailwind utility already covers it.
- No mixing unrelated concerns in one component (e.g. don't put playlist logic inside
  `PlayerControls.svelte`).
- No blocking the UI thread — YouTube API script loads asynchronously.
- No committing real video IDs/images to the repo without Aditya's confirmation they're
  final.
- No skipping the loading state — if the YT player takes a moment to init, show a
  subtle glass skeleton/spinner, not a blank screen.
- No breaking existing project conventions if this ever gets merged into a larger
  Codeline.AI or personal-portfolio codebase.

## 🎨 Design-related Rules (see design.md for full spec)
- Every floating panel/card must use the shared `GlassCard` component — no one-off
  glass styles scattered across files.
- Maintain consistent border-radius scale (`rounded-2xl` / `rounded-3xl`) across all
  cards.
- Dark theme is default and primary — do not add a light-mode toggle unless
  specifically requested.
