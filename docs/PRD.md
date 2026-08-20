# PRD.md — SyntaxBeats (Music Player for Coders)

## 1. Project Overview
SyntaxBeats is a glassmorphism-themed music player website built for coders/developers.
On first visit, the user selects **Male** or **Female**, and based on that selection, a
curated playlist automatically starts playing (via YouTube) with a matching background
theme — no further prompts needed.

## 2. Goals
- Give developers a quick, no-friction music player they can keep open while coding.
- Deliver a premium, modern **glassmorphism** aesthetic (blurred, translucent panels,
  soft shadows, smooth edges).
- Zero-click music start after the initial gender selection (browser autoplay policies
  satisfied via that same click).
- Seamless song switching (next/prev/click-to-play from playlist) without page reloads
  or visual jank.

## 3. Target Users
- Developers/coders who want ambient/focus music while working.
- Users who prefer a fast, visually striking single-purpose tool over a full streaming
  app.

## 4. Core User Flow
1. User lands on the site → **Selection Screen** appears (glass card, blurred bg,
   "Male" / "Female" options).
2. User clicks one option.
3. App transitions (smooth fade/scale) to the **Player Screen**:
   - Background image matches the selection (male.jpg / female.jpg).
   - First song from the matching playlist starts playing automatically.
   - Playlist sidebar/drawer shows all songs for that selection.
4. User can:
   - Play / Pause
   - Next / Previous track
   - Click any song in the playlist to jump to it
   - See progress bar + current time / duration
   - (Stretch) Switch gender/theme later via a small toggle without full reload

## 5. Functional Requirements
| # | Requirement | Priority |
|---|-------------|----------|
| FR1 | Gender selection screen on first load | Must |
| FR2 | Store selection in memory (sessionStorage) so refresh doesn't re-ask mid-session | Should |
| FR3 | Auto-play matching playlist immediately after selection (using the click as the user-interaction unlock) | Must |
| FR4 | Play / Pause control | Must |
| FR5 | Next / Previous track control | Must |
| FR6 | Clickable playlist with active-track highlight | Must |
| FR7 | Progress bar with seek | Should |
| FR8 | Volume control | Should |
| FR9 | Background image swap based on gender selection | Must |
| FR10 | Fully responsive (mobile + desktop) | Must |
| FR11 | Loading state while YouTube iframe/player initializes | Should |
| FR12 | Auto-advance to next song when current ends | Must |

## 6. Non-Functional Requirements
- **Performance:** First screen should render instantly; YouTube API loads async.
- **Aesthetic:** Glassmorphism — translucent frosted-glass cards (`backdrop-filter:
  blur()`), soft multi-layer shadows, 16–24px rounded corners, subtle border glow.
- **Coder theme:** Monospace accents (JetBrains Mono / Fira Code), terminal/neon glow
  touches, dark-first color palette.
- **Accessibility:** Keyboard-operable controls, sufficient contrast on glass panels.
- **Browser compatibility:** Modern evergreen browsers (Chrome, Edge, Firefox, Safari).

## 7. Out of Scope (v1)
- User accounts / login
- Persisting playlists across devices
- Uploading custom songs
- Multi-language UI (English only for v1)

## 8. Open Items (pending from user)
- [ ] Male background image
- [ ] Female background image
- [ ] Male playlist — YouTube video IDs/links + titles
- [ ] Female playlist — YouTube video IDs/links + titles

## 9. Success Criteria
- User reaches playing music within 2 clicks (select → auto-play).
- No broken autoplay (no second prompt needed).
- Visual QA: glassmorphism renders correctly on Chrome + Safari + mobile.
