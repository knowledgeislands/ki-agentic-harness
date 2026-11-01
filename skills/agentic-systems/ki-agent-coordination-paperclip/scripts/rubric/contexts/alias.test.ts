import { expect, test } from 'bun:test'
import { tmpdir } from 'node:os'
import { ALIAS } from '../items/alias.ts'
import { createPaperclipAliasSession } from './alias.ts'

const outcomes = (configuration: Readonly<Record<string, unknown>> | undefined) => {
  const session = createPaperclipAliasSession({
    mode: 'audit',
    repository: tmpdir(),
    userHome: tmpdir(),
    configuration: configuration as Readonly<Record<string, unknown>>
  })
  const context = session.subjects[0]?.context()
  if (!context) throw new Error('ki-agent-coordination-paperclip session did not expose its subject')
  const item = ALIAS.items[0]
  if (!item?.mechanical) throw new Error('ALIAS-1 mechanical item missing')
  return { level: item.mechanical.level, outcomes: item.mechanical.audit.run(ALIAS.selectContext(context)) }
}

test('the deprecated declaration warns and names ki-delegation-paperclip', () => {
  const { level, outcomes: found } = outcomes({ organisation_code: 'KIS' })
  expect(level).toBe('WARN')
  expect(found).toEqual([
    expect.objectContaining({
      status: 'VIOLATION',
      message: expect.stringContaining('[skills.ki-delegation-paperclip]')
    })
  ])
})

test('without a declaration the alias does not apply', () => {
  expect(outcomes(undefined).outcomes[0]?.status).toBe('NOT_APPLICABLE')
})
