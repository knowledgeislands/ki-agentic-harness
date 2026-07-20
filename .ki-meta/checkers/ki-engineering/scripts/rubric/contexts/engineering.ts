import { resolve } from 'node:path'
import { collectAuditEvidence, type EngineeringEvidenceFinding } from './audit-evidence.ts'
import { repairEngineeringItem } from './conform-evidence.ts'

export type EngineeringRubricContext = {
  target: string
  dryRun: boolean
  audit: (code: string) => readonly EngineeringEvidenceFinding[]
  repair: (code: string) => { changed: boolean; message: string; subject?: string }
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
  return () => ({
    target: absoluteTarget,
    dryRun,
    audit: (code) => collectAuditEvidence(absoluteTarget, code),
    repair: (code) => repairEngineeringItem({ target: absoluteTarget, dryRun, code })
  })
}
