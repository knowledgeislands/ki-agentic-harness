import { CHECKER_LEVELS, type CheckerFinding, type CheckerLevel, type CheckerResult, type CheckerSummary, checkerJsonl } from './checker.ts'

export const REPORTERS = ['jsonl', 'terminal'] as const
export type Reporter = (typeof REPORTERS)[number]

export type ReporterOptions = {
  reporter: Reporter
  levels?: readonly CheckerLevel[]
  colour?: boolean
}

export type ParsedReporterArguments = {
  arguments: readonly string[]
  options: ReporterOptions
}

type TextStyle = (text: string) => string

const plain: TextStyle = (text) => text

const styles = (colour: boolean): { level: Record<CheckerLevel, TextStyle>; muted: TextStyle; subject: TextStyle } => {
  if (!colour)
    return {
      level: Object.fromEntries(CHECKER_LEVELS.map((level) => [level, plain])) as Record<CheckerLevel, TextStyle>,
      muted: plain,
      subject: plain
    }

  const paint =
    (open: string): TextStyle =>
    (text) =>
      `${open}${text}\x1b[0m`
  return {
    level: {
      FAIL: paint('\x1b[31m'),
      WARN: paint('\x1b[33m'),
      FIXED: paint('\x1b[32m'),
      INFO: paint('\x1b[36m'),
      NOT_APPLICABLE: paint('\x1b[2m'),
      PASS: paint('\x1b[32m')
    },
    muted: paint('\x1b[2m'),
    subject: paint('\x1b[36m')
  }
}

const defaultLevels = (mode: 'audit' | 'conform'): readonly CheckerLevel[] =>
  mode === 'conform' ? ['FAIL', 'WARN', 'FIXED'] : ['FAIL', 'WARN']

export const parseReporterLevels = (value: string): readonly CheckerLevel[] => {
  if (value.trim().toLowerCase() === 'all') return CHECKER_LEVELS
  const levels = value
    .split(',')
    .map((level) => level.trim().toUpperCase())
    .filter(Boolean)
  if (levels.length === 0 || levels.some((level) => !CHECKER_LEVELS.includes(level as CheckerLevel)))
    throw new Error(`--reporter-levels accepts ${CHECKER_LEVELS.join(', ')}, or all`)
  return [...new Set(levels)] as CheckerLevel[]
}

const summaryLine = (summary: CheckerSummary): string =>
  [
    `FAIL=${summary.fail}`,
    `WARN=${summary.warn}`,
    `FIXED=${summary.fixed}`,
    `INFO=${summary.info}`,
    `NOT_APPLICABLE=${summary.notApplicable}`,
    `PASS=${summary.pass}`,
    `JUDGMENT_UNEVALUATED=${summary.judgment.unevaluated}`
  ].join(' ')

const renderFinding = (finding: CheckerFinding, style: ReturnType<typeof styles>): string => {
  const label = style.level[finding.level](finding.level.padEnd(14))
  const identity = style.muted(`${finding.title} (${finding.code})`)
  const subject = finding.subject ? ` ${style.subject(finding.subject)}` : ''
  return `${label} ${identity}${subject} — ${finding.message}`
}

export const parseReporterArguments = (argv: readonly string[]): ParsedReporterArguments => {
  const remaining: string[] = []
  let reporter: Reporter = 'jsonl'
  let levels: readonly CheckerLevel[] | undefined

  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index] as string
    const reporterValue =
      argument === '--reporter' ? argv[++index] : argument.startsWith('--reporter=') ? argument.slice('--reporter='.length) : undefined
    if (reporterValue !== undefined) {
      if (!REPORTERS.includes(reporterValue as Reporter)) throw new Error(`--reporter accepts ${REPORTERS.join(' or ')}`)
      reporter = reporterValue as Reporter
      continue
    }

    const levelsValue =
      argument === '--reporter-levels'
        ? argv[++index]
        : argument.startsWith('--reporter-levels=')
          ? argument.slice('--reporter-levels='.length)
          : undefined
    if (levelsValue !== undefined) {
      if (!levelsValue) throw new Error('--reporter-levels requires a value')
      levels = parseReporterLevels(levelsValue)
      continue
    }
    remaining.push(argument)
  }

  if (levels && reporter !== 'terminal') throw new Error('--reporter-levels requires --reporter=terminal')
  return {
    arguments: remaining,
    options: {
      reporter,
      ...(levels ? { levels } : {})
    }
  }
}

export const renderCheckerResult = (result: CheckerResult, options: ReporterOptions): string => {
  if (options.reporter === 'jsonl') return checkerJsonl(result.records)

  const meta = result.records[0]
  if (meta?.record !== 'meta') throw new Error('checker result does not start with a meta record')
  const selected = new Set(options.levels ?? defaultLevels(meta.mode))
  const visible = result.findings.filter((finding) => selected.has(finding.level))
  const style = styles(options.colour ?? false)
  const body =
    visible.length > 0 ? visible.map((finding) => renderFinding(finding, style)).join('\n') : `No ${[...selected].join(' / ')} findings.`
  return `${body}\n${style.muted(`Summary: ${summaryLine(result.summary)}`)}\n`
}
