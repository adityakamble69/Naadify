# Naadify

A glassmorphism-themed music player built for coders. Land straight on the player screen, hit play on a curated coding playlist, and keep it running in the background while you work — no accounts, no friction.

*(Renamed from SyntaxBeats → Naadify.)*

## Features

- **Zero-friction entry** — no selection screen; the player loads and the first track starts on your first click (satisfying browser autoplay-unlock policy)
- **Playback controls** — play/pause, next/previous, click-to-jump from the queue, seekable progress bar, auto-advance on track end
- **YouTube-powered** — songs are streamed via the YouTube IFrame Player, no audio files hosted
- **In-app YouTube search** — search and add a track to the queue without leaving the app
- **Playlist import** — paste a YouTube playlist URL to append or replace the current queue
- **Persistence** — songs added via search/import survive a page refresh (localStorage)
- **Ambient effects** — toggleable rain and fog visual overlays, plus a live "online now" counter
- **Share** — share the current track via native share sheet or clipboard fallback
- **Responsive** — works on mobile and desktop

## Tech stack

| Layer      | Technology                          |
| ---------- | ------------------------------------- |
| Framework  | SvelteKit 2 (Svelte 4), static adapter |
| Build tool | Vite                                   |
| Styling    | Tailwind CSS                           |
| Playback   | YouTube IFrame Player API              |
| Data       | YouTube Data API v3 (search + playlist import) |
| Persistence | Browser `localStorage` (no backend/database) |

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and add your YouTube Data API key:

```bash
cp .env.example .env
```

```
VITE_YOUTUBE_API_KEY=your_api_key_here
```

To get a key: Google Cloud Console → **APIs & Services → Credentials**, enable **YouTube Data API v3** on the project first, then create an API key restricted by HTTP referrer to your production domain + `localhost`. The key is used client-side only — there's no backend component (see `docs/architecture.md`).

> **Quota note:** the YouTube Data API free tier is ~10,000 units/day. `search.list` costs 100 units per call (~100 searches/day), `playlistItems.list` costs 1 unit per page — search is deliberately button-triggered, not per-keystroke, to avoid burning quota.

### 3. Run the dev server

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
npm run preview   # preview the production build locally
```

## Available scripts

| Script            | Description                     |
| ------------------ | -------------------------------- |
| `npm run dev`      | Start the Vite dev server        |
| `npm run build`    | Build the static site            |
| `npm run preview`  | Preview the production build     |

## Project structure

```
src/
  routes/
    +layout.svelte        # App shell
    +page.svelte           # Entry point — player screen
  lib/
    components/            # Player UI: PlayerScreen, PlayerControls, ProgressBar,
                            # BottomPlayerBar, PlaylistSidebar, PlaylistImport,
                            # SearchBar, YouTubePlayer, WeatherFX, TopBar, etc.
    stores/                 # Svelte stores: player, queue, selection, weather, online
    data/                   # Default curated playlists (male/female/default)
    utils/                   # youtube.js / youtubeApi.js — YouTube API + IFrame helpers

static/images/            # Logo and background art
docs/                      # PRD, architecture, design, rules, roadmap
```

## Known limitations

- No user accounts or cross-device playlist sync — persistence is local to the browser only (see `docs/PRD.md` → *Out of Scope*)
- No custom audio uploads — YouTube is the only source
- English/Hinglish UI only
- No backend/server — the YouTube API key runs client-side, protected by HTTP referrer restriction rather than a proxy

## Documentation

- `docs/PRD.md` — product requirements, feature status, out-of-scope items
- `docs/architecture.md` — system architecture
- `docs/design.md` — glassmorphism design language
- `docs/rules.md` — project conventions
- `docs/phases.md` — build roadmap

## Deployment

Built with `@sveltejs/adapter-static`, so it ships as a static site — deployable to Vercel, Netlify, or any static host. Set `VITE_YOUTUBE_API_KEY` in your deployment environment and restrict the key's HTTP referrer to your production domain before going live.
