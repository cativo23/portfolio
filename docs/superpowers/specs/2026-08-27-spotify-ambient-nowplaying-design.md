# Spotify Now Playing — Ambient Redesign

**Date:** 2026-08-27
**Scope:** `/now.vue` "NOW PLAYING · SPOTIFY" panel only (Footer.vue stays as-is).

## Problem

The now-playing panel is functional but visually generic: a small flat thumbnail next to
plain text, using the fixed Nightwire cyan accent regardless of what's playing. The goal
is to make it feel alive and tied to the actual music — without breaking the Nightwire
design system (flat panels, 2px panel-gap, monospace/stamp typography) used everywhere
else on `/now.vue`.

## Chosen direction: Ambient blur backdrop, contained

Of three options mocked up (ambient blur backdrop, split-hero with glow, subtle accent-only),
the user picked the ambient blur backdrop — the album art stretched, blurred, and used as
the panel's own background, with a dark gradient overlay for legibility. The blur is
**contained inside the panel's border** — no bleed into the surrounding page background.
A second variant (glow escaping the panel edges) was mocked and rejected: the difference
was too subtle to justify the added layout risk on narrow screens.

When nothing is playing, the panel returns to today's flat, cyan-accented look — the
ambient/dynamic-accent treatment only activates for an actual track.

## Architecture: color extraction

- **Library:** `node-vibrant` (the `/node` build, backed by Jimp — no native deps like
  `sharp`/`canvas`, keeps the Docker build simple).
- Runs server-side in `server/utils/spotify.ts`, inside `fetchNowPlaying()`.
- **Recompute trigger:** only when the track changes (compared by `albumArt`/`spotifyUrl`
  against the last cached value) — not on every 5s poll. If the track hasn't changed,
  the cached `accentColor` is reused.
- **Contrast safeguard:** if the extracted `Vibrant` swatch's luminosity is below ~40%,
  it's lightened before being sent to the frontend, so it stays legible as text/progress-bar
  color against the dark overlay.
- Output: a single hex string, added to the existing `SpotifyNowPlaying` shape as
  `accentColor?: string`. No new endpoint, no change to the 5s now-playing TTL.

## Data flow

1. `fetchNowPlaying()` (existing) detects a track change → calls new helper
   `extractAccentColor(albumArtUrl): Promise<string | undefined>`.
2. Helper downloads the album art (short timeout, ~3s) and runs Vibrant; wrapped in its
   own try/catch so a failure here **never** fails the overall now-playing fetch.
3. `SpotifyNowPlaying.accentColor` flows through unchanged via `useNowPlaying.ts` —
   composable shape doesn't change, consumers just get one more optional field.
4. `now.vue` sets a CSS variable from it: `--np-accent: v-bind(nowPlaying.accentColor ?? 'var(--nw-cyan)')`,
   used by the label, progress-bar fill, and blurred backdrop tint.

## Visual treatment (CSS)

- Panel container: `position: relative; overflow: hidden` — this is what keeps the blur
  contained to the panel's own border.
- Background layer: the current track's `albumArt`, oversized (`inset: -30%`) and
  `filter: blur(38px) saturate(1.3); opacity: 0.5`, so there's no hard edge from the blur
  radius.
- Overlay: `linear-gradient(180deg, rgba(10,10,10,.35) 0%, rgba(10,10,10,.96) 100%)`
  on top, for text legibility regardless of the extracted color's brightness.
- Foreground content (thumb, track/artist text, progress bar) sits in its own stacking
  layer above both, unaffected by the blur — the small thumbnail stays sharp.
- **Track-change transition:** ~400ms opacity cross-fade on the backdrop when `albumArt`
  changes. Respects `prefers-reduced-motion` — no transition if the user has that set.

## Empty state (nothing playing)

Falls back entirely to today's flat panel: no blur, no dynamic accent, fixed
`--nw-cyan`, "Nothing playing right now" message unchanged.

## Error handling

- Album art download / Vibrant failure (network error, 404, no swatches found) →
  `accentColor: undefined`, logged via `console.warn` (same pattern as existing Spotify
  error logging) — never throws, never fails the now-playing response.
- Extraction only fires on track change, so a persistent failure doesn't retry on every
  5s poll — it retries only the next time the track changes.

## Testing

- `extractAccentColor()`: valid image → hex color; failed download → `undefined`; image
  with no usable swatches → `undefined`; dark swatch → verifies lightening kicks in.
- `fetchNowPlaying()`: same `albumArt` across two calls → Vibrant invoked exactly once
  (recompute-on-change behavior).
- No automated visual/E2E test for the CSS effect itself — verified manually in-browser
  (or via visual QA) once implemented.

## Out of scope

- Footer.vue (short bar) — untouched.
- Light mode — the site is dark-only, no parallel theme work needed.
- Client-side color extraction — rejected in favor of server-side, single computation
  shared by all visitors.
