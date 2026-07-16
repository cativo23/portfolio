import type { H3Event } from 'h3'
import { apiFetch } from '~/server/utils/api'

interface NpmPackageData {
  monthly: number
  weekly: number[]
}

interface InfraStats {
  services: number | null
  stacks: number | null
}

interface SignalData {
  github: {
    contributions: number
    weeks: number[][]
    publicRepos: number
  }
  npm: {
    lumira: NpmPackageData
    claudeStyle: NpmPackageData
    nightwire: NpmPackageData
    total: number
    /**
     * Total published packages (maintainer:cativo23), live from the registry;
     * null when the count couldn't be determined (so the UI shows '…', not '0').
     */
    packages: number | null
  }
  api: {
    version: string
    status: string
  }
  /** Live self-hosted infra counts, sourced from portfolio-api. */
  infra: InfraStats
}

async function fetchGitHubContributions(token: string): Promise<{ contributions: number; weeks: number[][] }> {
  if (!token) {
    return { contributions: 0, weeks: [] }
  }

  const query = `query {
    user(login: "cativo23") {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              contributionLevel
            }
          }
        }
      }
    }
  }`

  const res = await $fetch<any>('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: { query },
    timeout: 8000,
  })

  const calendar = res?.data?.user?.contributionsCollection?.contributionCalendar
  if (!calendar) return { contributions: 0, weeks: [] }

  const levelMap: Record<string, number> = {
    NONE: 0,
    FIRST_QUARTILE: 1,
    SECOND_QUARTILE: 2,
    THIRD_QUARTILE: 3,
    FOURTH_QUARTILE: 4,
  }

  const weeks = calendar.weeks.slice(-30).map((w: any) =>
    w.contributionDays.map((d: any) => levelMap[d.contributionLevel] ?? 0)
  )

  return {
    contributions: calendar.totalContributions,
    weeks,
  }
}

async function fetchGitHubRepos(token: string): Promise<number> {
  const headers: Record<string, string> = token
    ? { Authorization: `Bearer ${token}` }
    : {}
  const res = await $fetch<any>('https://api.github.com/users/cativo23', { timeout: 5000, headers })
  return res?.public_repos ?? 0
}

async function fetchNpmDownloads(pkg: string): Promise<NpmPackageData> {
  const end = new Date()
  const start = new Date(end.getTime() - 7 * 7 * 24 * 60 * 60 * 1000) // 7 weeks ago
  const fmt = (d: Date) => d.toISOString().slice(0, 10)

  const [point, range] = await Promise.allSettled([
    $fetch<any>(`https://api.npmjs.org/downloads/point/last-month/${pkg}`, { timeout: 5000 }),
    $fetch<any>(`https://api.npmjs.org/downloads/range/${fmt(start)}:${fmt(end)}/${pkg}`, { timeout: 5000 }),
  ])

  const monthly = point.status === 'fulfilled' ? (point.value?.downloads ?? 0) : 0

  let weekly: number[] = []
  if (range.status === 'fulfilled' && range.value?.downloads) {
    const days: { downloads: number }[] = range.value.downloads
    for (let i = 0; i < days.length; i += 7) {
      const chunk = days.slice(i, i + 7)
      weekly.push(chunk.reduce((sum, d) => sum + d.downloads, 0))
    }
  }
  if (weekly.length === 0) weekly = [0, 0, 0, 0, 0, 0, 0]

  return { monthly, weekly }
}

async function fetchNpmPackageCount(): Promise<number> {
  // `objects.length` is the exact returned set; size=250 comfortably covers a
  // personal account, so it won't be capped. Preferred over `total`, which the
  // registry can inflate for fuzzy maintainer matches.
  const res = await $fetch<any>(
    'https://registry.npmjs.org/-/v1/search?text=maintainer:cativo23&size=250',
    { timeout: 5000 }
  )
  // Throw on a malformed response so the caller degrades to null (→ '…') rather
  // than reporting a misleading "0" as if it were a real count.
  if (!Array.isArray(res?.objects)) {
    throw new Error('unexpected npm registry response shape')
  }
  return res.objects.length
}

async function fetchInfraStats(event: H3Event): Promise<InfraStats> {
  // Versioned endpoint on portfolio-api — it lives under the global /api/v1 prefix
  // (unlike /health and /, which are excluded), so use the default basePath. The
  // backend already degrades to null counts on a docker-proxy outage; the
  // try/catch guards a transport failure so the panel never breaks.
  try {
    const res = await apiFetch<{ status: string; data: InfraStats }>(
      event,
      '/infra/stats'
    )
    return res?.data ?? { services: null, stacks: null }
  } catch {
    return { services: null, stacks: null }
  }
}

async function fetchApiHealth(): Promise<{ version: string; status: string }> {
  try {
    const res = await $fetch<any>('https://api.cativo.dev', { timeout: 5000 })
    return {
      version: res?.data?.version ?? '...',
      status: res?.data?.status ?? 'unknown',
    }
  } catch {
    return { version: '...', status: 'unreachable' }
  }
}

export default defineCachedEventHandler(
  async (event) => {
    const { githubToken } = useRuntimeConfig(event)
    const [gh, repos, lumira, claudeStyle, nightwire, api, npmCount, infra] =
      await Promise.allSettled([
        fetchGitHubContributions(githubToken),
        fetchGitHubRepos(githubToken),
        fetchNpmDownloads('lumira'),
        fetchNpmDownloads('claude-style'),
        fetchNpmDownloads('@cativo23/nightwire'),
        fetchApiHealth(),
        fetchNpmPackageCount(),
        fetchInfraStats(event),
      ])

    const ghData = gh.status === 'fulfilled' ? gh.value : { contributions: 0, weeks: [] }
    const repoCount = repos.status === 'fulfilled' ? repos.value : 0
    const fallbackPkg: NpmPackageData = { monthly: 0, weekly: [0, 0, 0, 0, 0, 0, 0] }
    const lumiraDl = lumira.status === 'fulfilled' ? lumira.value : fallbackPkg
    const claudeStyleDl = claudeStyle.status === 'fulfilled' ? claudeStyle.value : fallbackPkg
    const nightwireDl = nightwire.status === 'fulfilled' ? nightwire.value : fallbackPkg
    const apiData = api.status === 'fulfilled' ? api.value : { version: '...', status: 'unknown' }
    const packageCount = npmCount.status === 'fulfilled' ? npmCount.value : null
    const infraData =
      infra.status === 'fulfilled'
        ? infra.value
        : { services: null, stacks: null }

    const data: SignalData = {
      github: {
        contributions: ghData.contributions,
        weeks: ghData.weeks,
        publicRepos: repoCount,
      },
      npm: {
        lumira: lumiraDl,
        claudeStyle: claudeStyleDl,
        nightwire: nightwireDl,
        total: lumiraDl.monthly + claudeStyleDl.monthly + nightwireDl.monthly,
        packages: packageCount,
      },
      api: apiData,
      infra: infraData,
    }

    return { status: 'success', data }
  },
  // Cache the composed payload server-side for an hour so the rate-limited
  // upstreams (GitHub GraphQL, npm registry) aren't hammered. `swr: true` emits
  // `s-maxage` + `stale-while-revalidate` instead of a private `max-age`, so the
  // browser revalidates (cheap via ETag) rather than pinning a stale copy for an
  // hour — keeps the LIVE numbers fresh and stops payload-shape changes from
  // replaying broken data to returning visitors.
  { maxAge: 60 * 60, swr: true }
)
