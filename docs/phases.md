# phases.md — Naadify

## Phase 0 — Setup & Assets ✅
- [x] Init SvelteKit project + Tailwind CSS
- [x] Set up folder structure (per architecture.md)
- [x] Collect background image(s) from Aditya
- [x] Collect starter playlist (placeholder YouTube IDs, to be replaced)
- [x] Add JetBrains Mono + body font via Google Fonts

## Phase 1 — Rebrand: SyntaxBeats → Naadify ✅
- [x] Renamed app across title, meta, package.json, in-app copy
- [x] Added real Naadify logo (top bar, then upgraded to a big hero overlay on bg)
- [x] Removed the Male/Female selection screen entirely — direct entry to player
- [x] Merged male/female playlists + backgrounds into single unified versions
- [x] Replaced male/female accent colors with one shared `accent` color

## Phase 2 — Player Screen Shell ✅
- [x] `PlayerScreen.svelte` — bg image + big centered logo overlay + glass player bar
- [x] Responsive layout (mobile stacked, desktop wider glass bar)
- [x] Entry animation (fade/scale in)

## Phase 3 — YouTube Playback ✅
- [x] `youtube.js` util — loads YT IFrame API script once
- [x] `YouTubePlayer.svelte` — mounts hidden/styled iframe, exposes play/pause/next/prev
- [x] Auto-play first track on first user interaction (autoplay-policy unlock)
- [x] `onStateChange` → auto-advance to next track when a song ends
- [x] `player` store synced from YT events (isPlaying, currentTime, duration)

## Phase 4 — Player Controls & Queue UI ✅
- [x] `BottomPlayerBar.svelte` — play/pause, next, prev, share, queue toggle
- [x] `ProgressBar.svelte` — seek bar synced to currentTime/duration
- [x] `PlaylistSidebar.svelte` (the "queue") — thumbnail + title + credits,
      active-track highlight, click-to-play
- [ ] `VolumeControl.svelte` — component exists, not yet wired into the visible UI

## Phase 5 — Extra Features (Deluxe-Salon-inspired) ✅
- [x] Live "X online" counter (cosmetic, drifts every few seconds) — `online.js`
- [x] Share button — native share sheet or clipboard-copy fallback
- [x] Track credits shown as "Credits: {artist}"
- [x] Rain 🌧️ ambient visual effect — `WeatherFX.svelte`
- [x] Fog 🌫️ ambient visual effect — `WeatherFX.svelte`
- [x] Rain/Fog toggle buttons — `WeatherToggle.svelte`, repositioned above the
      player bar so it doesn't overlap

## Phase 6 — Responsiveness & QA ✅ (ongoing)
- [x] Mobile layout pass (collapsible queue drawer)
- [x] `npm run build` verified clean after every change so far
- [ ] Dedicated cross-browser autoplay check (Safari is strictest) — not yet done
- [ ] Keyboard accessibility pass — not yet done

## Phase 7 — Deploy
- [ ] Build with SvelteKit static adapter
- [ ] Deploy to Vercel/Netlify
- [ ] Final smoke test on production URL

---

## Phase 8 — YouTube Data API Integration (search + playlist import)
### 8a — Search (done)
- [x] Add `VITE_YOUTUBE_API_KEY` support via `.env` (`.env.example` provided,
      already gitignored) — user provides their own key
- [x] Build `src/lib/utils/youtubeApi.js` — `searchVideos(query)` fetch wrapper,
      typed `YouTubeApiError` for missing-key / quota / invalid-key / network cases
- [x] Build `queue.js` store — holds user-built queue, persisted to localStorage
- [x] Build `SearchBar.svelte` — input + button (not per-keystroke), results list
      with thumbnail/title/channel, "add to queue" per result, inline glass error
- [x] Wire `PlayerScreen.svelte` to read from `queue.js` when non-empty, else fall
      back to static `playlist.js`; first add to an empty queue auto-plays it
- [x] "search" toggle added to `BottomPlayerBar.svelte`, opens a glass drawer
      (same pattern as the queue drawer) with `SearchBar` + "clear queue"
- [x] `npm run build` verified clean

### 8b — Playlist import ✅
- [x] Extend `youtubeApi.js` with `fetchPlaylistItems(playlistId)` (+ pagination)
- [x] Build `PlaylistImport.svelte` — paste playlist URL, extract `list=` id,
      fetch + paginate all items, "Replace queue" / "Append to queue" choice
- [x] Reuse `queue.js` `replaceQueue` (already built) for the "Replace" path
- [x] Add inline glass toast/error state for bad playlist URL / private playlist
- [x] Wired into `PlayerScreen.svelte` search drawer as a "search" / "import" tab
      switcher — both features live in the same drawer now
- [x] `npm run build` verified clean (static adapter output confirmed 2026-08-21)
- [ ] QA: import a *real* playlist with a live API key, confirm order +
      auto-advance works across the whole imported list — still needs Aditya's
      own manual pass since it needs a real `VITE_YOUTUBE_API_KEY`
- [ ] Update `memory.md` once QA is done (docs were stale — code was already
      ahead of the tracked status as of 2026-08-21)

---
**Status legend:** ⏳ pending · 🔄 in progress · ✅ done

**Current phase:** Phase 8 (8a search + 8b import) is functionally complete —
code, wiring, and build all verified. UI now uses an iOS-style Liquid Glass
material (2026-08-21) with the queue docked left instead of right. **Phase 7
(deploy) is the next real gap** — nothing under Phase 7 has been done yet (no
static adapter deploy, no Vercel/Netlify push, no prod smoke test).
