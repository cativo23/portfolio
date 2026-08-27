# Spotify Ambient Now-Playing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the `/now.vue` "NOW PLAYING · SPOTIFY" panel a blurred-album-art ambient
backdrop and a per-track dynamic accent color, extracted server-side, replacing the fixed
Nightwire cyan accent — while falling back to today's flat look when nothing is playing.

**Architecture:** `server/utils/spotify.ts` gains an `extractAccentColor()` helper backed by
`node-vibrant`, invoked from inside `fetchNowPlaying()` only when the current track's
`albumArt` differs from the last one seen (never on every 5s poll). The resulting
`accentColor` hex flows through the existing `SpotifyNowPlaying` type, `useNowPlaying`
composable, and into `now.vue` as a CSS custom property driving the blurred backdrop,
label, and progress-bar color.

**Tech Stack:** Nuxt 3 / Nitro server routes, TypeScript, Vitest, `node-vibrant` (Node build,
Jimp-backed — no native image deps).

## Global Constraints

- Spec: `docs/superpowers/specs/2026-08-27-spotify-ambient-nowplaying-design.md`
- Scope is `/now.vue` only — `Footer.vue` is explicitly out of scope.
- `accentColor` recomputes only when the track's `albumArt` URL changes, not on every
  5s now-playing poll.
- Extraction failures must never fail `fetchNowPlaying()` — always resolve to
  `string | undefined`, never throw out of `extractAccentColor()`.
- Minimum lightness for the returned accent is 0.4 (HSL `l`, 0–1 range) — darker swatches
  get lightened to `l = 0.55` before being turned back into a hex string.
- The ambient blur/overlay is contained inside the panel's own border — no bleed into the
  page background.
- Respect `prefers-reduced-motion` for the track-change cross-fade.
- Site is dark-only — no light-theme variant needed.

---

### Task 1: Add `node-vibrant` dependency

**Files:**
- Modify: `package.json`

**Interfaces:**
- Produces: `node-vibrant` v4 available at import path `node-vibrant/node`, exporting
  `Vibrant` with static `Vibrant.from(src: string).getPalette(): Promise<Palette>`, where
  `Palette = { Vibrant: Swatch | null, LightVibrant: Swatch | null, Muted: Swatch | null,
  DarkVibrant: Swatch | null, LightMuted: Swatch | null, DarkMuted: Swatch | null }` and
  `Swatch` has `.hex: string` and `.hsl: [number, number, number]` (h, s, l all in `0..1`).

- [ ] **Step 1: Install the dependency inside the dev container**

Run: `docker compose exec -T app npm install node-vibrant@^4.0.4`

Expected: `package.json` `dependencies` gains `"node-vibrant": "^4.0.4"`, and
`package-lock.json` updates accordingly.

- [ ] **Step 2: Verify the import resolves**

Run:
```bash
docker compose exec -T app node -e "import('node-vibrant/node').then(m => console.log(typeof m.Vibrant.from))"
```
Expected: prints `function`

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "⚙️ chore(deps): add node-vibrant for album-art color extraction"
```

---

### Task 2: `extractAccentColor()` helper with contrast safeguard (TDD)

**Files:**
- Modify: `src/server/utils/spotify.ts`
- Test: `tests/server/utils/spotify.test.ts`

**Interfaces:**
- Consumes: `Vibrant.from(url).getPalette()` from `node-vibrant/node` (Task 1).
- Produces: `export async function extractAccentColor(albumArtUrl: string): Promise<string | undefined>`
  — used by Task 3.

- [ ] **Step 1: Add the module mock and write the failing tests**

At the top of `tests/server/utils/spotify.test.ts`, right after the existing imports, add:

```ts
vi.mock('node-vibrant/node', () => ({
  Vibrant: {
    from: vi.fn(() => ({
      getPalette: () => Promise.resolve({
        Vibrant: null,
        LightVibrant: null,
        Muted: null,
        DarkVibrant: null,
        LightMuted: null,
        DarkMuted: null,
      }),
    })),
  },
}))
```

This is the file-wide default (no usable swatch) so every *other* existing test in this
file — none of which care about color — keeps passing unchanged (`accentColor` stays
unset). Then update the import line to also pull in `extractAccentColor` and the mocked
`Vibrant`:

```ts
import { fetchNowPlaying, fetchRecentlyPlayed, extractAccentColor, _clearSpotifyCache } from '../../../src/server/utils/spotify'
import { Vibrant } from 'node-vibrant/node'
```

Add a new `describe` block at the end of the file:

```ts
describe('extractAccentColor', () => {
  beforeEach(() => {
    vi.mocked(Vibrant.from).mockClear()
  })

  it('should return the Vibrant swatch hex when it is light enough', async () => {
    vi.mocked(Vibrant.from).mockReturnValueOnce({
      getPalette: () => Promise.resolve({
        Vibrant: { hex: '#ff6a3d', hsl: [0.05, 0.8, 0.6] },
        LightVibrant: null,
        Muted: null,
        DarkVibrant: null,
        LightMuted: null,
        DarkMuted: null,
      }),
    } as any)

    const color = await extractAccentColor('https://i.scdn.co/image/abc')
    expect(color).toBe('#ff6a3d')
  })

  it('should lighten a swatch that is too dark instead of returning it as-is', async () => {
    vi.mocked(Vibrant.from).mockReturnValueOnce({
      getPalette: () => Promise.resolve({
        Vibrant: { hex: '#1a0d08', hsl: [0.05, 0.8, 0.1] },
        LightVibrant: null,
        Muted: null,
        DarkVibrant: null,
        LightMuted: null,
        DarkMuted: null,
      }),
    } as any)

    const color = await extractAccentColor('https://i.scdn.co/image/dark')
    // Not the original dark hex, and a valid hex string
    expect(color).not.toBe('#1a0d08')
    expect(color).toMatch(/^#[0-9a-f]{6}$/)
  })

  it('should fall back through the swatch priority order when Vibrant is null', async () => {
    vi.mocked(Vibrant.from).mockReturnValueOnce({
      getPalette: () => Promise.resolve({
        Vibrant: null,
        LightVibrant: { hex: '#cceeff', hsl: [0.55, 0.6, 0.85] },
        Muted: null,
        DarkVibrant: null,
        LightMuted: null,
        DarkMuted: null,
      }),
    } as any)

    const color = await extractAccentColor('https://i.scdn.co/image/fallback')
    expect(color).toBe('#cceeff')
  })

  it('should return undefined when no swatch is usable', async () => {
    const color = await extractAccentColor('https://i.scdn.co/image/none')
    expect(color).toBeUndefined()
  })

  it('should return undefined instead of throwing when Vibrant rejects', async () => {
    vi.mocked(Vibrant.from).mockReturnValueOnce({
      getPalette: () => Promise.reject(new Error('decode failed')),
    } as any)

    const color = await extractAccentColor('https://i.scdn.co/image/broken')
    expect(color).toBeUndefined()
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `docker compose exec -T app npx vitest run tests/server/utils/spotify.test.ts`

Expected: FAIL — `extractAccentColor is not a function` (and the mock import errors,
since `node-vibrant` isn't imported by `spotify.ts` yet).

- [ ] **Step 3: Implement `extractAccentColor()`**

In `src/server/utils/spotify.ts`, add this import at the top of the file (before the
`SpotifyNowPlaying` interface, line 1):

```ts
import { Vibrant } from 'node-vibrant/node'
```

Then add this after the `MAX_CACHE_BYTES`/`INFLIGHT_TIMEOUT_MS` constants (after line 96)
and before `getAccessToken`:

```ts
const ACCENT_MIN_LIGHTNESS = 0.4
const ACCENT_TARGET_LIGHTNESS = 0.55
const ACCENT_EXTRACTION_TIMEOUT_MS = 3_000

function lightenHex(h: number, s: number, l: number): string {
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const hueDeg = h * 360
    const k = (n + hueDeg / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

export async function extractAccentColor(albumArtUrl: string): Promise<string | undefined> {
  try {
    const palette = await Promise.race([
      Vibrant.from(albumArtUrl).getPalette(),
      new Promise<never>((_, rej) => setTimeout(() => rej(new Error('accent color extraction timeout')), ACCENT_EXTRACTION_TIMEOUT_MS)),
    ])

    const swatch = palette.Vibrant ?? palette.LightVibrant ?? palette.Muted ?? palette.DarkVibrant ?? palette.LightMuted ?? palette.DarkMuted

    if (!swatch) {
      return undefined
    }

    const [h, s, l] = swatch.hsl
    if (l < ACCENT_MIN_LIGHTNESS) {
      return lightenHex(h, s, ACCENT_TARGET_LIGHTNESS)
    }

    return swatch.hex
  } catch (err: any) {
    console.warn('[Spotify] failed to extract accent color:', err?.message || err)
    return undefined
  }
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `docker compose exec -T app npx vitest run tests/server/utils/spotify.test.ts`

Expected: PASS — all 5 new `extractAccentColor` tests, and all pre-existing tests in the
file unaffected.

- [ ] **Step 5: Commit**

```bash
git add src/server/utils/spotify.ts tests/server/utils/spotify.test.ts
git commit -m "✨ feat(spotify): add extractAccentColor with contrast safeguard"
```

---

### Task 3: Wire accent extraction into `fetchNowPlaying()` (recompute-on-change)

**Files:**
- Modify: `src/server/utils/spotify.ts`
- Test: `tests/server/utils/spotify.test.ts`

**Interfaces:**
- Consumes: `extractAccentColor(albumArtUrl: string): Promise<string | undefined>` (Task 2).
- Produces: `SpotifyNowPlaying.accentColor?: string`, populated by `fetchNowPlaying()`.

- [ ] **Step 1: Write the failing tests**

Add to `tests/server/utils/spotify.test.ts`, inside the existing `describe('fetchNowPlaying', ...)`
block (after the last `it(...)` in that block, before its closing `})`):

```ts
  it('should attach accentColor extracted from the current track album art', async () => {
    vi.mocked(Vibrant.from).mockReturnValueOnce({
      getPalette: () => Promise.resolve({
        Vibrant: { hex: '#ff6a3d', hsl: [0.05, 0.8, 0.6] },
        LightVibrant: null,
        Muted: null,
        DarkVibrant: null,
        LightMuted: null,
        DarkMuted: null,
      }),
    } as any)

    viFetch.mockResolvedValueOnce({ access_token: 'token', expires_in: 3600 })
    viFetch.mockResolvedValueOnce({
      is_playing: true,
      progress_ms: 0,
      item: {
        name: 'Accent Track',
        duration_ms: 1000,
        artists: [{ name: 'Artist' }],
        album: { name: 'Album', images: [{ url: 'https://i.scdn.co/image/accent', height: 300, width: 300 }] },
        external_urls: { spotify: 'u' },
      },
    })

    const res = await fetchNowPlaying('c', 's', 'r')
    expect(res.accentColor).toBe('#ff6a3d')
  })

  it('should not re-extract accentColor when the track has not changed', async () => {
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))
    vi.mocked(Vibrant.from).mockClear()
    vi.mocked(Vibrant.from).mockReturnValueOnce({
      getPalette: () => Promise.resolve({
        Vibrant: { hex: '#66ddff', hsl: [0.55, 0.8, 0.6] },
        LightVibrant: null,
        Muted: null,
        DarkVibrant: null,
        LightMuted: null,
        DarkMuted: null,
      }),
    } as any)

    const sameItem = {
      is_playing: true,
      progress_ms: 0,
      item: {
        name: 'Same Track',
        duration_ms: 1000,
        artists: [{ name: 'Artist' }],
        album: { name: 'Album', images: [{ url: 'https://i.scdn.co/image/same', height: 300, width: 300 }] },
        external_urls: { spotify: 'u' },
      },
    }

    viFetch.mockResolvedValueOnce({ access_token: 'token', expires_in: 3600 })
    viFetch.mockResolvedValueOnce(sameItem)
    const res1 = await fetchNowPlaying('c', 's', 'r')
    expect(res1.accentColor).toBe('#66ddff')

    // Advance past the 5s now-playing POLL_INTERVAL so the *outer* cache expires and
    // a real fetch happens again — this is what actually exercises the accent-reuse
    // logic (lastAccent), instead of short-circuiting on the outer cache.
    vi.advanceTimersByTime(6_000)

    // Cached token is still valid (only 6s passed, expires in 3600s) — no token mock needed.
    viFetch.mockResolvedValueOnce(sameItem)
    const res2 = await fetchNowPlaying('c', 's', 'r')

    expect(res2.accentColor).toBe('#66ddff')
    expect(vi.mocked(Vibrant.from)).toHaveBeenCalledTimes(1)
  })
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `docker compose exec -T app npx vitest run tests/server/utils/spotify.test.ts`

Expected: FAIL — `res.accentColor` is `undefined` (field doesn't exist yet on the type or
in the returned data).

- [ ] **Step 3: Implement the wiring**

In `src/server/utils/spotify.ts`, add `accentColor?: string` to the `SpotifyNowPlaying`
interface (line 1-10):

```ts
export interface SpotifyNowPlaying {
  isPlaying: boolean
  track?: string
  artist?: string
  album?: string
  albumArt?: string
  spotifyUrl?: string
  progressMs?: number
  durationMs?: number
  accentColor?: string
}
```

Add a module-level cache for the last-seen track's accent, next to `cachedState` (around
line 72):

```ts
let lastAccent: { albumArt: string; color: string | undefined } | null = null
```

Reset it in `_clearSpotifyCache()` (around line 82-90):

```ts
export function _clearSpotifyCache() {
  cachedToken = null
  cachedState = null
  cachedRecentlyPlayed = null
  lastAccent = null
  rateLimitedUntil = 0
  inFlightToken = null
  inFlightNowPlaying = null
  inFlightRecentlyPlayed = null
}
```

Inside `fetchNowPlaying()`, right after the `data` object is built (after line 196, before
the "Defensive cache-size guard" comment on line 198), insert:

```ts
      if (data.isPlaying && data.albumArt) {
        if (lastAccent && lastAccent.albumArt === data.albumArt) {
          data.accentColor = lastAccent.color
        } else {
          const color = await extractAccentColor(data.albumArt)
          lastAccent = { albumArt: data.albumArt, color }
          if (color) {
            data.accentColor = color
          }
        }
      }
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `docker compose exec -T app npx vitest run tests/server/utils/spotify.test.ts`

Expected: PASS — all tests in the file, including the 2 new ones.

- [ ] **Step 5: Run the full test suite to check for regressions**

Run: `docker compose exec -T app npx vitest run`

Expected: PASS — all test files (this must include the pre-existing `fetchNowPlaying`
tests from before this feature, unaffected by the new optional field).

- [ ] **Step 6: Commit**

```bash
git add src/server/utils/spotify.ts tests/server/utils/spotify.test.ts
git commit -m "✨ feat(spotify): wire accentColor into fetchNowPlaying, recompute only on track change"
```

---

### Task 4: Propagate `accentColor` through the composable type

**Files:**
- Modify: `src/composables/useNowPlaying.ts`

**Interfaces:**
- Consumes: `SpotifyNowPlaying` shape from `fetchNowPlaying()` (Task 3), fetched from
  `/api/spotify/now-playing` (endpoint unchanged — it already just returns whatever
  `fetchNowPlaying()` produces).
- Produces: `useNowPlaying()` returns `{ nowPlaying: Ref<NowPlayingData> }` where
  `NowPlayingData` now includes `accentColor?: string`.

This task has no new server behavior to test — it's a type update so `now.vue` (Task 5)
gets `accentColor` autocompletion/typechecking. Verified by the project's existing
`vue-tsc` typecheck, not a new unit test.

- [ ] **Step 1: Add the field to the local interface**

In `src/composables/useNowPlaying.ts`, update the `NowPlayingData` interface (lines 3-12):

```ts
interface NowPlayingData {
  isPlaying: boolean
  track?: string
  artist?: string
  album?: string
  albumArt?: string
  spotifyUrl?: string
  progressMs?: number
  durationMs?: number
  accentColor?: string
}
```

- [ ] **Step 2: Typecheck**

Run: `docker compose exec -T app npx vue-tsc --noEmit`

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/composables/useNowPlaying.ts
git commit -m "♻️ refactor(now-playing): propagate accentColor through useNowPlaying's type"
```

---

### Task 5: Ambient blur backdrop + dynamic accent in `now.vue`

**Files:**
- Modify: `src/pages/now.vue`

**Interfaces:**
- Consumes: `nowPlaying.value.accentColor?: string` (Task 4).
- Produces: no new exports — this is the terminal, user-visible task.

- [ ] **Step 1: Replace the NOW PLAYING panel markup**

In `src/pages/now.vue`, replace the entire `<!-- NOW PLAYING -->` block (lines 21-66) with:

```html
    <!-- NOW PLAYING -->
    <div
      class="panel now-playing-panel"
      :style="nowPlaying?.isPlaying && nowPlaying.accentColor ? { '--np-accent': nowPlaying.accentColor } : undefined"
    >
      <div class="panel-header" style="position: relative; z-index: 2;">
        <span :style="nowPlaying?.isPlaying && nowPlaying.accentColor ? { color: 'var(--np-accent)' } : undefined">NOW PLAYING · SPOTIFY</span>
        <NowPlayingBars v-if="nowPlaying?.isPlaying" />
      </div>

      <div
        v-if="nowPlaying?.isPlaying && nowPlaying.albumArt"
        class="now-playing-backdrop"
        :style="{ backgroundImage: `url(${nowPlaying.albumArt})` }"
      />
      <div v-if="nowPlaying?.isPlaying && nowPlaying.albumArt" class="now-playing-overlay" />

      <div class="panel-body p-4" style="position: relative; z-index: 2;">
        <div v-if="nowPlaying?.isPlaying" class="flex items-center gap-4">
          <img
            v-if="nowPlaying.albumArt"
            :src="nowPlaying.albumArt"
            :alt="nowPlaying.album"
            class="w-14 h-14 rounded-sm border border-nw-text-line shrink-0"
          />
          <div class="flex-1 min-w-0 space-y-1">
            <a
              :href="nowPlaying.spotifyUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="block text-nw-text font-mono text-sm hover:text-nw-primary-hot transition-colors truncate"
            >
              {{ nowPlaying.track }}
            </a>
            <div class="text-nw-text-dim text-xs font-mono truncate">{{ nowPlaying.artist }} · {{ nowPlaying.album }}</div>
            <div class="flex items-center gap-2">
              <span class="text-nw-text-mute text-[10px] font-mono w-8 text-right shrink-0">{{ formatMs(nowPlaying.progressMs) }}</span>
              <div class="flex-1 h-[3px] bg-nw-text-line rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-1000"
                  :class="nowPlaying.accentColor ? '' : 'bg-nw-green'"
                  :style="nowPlaying.accentColor ? { width: progressPercent + '%', background: 'var(--np-accent)' } : { width: progressPercent + '%' }"
                />
              </div>
              <span class="text-nw-text-mute text-[10px] font-mono w-8 shrink-0">{{ formatMs(nowPlaying.durationMs) }}</span>
            </div>
          </div>
          <a
            :href="nowPlaying.spotifyUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="font-stamp uppercase tracking-[0.14em] text-[10px] text-nw-green hover:text-nw-primary-hot transition-colors shrink-0 hidden sm:block"
          >
            OPEN IN SPOTIFY →
          </a>
        </div>
        <div v-else class="text-nw-text-dim text-xs font-mono py-1">
          Nothing playing right now.
        </div>
      </div>
    </div>
```

- [ ] **Step 2: Add the ambient backdrop CSS**

In `src/pages/now.vue`, inside the `<script setup>` block, this is a `<template>`-only
change — add a `<style scoped>` block right after the closing `</script>` tag (end of
file, after line 250's `</script>`):

```html
<style scoped>
.now-playing-panel {
  position: relative;
  overflow: hidden;
}

.now-playing-backdrop {
  position: absolute;
  inset: -30%;
  background-size: cover;
  background-position: center;
  filter: blur(38px) saturate(1.3);
  opacity: 0.5;
  transition: opacity 400ms ease;
  z-index: 0;
}

.now-playing-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(10, 10, 10, 0.35) 0%, rgba(10, 10, 10, 0.88) 78%, rgba(10, 10, 10, 0.96) 100%);
  z-index: 1;
}

@media (prefers-reduced-motion: reduce) {
  .now-playing-backdrop {
    transition: none;
  }
}
</style>
```

- [ ] **Step 3: Typecheck and run the full test suite**

Run: `docker compose exec -T app npx vue-tsc --noEmit && docker compose exec -T app npx vitest run`

Expected: both pass with no errors, no regressions.

- [ ] **Step 4: Visual check in the running app**

Run: `docker compose logs app --tail 20` to confirm the dev server is up (it should already
be running from earlier in this session), then open `http://localhost:<dev-port>/now` in a
browser and confirm:
- With nothing playing: panel looks exactly like it did before this task.
- With a track playing (requires the regenerated Spotify refresh token from PR #166):
  blurred album-art backdrop is visible, contained inside the panel border, label and
  progress bar use the extracted accent color, and text stays legible.

- [ ] **Step 5: Commit**

```bash
git add src/pages/now.vue
git commit -m "✨ feat(now): ambient blurred album-art backdrop with dynamic accent color"
```

---

## Post-plan note

This branch (`feature/spotify-ambient-nowplaying`) is based on `feature/spotify-recently-played`
(PR #166), per Carlos's request — rebase onto `develop` once #166 merges, before opening
this feature's own PR.
