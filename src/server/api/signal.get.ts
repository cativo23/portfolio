interface SignalData {
  github: {
    contributions: number
    weeks: number[][]
    publicRepos: number
  }
  npm: {
    lumira: number
    claudeSetup: number
    nightwire: number
    total: number
  }
  api: {
    version: string
    status: string
  }
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

  const weeks = calendar.weeks.slice(-16).map((w: any) =>
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

async function fetchNpmDownloads(pkg: string): Promise<number> {
  const res = await $fetch<any>(
    `https://api.npmjs.org/downloads/point/last-month/${pkg}`,
    { timeout: 5000 }
  )
  return res?.downloads ?? 0
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
    const [gh, repos, lumira, claudeSetup, nightwire, api] = await Promise.allSettled([
      fetchGitHubContributions(githubToken),
      fetchGitHubRepos(githubToken),
      fetchNpmDownloads('lumira'),
      fetchNpmDownloads('claude-setup'),
      fetchNpmDownloads('@cativo23/nightwire'),
      fetchApiHealth(),
    ])

    const ghData = gh.status === 'fulfilled' ? gh.value : { contributions: 0, weeks: [] }
    const repoCount = repos.status === 'fulfilled' ? repos.value : 0
    const lumiraDl = lumira.status === 'fulfilled' ? lumira.value : 0
    const claudeSetupDl = claudeSetup.status === 'fulfilled' ? claudeSetup.value : 0
    const nightwireDl = nightwire.status === 'fulfilled' ? nightwire.value : 0
    const apiData = api.status === 'fulfilled' ? api.value : { version: '...', status: 'unknown' }

    const data: SignalData = {
      github: {
        contributions: ghData.contributions,
        weeks: ghData.weeks,
        publicRepos: repoCount,
      },
      npm: {
        lumira: lumiraDl,
        claudeSetup: claudeSetupDl,
        nightwire: nightwireDl,
        total: lumiraDl + claudeSetupDl + nightwireDl,
      },
      api: apiData,
    }

    return { status: 'success', data }
  },
  { maxAge: 60 * 60 }
)
