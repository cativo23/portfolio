import { computed } from 'vue'

/**
 * Formats a monthly npm download count as a short approximate label ("~580",
 * "~1.8K"). Returns null when there's no real count, so callers hide the badge
 * instead of advertising "~0".
 */
export function formatMonthlyDownloads(count: number | null | undefined): string | null {
  if (!count || count <= 0) return null
  if (count < 10) return `~${count}`

  const rounded = Math.round(count / 10) * 10
  if (rounded < 1000) return `~${rounded}`

  return `~${(count / 1000).toFixed(1).replace(/\.0$/, '')}K`
}

/**
 * Live lumira monthly downloads, read from the cached /api/signal payload so the
 * about/cv/now pages never drift from npm again. Fetched during SSR so the
 * number is in the HTML (and the printed CV); a failed fetch hides the badge.
 */
export function useNpmDownloads() {
  const { data } = useFetch('/api/signal', {
    key: 'npm-downloads',
    transform: (res: { data?: { npm?: { lumira?: { monthly?: number } } } }) =>
      res?.data?.npm?.lumira?.monthly ?? null,
  })

  return {
    lumira: computed(() => formatMonthlyDownloads(data.value)),
  }
}
