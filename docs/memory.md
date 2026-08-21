# memory.md — Naadify

## Project Snapshot
- **Name:** Naadify — glassmorphism music player for coders (renamed from SyntaxBeats)
- **Stack:** SvelteKit + Tailwind CSS + YouTube IFrame Player API
- **Current phase:** Phases 0–6, Phase 8 (search + playlist import), and Phase 9
  (fullscreen "now playing" view) are functionally complete and build-verified.
  **Phase 7 (deploy) is the only phase with zero progress — that's the real
  next task.**

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
- [x] **Phase 8a — Search** — `youtubeApi.js` (`searchVideos`), `queue.js` store
      (localStorage-persisted), `SearchBar.svelte`, wired into `PlayerScreen.svelte`
- [x] **Phase 8b — Playlist import** — `extractPlaylistId` + `fetchPlaylistItems`
      (paginated) in `youtubeApi.js`, full `PlaylistImport.svelte` (paste URL,
      loading/error/success states, preview list, append/replace buttons), wired
      into `PlayerScreen.svelte`'s search drawer as a "search"/"import" tab switch.
      **Note (2026-08-21): this was already fully built in the codebase — phases.md
      had it marked "not started" from a stale doc update. Verified against actual
      source, not just the docs, before continuing.**
- [x] `npm run build` re-verified clean on 2026-08-21 (static adapter output OK;
      only harmless Svelte/Kit internal "not exported" warnings, no failures)
- [x] **Liquid Glass UI redesign (2026-08-21)** — replaced flat glassmorphism with
      an iOS-26-style Liquid Glass material: saturated blur (`saturate(190%)`),
      directional top-lit gradient fill + brighter top border, specular highlight
      pseudo-layer (top-left white glow + faint accent-blue pickup bottom-right),
      inset bevel shadow for physical "thickness", and spring-easing bounce on
      buttons. Added a single signature touch — a slow 7s drifting sheen
      (`.glass-liquid`) — on the bottom player bar only, kept off every other
      surface deliberately so it stays a moment, not noise. Cascades everywhere
      automatically since all components already share the `.glass`/`.glass-btn`
      utility classes from `app.css`.
- [x] **Queue drawer moved to the left (2026-08-21)** — was a right-docked floating
      card, now docks to the left edge as a tall sidebar-style panel on desktop
      (`sm:ml-5 sm:my-5`, stretches to near-full height via `sm:items-stretch`).
      Mobile behavior unchanged (still a bottom sheet). Search/import drawer
      intentionally left centered — not part of this request.
- [x] **Scrolling ("marquee") track titles (2026-08-21)** — new reusable
      `MarqueeText.svelte`: measures whether the title actually overflows its
      box before animating anything (short titles stay static), scrolls in a
      seamless CSS loop, pauses on hover. Wired into the three places showing
      a track title: `BottomPlayerBar.svelte` (now-playing bar),
      `PlaylistSidebar.svelte` (queue list), `SearchBar.svelte` (search
      results). Artist line under each title left as plain `truncate` — only
      the title was reported as not scrolling.
- [x] **Static background replaced with animated cloud shader (2026-08-21)** —
      Aditya asked for `npx shadcn@latest add @aceternity/cloud-shader-demo`;
      that registry component is React/Next-only with no SvelteKit
      equivalent, so instead built `CloudShaderBackground.svelte`: a raw
      WebGL2 fullscreen-triangle shader (fbm noise + domain warp, slow drift)
      tinted to the existing Tailwind palette (`base #070A12`,
      `sky #1959C9`, `accent #3FA0FF`, `accent-glow #6FC3FF`) so it reads as
      part of the same design system. Replaces `bg.jpg` entirely in
      `PlayerScreen.svelte`; existing dark overlay + vertical gradient kept
      unchanged on top for text legibility. Auto-pauses on
      `visibilitychange` when tab isn't focused, capped at 2x DPR, falls back
      to flat `bg-base` color if WebGL2 is unavailable. **Not yet visually
      screenshot-tested** — no browser in this sandbox; build is clean but a
      real look-over (incl. older/lower-end GPUs, since it's WebGL2-only) is
      worth doing before calling this QA'd. `static/images/bg.jpg` left in
      the repo untouched, not deleted, in case Aditya wants to revert.
      **Update (2026-08-21, same session): this WAS visually verified** —
      Playwright/Chromium was made to work in this sandbox after all; see
      responsiveness entry below.
- [x] **Full responsive pass, verified with real browser screenshots
      (2026-08-21)** — got Playwright+Chromium running in the sandbox and
      screenshotted mobile (390px, plus a tight 320px iPhone-SE-class width),
      tablet (820px), and laptop (1440px), both at rest and mid-interaction
      (queue drawer, search drawer). Everything scaled cleanly except one real
      bug, now fixed: at 320px the "share"/"queue" text buttons in the
      now-playing bar needed more width than the title column had, squeezing
      the track title to 0px (invisible). Fixed by converting those two into
      icon+label buttons (label hides below the new `xs: 400px` Tailwind
      breakpoint, icon always shows) and giving `MarqueeText` a `min-w-[56px]`
      floor there. Added `xs: 400px` to `tailwind.config.js` screens for this
      and any future smallest-phone tuning.
- [x] **About/FAQ/Support removed entirely (2026-08-21)** — Aditya had asked
      for them moved into a scroll-gated footer (see below, now superseded),
      then decided to drop them altogether. Deleted `Footer.svelte`, removed
      the import/usage from `PlayerScreen.svelte`, and collapsed the page
      back to a single non-scrolling `min-h-screen` view (confirmed via
      Playwright that `document.body.scrollHeight === window.innerHeight` —
      no leftover empty scroll space). `TopBar.svelte` now only has the two
      status pills (playing/paused, online count) — untouched from the
      previous session, already had no About/FAQ/Support in it.
- [x] ~~Scroll-gated footer with About/FAQ/Support (2026-08-21)~~ —
      **superseded/removed same session, see above.** (Built a `Footer.svelte`
      below the hero section, restructured the page to allow real scroll so
      it only appeared once the person scrolled down. Kept here only as a
      paper trail in case Aditya wants it back — the approach worked and was
      screenshot-verified before he asked to remove it, so it can be
      re-added quickly by reversing the change above if needed.)
- [x] **Docs sync + dead-code cleanup after the removal above (2026-08-21)** —
      deleted `InfoModal.svelte` (it was only ever used by the About/FAQ/
      Support buttons, which no longer exist anywhere — confirmed via grep,
      zero remaining imports, build still clean after removal). Updated
      `docs/architecture.md`'s file tree: removed the `InfoModal.svelte` and
      old `TopBar.svelte` "About/FAQ/Support" description, added the two
      components that existed in code but weren't yet documented
      (`MarqueeText.svelte`, `CloudShaderBackground.svelte`), and corrected
      the `static/images/bg.jpg` entry to note it's unused/kept only for
      revert. Updated `docs/design.md`'s background section to describe the
      shader instead of the old static-image approach. Did **not** touch the
      pre-existing Male/Female references in `README.md` / `docs/phases.md`
      (lines like "pick Male/Female" in the README intro, `bg-male.jpg` in
      the "swap background images" section) — those were already stale
      before this session (the selection screen was removed back on
      2026-08-20) and are a separate, unrelated cleanup Aditya hasn't asked
      for yet; flagged to him in chat rather than changed silently.

- [x] **Fullscreen "Now Playing" view (2026-08-21)** — new `NowPlayingScreen.svelte`,
      opened by tapping the album thumbnail or title in `BottomPlayerBar.svelte`
      (`fullscreenOpen` state in `PlayerScreen.svelte`). Blurred oversized-album-art
      backdrop, big centered cover card, marquee title + "Credits: {artist}", progress
      bar, prev/play-pause/next, volume control, and share/queue shortcuts up top.
      Closes via minimize button or `Escape`; tapping queue from inside it collapses
      the fullscreen view first, then opens the queue drawer. Reuses `MarqueeText`,
      `ProgressBar`, `VolumeControl` — no duplicated logic. **Code was already built
      and wired when this session started; docs (phases.md/architecture.md) hadn't
      been updated yet — same stale-docs pattern as Phase 8b, caught by diffing the
      actual component tree against the docs rather than trusting phases.md.**
      `npm run build` re-verified clean with it included. **Not yet visually
      screenshot-tested.**

## 🔄 Currently Being Worked On
- Nothing actively mid-edit.
- `NowPlayingScreen.svelte` (fullscreen now-playing view) needs a real browser
  look-over — same caveat as the Liquid Glass redesign below, hasn't been
  screenshotted yet this session.
- Liquid Glass redesign hasn't been visually screenshot-tested (sandboxed build
  environment has no browser available) — build is clean and CSS is
  spec-correct, but a real look-over in a browser (esp. Safari, where
  `backdrop-filter` + `mix-blend-mode` support can be pickier) is worth doing
  before calling this fully QA'd.
- **Real next task: Phase 7 — Deploy.** Nothing under Phase 7 has been done —
  no static adapter deploy run, no Vercel/Netlify push, no prod smoke test.
- Phase 8 QA still needs Aditya's own manual pass with a **real** YouTube Data
  API v3 key (search + import both worked in build/lint terms, but haven't been
  exercised against the live API by a human yet).

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
