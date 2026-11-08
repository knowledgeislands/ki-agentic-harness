import { afterEach, describe, expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { folderOutcomes } from '../contexts/work-folder.ts'
import { FOLDER } from './folder.ts'

const roots: string[] = []

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
})

const write = (root: string, path: string, text: string): void => {
  const file = join(root, path)
  mkdirSync(join(file, '..'), { recursive: true })
  writeFileSync(file, text)
}

const WORK = join('+', '_WORK', 'ki.held')

describe('FOLDER family levels', () => {
  test('every outcome level, including HOLD-TIDY failures, is one its item declares', () => {
    const root = mkdtempSync(join(tmpdir(), 'ki-folder-levels-'))
    roots.push(root)
    for (const name of ['_index.md', 'queries.md', 'messages.md']) write(root, join(WORK, name), `# ${name}\n`)
    write(root, join(WORK, 'state.md'), '---\nid: ki.held\nstate: on-hold\n---\n# state\n')
    write(root, join(WORK, 'decisions.md'), '# Decisions\n\n- PMO-CI answered\n')
    write(root, join(WORK, 'reports', 'pilot.report.md'), '# Run\n\n## Queries\n\n### PMO-CI - Which?\n')
    write(root, join(WORK, 'briefs', 'pilot.md'), '# Brief\n')
    const outcomes = folderOutcomes(root)
    const levels = FOLDER.items.flatMap(({ code, mechanical }) => {
      if (!mechanical) return []
      const declared = [mechanical.level, ...(mechanical.overrideLevels ?? [])]
      return mechanical.audit
        .run(outcomes)
        .flatMap((outcome) =>
          outcome.status === 'VIOLATION' && outcome.level ? [{ code, declared: declared.includes(outcome.level) }] : []
        )
    })
    expect(levels.filter(({ code }) => code === 'FOLDER-2' || code === 'FOLDER-3').length).toBe(2)
    expect(levels.filter(({ declared }) => !declared)).toEqual([])
  })
})
