import { existsSync, lstatSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { ConformProposal, ConformWrite } from '../../shared/rubric.ts'
import {
  type Finding,
  ISSUE_LEDGER,
  issueLedger,
  ledgerAllocation,
  rootRoadmap,
  workItemsFor
} from './roadmap-evidence.ts'

export type RoadmapDraft = {
  normaliseRoot: () => void
  scaffoldIssueLedger: () => void
  repairIssueLedger: () => void
  proposal: () => ConformProposal
}

const safeToDraft = (repository: string, findings: readonly Finding[]): boolean => {
  const ledgerMissing = !existsSync(join(repository, 'docs', 'roadmap', ISSUE_LEDGER))
  return !findings.some(
    (finding) => finding.level === 'FAIL' && finding.area !== 'ROOT-1' && !(finding.area === 'ROAD-7' && ledgerMissing)
  )
}

export const createRoadmapDraft = (_repository: string, findings: readonly Finding[]): RoadmapDraft | undefined => {
  if (!safeToDraft(_repository, findings)) return undefined
  const writes: ConformWrite[] = []
  const addWrite = (path: string, content: string, create = false): void => {
    if (!writes.some((write) => write.path === path))
      writes.push(create ? { path, content, create: true } : { path, content })
  }
  const scaffoldIssueLedger = (): void => {
    if (existsSync(join(_repository, 'docs', 'roadmap', ISSUE_LEDGER))) return
    const items = workItemsFor(_repository)
    const areas = new Map<string, number>()
    for (const item of items) {
      if (!item.area) continue
      areas.set(item.area, Math.max(areas.get(item.area) ?? 0, item.serial))
    }
    const highestRetained = Math.max(0, ...items.map((item) => item.serial))
    addWrite(`docs/roadmap/${ISSUE_LEDGER}`, issueLedger(areas.size ? areas : highestRetained), true)
  }
  // Rewrites only a ledger whose body exactly matches a superseded canonical form, preserving its allocation.
  const repairIssueLedger = (): void => {
    const path = join(_repository, 'docs', 'roadmap', ISSUE_LEDGER)
    if (!existsSync(path) || !lstatSync(path).isFile()) return
    const ledger = ledgerAllocation(readFileSync(path, 'utf8'))
    if (ledger?.form !== 'superseded') return
    addWrite(`docs/roadmap/${ISSUE_LEDGER}`, issueLedger(ledger.allocation))
  }
  return {
    normaliseRoot: () => {
      addWrite('ROADMAP.md', rootRoadmap())
    },
    scaffoldIssueLedger,
    repairIssueLedger,
    proposal: () => ({ writes })
  }
}
