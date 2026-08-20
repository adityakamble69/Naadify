# memory.md — Naadify

## Project Snapshot
- **Name:** Naadify — glassmorphism music player for coders (renamed from SyntaxBeats)
- **Stack:** SvelteKit + Tailwind CSS + YouTube IFrame Player API
- **Current phase:** Phases 0–6 functionally complete. Phase 7 (deploy) pending.
  **Phase 8 (YouTube Data API — search + playlist import) is the active next task.**

## ✅ Completed
- [x] Original SyntaxBeats build: selection screen, player, YouTube playback,
      controls, playlist sidebar (see git history / earlier phases.md revisions)
- [x] **Rebrand to Naadify** — title, meta description, package.json, in-app About/
      FAQ/Support copy all updated
- [x] **Logo added** — first as a small top-bar mark, then upgraded to a large
      centered hero overlay on the background image (Aditya wanted it bigger, twice)
- [x] **Removed the Male/Female selection screen** entirely — app now lands directly
      on the Player Screen. Deleted `SelectionScreen.svelte` and the `selection.js`
      store. Merged `playlist.male.js` + `playlist.female.js` → single `playlist.js`.
      Merged `bg-male.jpg`/`bg-female.jpg` → single `bg.jpg`. Replaced the male/female
      Tailwind accent colors with one shared `accent` color.
- [x] **Live "online now" counter** — `stores/online.js`, cosmetic, drifts every ~4s,
      shown as a second pill next to the play/pause status pill in `TopBar.svelte`
- [x] **Share button** — in `BottomPlayerBar.svelte`, uses `navigator.share` on
      mobile, falls back to clipboard-copy with a "copied!" confirmation
- [x] **Track credits** — artist line now reads `Credits: {artist}`
- [x] **Rain 🌧️ / Fog 🌫️ ambient effects** — `WeatherFX.svelte` (CSS-only falling
      drops / drifting blurred fog layers) + `WeatherToggle.svelte` (two independent
      toggle pills). Positioned above the bottom player bar; had to bump the offset
      up twice (`bottom-[86px]` → `bottom-[110px]` → `bottom-[140px]` mobile) because
      it kept overlapping the player bar at smaller viewport heights.
- [x] `.gitignore` added (node_modules, .svelte-kit, build, .env, OS/log junk)
- [x] `npm install && npm run build` verified clean after every round of changes

## 🔄 Currently Being Worked On
- Nothing actively mid-edit. Just finished writing this doc update.
- **Up next (confirmed with Aditya, 2026-08-20):** YouTube Data API integration —
  he wants **both** an in-app search bar *and* a paste-a-playlist-URL import, so he
  never has to hand-copy a YouTube video ID again. See architecture.md §5 and
  phases.md Phase 8 for the full plan — not started yet, waiting on Aditya to
  generate/share a YouTube Data API v3 key (or confirm he wants Claude to walk him
  through creating one).

## ⏳ Blocked / Waiting On (from Aditya)
- [ ] A YouTube Data API v3 key (new or existing Google Cloud project), restricted
      by HTTP referrer to his deployed domain + localhost
- [ ] Confirmation of default import behavior he wants: should pasting a playlist
      URL always **replace** the current queue, or should we ask replace-vs-append
      each time?

## 📌 Key Decisions Made
1. **2026-08-20 — Dropped the Male/Female selection entirely.** Aditya asked to
   remove the gender-based theme picker; app now goes straight to the player with
   one unified look. Playlists and backgrounds were merged rather than deleted.
2. **2026-08-20 — Rebrand to "Naadify."** New logo supplied by Aditya (transparent
   PNG), applied first small in the top bar, then made into a large hero overlay
   on the background per his follow-up request.
3. **2026-08-20 — Added Deluxe-Salon-inspired extras**, cherry-picked (not the full
   set) after Aditya reviewed a reference screenshot: live online counter, share,
   track credits. He explicitly did **not** ask for the "Change Theme" button or the
   contact-email footer from that reference — those were left out.
4. **2026-08-20 — Added Rain/Fog ambient effects** as a separate follow-up request,
   inspired by the same reference's "Baarish?" toggle, but implemented as two
   independent CSS-only effects rather than a single weather toggle.
5. **2026-08-20 — Decided to connect Naadify to YouTube directly** instead of
   Aditya continuing to hand-paste video IDs. He chose **both** search-in-app and
   playlist-URL import (not just one). No backend planned — client-side `fetch()`
   calls to the YouTube Data API v3 using a referrer-restricted key. Full technical
   plan logged in architecture.md §5 and phases.md Phase 8 before any code was
   written, per Aditya's explicit request to be told the plan first.
6. No backend/DB for v1, still true even with the Data API — it's just another
   client-side fetch, same trust model as the existing YouTube IFrame embed.

## 🗂️ Next Session Should Start With
1. Confirm Aditya has a YouTube Data API v3 key ready (or walk him through creating
   one — Google Cloud Console → enable "YouTube Data API v3" → Credentials → API
   key → restrict by HTTP referrer).
2. Start Phase 8: build `youtubeApi.js`, `queue.js` store, `SearchBar.svelte`,
   `PlaylistImport.svelte`, wire into `PlayerScreen.svelte`.
3. QA search + import end-to-end with real songs before calling Phase 8 done.

## 📝 Notes for Future Sessions
- Update the "Completed" / "Currently Being Worked On" sections at the end of every
  session.
- Aditya iterates fast and in small follow-up messages (often just "isko upar/bada
  karo" style tweaks after seeing a screenshot) — expect several quick polish rounds
  after any new feature ships, and keep changes easy to nudge (named Tailwind
  spacing/size values rather than magic numbers baked into markup where possible).
- If scope changes again (e.g. Aditya wants to drop YouTube for a self-hosted audio
  library, or wants login/accounts), log the decision here before changing
  architecture.md.
