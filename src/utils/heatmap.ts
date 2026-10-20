const MONTH_NAMES = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

/** Closer than this many weeks, two axis labels overlap on narrow screens. */
const MIN_LABEL_GAP_WEEKS = 2

/**
 * Month labels for the contribution heatmap's x-axis: one per month, placed at
 * the first week that falls in it. When the calendar opens on the last days of
 * a month, that leading label sits a week from the next one and the two print
 * on top of each other ("MARAPR"), so the partial month is dropped — the same
 * thing GitHub's own heatmap does.
 */
export function buildMonthLabels(weekCount: number, now: Date): { name: string; index: number }[] {
  const labels: { name: string; index: number }[] = []
  let lastMonth = -1

  for (let wi = 0; wi < weekCount; wi++) {
    const approxDate = new Date(now.getTime() - (weekCount - 1 - wi) * 7 * 24 * 60 * 60 * 1000)
    const month = approxDate.getMonth()
    if (month === lastMonth) continue
    lastMonth = month

    const prev = labels[labels.length - 1]
    if (prev && wi - prev.index < MIN_LABEL_GAP_WEEKS) labels.pop()
    labels.push({ name: MONTH_NAMES[month] ?? '', index: wi })
  }

  return labels
}
