# design.md — Naadify

## 1. Design Direction
Dark-first, cinematic glassmorphism with a coder/developer edge — think "frosted glass
terminal floating over a blurred wallpaper." Calm, focused, premium — not flashy or
cluttered, since this sits in the background while someone codes.

## 2. Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-base` | `#0A0A0F` | Base dark backdrop (behind bg image) |
| `--glass-fill` | `rgba(255,255,255,0.06)` | Glass card fill |
| `--glass-border` | `rgba(255,255,255,0.14)` | Glass card border |
| `--glass-fill-strong` | `rgba(255,255,255,0.10)` | Active/hover glass state |
| `--accent-primary` | `#7C5CFF` (violet) | Primary accent, active states, progress bar |
| `--accent-secondary` | `#38F2C0` (mint) | Secondary accent (matches Aditya's existing violet→mint gradient preference) |
| `--accent-glow` | `rgba(124,92,255,0.45)` | Glow/shadow behind active elements |
| `--text-primary` | `#F5F5F7` | Main text on dark |
| `--text-secondary` | `rgba(245,245,247,0.6)` | Secondary/meta text |
| `--accent` | `#3FA0FF` (electric blue) | Single shared accent (replaces the old male/female split) |

Background image (`bg.jpg`) sits behind everything with a dark overlay
(`rgba(0,0,0,0.45)`) + heavy blur on non-focal areas so glass cards stay legible.
A large Naadify logo is overlaid near the top of the page, above the background.
Optional **rain** / **fog** CSS effects (`WeatherFX.svelte`) can render above the
background and below the glass UI (z-index between the two).

## 3. Typography

| Role | Font | Notes |
|------|------|-------|
| Body / UI text | **Inter** or **Sora** | Clean, modern, highly legible |
| Coder accents | **JetBrains Mono** | Used for: song duration/time, small labels like `// now playing`, track index numbers |
| Headings | Sora (Semibold/Bold) | Selection screen title, player title |

**Type scale (approx):**
- Hero/selection title: 32–40px, semibold
- Song title (now playing): 20–24px, semibold
- Artist name: 14–16px, regular, secondary color
- Playlist item title: 14px
- Meta/mono labels (time, index): 12–13px, JetBrains Mono

## 4. Glassmorphism Spec
- `backdrop-filter: blur(20px)` (cards), `blur(40px)` (large background panels)
- Background fill: `var(--glass-fill)`
- Border: `1px solid var(--glass-border)`
- Border radius: `24px` for main cards, `16px` for buttons/small elements
- Shadow: soft, multi-layer —
  `0 8px 32px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.08) inset`
- Hover/active state: fill lightens to `--glass-fill-strong`, subtle
  `box-shadow: 0 0 24px var(--accent-glow)` glow appears

## 5. Iconography
- Line-style icons (e.g. Lucide icons) — play, pause, skip-next, skip-previous,
  volume, for consistency with a clean coder aesthetic.
- Icons sit inside circular glass buttons (44–56px touch target).

## 6. Motion / Micro-interactions
- Selection → Player transition: 400–500ms fade + slight scale (0.96 → 1)
- Button hover: scale 1.0 → 1.05, glow fade-in, 150ms ease
- Active playlist item: left accent bar (2–3px, accent color) + subtle background glow
- Progress bar fill: smooth linear transition, updates every ~250ms
- Album-art / now-playing area: gentle pulsing glow synced to "isPlaying" state (subtle,
  not distracting)

## 7. Layout Notes
- **Selection Screen:** centered single glass card, max-width ~420px, two large glass
  buttons stacked (mobile) or side-by-side (desktop)
- **Player Screen (desktop):** two-column — left = now-playing glass card with big
  controls, right = playlist sidebar (scrollable glass panel)
- **Player Screen (mobile):** single column, playlist becomes a swipe-up/collapsible
  drawer beneath the now-playing card

## 8. Theme Variation (updated)
- The old male/female accent-tint split is **removed** — one shared `--accent` color
  is used everywhere (progress bar fill, active states, glow).
- Instead, personalization now comes from the optional **rain** / **fog** ambient
  overlays, toggled independently, rather than a fixed per-user theme choice.
