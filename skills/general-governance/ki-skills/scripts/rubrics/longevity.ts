import type { RubricItem } from '../lib/rubric/rubric.ts'

export const REFRESH_GRACE_DAYS = 14
export const CADENCE_DAYS: Record<string, number> = { weekly: 7, monthly: 30, quarterly: 90 }

export type RefreshStatus = 'due' | 'within-window' | 'overdue' | 'no-clock' | 'unmarked'
export type RefreshInfo = {
  cls: 'external-spec' | 'canonical' | null
  cadence: string | null
  lastReviewed: string | null
  ageDays: number | null
  status: RefreshStatus
}

const latestReviewDate = (text: string): string | null => {
  let column = -1
  let latest: string | null = null
  for (const line of text.split(/\r?\n/)) {
    if (!line.trimStart().startsWith('|')) {
      column = -1
      continue
    }
    const cells = line
      .split('|')
      .slice(1, -1)
      .map((cell) => cell.trim())
    const header = cells.findIndex((cell) => /^last reviewed$/i.test(cell))
    if (header >= 0) {
      column = header
      continue
    }
    const date = column < 0 ? undefined : (cells[column] ?? '').match(/\d{4}-\d{2}-\d{2}/)?.[0]
    if (date && (latest === null || date > latest)) latest = date
  }
  return latest
}

export const refreshStatus = (sources: string, now = Date.now()): RefreshInfo => {
  const match = sources.match(/^\*\*Refresh:\*\*\s*(external-spec|canonical)\s*·\s*(weekly|monthly|quarterly|on-change|\d+d)\s*$/m)
  const lastReviewed = latestReviewDate(sources)
  const ageDays = lastReviewed ? Math.floor((now - Date.parse(`${lastReviewed}T00:00:00Z`)) / 86_400_000) : null
  if (!match) return { cls: null, cadence: null, lastReviewed, ageDays, status: 'unmarked' }
  const cls = match[1] as 'external-spec' | 'canonical'
  const cadence = match[2] as string
  const windowDays = cadence === 'on-change' ? null : /^\d+d$/.test(cadence) ? Number.parseInt(cadence, 10) : CADENCE_DAYS[cadence]
  if (windowDays === null) return { cls, cadence, lastReviewed, ageDays, status: 'no-clock' }
  if (!windowDays || windowDays < 1 || ageDays === null) return { cls, cadence, lastReviewed, ageDays, status: 'overdue' }
  return {
    cls,
    cadence,
    lastReviewed,
    ageDays,
    status: ageDays > windowDays + REFRESH_GRACE_DAYS ? 'overdue' : ageDays < windowDays ? 'within-window' : 'due'
  }
}

export const auditLongevity = (sources: string) => {
  const info = refreshStatus(sources)
  const findings = [] as { type: 'M'; level: 'WARN'; code: string; message: string }[]
  if (info.status === 'unmarked')
    findings.push({
      type: 'M',
      level: 'WARN',
      code: LONG_4.code,
      message: 'references/sources.md has no parseable `**Refresh:** <class> · <cadence>` marker near the top (LONG-4a)'
    })
  else {
    if (info.cls === 'external-spec' && info.cadence === 'on-change')
      findings.push({
        type: 'M',
        level: 'WARN',
        code: LONG_4.code,
        message:
          '`**Refresh:**` marks this external-spec but cadence is `on-change` — an external-spec tracker needs a clock cadence (LONG-4b)'
      })
    if (info.status === 'overdue')
      findings.push({
        type: 'M',
        level: 'WARN',
        code: LONG_3.code,
        message: info.lastReviewed
          ? `references/sources.md last reviewed ${info.lastReviewed} (${info.ageDays} days ago), past its ${info.cadence} REFRESH cadence + ${REFRESH_GRACE_DAYS}d grace — run Mode REFRESH`
          : `references/sources.md declares a ${info.cadence} cadence but has no \`Last reviewed\` date — run Mode REFRESH`
      })
  }
  return findings
}

export const LONG_1: RubricItem = {
  code: 'LONG-1',
  title: 'volatile facts have a refresh path',
  description: 'A skill with time-sensitive facts resolves them at runtime or records sources and a refresh path.',
  sources: ['BP', 'COMMUNITY'],
  judgment: { prompt: 'Do volatile facts resolve at runtime or have a tracked source list and refresh path?' }
}

export const LONG_2: RubricItem = {
  code: 'LONG-2',
  title: 'the refresh path has a cadence',
  description: 'A skill that has a refresh path declares an appropriate cadence and schedules it when supported.',
  sources: ['COMMUNITY'],
  judgment: { prompt: 'Does the refresh path have an appropriate declared cadence and scheduled execution where supported?' }
}

export const LONG_3: RubricItem = {
  code: 'LONG-3',
  title: 'the declared refresh cadence is being met',
  description: 'A skill source list remains within its declared review cadence and grace period.',
  sources: ['COMMUNITY']
}

export const LONG_4: RubricItem = {
  code: 'LONG-4',
  title: 'the refresh marker is present and coherent',
  description: 'A sources file has a parseable and coherent refresh class and cadence marker.',
  sources: ['COMMUNITY']
}

export const LONGEVITY: readonly RubricItem[] = [LONG_1, LONG_2, LONG_3, LONG_4]
