import { afterEach, expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { AuditOutcome, RubricItem } from '../../shared/rubric.ts'
import { createKeystoneContext, type KeystoneContext } from '../contexts/keystone.ts'
import definition from './index.ts'

const roots: string[] = []
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
})

const repository = (skills: Record<string, string[]>): string => {
  const root = mkdtempSync(join(tmpdir(), 'ki-keystone-audit-'))
  roots.push(root)
  for (const [path, lines] of Object.entries(skills)) {
    mkdirSync(join(root, 'skills', path), { recursive: true })
    writeFileSync(
      join(root, 'skills', path, 'SKILL.md'),
      [
        '---',
        ...lines,
        '---',
        '',
        ...(path.endsWith('ki-keystone')
          ? ['<!-- ki-keystone:guild-map:start -->', '<!-- ki-keystone:guild-map:end -->', '']
          : [])
      ].join('\n')
    )
  }
  return root
}

const items = definition.families.flatMap((family) => family.items as readonly RubricItem<KeystoneContext>[])
const run = (code: string, context: KeystoneContext): readonly AuditOutcome[] => {
  const item = items.find((candidate) => candidate.code === code)
  if (!item?.mechanical) throw new Error(`${code} is not mechanical`)
  return item.mechanical.audit.run(context)
}
const statuses = (code: string, context: KeystoneContext) => run(code, context).map((outcome) => outcome.status)

test('the catalogue exposes the ordered Keystone criteria', () => {
  expect(definition.contract).toBe(1)
  expect(definition.name).toBe('ki-keystone')
  expect(definition.families.map((family) => family.code)).toEqual(['RUBRIC', 'KEYSTONE'])
  expect(items.map((item) => item.code)).toEqual([
    'RUBRIC-1',
    'KEYSTONE-1',
    'KEYSTONE-2',
    'KEYSTONE-3',
    'KEYSTONE-4',
    'KEYSTONE-5'
  ])
  expect(items.filter((item) => item.judgment && !item.mechanical).map((item) => item.code)).toEqual([
    'KEYSTONE-4',
    'KEYSTONE-5'
  ])
})

test('a repository without guilds is not applicable', () => {
  const none = createKeystoneContext(repository({}))
  const flat = createKeystoneContext(repository({ 'ki-example': ['name: ki-example'] }))
  for (const code of ['KEYSTONE-1', 'KEYSTONE-2', 'KEYSTONE-3']) {
    expect(statuses(code, none)).toEqual(['NOT_APPLICABLE'])
    expect(statuses(code, flat)).toEqual(['NOT_APPLICABLE'])
  }
})

test('an organised collection passes once every guild has one lead in Keystone and the map is current', () => {
  const root = repository({
    'keystone/ki-keystone': ['name: ki-keystone', 'ki-guild: keystone', 'ki-leads: keystone'],
    'keystone/ki-work': ['name: ki-work', 'ki-guild: keystone', 'ki-leads: work'],
    'work/ki-work-roadmap': ['name: ki-work-roadmap', 'ki-guild: work']
  })
  const stale = createKeystoneContext(root)
  expect(statuses('KEYSTONE-1', stale)).toEqual(['PASS'])
  expect(statuses('KEYSTONE-2', stale)).toEqual(['PASS'])
  expect(statuses('KEYSTONE-3', stale)).toEqual(['VIOLATION'])
})

test('a skill without a guild, a guild without a lead and a lead outside Keystone fail', () => {
  const context = createKeystoneContext(
    repository({
      'keystone/ki-keystone': ['name: ki-keystone', 'ki-guild: keystone', 'ki-leads: keystone'],
      'work/ki-work': ['name: ki-work', 'ki-guild: work', 'ki-leads: work'],
      'design/ki-design-system': ['name: ki-design-system', 'ki-guild: design'],
      'ki-loose': ['name: ki-loose']
    })
  )
  expect(run('KEYSTONE-1', context).map((outcome) => outcome.message)).toEqual(['ki-loose declares no `ki-guild`'])
  expect(run('KEYSTONE-2', context).map((outcome) => outcome.message)).toEqual([
    'guild design has no lead',
    'ki-work leads work but is not a member of keystone'
  ])
})

test('a second lead for one guild fails', () => {
  const context = createKeystoneContext(
    repository({
      'keystone/ki-keystone': ['name: ki-keystone', 'ki-guild: keystone', 'ki-leads: keystone'],
      'keystone/ki-other': ['name: ki-other', 'ki-guild: keystone', 'ki-leads: keystone']
    })
  )
  expect(run('KEYSTONE-2', context).map((outcome) => outcome.message)).toEqual([
    'guild keystone has more than one lead: ki-keystone, ki-other'
  ])
})
