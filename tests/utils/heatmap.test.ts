import { describe, it, expect } from 'vitest'
import { buildMonthLabels } from '~/utils/heatmap'

// 2026-10-19 is a Monday; 30 weeks back starts in late March.
const NOW = new Date('2026-10-19T12:00:00Z')

describe('buildMonthLabels', () => {
  it('labels the first week of each month', () => {
    const names = buildMonthLabels(30, NOW).map((l) => l.name)
    expect(names).toEqual(['APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT'])
  })

  it('drops a leading partial month that would collide with the next label', () => {
    // Week 0 lands in March, week 1 already in April: MAR and APR would overlap.
    const labels = buildMonthLabels(30, NOW)
    expect(labels[0]).toMatchObject({ name: 'APR' })
    expect(labels.some((l) => l.name === 'MAR')).toBe(false)
  })

  it('keeps labels at least two weeks apart', () => {
    const labels = buildMonthLabels(30, NOW)
    for (let i = 1; i < labels.length; i++) {
      expect(labels[i]!.index - labels[i - 1]!.index).toBeGreaterThanOrEqual(2)
    }
  })

  it('returns nothing for an empty calendar', () => {
    expect(buildMonthLabels(0, NOW)).toEqual([])
  })
})
