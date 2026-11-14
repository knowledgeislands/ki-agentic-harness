import { expect, test } from 'bun:test'
import { createAcquisitionSession } from '../contexts/acquisition.ts'
import { CONFIG } from './configuration.ts'

test('common acquisition rejects invented adapter settings without proposing state writes', () => {
  const configuration = { state_root: 'elsewhere', capture_root: 'renamed' }
  const session = createAcquisitionSession({
    mode: 'conform',
    repository: process.cwd(),
    userHome: process.cwd(),
    configuration,
    packageScriptClaims: []
  })
  const subject = session.subjects.find(({ families }) => families.includes('CONFIG'))
  if (!subject) throw new Error('Missing configuration subject')
  const context = subject.context()
  expect(CONFIG.items[0].mechanical.audit.run(context)).toEqual([
    { status: 'VIOLATION', message: 'Unsupported common acquisition property: capture_root' },
    { status: 'VIOLATION', message: 'Unsupported common acquisition property: state_root' }
  ])
  expect(session.proposal()).toEqual({ writes: [] })
  expect(configuration).toEqual({ state_root: 'elsewhere', capture_root: 'renamed' })
})

test('empty configuration is valid and audit sessions supply the host publication without mutation', () => {
  const publication = {
    target: 'references/rubric.md',
    rendered: '',
    state: 'stale' as const,
    propose: () => undefined
  }
  const session = createAcquisitionSession({
    mode: 'audit',
    repository: process.cwd(),
    userHome: process.cwd(),
    configuration: {},
    packageScriptClaims: [],
    publication
  })
  const configurationSubject = session.subjects.find(({ families }) => families.includes('CONFIG'))
  if (!configurationSubject) throw new Error('Missing configuration subject')
  const configuration = configurationSubject.context()
  expect(CONFIG.items[0].mechanical.audit.run(configuration)[0]?.status).toBe('PASS')
  const publicationSubject = session.subjects.find(({ families }) => families.includes('RUBRIC'))
  if (!publicationSubject) throw new Error('Missing publication subject')
  expect(publicationSubject.context().rubric.publication).toBe(publication)
  expect(session.proposal()).toEqual({ writes: [] })
})
