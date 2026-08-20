# architecture.md — Naadify

## 1. Tech Stack
| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | **SvelteKit** | Fast, file-based routing, static-adapter friendly |
| Styling | **Tailwind CSS** | Fast utility-based glassmorphism styling (`backdrop-blur`, `bg-white/10`, etc.) |
| Music playback | **YouTube IFrame Player API** | Free, reliable, no backend audio hosting needed |
| Music *discovery* (planned) | **YouTube Data API v3** (`search.list`, `playlistItems.list`) | Lets the app fetch real videos instead of hand-typed IDs |
| State | **Svelte stores** (writable) | Lightweight global state for player status, playlist, weather, online count |
| Persistence | **sessionStorage** (current), will extend to store the search/import-built queue | Survive refresh mid-session |
| Fonts | **JetBrains Mono** (accents) + **Sora** (body) | Coder-themed accents + clean readability |
| Hosting | Vercel / Netlify (static adapter) | Simple static deploy, no server needed |

No backend/database for v1 — playlists are static config files today, and will become
a **client-side-fetched, locally-cached** list once the YouTube Data API is wired in
(see §7). Still no server required.

## 2. App Flow

```
┌───────────────────────────────┐
│   / (root route)               │
│  Player Screen (direct entry)  │
│  - big Naadify logo over bg    │
│  - glass player bar             │
│  - YouTube iframe (hidden,      │
│    audio-only)                  │
│  - queue drawer                 │
│  - rain / fog toggle             │
│  - online counter, share, etc.  │
└───────────────────────────────┘
```

- Single route (`/`) — the old Selection → Player toggle is gone; `+page.svelte`
  renders `PlayerScreen` directly.
- YouTube IFrame Player is mounted once, hidden/styled to show just album-art-style
  overlay (we don't want the raw YouTube video UI visible — glass card sits on top).

## 3. Folder & File Structure (current)

```
syntaxbeats/                                # package name: "naadify"
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── PlayerScreen.svelte         # Main player layout + big logo overlay
│   │   │   ├── TopBar.svelte               # Status pill, online count, About/FAQ/Support
│   │   │   ├── GlassCard.svelte            # Reusable glass panel wrapper
│   │   │   ├── BottomPlayerBar.svelte      # Now-playing bar: controls, share, credits
│   │   │   ├── ProgressBar.svelte          # Seek bar + time display
│   │   │   ├── VolumeControl.svelte        # Volume slider (built, not yet wired in)
│   │   │   ├── PlaylistSidebar.svelte      # Queue list, click-to-play
│   │   │   ├── YouTubePlayer.svelte        # Wraps YT IFrame API logic
│   │   │   ├── WeatherFX.svelte            # Rain / fog CSS overlay effect
│   │   │   ├── WeatherToggle.svelte        # Rain / Fog toggle buttons
│   │   │   └── InfoModal.svelte            # About / FAQ / Support modal
│   │   ├── stores/
│   │   │   ├── player.js                   # currentTrack, isPlaying, progress, etc.
│   │   │   ├── online.js                   # simulated live "online now" count
│   │   │   └── weather.js                  # 'none' | 'rain' | 'fog'
│   │   ├── data/
│   │   │   └── playlist.js                 # single merged playlist config
│   │   └── utils/
│   │       └── youtube.js                  # YT IFrame API loader + helper functions
│   ├── routes/
│   │   ├── +layout.svelte                  # global styles, fonts
│   │   └── +page.svelte                    # renders PlayerScreen directly
│   ├── app.css                             # Tailwind base + custom glass utilities
│   └── app.html
├── static/
│   ├── images/
│   │   ├── bg.jpg                          # single background (merged from bg-male.jpg)
│   │   └── logo.png                        # Naadify brand logo
│   └── favicon.png
├── docs/
│   ├── PRD.md
│   ├── architecture.md   ← you are here
│   ├── rules.md
│   ├── phases.md
│   ├── design.md
│   └── memory.md
├── svelte.config.js
├── tailwind.config.js
├── .gitignore
└── package.json
```

## 4. Data Model — current

```js
// src/lib/data/playlist.js
export const playlist = [
  {
    id: 'yt-video-id-1',
    title: 'Song Title',
    artist: 'Artist Name',
    thumbnail: 'https://img.youtube.com/vi/yt-video-id-1/hqdefault.jpg'
  },
  // ...
];
```

## 5. YouTube Data API Integration — planned architecture

**Goal:** replace manual `REPLACE_WITH_YOUTUBE_ID_x` editing with two in-app flows —
**search** and **playlist import** — both selected by Aditya (2026-08-20).

### 5.1 Getting an API key
- Create/reuse a Google Cloud project → enable **YouTube Data API v3** → create an
  **API key**.
- In the key's settings, add an **HTTP referrer restriction** limited to the app's
  deployed domain(s) (e.g. `https://naadify.vercel.app/*`, `http://localhost:5173/*`
  for dev). This is what makes it safe to ship the key in client-side code — nobody
  else's site can use it even if they read it out of the bundle.
- Store the key in a `.env` file as `VITE_YOUTUBE_API_KEY` (already covered by
  `.gitignore`, never committed).

### 5.2 New files (to be created)
```
src/lib/utils/youtubeApi.js       # thin fetch wrappers around the Data API
src/lib/components/SearchBar.svelte      # search input + results list
src/lib/components/PlaylistImport.svelte # paste-a-URL import UI
src/lib/stores/queue.js          # user-built queue (search/import results),
                                  # persisted to sessionStorage (or localStorage
                                  # if we want it to survive across sessions)
```

### 5.3 Search flow (FR14)
1. User types a query into `SearchBar` and presses Enter / a search button
   (deliberately, not on every keystroke — quota-friendly).
2. `youtubeApi.searchVideos(query)` calls
   `GET https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=...&key=...`
3. Results (title, channel title, thumbnail, videoId) render in a glass list.
4. Tapping a result maps it into our existing `Track` shape
   (`{ id, title, artist: channelTitle, thumbnail }`) and pushes it into `queue.js`.
5. `PlayerScreen` reads from `queue.js` instead of the static `playlist.js` once at
   least one song has been added this way (fallback to `playlist.js` if empty).

### 5.4 Playlist import flow (FR15)
1. User pastes a YouTube playlist URL into `PlaylistImport`.
2. Extract the `list=` param (playlist ID) from the URL.
3. `youtubeApi.fetchPlaylistItems(playlistId)` calls
   `GET https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=...&maxResults=50&key=...`
   (paginate with `pageToken` if the playlist has more than 50 items).
4. Map each item into our `Track` shape and either **replace** or **append to** the
   current queue (UI should offer both, default to replace for a clean import).

### 5.5 Quota & error handling notes
- Free tier: ~10,000 units/day. `search.list` = 100 units/call, `playlistItems.list`
  = 1 unit/call. A single 50-song playlist import costs ~1 unit; a search costs 100 —
  so importing playlists is far cheaper than repeated searching.
- If the API returns a quota-exceeded or invalid-key error, show a small inline glass
  toast ("couldn't reach YouTube search right now") rather than breaking playback of
  whatever is already queued.
- Playback itself is unaffected either way — it still goes through the existing
  `YouTubePlayer.svelte` / IFrame API, only *how a video ID gets into the queue*
  changes.

## 6. State Management
- `player.js` → `{ currentIndex, isPlaying, currentTime, duration, volume }`
- `online.js` → simulated live viewer count
- `weather.js` → `'none' | 'rain' | 'fog'`
- `queue.js` (planned) → user-built list of `Track`s from search/import, persisted
- YouTubePlayer component subscribes to `player` store and drives the actual IFrame
  API calls (`playVideoById`, `pauseVideo`, `seekTo`, etc.)

## 7. Key Technical Notes
- Autoplay works because the first click on the page is the required user gesture —
  the YouTube player is initialized and told to play inside that same interaction
  chain (or immediately after, which browsers still treat as unlocked).
- Use `enablejsapi=1` and `origin` param when embedding YouTube iframe.
- Auto-advance: listen to YT `onStateChange` event, when `state === ENDED` → call
  `nextTrack()`.
- **No backend needed even with the Data API** — all calls are plain client-side
  `fetch()` requests using the referrer-restricted key. If usage ever needs to scale
  past personal use, a small serverless proxy (e.g. a Vercel Edge Function) could hide
  the key entirely and add caching — noted here for later, not required for v1 of this
  feature.
