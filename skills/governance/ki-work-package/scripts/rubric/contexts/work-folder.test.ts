import { afterEach, describe, expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { AuditOutcome } from '../../shared/rubric.ts'
import {
  decisionLogFindings,
  focusIds,
  focusIndexFindings,
  folderOutcomes,
  idleEmerging,
  openQueryCount,
  reportQueryTags,
  workFolderStray
} from './work-folder.ts'

const roots: string[] = []

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
})

const fixture = (): string => {
  const root = mkdtempSync(join(tmpdir(), 'ki-work-folder-'))
  roots.push(root)
  return root
}

const write = (root: string, path: string, text: string): string => {
  const file = join(root, path)
  mkdirSync(join(file, '..'), { recursive: true })
  writeFileSync(file, text)
  return file
}

const WORK = join('+', '_WORK', 'ki.ways-of-working')
const THREAD = join('+', '_THREADS', 'ways-of-working')

const statuses = (outcomes: readonly AuditOutcome[]): string[] =>
  outcomes.map((outcome) => (outcome.status === 'VIOLATION' && outcome.level ? outcome.level : outcome.status))

const queries = (...tags: string[]): string =>
  `# Run\n\n## Queries\n\n${tags.map((tag) => `### ${tag} - Which?\n\n`).join('')}\`\`\`text\n### FENCED - not a query\n\`\`\`\n`

const pkg = (root: string): string => {
  for (const name of ['_index.md', 'state.md', 'queries.md', 'messages.md', 'decisions.md'])
    write(root, join(WORK, name), `# ${name}\n`)
  return join(root, WORK)
}

describe('work folder closed list', () => {
  test('a folder holding only its closed list passes', () => {
    const root = fixture()
    pkg(root)
    write(root, join(WORK, 'reports', 'run.report.md'), '# Run\n')
    write(root, join(WORK, 'briefs', 'run.md'), '# Brief\n')
    write(root, join(WORK, 'feedback', 'review.md'), '# Feedback\n')
    write(root, join(WORK, 'design', 'model', 'model.architecture.json'), '{}\n')
    write(root, join(WORK, 'design', 'model', 'model.svg'), '<svg/>\n')
    expect(statuses(folderOutcomes(root).closed)).toEqual(['PASS'])
    write(root, join(WORK, 'discussions.md'), '# discussions.md\n')
    expect(statuses(folderOutcomes(root).closed)).toEqual(['PASS'])
  })

  // INDEX-ENTRY (Kris, 8 November 2026): the entry file is `_index.md`; `work.md` is read in its place during the
  // rollout, never beside it.
  test('a folder whose entry file is still work.md passes and is read, and one holding both fails', () => {
    const root = fixture()
    const folder = join(root, WORK)
    for (const name of ['work.md', 'state.md', 'discussions.md', 'messages.md', 'decisions.md'])
      write(root, join(WORK, name), `# ${name}\n`)
    write(root, join(WORK, 'work.md'), '# ki.ways-of-working\n\n## Focus\n\n- `layout` - the folder layout\n')
    expect(statuses(folderOutcomes(root).closed)).toEqual(['PASS'])
    expect(focusIds(folder)).toEqual(['layout'])

    write(root, join(WORK, '_index.md'), '# ki.ways-of-working\n\n## Focus\n\n- `roles` - the role model\n')
    expect(focusIds(folder)).toEqual(['roles'])
    const closed = folderOutcomes(root).closed
    expect(statuses(closed)).toEqual(['VIOLATION'])
    expect(closed[0]?.message).toContain('one entry file')
  })

  test('reports/ holds only run reports, and a top-level report warns during the tolerance window', () => {
    const root = fixture()
    const folder = pkg(root)
    write(root, join(WORK, 'reports', 'run.report.md'), '# Run\n')
    write(root, join(WORK, 'reports', 'notes.md'), 'notes\n')
    expect(workFolderStray(folder)).toEqual(['reports/notes.md'])
    expect(statuses(folderOutcomes(root).closed)).toEqual(['VIOLATION'])

    const loose = fixture()
    pkg(loose)
    write(loose, join(WORK, 'old.report.md'), '# Run\n')
    const outcomes = folderOutcomes(loose).closed
    expect(statuses(outcomes)).toEqual(['WARN'])
    expect(outcomes[0]?.message).toEndWith('stray until the sweep: old.report.md')
  })

  test('per-tag findings pass FOLDER-1 while nested and non-Markdown findings fail', () => {
    const root = fixture()
    const folder = pkg(root)
    write(root, join(WORK, 'findings', 'FINDINGS-SECTION.md'), '### FINDINGS-SECTION - Findings retention\n')
    write(root, join(WORK, 'findings', 'QUERY-RULES.md'), '### QUERY-RULES - Query rules\n')
    expect(workFolderStray(folder)).toEqual([])
    expect(statuses(folderOutcomes(root).closed)).toEqual(['PASS'])

    write(root, join(WORK, 'findings', 'out.log'), 'temporary output')
    write(root, join(WORK, 'findings', 'nested', 'FINDINGS-SECTION.md'), 'nested finding')
    expect(workFolderStray(folder)).toEqual(['findings/nested/', 'findings/out.log'])
    expect(statuses(folderOutcomes(root).closed)).toEqual(['VIOLATION'])
  })

  test('a stray file or folder fails, naming each', () => {
    const root = fixture()
    const folder = pkg(root)
    write(root, join(WORK, 'notes.txt'), 'scratch\n')
    write(root, join(WORK, 'tmp', 'out.log'), 'log\n')
    write(root, join(WORK, 'briefs', 'shot.png'), 'png\n')
    write(root, join(WORK, 'design', 'probe.ts'), 'code\n')
    expect(workFolderStray(folder)).toEqual(['briefs/shot.png', 'design/probe.ts', 'notes.txt', 'tmp/'])
    const outcomes = folderOutcomes(root).closed
    expect(statuses(outcomes)).toEqual(['VIOLATION'])
    expect(outcomes[0]?.subject).toBe(WORK)
  })

  test('a thread folder warns as legacy, naming its strays', () => {
    const root = fixture()
    write(root, join(THREAD, 'decisions.md'), '# Decisions\n')
    write(root, join(THREAD, 'brief.md'), 'brief\n')
    const outcomes = folderOutcomes(root).closed
    expect(statuses(outcomes)).toEqual(['WARN', 'WARN'])
    expect(outcomes[0]?.message).toEndWith('outside the closed list: brief.md')
  })

  test('no work or thread folder is not applicable', () => {
    const outcomes = folderOutcomes(fixture())
    expect(statuses(outcomes.closed)).toEqual(['NOT_APPLICABLE'])
    expect(statuses(outcomes.briefs)).toEqual(['NOT_APPLICABLE'])
    expect(statuses(outcomes.review)).toEqual(['NOT_APPLICABLE'])
  })
})

const FOCUS_WORK = `# ki.ways-of-working

## Goals

Goals.

## Scope

Scope.

## Focus

Each focus area has an id, which is also its folder.

1. \`layout\` — work package layout.
2. \`_emerging\` — anything else.
`

describe('focus folders', () => {
  test("_index.md's Focus section declares its ids, each leading its list item as a code span", () => {
    const root = fixture()
    const folder = pkg(root)
    write(root, join(WORK, '_index.md'), FOCUS_WORK)
    expect(focusIds(folder)).toEqual(['layout', '_emerging'])
    write(root, join(WORK, '_index.md'), '# ki.ways-of-working\n\n## Goals\n\n- `layout` is not a focus\n')
    expect(focusIds(folder)).toEqual([])
  })

  test('a declared focus folder holds briefs, reports and design notes; an undeclared folder fails', () => {
    const root = fixture()
    const folder = pkg(root)
    write(root, join(WORK, '_index.md'), FOCUS_WORK)
    write(root, join(WORK, 'layout', 'pilot.brief.md'), '# Brief\n')
    write(root, join(WORK, 'layout', 'pilot.report.md'), '# Run\n')
    write(root, join(WORK, 'layout', 'options.md'), '# Options\n')
    write(root, join(WORK, 'layout', 'model', 'model.svg'), '<svg/>\n')
    write(root, join(WORK, 'layout', '_index.md'), '# Layout\n')
    write(root, join(WORK, '_emerging', 'notes.md'), '# Notes\n')
    write(root, join(WORK, '_emerging', '_index.md'), '# Emerging\n')
    expect(workFolderStray(folder)).toEqual([])
    expect(statuses(folderOutcomes(root).closed)).toEqual(['PASS'])

    write(root, join(WORK, 'layout', 'probe.ts'), 'code\n')
    write(root, join(WORK, 'async', 'notes.md'), '# Notes\n')
    expect(workFolderStray(folder)).toEqual(['async/', 'layout/probe.ts'])
    expect(statuses(folderOutcomes(root).closed)).toEqual(['VIOLATION'])
  })

  test('type folders beside declared focus areas warn for the tolerance window, and pass without them', () => {
    const root = fixture()
    pkg(root)
    write(root, join(WORK, 'reports', 'run.report.md'), '# Run\n')
    write(root, join(WORK, 'design', 'note.md'), '# Note\n')
    expect(statuses(folderOutcomes(root).closed)).toEqual(['PASS'])
    write(root, join(WORK, '_index.md'), FOCUS_WORK)
    write(root, join(WORK, '_emerging', 'notes.md'), '# Notes\n')
    write(root, join(WORK, '_emerging', '_index.md'), '# Emerging\n')
    const outcomes = folderOutcomes(root).closed
    expect(statuses(outcomes)).toEqual(['WARN'])
    expect(outcomes[0]?.message).toContain('`design/`, `reports/`')
  })

  test('under EMERGING-ONLY-WHEN-USED a listed _emerging warns while it holds nothing', () => {
    const root = fixture()
    const folder = pkg(root)
    write(root, join(WORK, '_index.md'), FOCUS_WORK)
    expect(idleEmerging(folder)).toBe(true)
    const outcomes = folderOutcomes(root).closed
    expect(statuses(outcomes)).toEqual(['WARN'])
    expect(outcomes[0]?.message).toContain('lists `_emerging` while it holds nothing')
    write(root, join(WORK, 'messages.md'), '# Messages\n\n- focus: _emerging · ASK · a side ask\n')
    expect(idleEmerging(folder)).toBe(false)
    write(root, join(WORK, 'messages.md'), '# Messages\n\nNone.\n')
    write(root, join(WORK, '_emerging', '_index.md'), '# Emerging\n')
    expect(idleEmerging(folder)).toBe(true)
    write(root, join(WORK, '_emerging', 'notes.md'), '# Notes\n')
    expect(idleEmerging(folder)).toBe(false)
    expect(statuses(folderOutcomes(root).closed)).toEqual(['PASS'])
  })

  test('under INDEX-NAME a focus folder holding something without _index.md warns, index.md named', () => {
    const root = fixture()
    const folder = pkg(root)
    write(root, join(WORK, '_index.md'), FOCUS_WORK)
    write(root, join(WORK, 'layout', 'index.md'), '# Layout\n')
    write(root, join(WORK, '_emerging', 'notes.md'), '# Notes\n')
    expect(focusIndexFindings(folder)).toEqual(['layout/index.md', '_emerging/'])
    const outcomes = folderOutcomes(root).closed
    expect(statuses(outcomes)).toEqual(['WARN'])
    expect(outcomes[0]?.message).toContain('starts with `_index.md`')
    write(root, join(WORK, 'layout', '_index.md'), '# Layout\n')
    write(root, join(WORK, '_emerging', '_index.md'), '# Emerging\n')
    expect(focusIndexFindings(folder)).toEqual([])
  })

  test('FOLDER-2 and FOLDER-3 look inside focus folders', () => {
    const root = fixture()
    pkg(root)
    write(root, join(WORK, '_index.md'), FOCUS_WORK)
    write(root, join(WORK, 'decisions.md'), '# Decisions\n\n- PMO-CI answered\n')
    write(root, join(WORK, 'layout', 'pilot.report.md'), queries('PMO-CI'))
    write(root, join(WORK, 'layout', 'pilot.brief.md'), '# Brief\n')
    write(root, join(WORK, '_emerging', 'early.brief.md'), '# Brief\n')
    write(root, join(WORK, 'reports', 'early.report.md'), queries('OPEN-ONE'))
    write(root, join(WORK, '_emerging', 'open.brief.md'), '# Brief\n')
    const outcomes = folderOutcomes(root)
    expect(outcomes.answered[0]?.message).toEndWith(': layout/pilot.report.md')
    expect(outcomes.briefs[0]?.message).toEndWith(': layout/pilot.brief.md, _emerging/early.brief.md')
  })

  test('under HOLD-TIDY a folder On hold that keeps dealt-with reports or briefs fails rather than warns', () => {
    const root = fixture()
    pkg(root)
    write(root, join(WORK, '_index.md'), FOCUS_WORK)
    write(root, join(WORK, 'decisions.md'), '# Decisions\n\n- PMO-CI answered\n')
    write(root, join(WORK, 'layout', 'pilot.report.md'), queries('PMO-CI'))
    write(root, join(WORK, 'layout', 'pilot.brief.md'), '# Brief\n')
    expect(folderOutcomes(root).answered[0]?.level).toBeUndefined()
    write(root, join(WORK, 'state.md'), '---\nid: ki.ways-of-working\nstate: on-hold\n---\n# state\n')
    const outcomes = folderOutcomes(root)
    expect(statuses(outcomes.answered)).toEqual(['FAIL'])
    expect(statuses(outcomes.briefs)).toEqual(['FAIL'])
    expect(outcomes.answered[0]?.message).toStartWith('work On hold keeps nothing already dealt with')
  })
})

describe('work folder tidy', () => {
  test('query tags come from Queries headings, linked or not, never fenced', () => {
    expect(reportQueryTags(queries('PMO-CI', '[THREADS-TRIM](/x.md)'))).toEqual(['PMO-CI', 'THREADS-TRIM'])
    expect(reportQueryTags('# Run\n\n## Done\n\n### NOT-A-QUERY - x\n')).toEqual([])
    expect(reportQueryTags(queries('PMO-CI').replace('## Queries', '## Discussion'))).toEqual(['PMO-CI'])
  })

  test('a report whose queries the log answers, or which has none, is listed', () => {
    const root = fixture()
    pkg(root)
    write(root, join(WORK, 'decisions.md'), '# Decisions\n\n- PMO-CI and THREADS-TRIM answered\n')
    write(root, join(WORK, 'reports', 'answered.report.md'), queries('PMO-CI', 'THREADS-TRIM'))
    write(root, join(WORK, 'quiet.report.md'), '# Run\n\n## Queries\n\nNo outstanding queries\n')
    write(root, join(WORK, 'reports', 'partial.report.md'), queries('PMO-CI', 'PMO-CIX'))
    const outcomes = folderOutcomes(root).answered
    expect(statuses(outcomes)).toEqual(['VIOLATION'])
    expect(outcomes[0]?.message).toEndWith(': reports/answered.report.md, quiet.report.md')
  })

  test("a brief whose run's report is received is listed", () => {
    const root = fixture()
    pkg(root)
    write(root, join(WORK, 'briefs', 'done.md'), '# Brief\n')
    write(root, join(WORK, 'briefs', 'open.md'), '# Brief\n')
    write(root, join(WORK, 'briefs', 'old.md'), '# Brief\n')
    write(root, join(WORK, 'reports', 'done.report.md'), queries('OPEN-ONE'))
    write(root, join(WORK, 'old.report.md'), queries('OPEN-ONE'))
    const outcomes = folderOutcomes(root).briefs
    expect(statuses(outcomes)).toEqual(['VIOLATION'])
    expect(outcomes[0]?.message).toEndWith(': briefs/done.md, briefs/old.md')
  })

  test('every finished work folder is listed, whatever its mark', () => {
    const root = fixture()
    pkg(root)
    const state = (fields: string): string => write(root, join(WORK, 'state.md'), `---\n${fields}\n---\n\n# State\n`)
    state("state: 'finished'\nsince: '2026-10-19T10:00'\nmark: '2026-10-19T09:00'")
    expect(statuses(folderOutcomes(root).finished)).toEqual(['VIOLATION'])
    state("state: 'finished'\nsince: '2026-10-19T10:00'")
    expect(statuses(folderOutcomes(root).finished)).toEqual(['VIOLATION'])
    state("state: 'finished'\nsince: '2026-10-19T10:00'\nmark: '2026-10-19T11:00'")
    expect(statuses(folderOutcomes(root).finished)).toEqual(['VIOLATION'])
    state("state: 'with-worker'\nsince: '2026-10-19T10:00'\nmark: '2026-10-19T11:00'")
    expect(statuses(folderOutcomes(root).finished)).toEqual(['PASS'])
  })

  test('an unindexed review folder and an orphaned index line are listed', () => {
    const root = fixture()
    pkg(root)
    write(root, join('+', '_WORK_REVIEW', 'README.md'), '# Review\n\n- [[ki.held]] - why\n- `ki.gone/` - why\n')
    write(root, join('+', '_WORK_REVIEW', 'ki.held', '_index.md'), '# Held\n')
    write(root, join('+', '_WORK_REVIEW', 'ki.stray', '_index.md'), '# Stray\n')
    const outcomes = folderOutcomes(root).review
    expect(statuses(outcomes)).toEqual(['VIOLATION', 'VIOLATION'])
    expect(outcomes[0]?.message).toEndWith(': ki.stray')
    expect(outcomes[1]?.message).toEndWith(': ki.gone')
  })

  test('more than eight open queries is listed', () => {
    const root = fixture()
    const folder = pkg(root)
    const open = (count: number): string =>
      `# Queries\n\n## Open\n\n${Array.from({ length: count }, (_, n) => `### Q${n} - Which?\n\n`).join('')}## Parked\n\n### PARKED - x\n`
    write(root, join(WORK, 'queries.md'), open(8))
    expect(openQueryCount(folder)).toBe(8)
    expect(statuses(folderOutcomes(root).queries)).toEqual(['PASS'])
    write(root, join(WORK, 'queries.md'), open(9))
    expect(statuses(folderOutcomes(root).queries)).toEqual(['VIOLATION'])
    write(root, join(WORK, 'discussions.md'), open(8))
    expect(openQueryCount(folder)).toBe(8)
    expect(statuses(folderOutcomes(root).queries)).toEqual(['PASS'])
    write(root, join(WORK, 'discussions.md'), open(9))
    expect(folderOutcomes(root).queries[0]?.message).toContain('`discussions.md`')
  })
})

describe('decisions-log entries', () => {
  test('timestamped, dated, numbered and free-text headings all read, and a None log is clean', () => {
    const log =
      '# Decisions\n\n## 2026-10-20 00:31 BST - WOW-RESUME\n\n- taken\n\n## 2026-10-19 WAVE-1\n\n## Decision 3 (2026-10-14)\n\n## Standing push authorities\n'
    expect(decisionLogFindings(log)).toEqual([])
    expect(decisionLogFindings('# Decisions\n\nNone\n')).toEqual([])
    expect(decisionLogFindings('# Decisions\n\nStruck at the last mark; Git holds the rest.\n\n## A\n')).toEqual([])
  })

  test('entry-shaped lines before the first heading, empty and repeated headings are named', () => {
    const log =
      '# Decisions\n\n- PILOT-GO · Kris: build it\n### LATE - c)\n\n## \n\n## 2026-10-20 BST - SAME\n\n## 2026-10-20 BST - SAME\n'
    const findings = decisionLogFindings(log)
    expect(findings).toHaveLength(3)
    expect(findings[0]).toContain('2 entry-shaped line(s)')
    expect(findings[1]).toContain('1 `## ` heading(s) with no text')
    expect(findings[2]).toContain('`## 2026-10-20 BST - SAME`')
  })

  test('a fenced block is skipped', () => {
    expect(decisionLogFindings('# Decisions\n\n```text\n- not an entry\n## nor a heading\n```\n\n## A\n')).toEqual([])
  })

  test('a log the gate cannot read warns, in work and thread folders alike', () => {
    const root = fixture()
    pkg(root)
    expect(statuses(folderOutcomes(root).decisions)).toEqual(['PASS'])
    write(root, join(WORK, 'decisions.md'), '# Decisions\n\n- 2026-10-18 · PUSH-ALL · Kris: push\n')
    write(root, join(THREAD, 'decisions.md'), '# Decisions\n\n## A\n\n## A\n')
    const outcomes = folderOutcomes(root).decisions
    expect(statuses(outcomes)).toEqual(['VIOLATION', 'VIOLATION'])
    expect(outcomes.map((outcome) => outcome.subject)).toEqual([
      join(WORK, 'decisions.md'),
      join(THREAD, 'decisions.md')
    ])
  })

  test('no work or thread folder is not applicable', () => {
    expect(statuses(folderOutcomes(fixture()).decisions)).toEqual(['NOT_APPLICABLE'])
  })
})
