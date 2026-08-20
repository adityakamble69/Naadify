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

## Phase 8 — YouTube Data API Integration (planned, both search + playlist import)
- [ ] Create/reuse Google Cloud project, enable YouTube Data API v3
- [ ] Generate API key, restrict by HTTP referrer (prod domain + localhost)
- [ ] Add `VITE_YOUTUBE_API_KEY` to `.env` (already gitignored)
- [ ] Build `src/lib/utils/youtubeApi.js` — `searchVideos(query)` +
      `fetchPlaylistItems(playlistId)` fetch wrappers
- [ ] Build `queue.js` store — holds user-built queue, persisted to storage
- [ ] Build `SearchBar.svelte` — input + button (not per-keystroke), results list
      with thumbnail/title/channel, "add to queue" per result
- [ ] Build `PlaylistImport.svelte` — paste playlist URL, extract `list=` id,
      fetch + paginate all items, "Replace queue" / "Append to queue" choice
- [ ] Wire `PlayerScreen.svelte` to read from `queue.js` when non-empty, else fall
      back to static `playlist.js`
- [ ] Add inline glass toast/error state for quota-exceeded / invalid video / bad
      playlist URL cases
- [ ] QA: search a song, add it, confirm it plays; import a real playlist, confirm
      order + auto-advance works across the whole imported list
- [ ] Update `memory.md` once this phase ships

---
**Status legend:** ⏳ pending · 🔄 in progress · ✅ done

**Current phase:** Phase 8 — YouTube Data API Integration (search + import), not
started yet. Phases 0–6 are functionally complete; Phase 7 (deploy) still pending.
