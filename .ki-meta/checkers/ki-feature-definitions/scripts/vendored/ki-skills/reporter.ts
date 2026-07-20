import {
  CHECKER_LEVELS,
  type CheckerFinding,
  type CheckerLevel,
  type CheckerResult,
  type CheckerStatusEvent,
  type CheckerStatusTracker,
  type CheckerSummary,
  checkerJsonl
} from './checker.ts'

export const REPORTERS = ['jsonl', 'terminal'] as const
export type Reporter = (typeof REPORTERS)[number]
export const PROGRESS_MODES = ['auto', 'always', 'never'] as const
export type ProgressMode = (typeof PROGRESS_MODES)[number]

export type ReporterOptions = {
  reporter: Reporter
  levels?: readonly CheckerLevel[]
  colour?: boolean
}

export type ParsedReporterArguments = {
  arguments: readonly string[]
  options: ReporterOptions
}

export type ParsedProgressArguments = {
  arguments: readonly string[]
  mode: ProgressMode
}

export type ParsedCheckerArguments = ParsedReporterArguments & {
  progress: ProgressMode
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
    if (argument === '--reporter' || argument.startsWith('--reporter=')) {
      const reporterValue = argument === '--reporter' ? argv[++index] : argument.slice('--reporter='.length)
      if (!reporterValue || reporterValue.startsWith('-')) throw new Error('--reporter requires a value')
      if (!REPORTERS.includes(reporterValue as Reporter)) throw new Error(`--reporter accepts ${REPORTERS.join(' or ')}`)
      reporter = reporterValue as Reporter
      continue
    }

    if (argument === '--reporter-levels' || argument.startsWith('--reporter-levels=')) {
      const levelsValue = argument === '--reporter-levels' ? argv[++index] : argument.slice('--reporter-levels='.length)
      if (!levelsValue || levelsValue.startsWith('-')) throw new Error('--reporter-levels requires a value')
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

export const parseProgressArguments = (argv: readonly string[]): ParsedProgressArguments => {
  const arguments_: string[] = []
  let mode: ProgressMode = 'auto'
  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index] as string
    if (argument !== '--progress' && !argument.startsWith('--progress=')) {
      arguments_.push(argument)
      continue
    }
    const value = argument === '--progress' ? argv[++index] : argument.slice('--progress='.length)
    if (!value || value.startsWith('-')) throw new Error('--progress requires a value')
    if (!PROGRESS_MODES.includes(value as ProgressMode)) throw new Error(`--progress accepts ${PROGRESS_MODES.join(', ')}`)
    mode = value as ProgressMode
  }
  return { arguments: arguments_, mode }
}

export const parseCheckerArguments = (argv: readonly string[]): ParsedCheckerArguments => {
  const progress = parseProgressArguments(argv)
  return { ...parseReporterArguments(progress.arguments), progress: progress.mode }
}

const FALLBACK_TERMINAL_COLUMNS = 80
const ANSI_ESCAPE = new RegExp(`${String.fromCharCode(27)}\\[[0-?]*[ -/]*[@-~]`, 'gu')

const displayWidth = (text: string): number =>
  Array.from(text.replace(ANSI_ESCAPE, '')).reduce((width, character) => {
    const point = character.codePointAt(0) ?? 0
    if (point === 0 || (point >= 0x300 && point <= 0x36f)) return width
    return width + (point >= 0x1100 ? 2 : 1)
  }, 0)

const truncate = (text: string, width: number): string => {
  const plainText = text.replace(ANSI_ESCAPE, '')
  if (displayWidth(plainText) <= width) return plainText
  if (width <= 0) return ''
  if (width === 1) return '…'
  let result = ''
  for (const character of Array.from(plainText)) {
    if (displayWidth(result) + displayWidth(character) > width - 1) break
    result += character
  }
  return `${result}…`
}

const progressBar = (width: number, completed?: number, total?: number): string => {
  const innerWidth = width - 2
  if (completed === undefined || total === undefined) return `[>${'.'.repeat(Math.max(0, innerWidth - 1))}]`
  if (total <= 0) return `[${'#'.repeat(innerWidth)}]`
  const clamped = Math.max(0, Math.min(completed, total))
  const filled = clamped === total ? innerWidth : Math.floor((clamped / total) * innerWidth)
  return `[${'#'.repeat(filled)}${'.'.repeat(innerWidth - filled)}]`
}

const progressLine = ({
  left,
  right,
  completed,
  total,
  columns
}: {
  left: string
  right: string
  completed?: number
  total?: number
  columns: number
}): string => {
  const terminalWidth = Number.isFinite(columns) && columns > 0 ? Math.floor(columns) : FALLBACK_TERMINAL_COLUMNS
  const barWidth = Math.min(100, terminalWidth - displayWidth(left) - displayWidth(right) - 2)
  if (barWidth >= 3) return `${left} ${progressBar(barWidth, completed, total)} ${right}`

  const leftWidth = terminalWidth - displayWidth(right) - 1
  if (leftWidth > 0) return `${truncate(left, leftWidth)} ${right}`
  return truncate(right, terminalWidth)
}

const statusText = (event: CheckerStatusEvent): string => {
  if (event.type === 'start') return 'starting'
  if (event.type === 'complete') return 'complete'
  if (event.type === 'failed') return 'failed'
  return event.code
}

const progressFor = (event: CheckerStatusEvent, columns: number): string => {
  const completed = Math.max(0, Math.min(event.completed, event.total))
  const percentage = event.total <= 0 ? 100 : Math.round((completed / event.total) * 100)
  return progressLine({
    left: event.mode.toUpperCase(),
    right: `${completed}/${event.total} ${percentage}% ${statusText(event)}`,
    completed,
    total: event.total,
    columns
  })
}

export const createTerminalStatusTracker = ({
  mode,
  interactive,
  columns = () => process.stderr.columns,
  write
}: {
  mode: ProgressMode
  interactive: boolean
  columns?: () => number | undefined
  write: (line: string) => void
}): CheckerStatusTracker | undefined => {
  if (mode === 'never' || (mode === 'auto' && !interactive)) return undefined
  return (event: CheckerStatusEvent): void =>
    write(
      `${interactive ? '\r\x1b[2K' : ''}${progressFor(event, interactive ? (columns() ?? FALLBACK_TERMINAL_COLUMNS) : FALLBACK_TERMINAL_COLUMNS)}${
        event.type === 'complete' || event.type === 'failed' || !interactive ? '\n' : ''
      }`
    )
}

export const renderCheckerResult = (result: CheckerResult, options: ReporterOptions): string => {
  if (process.env.KI_CHECKER_PLAN === '1') return `${JSON.stringify({ version: 1, record: 'plan', items: result.plannedItems })}\n`
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
