import { afterEach, describe, expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { AuditOutcome } from '../../shared/rubric.ts'
import { folderOutcomes, openQueryCount, reportQueryTags, workFolderStray } from './work-folder.ts'

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
  for (const name of ['work.md', 'state.md', 'queries.md', 'messages.md', 'decisions.md'])
    write(root, join(WORK, name), `# ${name}\n`)
  return join(root, WORK)
}

describe('work folder closed list', () => {
  test('a folder holding only its closed list passes', () => {
    const root = fixture()
    pkg(root)
    write(root, join(WORK, 'run.report.md'), '# Run\n')
    write(root, join(WORK, 'briefs', 'run.md'), '# Brief\n')
    write(root, join(WORK, 'feedback', 'review.md'), '# Feedback\n')
    write(root, join(WORK, 'design', 'model', 'model.architecture.json'), '{}\n')
    write(root, join(WORK, 'design', 'model', 'model.svg'), '<svg/>\n')
    expect(statuses(folderOutcomes(root).closed)).toEqual(['PASS'])
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

describe('work folder tidy', () => {
  test('query tags come from Queries headings, linked or not, never fenced', () => {
    expect(reportQueryTags(queries('PMO-CI', '[THREADS-TRIM](/x.md)'))).toEqual(['PMO-CI', 'THREADS-TRIM'])
    expect(reportQueryTags('# Run\n\n## Done\n\n### NOT-A-QUERY - x\n')).toEqual([])
  })

  test('a report whose queries the log answers, or which has none, is listed', () => {
    const root = fixture()
    pkg(root)
    write(root, join(WORK, 'decisions.md'), '# Decisions\n\n- PMO-CI and THREADS-TRIM answered\n')
    write(root, join(WORK, 'answered.report.md'), queries('PMO-CI', 'THREADS-TRIM'))
    write(root, join(WORK, 'quiet.report.md'), '# Run\n\n## Queries\n\nNo outstanding queries\n')
    write(root, join(WORK, 'partial.report.md'), queries('PMO-CI', 'PMO-CIX'))
    const outcomes = folderOutcomes(root).answered
    expect(statuses(outcomes)).toEqual(['VIOLATION'])
    expect(outcomes[0]?.message).toEndWith(': answered.report.md, quiet.report.md')
  })

  test("a brief whose run's report is received is listed", () => {
    const root = fixture()
    pkg(root)
    write(root, join(WORK, 'briefs', 'done.md'), '# Brief\n')
    write(root, join(WORK, 'briefs', 'open.md'), '# Brief\n')
    write(root, join(WORK, 'done.report.md'), queries('OPEN-ONE'))
    const outcomes = folderOutcomes(root).briefs
    expect(statuses(outcomes)).toEqual(['VIOLATION'])
    expect(outcomes[0]?.message).toEndWith(': briefs/done.md')
  })

  test('finished work outliving its closing mark is listed', () => {
    const root = fixture()
    pkg(root)
    const state = (fields: string): string => write(root, join(WORK, 'state.md'), `---\n${fields}\n---\n\n# State\n`)
    state("state: 'finished'\nsince: '2026-10-19T10:00'\nmark: '2026-10-19T09:00'")
    expect(statuses(folderOutcomes(root).finished)).toEqual(['PASS'])
    state("state: 'finished'\nsince: '2026-10-19T10:00'\nmark: '2026-10-19T11:00'")
    expect(statuses(folderOutcomes(root).finished)).toEqual(['VIOLATION'])
    state("state: 'with-worker'\nsince: '2026-10-19T10:00'\nmark: '2026-10-19T11:00'")
    expect(statuses(folderOutcomes(root).finished)).toEqual(['PASS'])
  })

  test('an unindexed review folder and an orphaned index line are listed', () => {
    const root = fixture()
    pkg(root)
    write(root, join('+', '_WORK_REVIEW', 'README.md'), '# Review\n\n- [[ki.held]] - why\n- `ki.gone/` - why\n')
    write(root, join('+', '_WORK_REVIEW', 'ki.held', 'work.md'), '# Held\n')
    write(root, join('+', '_WORK_REVIEW', 'ki.stray', 'work.md'), '# Stray\n')
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
  })
})
