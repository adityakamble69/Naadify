# architecture.md — SyntaxBeats

## 1. Tech Stack
| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | **SvelteKit** | Matches existing project stack (Lifeline), fast, file-based routing |
| Styling | **Tailwind CSS** | Fast utility-based glassmorphism styling (`backdrop-blur`, `bg-white/10`, etc.) |
| Music playback | **YouTube IFrame Player API** | Free, reliable, no backend audio hosting needed |
| State | **Svelte stores** (writable) | Lightweight global state for player status, playlist, selection |
| Persistence | **sessionStorage** | Remember gender selection within a session |
| Fonts | **JetBrains Mono** (accents) + **Inter/Sora** (body) | Coder-themed accents + clean readability |
| Hosting | Vercel / Netlify (static adapter) | Simple static deploy, no server needed for v1 |

No backend/database required for v1 — playlists are static config files.

## 2. App Flow

```
┌─────────────────────┐
│   / (root route)     │
│  Selection Screen     │
│  [Male]   [Female]    │
└──────────┬────────────┘
           │ click (unlocks autoplay)
           ▼
┌─────────────────────────────┐
│  Player Screen (same route,  │
│  conditional render)         │
│  - bg image (male/female)    │
│  - glass player card         │
│  - YouTube iframe (hidden,   │
│    audio-only visual)        │
│  - playlist sidebar          │
│  - controls: prev/play/next  │
│  - progress bar + volume     │
└───────────────────────────────┘
```

- Single route (`/`) is enough for v1 — selection vs player is a client-side state
  toggle (`$selectionStore`), not a page navigation. This keeps the transition instant
  and avoids re-loading the YouTube script.
- YouTube IFrame Player is mounted once, hidden/styled to show just album-art-style
  overlay (we don't want the raw YouTube video UI visible — glass card sits on top).

## 3. Folder & File Structure

```
syntaxbeats/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── SelectionScreen.svelte      # Male/Female choice UI
│   │   │   ├── PlayerScreen.svelte         # Main player layout
│   │   │   ├── GlassCard.svelte            # Reusable glass panel wrapper
│   │   │   ├── PlayerControls.svelte       # Play/pause/next/prev buttons
│   │   │   ├── ProgressBar.svelte          # Seek bar + time display
│   │   │   ├── VolumeControl.svelte        # Volume slider
│   │   │   ├── PlaylistSidebar.svelte      # Song list, click-to-play
│   │   │   └── YouTubePlayer.svelte        # Wraps YT IFrame API logic
│   │   ├── stores/
│   │   │   ├── selection.js                # gender selection store (persisted)
│   │   │   └── player.js                   # currentTrack, isPlaying, progress, etc.
│   │   ├── data/
│   │   │   ├── playlist.male.js            # male playlist config
│   │   │   └── playlist.female.js          # female playlist config
│   │   └── utils/
│   │       └── youtube.js                  # YT API loader + helper functions
│   ├── routes/
│   │   ├── +layout.svelte                  # global styles, fonts
│   │   └── +page.svelte                    # renders Selection or Player based on store
│   ├── app.css                             # Tailwind base + custom glass utilities
│   └── app.html
├── static/
│   ├── images/
│   │   ├── bg-male.jpg
│   │   └── bg-female.jpg
│   └── favicon.png
├── docs/                                    # this planning doc set
│   ├── PRD.md
│   ├── architecture.md
│   ├── rules.md
│   ├── phases.md
│   ├── design.md
│   └── memory.md
├── svelte.config.js
├── tailwind.config.js
└── package.json
```

## 4. Data Model (playlist config example)

```js
// src/lib/data/playlist.male.js
export const malePlaylist = [
  {
    id: 'yt-video-id-1',
    title: 'Song Title',
    artist: 'Artist Name',
    thumbnail: 'https://img.youtube.com/vi/yt-video-id-1/hqdefault.jpg'
  },
  // ...
];
```

## 5. State Management
- `selection.js` → `'male' | 'female' | null`, persisted to `sessionStorage`
- `player.js` → `{ currentIndex, isPlaying, currentTime, duration, volume }`
- YouTubePlayer component subscribes to `player` store and drives the actual IFrame
  API calls (`playVideoById`, `pauseVideo`, `seekTo`, etc.)

## 6. Key Technical Notes
- Autoplay works because the gender-selection **click** is the required user gesture —
  the YouTube player is initialized and told to play inside that same interaction
  chain (or immediately after, which browsers still treat as unlocked).
- Use `enablejsapi=1` and `origin` param when embedding YouTube iframe.
- Auto-advance: listen to YT `onStateChange` event, when `state === ENDED` → call
  `nextTrack()`.
