# SyntaxBeats

Glassmorphism music player for coders — pick Male/Female, music auto-plays from
YouTube, no further prompts.

## Run locally

```bash
npm install
npm run dev
```

Open the printed local URL (usually http://localhost:5173).

## Add your songs

Edit these two files — replace `REPLACE_WITH_YOUTUBE_ID_x` with the real YouTube
video ID (the part after `v=` in a YouTube URL) and fill in `title` / `artist`:

- `src/lib/data/playlist.male.js`
- `src/lib/data/playlist.female.js`

You can add as many tracks as you want — just add/remove objects in the array.

## Swap background images

Replace these files (keep the same filenames, or update the paths in
`src/lib/components/PlayerScreen.svelte`):

- `static/images/bg-male.jpg`
- `static/images/bg-female.jpg`

## Build for production

```bash
npm run build
npm run preview   # test the production build locally
```

The static build output goes to the `build/` folder — deploy it as-is to Vercel,
Netlify, GitHub Pages, or any static host.

## Project docs

See the `docs/` folder for the full planning set: `PRD.md`, `architecture.md`,
`rules.md`, `phases.md`, `design.md`, `memory.md`.

## Notes

- Autoplay works because the Male/Female click is the "user gesture" that unlocks
  browser autoplay-with-sound policy — don't remove that click-to-select step.
- If a video ID is invalid/unavailable, that track will silently fail to load —
  double check IDs if a song doesn't play.
