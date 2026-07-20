#!/usr/bin/env bun
import { expect, test } from 'bun:test'
import { type CheckerStatusEvent, checkerJsonl, parseCheckerJsonl, runChecker, validateCheckerRecords } from './checker.ts'
import { defineRubricFamily, type RubricDefinition, type RubricItem } from './rubric.ts'

type TestContext = {
  generation: number
  present: boolean
  executionLog: string[]
}

let contextGeneration = 0
const executionLog: string[] = []

const PREPARE_HYBRID: RubricItem<TestContext> = {
  code: 'ALPHA-1',
  title: 'hybrid prerequisite',
  description: 'A hybrid test prerequisite.',
  sources: ['TEST'],
  mechanical: {
    level: 'FAIL',
    audit: {
      phase: 'PREPARE',
      run: (context) => {
        context.executionLog.push(`prepare:${context.generation}`)
        return context.present
          ? [{ status: 'PASS', message: 'prerequisite is present' }]
          : [{ status: 'VIOLATION', message: 'prerequisite is absent' }]
      }
    }
  },
  judgment: { prompt: 'Is the prerequisite appropriate?' }
}

const AUDIT_FALLBACK: RubricItem<TestContext> = {
  code: 'ALPHA-2',
  title: 'audit fallback',
  description: 'A conform run falls back to audit when no safe repair exists.',
  sources: ['TEST'],
  mechanical: {
    level: 'WARN',
    audit: {
      phase: 'INSPECT',
      run: (context) => {
        context.executionLog.push(`fallback:${context.generation}`)
        return [{ status: 'PASS', message: 'fallback inspection ran' }]
      }
    }
  }
}

const SECOND_AUDIT_FALLBACK: RubricItem<TestContext> = {
  code: 'ALPHA-3',
  title: 'second audit fallback',
  description: 'A second same-phase item proves item ordering across subjects.',
  sources: ['TEST'],
  mechanical: {
    level: 'WARN',
    audit: {
      phase: 'INSPECT',
      run: (context) => {
        context.executionLog.push(`fallback-two:${context.generation}`)
        return [{ status: 'PASS', message: 'second fallback inspection ran' }]
      }
    }
  }
}

const SAFE_CONFORM: RubricItem<TestContext> = {
  code: 'ALPHA-4',
  title: 'safe conform',
  description: 'A safe conform action is applied.',
  sources: ['TEST'],
  mechanical: {
    level: 'FAIL',
    audit: {
      phase: 'INSPECT',
      run: (context) => {
        context.executionLog.push(`inspect:${context.generation}`)
        return context.present
          ? [{ status: 'VIOLATION', message: 'repair is required' }]
          : [{ status: 'PASS', message: 'repair is not required' }]
      }
    },
    conform: {
      phase: 'PRIMARY',
      run: (context) => {
        context.executionLog.push(`conform:${context.generation}`)
        return [{ status: 'FIXED', message: 'safe repair was applied' }]
      }
    }
  }
}

const JUDGMENT_ONLY: RubricItem<TestContext> = {
  code: 'ALPHA-5',
  title: 'judgment only',
  description: 'A judgment-only criterion.',
  sources: ['TEST'],
  judgment: { prompt: 'Does this require judgment?' }
}

const ALPHA = defineRubricFamily<TestContext, TestContext>({
  code: 'ALPHA',
  title: 'Alpha',
  description: 'Test family.',
  standard: 'test',
  selectContext: (context) => context,
  items: [PREPARE_HYBRID, AUDIT_FALLBACK, SECOND_AUDIT_FALLBACK, SAFE_CONFORM, JUDGMENT_ONLY]
})

const rubric: RubricDefinition<TestContext> = {
  name: 'test-rubric',
  concern: 'test',
  families: [ALPHA]
}

const subject = () => ({
  familyCodes: ['ALPHA'],
  subject: 'fixture',
  context: (): TestContext => ({ generation: ++contextGeneration, present: true, executionLog })
})

const conform = runChecker({ mode: 'conform', concern: 'fixture', target: '/fixture', rubric, subjects: [subject(), subject()] })
const conformExecutionLog = executionLog.join(',')
const conformContextGeneration = contextGeneration
test('phase order → phase, family, item, then subject', () =>
  expect(conformExecutionLog).toBe('prepare:1,prepare:2,fallback:3,fallback:4,fallback-two:5,fallback-two:6,conform:7,conform:8'))
test('fresh contexts → context factory runs immediately before every execution', () => expect(conformContextGeneration).toBe(8))
test('conform fallback → missing conform execution uses audit', () =>
  expect(conform.findings.filter((finding) => finding.code === 'ALPHA-2')).toHaveLength(2))
test('safe conform → conform execution maps FIXED directly', () => expect(conform.summary.fixed).toBe(2))
test('hybrid judgment → selected judgment codes are counted once across subjects', () =>
  expect(conform.summary.judgment.unevaluated).toBe(2))
test('no judgment findings → only mechanical items emit findings', () =>
  expect(conform.findings.every((finding) => finding.code !== 'ALPHA-5')).toBe(true))

contextGeneration = 0
executionLog.length = 0
runChecker({ mode: 'audit', concern: 'fixture', target: '/fixture', rubric, subjects: [subject(), subject()] })
const auditContextGeneration = contextGeneration
test('audit contexts → each immutable subject context is created once', () => expect(auditContextGeneration).toBe(2))

test('status tracker → counts every planned mechanical item without changing the result', () => {
  const statusEvents: CheckerStatusEvent[] = []
  const result = runChecker({
    mode: 'audit',
    concern: 'fixture',
    target: '/fixture',
    rubric,
    subjects: [subject()],
    statusTracker: (event) => statusEvents.push(event)
  })
  expect(result.summary.pass).toBe(3)
  expect(statusEvents).toEqual([
    { type: 'start', mode: 'audit', completed: 0, total: 4 },
    expect.objectContaining({ type: 'item-complete', code: 'ALPHA-1', completed: 1, total: 4 }),
    expect.objectContaining({ type: 'item-complete', code: 'ALPHA-2', completed: 2, total: 4 }),
    expect.objectContaining({ type: 'item-complete', code: 'ALPHA-3', completed: 3, total: 4 }),
    expect.objectContaining({ type: 'item-complete', code: 'ALPHA-4', completed: 4, total: 4 }),
    { type: 'complete', mode: 'audit', completed: 4, total: 4 }
  ])
})

test('status tracker → ignores a broken presentation callback', () => {
  expect(() =>
    runChecker({
      mode: 'audit',
      concern: 'fixture',
      target: '/fixture',
      rubric,
      subjects: [subject()],
      statusTracker: () => {
        throw new Error('broken tracker')
      }
    })
  ).not.toThrow()
})

const jsonl = checkerJsonl(conform.records)
const parsed = parseCheckerJsonl(jsonl)
test('JSONL → one parseable object per record', () => {
  expect(parsed.errors).toHaveLength(0)
  expect(parsed.records).toHaveLength(conform.records.length)
})
test('validation → canonical response agrees with its in-memory rubric', () =>
  expect(
    validateCheckerRecords({ records: parsed.records, rubric, subjects: [subject(), subject()], exitCode: conform.exitCode })
  ).toHaveLength(0))

const badTitle = structuredClone(conform.records) as unknown[]
const firstFinding = badTitle.find((record) => (record as { record?: string }).record === 'finding') as { title: string }
firstFinding.title = 'wrong title'
test('validation → rejects title drift from the in-memory rubric', () =>
  expect(
    validateCheckerRecords({ records: badTitle, rubric, subjects: [subject()] }).some((error) => error.includes('title does not match'))
  ).toBe(true))

test('validation → rejects finding codes outside the selected rubric items', () =>
  expect(
    validateCheckerRecords({ records: conform.records, rubric, subjects: [] }).some((error) =>
      error.includes('code does not resolve in the selected rubric items')
    )
  ).toBe(true))

const badJudgment = structuredClone(conform.records) as unknown[]
const badJudgmentSummary = badJudgment.at(-1) as { summary: { judgment: Record<string, unknown> } }
badJudgmentSummary.summary.judgment.extra = 1
test('validation → rejects unknown judgment summary fields', () =>
  expect(
    validateCheckerRecords({ records: badJudgment, rubric, subjects: [subject()] }).some((error) =>
      error.includes('summary judgment has unknown field')
    )
  ).toBe(true))

type RepairState = { outcome: 'PASS' | 'VIOLATION' | 'INFO'; observedChange: boolean; resolves: boolean; calls: number }

const repairResult = ({
  outcome,
  repairOn = [],
  observedChange = true,
  resolves = true
}: {
  outcome: RepairState['outcome']
  repairOn?: readonly 'INFO'[]
  observedChange?: boolean
  resolves?: boolean
}): { result: ReturnType<typeof runChecker>; state: RepairState; events: CheckerStatusEvent[] } => {
  const state: RepairState = { outcome, observedChange, resolves, calls: 0 }
  const item: RubricItem<RepairState> = {
    code: 'REPAIR-1',
    title: 'audit-gated repair',
    description: 'A focused shared-checker repair fixture.',
    sources: ['TEST'],
    mechanical: {
      level: 'FAIL',
      audit: {
        phase: 'INSPECT',
        run: (context) => [
          context.outcome === 'PASS'
            ? { status: 'PASS' as const, message: 'clean' }
            : context.outcome === 'INFO'
              ? { status: 'INFO' as const, message: 'informational repair candidate' }
              : { status: 'VIOLATION' as const, message: 'repair required' }
        ]
      },
      repair: {
        phase: 'PRIMARY',
        run: (context) => {
          context.calls++
          if (context.resolves) context.outcome = 'PASS'
          return [{ changed: context.observedChange, message: 'repair wrote the target' }]
        }
      },
      ...(repairOn.length ? { repairOn } : {})
    }
  }
  const family = defineRubricFamily<RepairState, RepairState>({
    code: 'REPAIR',
    title: 'Repair',
    description: 'Repair transaction fixture.',
    standard: 'test',
    selectContext: (context) => context,
    items: [item]
  })
  const events: CheckerStatusEvent[] = []
  const result = runChecker({
    mode: 'conform',
    concern: 'fixture',
    target: '/fixture',
    rubric: { name: 'repair-fixture', concern: 'fixture', families: [family] },
    subjects: [{ familyCodes: ['REPAIR'], context: () => state }],
    statusTracker: (event) => events.push(event)
  })
  return { result, state, events }
}

test('audit-gated repair → a clean item skips its repair action', () => {
  const { result, state } = repairResult({ outcome: 'PASS' })
  expect(state.calls).toBe(0)
  expect(result.findings).toEqual([expect.objectContaining({ level: 'PASS', code: 'REPAIR-1' })])
})

test('audit-gated repair → a changed, repaired violation reports FIXED after post-audit', () => {
  const { result, state, events } = repairResult({ outcome: 'VIOLATION' })
  expect(state.calls).toBe(1)
  expect(result.findings).toEqual([expect.objectContaining({ level: 'FIXED', code: 'REPAIR-1' })])
  expect(events.filter((event) => event.type === 'item-complete')).toHaveLength(1)
})

test('audit-gated repair → INFO is not mutable without an explicit opt-in', () => {
  const { result, state } = repairResult({ outcome: 'INFO' })
  expect(state.calls).toBe(0)
  expect(result.findings).toEqual([expect.objectContaining({ level: 'INFO' })])
})

test('audit-gated repair → an opted-in INFO repair is verified like a violation', () => {
  const { result, state } = repairResult({ outcome: 'INFO', repairOn: ['INFO'] })
  expect(state.calls).toBe(1)
  expect(result.findings).toEqual([expect.objectContaining({ level: 'FIXED' })])
})

test('audit-gated repair → a no-op observation never claims FIXED', () => {
  const { result, state } = repairResult({ outcome: 'VIOLATION', observedChange: false })
  expect(state.calls).toBe(1)
  expect(result.findings).toEqual([expect.objectContaining({ level: 'PASS' })])
  expect(result.summary.fixed).toBe(0)
})

test('audit-gated repair → a failed post-audit remains terminally failing', () => {
  const { result } = repairResult({ outcome: 'VIOLATION', resolves: false })
  expect(result.findings).toEqual([expect.objectContaining({ level: 'FAIL' })])
})

const malformedRubric = (
  outcomes: unknown,
  phase: unknown = 'INSPECT',
  overrideLevels: readonly ('FAIL' | 'WARN')[] = []
): RubricDefinition<TestContext> =>
  ({
    name: 'malformed-rubric',
    concern: 'test',
    families: [
      defineRubricFamily<TestContext, TestContext>({
        code: 'ALPHA',
        title: 'Alpha',
        description: 'Malformed callback fixture.',
        standard: 'test',
        selectContext: (context) => context,
        items: [
          {
            code: 'ALPHA-1',
            title: 'malformed callback',
            description: 'A deliberately malformed callback.',
            sources: ['TEST'],
            mechanical: {
              level: 'FAIL',
              ...(overrideLevels.length > 0 ? { overrideLevels } : {}),
              audit: { phase, run: () => outcomes } as never
            }
          }
        ]
      })
    ]
  }) as unknown as RubricDefinition<TestContext>

const rejects = (candidate: RubricDefinition<TestContext>, fragment: string, candidateSubject = subject()): boolean => {
  try {
    runChecker({ mode: 'audit', concern: 'fixture', target: '/fixture', rubric: candidate, subjects: [candidateSubject] })
    return false
  } catch (error) {
    return error instanceof Error && error.message.includes(fragment)
  }
}

test('status tracker → terminates when an execution fails', () => {
  const events: CheckerStatusEvent[] = []
  expect(() =>
    runChecker({
      mode: 'audit',
      concern: 'fixture',
      target: '/fixture',
      rubric: malformedRubric([], 'INSPECT'),
      subjects: [subject()],
      statusTracker: (event) => events.push(event)
    })
  ).toThrow('returned no outcome')
  expect(events.at(-1)).toEqual({ type: 'failed', mode: 'audit', completed: 0, total: 1 })
})

test('planning → rejects catalogue issues and unknown phases', () => {
  expect(
    rejects(
      {
        ...rubric,
        families: [{ ...ALPHA, items: [{ ...PREPARE_HYBRID, code: 'WRONG-1' }] }]
      } as RubricDefinition<TestContext>,
      'invalid rubric catalogue'
    )
  ).toBe(true)
  expect(rejects(malformedRubric([{ status: 'PASS', message: 'ok' }], 'UNKNOWN'), 'unknown phase')).toBe(true)
})

test('execution → rejects malformed callback outcomes', () => {
  for (const [outcomes, fragment] of [
    [[], 'returned no outcome'],
    [[{ status: 'UNKNOWN', message: 'bad status' }], 'unknown status'],
    [[{ status: 'FIXED', message: 'invalid audit fix' }], 'cannot be FIXED in audit mode'],
    [[{ status: 'PASS', level: 'WARN', message: 'invalid pass level' }], 'invalid violation level'],
    [[{ status: 'VIOLATION', level: 'INFO', message: 'invalid violation level' }], 'invalid violation level'],
    [[{ status: 'PASS', message: ' ' }], 'message must be non-empty'],
    [[{ status: 'PASS', message: 'ok', subject: ' ' }], 'subject must be non-empty when present']
  ])
    expect(rejects(malformedRubric(outcomes), fragment as string)).toBe(true)
})

test('execution → a violation may override its item default level', () => {
  const result = runChecker({
    mode: 'audit',
    concern: 'fixture',
    target: '/fixture',
    rubric: malformedRubric([{ status: 'VIOLATION', level: 'WARN', message: 'warning variant' }], 'INSPECT', ['WARN']),
    subjects: [subject()]
  })
  expect({ exitCode: result.exitCode, fail: result.summary.fail, warn: result.summary.warn }).toEqual({ exitCode: 0, fail: 0, warn: 1 })
  expect(
    validateCheckerRecords({ records: result.records, rubric: malformedRubric([], 'INSPECT', ['WARN']), subjects: [subject()] })
  ).toEqual([])
})

test('execution → an undeclared violation-level override is rejected', () =>
  expect(() =>
    runChecker({
      mode: 'audit',
      concern: 'fixture',
      target: '/fixture',
      rubric: malformedRubric([{ status: 'VIOLATION', level: 'WARN', message: 'silent downgrade' }]),
      subjects: [subject()]
    })
  ).toThrow('uses an undeclared violation level'))

test('planning → rejects a blank present subject', () =>
  expect(rejects(rubric, 'subject 1 must be non-empty', { ...subject(), subject: ' ' })).toBe(true))

contextGeneration = 0
executionLog.length = 0
const auditFailure = runChecker({
  mode: 'audit',
  concern: 'fixture',
  target: '/fixture',
  rubric,
  subjects: [{ ...subject(), context: () => ({ generation: ++contextGeneration, present: false, executionLog }) }]
})
test('FAIL exit → a FAIL violation alone makes exit status non-zero', () => {
  expect(auditFailure.exitCode).toBe(1)
  expect(auditFailure.summary.fail).toBe(1)
})
test('FAIL validation → exit status agrees with emitted findings', () =>
  expect(
    validateCheckerRecords({ records: auditFailure.records, rubric, subjects: [subject()], exitCode: auditFailure.exitCode })
  ).toHaveLength(0))
