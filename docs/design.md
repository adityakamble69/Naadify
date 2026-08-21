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

## 4. Glassmorphism Spec — "Liquid Glass" material (updated 2026-08-21)
Redesigned to read like iOS 26's Liquid Glass rather than flat glassmorphism —
every surface now behaves like a lensed, refractive material instead of a
uniform tinted panel:
- `backdrop-filter: blur(26px) saturate(190%)` — the extra saturation keeps
  colors behind the glass vivid instead of going muddy grey, which is the main
  visual tell of real liquid glass vs. flat glassmorphism.
- **Directional lighting, not a flat tint:** background is a top-to-bottom
  gradient (bright at the top, fading down) rather than a single flat fill,
  and the border is brighter on top (`rgba(255,255,255,0.38)`) than on the
  sides — simulates a curved surface catching light from above.
- **Specular highlight layer:** a `::before` pseudo-element radial-gradients
  a soft white highlight into the top-left corner, plus a faint accent-blue
  pickup in the bottom-right, so the glass feels like it's bending and
  reflecting its surroundings rather than sitting flat.
- **Bevel shadow:** `inset` box-shadow combo gives a bright 1px top inner edge
  and a soft dark inner shadow near the bottom, reading as physical thickness.
- **Signature moment — `.glass-liquid`:** reserved for the bottom player bar
  only (the one element always on screen). A slow 7s diagonal sheen drifts
  across it, like light refracting through a real liquid-glass lens. Kept to
  one element deliberately — everywhere else stays quieter so this doesn't
  turn into visual noise.
- **Spring motion:** buttons (`.glass-btn`) use an overshoot cubic-bezier
  (`0.34, 1.56, 0.64, 1`) on hover/press instead of a linear ease, giving the
  same soft "bounce" feel as iOS's spring-based UI animations.
- Border radius: `24px`–`28px` for main cards, fully rounded (`rounded-full`)
  for buttons and pills — unchanged, this already matched the iOS pill idiom.
- Shadow: `0 12px 40px rgba(0,0,0,0.4)` outer + the inset bevel described above.
- Hover/active state: fill lightens via a layered `background-color`, subtle
  `box-shadow: 0 0 24px var(--accent-glow)` glow appears on primary actions.

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
  buttons stacked (mobile) or side-by-side (desktop) — *legacy note, this screen was
  removed in Phase 1; kept here for history only.*
- **Player Screen (desktop):** background + centered logo + floating bottom player
  bar (the signature liquid-glass surface). **Queue drawer docks to the left edge**
  as a tall floating sidebar (`sm:ml-5 sm:my-5`, stretches to near-full height) —
  moved from the right side on 2026-08-21 per Aditya's request. Search/import
  drawer stays centered.
- **Player Screen (mobile):** single column, queue and search both surface as a
  bottom sheet (thumb-reachable), same as before — only the desktop position
  changed, mobile layout is unaffected by the left-dock change.

## 8. Theme Variation (updated)
- The old male/female accent-tint split is **removed** — one shared `--accent` color
  is used everywhere (progress bar fill, active states, glow).
- Instead, personalization now comes from the optional **rain** / **fog** ambient
  overlays, toggled independently, rather than a fixed per-user theme choice.
