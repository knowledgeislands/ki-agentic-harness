import { expect, test } from 'bun:test'
import definition from './index.ts'

test('the catalogue exposes the ordered D12 criteria', () => {
  expect(definition.contract).toBe(1)
  expect(definition.name).toBe('ki-dodecakrisis')
  expect(definition.createSession).toBeFunction()
  expect(definition.families.map((family) => family.code)).toEqual(['CONFIG', 'RULES', 'MAILBOX', 'LEARN', 'RUBRIC'])
  expect(
    definition.families
      .filter((family) => family.code !== 'RUBRIC')
      .flatMap((family) => family.items.map((item) => item.code))
  ).toEqual([
    'CONFIG-1',
    'CONFIG-2',
    'CONFIG-3',
    'RULES-1',
    'RULES-2',
    'RULES-3',
    'RULES-4',
    'MAILBOX-1',
    'MAILBOX-2',
    'MAILBOX-3',
    'LEARN-1',
    'LEARN-2'
  ])
})

test('mailbox practice is judgment alone, since the repository audit cannot see a mailbox', () => {
  const mailbox = definition.families.find((family) => family.code === 'MAILBOX')
  const items = (mailbox?.items ?? []) as readonly { mechanical?: unknown; judgment?: unknown }[]
  expect(items).toHaveLength(3)
  expect(items.every((item) => item.mechanical === undefined && item.judgment !== undefined)).toBe(true)
})
