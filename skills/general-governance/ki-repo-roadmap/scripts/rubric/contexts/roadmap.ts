import type { AuditOutcome, ConformOutcome } from '../../vendored/ki-skills/rubric.ts'
import { inspectRoadmap, type Finding } from './roadmap-evidence.ts'
import { conformRoadmap } from './roadmap-writes.ts'

type LegacyLevel = 'FAIL' | 'WARN' | 'POLISH' | 'ADVISORY' | 'INFO' | 'NA' | 'PASS'
export type LegacyFinding = { level: LegacyLevel; area: string; message: string; subject?: string }

export type RoadmapContext = {
  target: string
  audit: readonly LegacyFinding[]
  conform: () => readonly LegacyFinding[]
}

const findings = (value: readonly Finding[]): readonly LegacyFinding[] => value.map(({ level, area, msg, file }) => ({ level, area, message: msg, ...(file ? { subject: file } : {}) }))

export const createRoadmapContextFactory = ({ target, dryRun = false }: { target: string; dryRun?: boolean }): (() => RoadmapContext) => {
  const audited = findings(inspectRoadmap(target))
  let conformed: readonly LegacyFinding[] | undefined
  return () => ({
    target,
    audit: audited,
    conform: () => (conformed ??= findings(conformRoadmap(target, dryRun)))
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
