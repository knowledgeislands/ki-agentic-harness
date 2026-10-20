import { expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { inspectRoadmapAreas, matchesRoadmapArea } from './roadmap-areas.ts'

test('Streams carries a byte-identical declared copy of the shared area checks', () => {
  const provider = readFileSync(resolve(import.meta.dir, 'roadmap-areas.ts'))
  const consumer = resolve(import.meta.dir, '../../../../repo-structure/ki-repo-kb-streams')
  expect(readFileSync(resolve(consumer, 'scripts/shared/roadmap-areas.ts'))).toEqual(provider)
  expect(readFileSync(resolve(consumer, 'SKILL.md'), 'utf8')).toContain('ki-work-roadmap:roadmap-areas')
})

test('rejects malformed or retired area declarations', () => {
  for (const value of [
    null,
    {},
    [],
    ['GOV', 'GOV'],
    ['gov'],
    { gov: 'Governance' },
    { GOV: 'company-record' },
    { GOV: '' }
  ])
    expect(inspectRoadmapAreas(value).error).toBeDefined()
})

test('preserves repository-wide and legacy issuing modes', () => {
  expect(inspectRoadmapAreas(undefined)).toEqual({ areas: new Map(), legacy: false })
  expect(inspectRoadmapAreas(['GOV'])).toEqual({ areas: new Map([['GOV', undefined]]), legacy: true })
  expect(matchesRoadmapArea('TEST-001', undefined, { repoCode: 'TEST', areas: new Map() })).toBe(true)
  expect(matchesRoadmapArea('TEST-GOV-001', 'GOV', { repoCode: 'TEST', areas: new Map() })).toBe(false)
})
