import { describe, it, expect, vi } from 'vitest'

vi.stubGlobal('useFetch', vi.fn())

const { formatMonthlyDownloads } = await import('~/composables/useNpmDownloads')

describe('formatMonthlyDownloads', () => {
  it('rounds sub-thousand counts to the nearest ten', () => {
    expect(formatMonthlyDownloads(584)).toBe('~580')
    expect(formatMonthlyDownloads(586)).toBe('~590')
  })

  it('keeps small counts readable instead of rounding to zero', () => {
    expect(formatMonthlyDownloads(4)).toBe('~4')
  })

  it('abbreviates thousands with one decimal', () => {
    expect(formatMonthlyDownloads(1834)).toBe('~1.8K')
    expect(formatMonthlyDownloads(12_400)).toBe('~12.4K')
  })

  it('drops a trailing .0 on round thousands', () => {
    expect(formatMonthlyDownloads(2000)).toBe('~2K')
  })

  it('does not render 995+ as ~1000', () => {
    expect(formatMonthlyDownloads(997)).toBe('~1K')
  })

  it('returns null when there is no real count to show', () => {
    expect(formatMonthlyDownloads(0)).toBeNull()
    expect(formatMonthlyDownloads(undefined)).toBeNull()
    expect(formatMonthlyDownloads(null)).toBeNull()
  })
})
