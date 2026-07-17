/**
 * Canonical checker reporter for governance checkers.
 *
 * This module deliberately knows nothing about a skill's policy or terminal
 * presentation. A checker gives it already-collected findings; it creates the
 * shared JSONL event stream to stdout.
 *
 * Bootstrap copies this source beside every checker so the local import remains
 * valid in a vendored `.ki-meta/` payload.
 */

export const CHECKER_LEVELS = ['FAIL', 'WARN', 'POLISH', 'ADVISORY', 'INFO', 'NA', 'PASS'] as const
export type CheckerLevel = (typeof CHECKER_LEVELS)[number]

export type MechanicalFinding = {
  type: 'M'
  level: CheckerLevel
  code: string
  message: string
  ref?: string
  file?: string
}

export type JudgmentFinding = {
  type: 'J'
  level: 'ADVISORY'
  code: string
  message: string
  ref: string
  file?: string
}

export type CheckerFinding = MechanicalFinding | JudgmentFinding

export type CheckerReporterRun = {
  version: 1
  runId: string
  mode: 'audit' | 'conform'
  concern: string
  target: string
  generatedAt: string
}

export type CheckerReporterMeta = CheckerReporterRun & {
  record: 'meta'
}

export type CheckerReporterFinding = CheckerReporterRun &
  CheckerFinding & {
    record: 'finding'
  }

export type CheckerReporterSummary = CheckerReporterRun & {
  record: 'summary'
  summary: Record<Lowercase<CheckerLevel>, number>
}

export type CheckerReporterEvent = CheckerReporterMeta | CheckerReporterFinding | CheckerReporterSummary

export type CheckerReporterInput = {
  mode: 'audit' | 'conform'
  concern: string
  target: string
  findings: CheckerFinding[]
}

function assertFinding(finding: CheckerFinding): void {
  if (!finding.code.trim()) throw new Error('checker finding code must be non-empty')
  if (!finding.message.trim()) throw new Error('checker finding message must be non-empty')
  if (finding.type === 'J' && !finding.ref?.trim()) throw new Error('J finding must cite its judgment criterion')
}

export function buildCheckerReporterEvents(input: CheckerReporterInput): CheckerReporterEvent[] {
  if (!input.concern.trim()) throw new Error('checker reporter concern must be non-empty')
  if (!input.target.trim()) throw new Error('checker reporter target must be non-empty')
  for (const finding of input.findings) assertFinding(finding)
  const summary: CheckerReporterSummary['summary'] = { fail: 0, warn: 0, polish: 0, advisory: 0, info: 0, na: 0, pass: 0 }
  for (const finding of input.findings) summary[finding.level.toLowerCase() as keyof typeof summary]++

  const run: CheckerReporterRun = {
    version: 1,
    runId: crypto.randomUUID(),
    mode: input.mode,
    concern: input.concern,
    target: input.target,
    generatedAt: new Date().toISOString()
  }

  return [
    { ...run, record: 'meta' },
    ...input.findings.map((finding) => ({ ...run, record: 'finding' as const, ...finding })),
    { ...run, record: 'summary', summary }
  ]
}

export function emitCheckerReporter(input: CheckerReporterInput): CheckerReporterEvent[] {
  const events = buildCheckerReporterEvents(input)
  for (const event of events) process.stdout.write(`${JSON.stringify(event)}\n`)
  return events
}

export function checkerReporterExitCode(findings: readonly CheckerFinding[]): number {
  return findings.some((finding) => finding.type === 'M' && finding.level === 'FAIL') ? 1 : 0
}
