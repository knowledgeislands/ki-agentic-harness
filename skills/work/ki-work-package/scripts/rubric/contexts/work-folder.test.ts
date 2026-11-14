import { afterEach, describe, expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { AuditOutcome } from '../../shared/rubric.ts'
import { folderOutcomes, packageStray, sectionText, unlinkedChanges, workLayout } from './work-folder.ts'

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

const PACKAGE = join('work', 'ki', 'ki.reg.pilot')

const statuses = (outcomes: readonly AuditOutcome[]): string[] =>
  outcomes.map((outcome) => (outcome.status === 'VIOLATION' ? (outcome.level ?? 'VIOLATION') : outcome.status))

const index = (changes: readonly string[], state = 'with-worker'): string =>
  `---\nid: ki.reg.pilot\nstate: ${state}\n---\n# ki.reg.pilot\n\n## Now\n\nNone\n\n## Changes\n\n${
    changes.length > 0 ? changes.map((target) => `- [${target}](${target}) - in hand.`).join('\n') : 'None'
  }\n`

/** A package with one change document and the given links. */
const pkg = (root: string, changes: readonly string[] = ['10-pilot.change.md'], state?: string): string => {
  write(root, join(PACKAGE, '_index.md'), index(changes, state))
  write(root, join(PACKAGE, '10-pilot.change.md'), '# Pilot\n')
  return join(root, PACKAGE)
}

describe('the layout under work/', () => {
  test('is absent without `work/`', () => {
    expect(workLayout(fixture())).toBeUndefined()
  })

  test('finds packages and their sub-packages, each with the id its place gives it', () => {
    const root = fixture()
    pkg(root, ['10-pilot.change.md', 'viewer/'])
    write(root, join(PACKAGE, 'viewer', '_index.md'), '# ki.reg.pilot.viewer\n')
    write(root, join(PACKAGE, 'viewer', 'deep', '_index.md'), '# ki.reg.pilot.viewer.deep\n')
    const layout = workLayout(root)
    expect(layout?.violations).toEqual([])
    expect(layout?.packages.map((folder) => [folder.subject, folder.expectedId, folder.territory])).toEqual([
      ['work/ki/ki.reg.pilot', 'ki.reg.pilot', 'ki'],
      ['work/ki/ki.reg.pilot/viewer', 'ki.reg.pilot.viewer', 'ki'],
      ['work/ki/ki.reg.pilot/viewer/deep', 'ki.reg.pilot.viewer.deep', 'ki']
    ])
  })

  test('a territory folder not named by a kebab slug fails', () => {
    const root = fixture()
    write(root, join('work', 'KI_Main', 'ki.reg.pilot', '_index.md'), '# ki.reg.pilot\n')
    expect(workLayout(root)?.violations.map((outcome) => outcome.subject)).toEqual(['work/KI_Main'])
  })
})

describe('FOLDER-1 closed list', () => {
  test('a package holding only its closed list passes', () => {
    const root = fixture()
    pkg(root)
    expect(statuses(folderOutcomes(root).closed)).toEqual(['PASS'])
  })

  test('the retired package files and folders fail', () => {
    const root = fixture()
    const folder = pkg(root)
    for (const name of ['state.md', 'decisions.md', 'discussions.md', 'messages.md', 'notes.md', '1-bad.change.md'])
      write(root, join(PACKAGE, name), '# x\n')
    for (const name of ['reports/run.report.md', 'pilot/run.brief.md', 'findings/TAG.md', 'scratch/x.txt'])
      write(root, join(PACKAGE, name), '# x\n')
    expect(packageStray(folder)).toEqual([
      '1-bad.change.md',
      'decisions.md',
      'discussions.md',
      'findings/',
      'messages.md',
      'notes.md',
      'pilot/',
      'reports/',
      'scratch/',
      'state.md'
    ])
    expect(statuses(folderOutcomes(root).closed)).toEqual(['VIOLATION'])
  })

  test('a sub-package without a change document fails', () => {
    const root = fixture()
    pkg(root, ['10-pilot.change.md', 'viewer/'])
    write(root, join(PACKAGE, 'viewer', '_index.md'), '# ki.reg.pilot.viewer\n\n## Changes\n\nNone\n')
    const outcomes = folderOutcomes(root).closed
    expect(outcomes.map((outcome) => outcome.subject)).toEqual(['work/ki/ki.reg.pilot/viewer'])
    expect(outcomes[0]?.message).toContain('one or more change documents')
  })
})

describe('FOLDER-8 Changes links', () => {
  test('every change document and sub-package linked passes', () => {
    const root = fixture()
    pkg(root, ['10-pilot.change.md', './viewer/_index.md#goals'])
    write(root, join(PACKAGE, 'viewer', '_index.md'), '# v\n\n## Changes\n\n- [10](10-viewer.change.md)\n')
    write(root, join(PACKAGE, 'viewer', '10-viewer.change.md'), '# Viewer\n')
    expect(statuses(folderOutcomes(root).changes)).toEqual(['PASS'])
  })

  test('an unlinked change document or sub-package fails', () => {
    const root = fixture()
    const folder = pkg(root, [])
    write(root, join(PACKAGE, '20-more.change.md'), '# More\n')
    write(root, join(PACKAGE, 'viewer', '_index.md'), '# v\n\n## Changes\n\n- [10](10-viewer.change.md)\n')
    write(root, join(PACKAGE, 'viewer', '10-viewer.change.md'), '# Viewer\n')
    expect(unlinkedChanges(folder)).toEqual(['10-pilot.change.md', '20-more.change.md', 'viewer/'])
    expect(statuses(folderOutcomes(root).changes)).toEqual(['VIOLATION'])
  })

  test('a link outside the Changes section does not count', () => {
    const root = fixture()
    const folder = pkg(root, [])
    write(
      root,
      join(PACKAGE, '_index.md'),
      '# ki.reg.pilot\n\n## Now\n\n- [10](10-pilot.change.md)\n\n## Changes\n\nNone\n'
    )
    expect(unlinkedChanges(folder)).toEqual(['10-pilot.change.md'])
  })

  test('sectionText reads a section up to the next H2', () => {
    expect(sectionText('# a\n\n## Now\n\nx\n\n### Deep\n\ny\n\n## Held\n\nz\n', 'Now')).toBe(
      '\n\nx\n\n### Deep\n\ny\n\n'
    )
    expect(sectionText('# a\n', 'Now')).toBeUndefined()
  })
})

describe('FOLDER-4 finished packages', () => {
  test("a finished work's package is due for close-out", () => {
    const root = fixture()
    pkg(root, undefined, 'finished')
    expect(folderOutcomes(root).finished.map((outcome) => outcome.subject)).toEqual(['work/ki/ki.reg.pilot'])
  })

  test('live work passes', () => {
    const root = fixture()
    pkg(root)
    expect(statuses(folderOutcomes(root).finished)).toEqual(['PASS'])
  })
})
