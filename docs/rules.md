# rules.md — Naadify

## ✅ What We DO
- Use **SvelteKit** conventions — stores for shared state, components for reusable UI.
- Use **Tailwind CSS** utility classes for styling; keep custom CSS minimal and only
  for effects Tailwind can't express cleanly (e.g. custom glow keyframes, rain/fog).
- Trigger YouTube playback **inside/right after the user's first click** on the page
  to respect browser autoplay policy.
- Keep the playlist as a simple static JS config file (`playlist.js`) as the
  **fallback only** — since Phase 8, the user-built `queue.js` (search/import)
  takes priority whenever it's non-empty.
- Make every interactive control (play, pause, next, prev, seek, volume) keyboard
  accessible.
- Use semantic HTML where possible even inside Svelte components (`<button>` not
  `<div onclick>`).
- Keep components small and single-responsibility (one file = one job).
- Comment non-obvious logic (especially YouTube IFrame API state handling).
- Update `memory.md` at the end of every work session — what got built, what's next.
- Test on both desktop and mobile viewport before marking a phase "done".
- **(New, for Phase 8)** Keep the YouTube Data API key in `.env` as
  `VITE_YOUTUBE_API_KEY`, never hardcoded in source, never committed (`.gitignore`
  already covers `.env`).
- **(New, for Phase 8)** Restrict the API key by HTTP referrer in Google Cloud
  Console — this is what makes a client-side-only key acceptable for this project.
- **(New, for Phase 8)** Trigger `search.list` calls deliberately (button press /
  Enter key), never per-keystroke — it's the most expensive call (100 units) against
  a ~10,000/day free quota.

## 🚫 What We AVOID
- No backend/database for v1 — everything is static/client-side, including the
  planned YouTube Data API calls.
- No autoplay attempt on page load *without* a prior user click — it will be blocked
  by the browser and will silently fail.
- No raw/unstyled YouTube player UI visible to the user — always wrap with our own
  glass controls.
- No hardcoding the background image path in multiple places — reference from a
  single config/store.
- No inline styles when a Tailwind utility already covers it.
- No mixing unrelated concerns in one component (e.g. don't put queue-fetching logic
  inside `BottomPlayerBar.svelte` — that belongs in `queue.js` / `youtubeApi.js`).
- No blocking the UI thread — YouTube API script loads asynchronously.
- No committing real video IDs/images to the repo without Aditya's confirmation
  they're final.
- No skipping the loading state — if the YT player takes a moment to init, show a
  subtle glass skeleton/spinner, not a blank screen.
- **(New, for Phase 8)** No exposing the raw API key in any client-visible log,
  error message, or committed file — referrer restriction is the safety net, not an
  excuse to be careless with it.
- **(New, for Phase 8)** No calling `search.list` on every keystroke — burns quota
  fast for no UX benefit.

## 🎨 Design-related Rules (see design.md for full spec)
- Every floating panel/card must use the shared `GlassCard` component — no one-off
  glass styles scattered across files.
- Maintain consistent border-radius scale (`rounded-2xl` / `rounded-3xl`) across all
  cards.
- Dark theme is default and primary — do not add a light-mode toggle unless
  specifically requested.
- Fixed-position overlays (weather toggle, player bar, top bar) should use named
  Tailwind spacing utilities (`bottom-[140px]`, etc.) rather than assuming a fixed
  viewport — Aditya has already asked for repositioning twice, expect more.
