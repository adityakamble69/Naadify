# memory.md — SyntaxBeats

## Project Snapshot
- **Name:** SyntaxBeats — glassmorphism music player for coders
- **Stack:** SvelteKit + Tailwind CSS + YouTube IFrame Player API
- **Current phase:** Phase 4 done (code-complete) — blocked only on real playlist data

## ✅ Completed
- [x] Requirements gathered and confirmed with Aditya (PRD.md)
- [x] Architecture + folder structure planned (architecture.md)
- [x] Rules/conventions defined (rules.md)
- [x] Phase roadmap created (phases.md)
- [x] Design system (colors, fonts, glassmorphism spec) drafted (design.md)
- [x] Tech stack confirmed: **SvelteKit**
- [x] Male + female background images received from Aditya (retro anime CRT-computer
      illustrations) and saved to `static/images/bg-male.jpg` / `bg-female.jpg`
- [x] Design palette updated to match the actual images (sky blue, CRT blue glow,
      meadow green, sand/bark tones) instead of a generic violet/mint default
- [x] Phase 0 — SvelteKit + Tailwind project scaffolded manually (package.json,
      svelte.config.js, vite.config.js, tailwind.config.js, postcss.config.js)
- [x] Phase 1 — `SelectionScreen.svelte` built (glass card, Male/Female buttons,
      sessionStorage persistence via `selection` store)
- [x] Phase 2 — `PlayerScreen.svelte` shell built (bg image swap, responsive
      layout, entry animation)
- [x] Phase 3 — YouTube integration built (`YouTubePlayer.svelte`,
      `utils/youtube.js` loader, auto-play-on-select, auto-advance on track end)
- [x] Phase 4 — Full controls built: `PlayerControls`, `ProgressBar` (seekable),
      `VolumeControl`, `PlaylistSidebar` (click-to-play, active-track highlight,
      mobile drawer)
- [x] `npm install` + `npm run build` verified clean (no errors, no a11y warnings)
- [x] Project zipped and delivered to Aditya as `syntaxbeats.zip`

## 🔄 Currently Being Worked On
- Nothing active — waiting on Aditya to drop in real YouTube video IDs (he said
  he'll add songs himself).

## ⏳ Blocked / Waiting On (from Aditya)
- [ ] Male playlist — replace placeholder IDs in `src/lib/data/playlist.male.js`
- [ ] Female playlist — replace placeholder IDs in `src/lib/data/playlist.female.js`
- [ ] Aditya to run `npm install && npm run dev` locally and confirm autoplay/UX
      feels right once real songs are in

## 📌 Key Decisions Made
1. Playlist differs by gender selection (not just background image) — confirmed by
   Aditya.
2. Aditya provides his own YouTube video IDs — playlist files ship with clearly
   labeled placeholder entries (`REPLACE_WITH_YOUTUBE_ID_x`), not fake real songs.
3. Single-route app (`/`) — Selection vs Player is a client-side state toggle, not a
   separate page, for instant transition + to keep the same user-gesture unlock the
   YouTube autoplay policy requires.
4. No backend/DB for v1 — playlists are static JS config files, easy to hand-edit.
5. Design palette pivoted away from generic violet/mint to match the actual uploaded
   background art (blue sky / CRT screen blue / meadow green / sand & bark) —
   distinctive rather than templated glassmorphism.
6. YouTube player is rendered visually hidden (1x1, `sr-only`); our own glass UI is
   the only visible player chrome.

## 🗂️ Next Session Should Start With
1. Confirm Aditya has added real YouTube IDs to both playlist files.
2. Do a manual QA pass: autoplay behavior, next/prev, seek, volume, mobile drawer.
3. Move into Phase 5/6 polish (loading skeleton, error state for bad video IDs,
   cross-browser autoplay check — Safari is strictest).

## 📝 Notes for Future Sessions
- Update the "Completed" / "Currently Being Worked On" sections at the end of every
  session — mirrors the workflow used on the Lifeline project.
- If scope changes (e.g. Aditya wants a gender-switch toggle post-selection, or wants
  Spotify instead of YouTube), log the decision here before changing architecture.md.
