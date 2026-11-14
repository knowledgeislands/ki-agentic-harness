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

const PACKAGE = join('work', 'ki', 'ki.reg.held')

describe('FOLDER family levels', () => {
  test('every outcome level is one its item declares', () => {
    const root = mkdtempSync(join(tmpdir(), 'ki-folder-levels-'))
    roots.push(root)
    write(root, join(PACKAGE, '_index.md'), '---\nid: ki.reg.held\nstate: finished\n---\n# ki.reg.held\n')
    write(root, join(PACKAGE, '10-held.change.md'), '# Held\n')
    write(root, join(PACKAGE, 'state.md'), '# state\n')
    const outcomes = folderOutcomes(root)
    const found = FOLDER.items.flatMap(({ code, mechanical }) => {
      if (!mechanical) return []
      const declared = [mechanical.level, ...(mechanical.overrideLevels ?? [])]
      return mechanical.audit
        .run(outcomes)
        .flatMap((outcome) =>
          outcome.status === 'VIOLATION'
            ? [{ code, declared: declared.includes(outcome.level ?? mechanical.level) }]
            : []
        )
    })
    expect(found.map(({ code }) => code)).toEqual(['FOLDER-1', 'FOLDER-4', 'FOLDER-8'])
    expect(found.filter(({ declared }) => !declared)).toEqual([])
  })
})
