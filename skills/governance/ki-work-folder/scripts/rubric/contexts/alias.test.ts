import { expect, test } from 'bun:test'
import { tmpdir } from 'node:os'
import { ALIAS } from '../items/alias.ts'
import { createWorkFolderAliasSession } from './alias.ts'

const outcomes = (configuration: Readonly<Record<string, unknown>> | undefined) => {
  const session = createWorkFolderAliasSession({
    mode: 'audit',
    repository: tmpdir(),
    userHome: tmpdir(),
    configuration: configuration as Readonly<Record<string, unknown>>
  })
  const context = session.subjects[0]?.context()
  if (!context) throw new Error('ki-work-folder session did not expose its subject')
  const item = ALIAS.items[0]
  if (!item?.mechanical) throw new Error('ALIAS-1 mechanical item is missing')
  return { level: item.mechanical.level, outcomes: item.mechanical.audit.run(ALIAS.selectContext(context)) }
}

test('the deprecated declaration warns and names ki-work-package', () => {
  const { level, outcomes: found } = outcomes({})

  expect(level).toBe('WARN')
  expect(found).toEqual([
    expect.objectContaining({ status: 'VIOLATION', message: expect.stringContaining('[skills.ki-work-package]') })
  ])
})

test('without the declaration the alias does not apply', () => {
  expect(outcomes(undefined).outcomes[0]?.status).toBe('NOT_APPLICABLE')
})
