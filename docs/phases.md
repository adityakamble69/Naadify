# phases.md — SyntaxBeats

## Phase 0 — Setup & Assets ⏳ (blocking)
- [ ] Init SvelteKit project + Tailwind CSS
- [ ] Set up folder structure (per architecture.md)
- [ ] Collect Male background image from Aditya
- [ ] Collect Female background image from Aditya
- [ ] Collect Male playlist (YouTube IDs + titles) from Aditya
- [ ] Collect Female playlist (YouTube IDs + titles) from Aditya
- [ ] Add JetBrains Mono + body font via Google Fonts / self-hosted

## Phase 1 — Selection Screen
- [ ] Build `SelectionScreen.svelte` — glass card, centered, blurred bg
- [ ] Male / Female buttons with hover/active glass states
- [ ] Wire click → update `selection` store → trigger transition
- [ ] sessionStorage persistence (skip re-asking on refresh mid-session)
- [ ] Entry animation (fade/scale in)

## Phase 2 — Player Screen Shell
- [ ] Build `PlayerScreen.svelte` layout (bg image + centered glass player card)
- [ ] Background image swaps based on `selection` store value
- [ ] Responsive layout (mobile stacked, desktop side-by-side with playlist)
- [ ] Transition animation from Selection → Player

## Phase 3 — YouTube Integration
- [ ] `youtube.js` util — loads YT IFrame API script once
- [ ] `YouTubePlayer.svelte` — mounts hidden/styled iframe, exposes play/pause/next/prev
- [ ] Auto-play first track immediately on entering Player Screen (using the selection
      click as the unlock gesture)
- [ ] `onStateChange` → auto-advance to next track when a song ends
- [ ] Sync `player` store (isPlaying, currentTime, duration) from YT events

## Phase 4 — Player Controls & Playlist UI
- [ ] `PlayerControls.svelte` — play/pause, next, prev buttons (glass, icon-based)
- [ ] `ProgressBar.svelte` — seek bar synced to currentTime/duration
- [ ] `VolumeControl.svelte` — slider, mute toggle
- [ ] `PlaylistSidebar.svelte` — list of songs, thumbnail + title + artist, active-track
      highlight, click-to-play
- [ ] Smooth active/hover states throughout (glass glow, scale micro-interactions)

## Phase 5 — Coder-Theme Polish
- [ ] Apply glassmorphism refinement (blur strength, border glow, shadow layering)
- [ ] Add coder-theme accents (monospace labels, subtle terminal-style details,
      neon accent color for active states)
- [ ] Loading/skeleton state while YT player initializes
- [ ] Empty/error state handling (e.g. video unavailable)

## Phase 6 — Responsiveness & QA
- [ ] Mobile layout pass (collapsible playlist drawer)
- [ ] Cross-browser check (Chrome, Safari, Firefox, Edge)
- [ ] Autoplay verification across browsers (especially Safari, which is strictest)
- [ ] Keyboard accessibility pass
- [ ] Performance check (Lighthouse — should stay fast despite bg images + YT script)

## Phase 7 — Deploy
- [ ] Build with SvelteKit static adapter
- [ ] Deploy to Vercel/Netlify
- [ ] Final smoke test on production URL

---
**Status legend:** ⏳ pending · 🔄 in progress · ✅ done

**Current phase:** Phase 0 — waiting on assets (images + playlists) from Aditya.
