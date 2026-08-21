# PRD.md — Naadify (Music Player for Coders)

## 1. Project Overview
Naadify is a glassmorphism-themed music player website built for coders/developers.
The user lands directly on the **Player Screen** — no gender/theme selection anymore
— and can immediately play a curated playlist (via YouTube), toggle ambient rain/fog
effects, see a live "online now" counter, and share the current track.

> **Renamed from SyntaxBeats → Naadify** (branding + logo updated across the app).

## 2. Goals
- Give developers a quick, no-friction music player they can keep open while coding.
- Deliver a premium, modern **glassmorphism** aesthetic (blurred, translucent panels,
  soft shadows, smooth edges).
- Zero-friction entry — no selection screen, straight into the player.
- Seamless song switching (next/prev/click-to-play from playlist) without page reloads
  or visual jank.
- **Delivered:** removed the manual "copy YouTube ID into a JS file" workflow by
  connecting Naadify directly to the YouTube Data API — songs can now be added
  from inside the app itself, via search or playlist-URL import.
- **Next milestone:** get the app actually live (Phase 7 — deploy to Vercel/Netlify).

## 3. Target Users
- Developers/coders who want ambient/focus music while working.
- Users who prefer a fast, visually striking single-purpose tool over a full streaming
  app.

## 4. Core User Flow
1. User lands on the site → **Player Screen** loads immediately.
   - Background image + big centered Naadify logo overlay.
   - First song from the playlist starts playing (first user tap/click unlocks
     autoplay per browser policy).
   - Playlist ("queue") drawer shows all songs.
2. User can:
   - Play / Pause
   - Next / Previous track
   - Click any song in the queue to jump to it
   - See progress bar + current time / duration
   - See live "X online" counter (cosmetic)
   - Toggle **Rain** and/or **Fog** ambient visual effects
   - **Share** the current track (native share sheet or copy-to-clipboard link)
   - **Search YouTube** directly from inside the app and add a result to the queue
   - **Paste any YouTube playlist URL** and import all its videos (append or
     replace the current queue)
3. **(Pending Aditya's manual QA)** Both search and import are code-complete and
   build-verified, but haven't yet been exercised against a live YouTube Data API
   key by a human.

## 5. Functional Requirements
| # | Requirement | Priority | Status |
|---|-------------|----------|--------|
| FR1 | Land directly on Player Screen (no selection step) | Must | ✅ Done |
| FR2 | Auto-play first track immediately (using the first click as the unlock gesture) | Must | ✅ Done |
| FR3 | Play / Pause control | Must | ✅ Done |
| FR4 | Next / Previous track control | Must | ✅ Done |
| FR5 | Clickable queue with active-track highlight | Must | ✅ Done |
| FR6 | Progress bar with seek | Should | ✅ Done |
| FR7 | Volume control | Should | ⏳ Component exists, not wired into UI |
| FR8 | Fully responsive (mobile + desktop) | Must | ✅ Done |
| FR9 | Auto-advance to next song when current ends | Must | ✅ Done |
| FR10 | Live "online now" counter (cosmetic) | Should | ✅ Done |
| FR11 | Share current track (native share / clipboard fallback) | Should | ✅ Done |
| FR12 | Rain ambient visual effect toggle | Should | ✅ Done |
| FR13 | Fog ambient visual effect toggle | Should | ✅ Done |
| FR14 | **YouTube search inside the app** — search box, results with thumbnail/title/channel, one-tap "add to queue" | Must (next) | ✅ Done — pending live QA |
| FR15 | **YouTube playlist import** — paste a playlist URL, fetch all videos, replace/append to queue | Must (next) | ✅ Done — pending live QA |
| FR16 | Persist any songs added via search/import so they survive a page refresh | Should (next) | ✅ Done (localStorage) |
| FR17 | Deploy to a live URL (Vercel/Netlify) | Must (next) | ⏳ Not started |

## 6. Non-Functional Requirements
- **Performance:** First screen should render instantly; YouTube API loads async.
- **Aesthetic:** Glassmorphism — translucent frosted-glass cards (`backdrop-filter:
  blur()`), soft multi-layer shadows, 16–24px rounded corners, subtle border glow.
- **Coder theme:** Monospace accents (JetBrains Mono / Fira Code), terminal/neon glow
  touches, dark-first color palette.
- **Accessibility:** Keyboard-operable controls, sufficient contrast on glass panels.
- **Browser compatibility:** Modern evergreen browsers (Chrome, Edge, Firefox, Safari).
- **API quota awareness (new):** YouTube Data API v3 free tier is ~10,000 units/day;
  a `search.list` call costs 100 units (~100 searches/day) and `playlistItems.list`
  costs 1 unit per page. Search should be deliberate (button press, not per-keystroke)
  to avoid burning quota.

## 7. Out of Scope (still, for now)
- User accounts / login
- Persisting playlists across devices/browsers (only local/session persistence)
- Uploading custom (non-YouTube) audio files
- Multi-language UI (English/Hinglish only)
- A backend/server component — the YouTube API key will be used client-side,
  restricted by HTTP referrer in Google Cloud Console (see architecture.md §7)

## 8. Open Items (pending from Aditya)
- [ ] Generate/share a real `VITE_YOUTUBE_API_KEY` and do a live manual QA pass on
      search + playlist import (code side is done, needs a human with a real key)
- [ ] Confirm final queue song list once search/import QA is done (no more
      placeholder `REPLACE_WITH_YOUTUBE_ID_x` entries needed)
- [ ] Decide hosting target for Phase 7 deploy — Vercel or Netlify

## 9. Success Criteria
- User reaches playing music within 1 click (land → tap play).
- No broken autoplay (no second prompt needed).
- Visual QA: glassmorphism renders correctly on Chrome + Safari + mobile.
- **(Next)** Aditya can add a new song to the queue in under 10 seconds without
  touching any code file.
