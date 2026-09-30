import { expect, test } from 'bun:test'
import type { RubricItem } from '../../shared/rubric.ts'
import catalogue from './index.ts'

const items = catalogue.families.flatMap((family) => family.items as readonly RubricItem<unknown>[])

test('Paperclip coordination keeps relationship criteria judgment-led', () => {
  expect(catalogue.name).toBe('ki-agent-coordination-paperclip')
  expect(items.map((item) => item.code)).toEqual([
    'COORD-1',
    'COORD-2',
    'COORD-3',
    'COORD-4',
    'COORD-5',
    'COORD-6',
    'COORD-7',
    'COORD-8',
    'COORD-9',
    'COORD-10',
    'COORD-11',
    'COORD-12',
    'COORD-13',
    'COORD-14',
    'ORG-1',
    'RUBRIC-1'
  ])
  expect(items.every((item) => !item.mechanical || ['ORG-1', 'RUBRIC-1'].includes(item.code))).toBe(true)
})

test('the roadmap write locus is assessed separately from workspace isolation', () => {
  const locus = items.find((candidate) => candidate.code === 'COORD-8')
  const metadata = `${locus?.description}\n${locus?.judgment?.prompt}`

  expect(locus?.sources).toContain('standards-agent-coordination-paperclip.md#roadmap-records-are-the-exception')
  expect(metadata).toContain('designated primary checkout')
  expect(metadata).toContain('isolated worktree')
  expect(metadata).toContain('both write boundaries')
})

test('workspace retirement distinguishes the automatic sweep from warned early close', () => {
  const retirement = items.find((candidate) => candidate.code === 'COORD-9')
  const metadata = `${retirement?.description}\n${retirement?.judgment?.prompt}`

  expect(retirement?.sources).toContain('standards-agent-coordination-paperclip.md#workspace-retirement')
  expect(metadata).toContain('automatic sweep')
  expect(metadata).toContain('early close')
  expect(metadata).toContain('explicit authority')
})

test('runtime replacement preserves repository continuity and authority without promising self-containment', () => {
  const replacement = items.find((candidate) => candidate.code === 'COORD-12')
  const metadata = `${replacement?.description}\n${replacement?.judgment?.prompt}`

  expect(replacement?.sources).toContain('standards-agent-coordination-paperclip.md#replaceable-coordination')
  expect(metadata).toContain('declared dependencies verified')
  expect(metadata).toContain('without Paperclip task UI or agent memory')
  expect(metadata).toContain('holds')
  expect(metadata).toContain('without copying secrets')
  expect(metadata).toContain('permission to repeat in-flight work')
})

test('routine review includes canonical definitions, independent acceptance and activation decisions', () => {
  const recurring = items.find((candidate) => candidate.code === 'COORD-13')
  const metadata = `${recurring?.description}\n${recurring?.judgment?.prompt}`

  expect(recurring?.sources).toContain('standards-existing-estate-onboarding.md#reconcile-recurring-obligations')
  expect(metadata).toContain('one appropriate repository definition')
  expect(metadata).toContain('home-project ownership')
  expect(metadata).toContain('one active run and independent acceptance')
  expect(metadata).toContain('schedule, timezone and budget before activation')
})
