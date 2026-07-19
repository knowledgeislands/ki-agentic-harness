import { spawnSync } from 'node:child_process'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { AuditOutcome, ConformOutcome, RubricOutcomes } from '../../vendored/ki-skills/rubric.ts'

type LegacyFinding = { level: string; code: string; message: string; file?: string }
export type TokenomicsRubricContext = { audit: ReadonlyMap<string, readonly LegacyFinding[]>; conform: ReadonlyMap<string, readonly LegacyFinding[]> }

const directory = dirname(fileURLToPath(import.meta.url))
const engine = (name: 'audit-engine.ts' | 'conform-engine.ts'): string => join(directory, name)
const collect = (source: string): ReadonlyMap<string, readonly LegacyFinding[]> => {
  const findings = new Map<string, LegacyFinding[]>()
  for (const line of source.split(/\r?\n/)) {
    try {
      const value = JSON.parse(line) as LegacyFinding
      if (!value.code || !value.level) continue
      const entries = findings.get(value.code) ?? []
      entries.push(value)
      findings.set(value.code, entries)
    } catch { /* terminal output is not part of the machine response */ }
  }
  return findings
}

/** Evidence and safe-write boundary; policy stays in the rubric item modules. */
export const createTokenomicsContext = ({ target, noUser, userDir, dryRun }: { target: string; noUser: boolean; userDir?: string; dryRun: boolean }): TokenomicsRubricContext => {
  const args = [resolve(target), ...(noUser ? ['--no-user'] : []), ...(userDir ? ['--user', resolve(userDir)] : [])]
  const audit = spawnSync('bun', [engine('audit-engine.ts'), ...args], { encoding: 'utf8' })
  const conform = spawnSync('bun', [engine('conform-engine.ts'), ...args, ...(dryRun ? ['--dry-run'] : [])], { encoding: 'utf8' })
  return { audit: collect(`${audit.stdout ?? ''}`), conform: collect(`${conform.stdout ?? ''}`) }
}

const asOutcomes = <Outcome extends AuditOutcome | ConformOutcome>(findings: readonly LegacyFinding[] | undefined, conform: boolean): RubricOutcomes<Outcome> => {
  if (!findings?.length) return [{ status: 'PASS', message: 'No finding for this criterion.' }] as RubricOutcomes<Outcome>
  return findings.map((finding) => ({
    status: finding.level === 'FAIL' || finding.level === 'WARN' ? 'VIOLATION' : conform && finding.level === 'POLISH' ? 'FIXED' : 'INFO',
    ...(finding.level === 'FAIL' || finding.level === 'WARN' ? { level: finding.level } : {}),
    message: finding.message,
    ...(finding.file ? { subject: finding.file } : {})
  })) as RubricOutcomes<Outcome>
}

export const auditOutcomes = (context: TokenomicsRubricContext, code: string): RubricOutcomes<AuditOutcome> => asOutcomes<AuditOutcome>(context.audit.get(code), false)
export const conformOutcomes = (context: TokenomicsRubricContext, code: string): RubricOutcomes<ConformOutcome> => asOutcomes<ConformOutcome>(context.conform.get(code), true)
