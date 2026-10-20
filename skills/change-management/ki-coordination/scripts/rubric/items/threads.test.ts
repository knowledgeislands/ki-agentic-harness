import { afterEach, describe, expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { AuditOutcome } from '../../shared/rubric.ts'
import { type CoordinationRubricContext, createCoordinationSession } from '../contexts/coordination.ts'
import { COORD } from './threads.ts'

const roots: string[] = []

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
})

const write = (root: string, path: string, body: string): void => {
  mkdirSync(join(root, path, '..'), { recursive: true })
  writeFileSync(join(root, path), body)
}

/** A Capital still in the tolerance window: every old-shape checkpoint the `legacy()` helper warns on. */
const toleranceCapital = (): string => {
  const root = mkdtempSync(join(tmpdir(), 'ki-coordination-levels-'))
  roots.push(root)
  write(root, '.ki.toml', '[skills.ki-repo]\nrepository = "ki-principal"\ncapital = "ki-principal"\n')
  write(root, '+/_CHECKPOINTS/_state-of-play.md', "---\nlabel: 'KI state of play'\n---\n\n# SoP\n")
  write(root, '+/_CHECKPOINTS/model.ways-of-working.md', "---\nlabel: 'KI Model: ways-of-working'\n---\n\n# WoW\n")
  write(root, '+/_THREADS/wow/stray.png', 'scratch')
  write(root, '+/_THREADS/wow/run.report.md', '<!-- rumdl-disable -->\n# Report\n')
  return root
}

const context = (root: string): CoordinationRubricContext => {
  const session = createCoordinationSession({ mode: 'audit', repository: root, userHome: root, configuration: {} })
  const [subject] = session.subjects
  if (!subject) throw new Error('the coordination session has no subject')
  return subject.context() as CoordinationRubricContext
}

/** Every outcome level an item emits that its declaration does not admit, as `ki`'s `validateOutcome` rejects them. */
const undeclaredLevels = (ctx: CoordinationRubricContext): string[] =>
  COORD.items.flatMap((item) => {
    const mechanical = item.mechanical
    if (!mechanical?.audit) return []
    const admitted = new Set([mechanical.level, ...(mechanical.overrideLevels ?? [])])
    const outcomes = mechanical.audit.run(COORD.selectContext(ctx)) as readonly AuditOutcome[]
    return outcomes
      .map((outcome) => ('level' in outcome ? outcome.level : undefined))
      .filter((level): level is NonNullable<typeof level> => level !== undefined && !admitted.has(level))
      .map((level) => `${item.code} ${level}`)
  })

describe('declared outcome levels', () => {
  test("every item's outcomes over a tolerance-window Capital use a declared level", () => {
    const ctx = context(toleranceCapital())
    expect(ctx.master.outcomes.some((outcome) => 'level' in outcome && outcome.level === 'WARN')).toBe(true)
    expect(undeclaredLevels(ctx)).toEqual([])
  })

  test('COORD-1 admits the tolerance-window warning', () => {
    const coord1 = COORD.items.find((item) => item.code === 'COORD-1')
    expect(coord1?.mechanical?.level).toBe('FAIL')
    expect(coord1?.mechanical?.overrideLevels).toContain('WARN')
  })

  test('COORD-12 fails a report that opens with a lint directive', () => {
    const coord12 = COORD.items.find((item) => item.code === 'COORD-12')
    expect(coord12?.mechanical?.level).toBe('FAIL')
    const audit = coord12?.mechanical?.audit
    if (!audit) throw new Error('COORD-12 has no mechanical audit')
    const outcomes = audit.run(COORD.selectContext(context(toleranceCapital()))) as readonly AuditOutcome[]
    const violations = outcomes.filter((outcome) => outcome.status === 'VIOLATION')
    expect(violations).toHaveLength(1)
    expect(JSON.stringify(violations[0])).toContain('run.report.md')
    expect(violations.every((outcome) => !('level' in outcome) || outcome.level === 'FAIL')).toBe(true)
  })
})
