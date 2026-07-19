import { resolve } from 'node:path'
import { collectAuditEvidence, type EngineeringEvidenceFinding } from './audit-evidence.ts'
import { collectConformEvidence, type EngineeringConformFinding } from './conform-evidence.ts'

export type EngineeringRubricContext = {
  target: string
  dryRun: boolean
  auditFindings: readonly EngineeringEvidenceFinding[]
  conformFindings: () => readonly EngineeringConformFinding[]
}

/** Immutable evidence is prepared once per AUDIT run and shared by item executions. */
export const createEngineeringContextFactory = ({
  target,
  dryRun = false
}: {
  target: string
  dryRun?: boolean
}): (() => EngineeringRubricContext) => {
  const absoluteTarget = resolve(target)
  const auditFindings = collectAuditEvidence(absoluteTarget)
  let conformFindings: readonly EngineeringConformFinding[] | undefined
  return () => ({
    target: absoluteTarget,
    dryRun,
    auditFindings,
    conformFindings: () => (conformFindings ??= collectConformEvidence(absoluteTarget, dryRun))
  })
}
