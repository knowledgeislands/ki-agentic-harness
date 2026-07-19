import { afterEach, expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, realpathSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createSkillEducationPlan } from './educator.ts'

const temporaryDirectories: string[] = []

const fixture = (): { source: string; target: string } => {
  const root = realpathSync(mkdtempSync(join(tmpdir(), 'ki-educator-plan-')))
  temporaryDirectories.push(root)
  const source = join(root, 'ki-example')
  const target = join(root, 'target')
  mkdirSync(join(source, 'scripts', 'rubric'), { recursive: true })
  mkdirSync(join(source, 'scripts', 'vendored', 'ki-bootstrap'), { recursive: true })
  mkdirSync(target)
  writeFileSync(join(source, 'SKILL.md'), '---\nname: ki-example\n---\n\n# Example\n')
  for (const script of ['audit.ts', 'conform.ts', 'educate.ts']) writeFileSync(join(source, 'scripts', script), 'export {}\n')
  writeFileSync(join(source, 'scripts', 'rubric', 'index.ts'), 'export {}\n')
  writeFileSync(join(source, 'scripts', 'vendored', 'ki-bootstrap', 'educator.ts'), 'export {}\n')
  return { source, target }
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) rmSync(directory, { recursive: true, force: true })
})

test('plans one offline educator snapshot and one checker projection for a skill', () => {
  const { source, target } = fixture()
  const plan = createSkillEducationPlan({ skill: 'ki-example', source, target, dryRun: true })

  expect(plan).toMatchObject({ skill: 'ki-example', source, target, dryRun: true })
  expect(plan.units.map(({ owner, destination }) => [owner, destination])).toEqual([
    ['educator', join(target, '.ki-meta', 'educators', 'ki-example')],
    ['checker', join(target, '.ki-meta', 'checkers', 'ki-example', 'SKILL.md')],
    ['checker', join(target, '.ki-meta', 'checkers', 'ki-example', 'scripts', 'audit.ts')],
    ['checker', join(target, '.ki-meta', 'checkers', 'ki-example', 'scripts', 'conform.ts')],
    ['checker', join(target, '.ki-meta', 'checkers', 'ki-example', 'scripts', 'rubric')],
    ['checker', join(target, '.ki-meta', 'checkers', 'ki-example', 'scripts', 'vendored')]
  ])
})

test('rejects a source whose declared skill name differs', () => {
  const { source, target } = fixture()
  expect(() => createSkillEducationPlan({ skill: 'ki-other', source, target })).toThrow('does not declare ki-other')
})

test('rejects a skill without all three mechanical mode entrypoints', () => {
  const { source, target } = fixture()
  rmSync(join(source, 'scripts', 'educate.ts'))
  expect(() => createSkillEducationPlan({ skill: 'ki-example', source, target })).toThrow('does not provide scripts/educate.ts')
})
