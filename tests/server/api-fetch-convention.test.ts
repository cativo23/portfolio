import { describe, it, expect } from 'vitest'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

// Every BFF → backend call must go through server/utils/api.ts's apiFetch(),
// which is the single place `config.apiBaseUrl` is composed into a URL and
// forwards the real client IP (see api.ts's LOAD-BEARING throttle comment).
// A route that calls $fetch(`${config.apiBaseUrl}...`) directly bypasses that
// IP forwarding and silently collapses every visitor back into one throttle
// bucket. This test guards against reintroducing that pattern.
const SERVER_API_DIR = join(__dirname, '../../src/server/api')
const APIBASEURL_PATTERN = /\bapiBaseUrl\b/

function collectTsFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) return collectTsFiles(full)
    return full.endsWith('.ts') ? [full] : []
  })
}

describe('server/api conventions', () => {
  it('never references apiBaseUrl directly — routes must call apiFetch() instead', () => {
    const offenders = collectTsFiles(SERVER_API_DIR)
      .filter((file) => APIBASEURL_PATTERN.test(readFileSync(file, 'utf-8')))
      .map((file) => relative(join(__dirname, '../..'), file))

    expect(offenders).toEqual([])
  })
})
