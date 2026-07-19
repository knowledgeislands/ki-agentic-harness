import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { AuditOutcome, ConformOutcome } from '../../vendored/ki-skills/rubric.ts'

type LegacyLevel = 'FAIL' | 'WARN' | 'POLISH' | 'ADVISORY' | 'INFO' | 'NA' | 'PASS'
export type LegacyFinding = { level: LegacyLevel; area: string; message: string; subject?: string }

export type RoadmapContext = {
  target: string
  audit: readonly LegacyFinding[]
  conform: () => readonly LegacyFinding[]
}

const legacyAudit = fileURLToPath(new URL('./legacy-audit.ts', import.meta.url))
const legacyConform = fileURLToPath(new URL('./legacy-conform.ts', import.meta.url))

const parse = (output: Uint8Array): readonly LegacyFinding[] => {
  const records = new TextDecoder().decode(output).split(/\r?\n/).filter(Boolean)
  return records.flatMap((line) => {
    try {
      const record = JSON.parse(line) as Record<string, unknown>
      if (record.record !== 'finding') return []
      return [{
        level: record.level as LegacyLevel,
        area: record.code as string,
        message: record.message as string,
        ...(typeof record.file === 'string' ? { subject: record.file } : {})
      }]
    } catch {
      return []
    }
  })
}

const run = (script: string, target: string, dryRun = false): readonly LegacyFinding[] => {
  const result = Bun.spawnSync(['bun', script, target, ...(dryRun ? ['--dry-run'] : [])], { stdout: 'pipe', stderr: 'pipe' })
  const findings = parse(result.stdout)
  if (findings.length === 0)
    return [{ level: 'FAIL', area: 'SAFE-1', message: `legacy checker did not return findings: ${new TextDecoder().decode(result.stderr).trim()}` }]
  return findings
}

export const createRoadmapContextFactory = ({ target, dryRun = false }: { target: string; dryRun?: boolean }): (() => RoadmapContext) => {
  const absolute = resolve(target)
  const audited = run(legacyAudit, absolute)
  let conformed: readonly LegacyFinding[] | undefined
  return () => ({
    target: absolute,
    audit: audited,
    conform: () => (conformed ??= run(legacyConform, absolute, dryRun))
  })
}

export const auditOutcome = (finding: LegacyFinding): AuditOutcome => ({
  status: finding.level === 'FAIL' || finding.level === 'WARN' ? 'VIOLATION' : finding.level === 'NA' ? 'NOT_APPLICABLE' : finding.level === 'INFO' ? 'INFO' : 'PASS',
  message: finding.message,
  ...(finding.subject ? { subject: finding.subject } : {})
})

export const conformOutcome = (finding: LegacyFinding): ConformOutcome => ({
  status:
    finding.level === 'FAIL' || finding.level === 'WARN'
      ? 'VIOLATION'
      : finding.level === 'POLISH'
        ? 'FIXED'
        : finding.level === 'NA'
          ? 'NOT_APPLICABLE'
          : finding.level === 'INFO' || finding.level === 'ADVISORY'
            ? 'INFO'
            : 'PASS',
  message: finding.message,
  ...(finding.subject ? { subject: finding.subject } : {})
})
