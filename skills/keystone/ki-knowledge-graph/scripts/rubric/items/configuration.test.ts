import { expect, test } from 'bun:test'
import { createKnowledgeGraphSession } from '../contexts/knowledge-graph.ts'
import { CONFIG } from './configuration.ts'

test('the knowledge-graph method rejects invented layout settings without proposing writes', () => {
  const configuration = { staging_root: 'knowledge', held_root: '_held' }
  const session = createKnowledgeGraphSession({
    mode: 'conform',
    repository: process.cwd(),
    userHome: process.cwd(),
    configuration,
    packageScriptClaims: []
  })
  const subject = session.subjects.find(({ families }) => families.includes('CONFIG'))
  if (!subject) throw new Error('Missing configuration subject')
  expect(CONFIG.items[0].mechanical.audit.run(subject.context())).toEqual([
    { status: 'VIOLATION', message: 'Unsupported knowledge-graph property: held_root' },
    { status: 'VIOLATION', message: 'Unsupported knowledge-graph property: staging_root' }
  ])
  expect(session.proposal()).toEqual({ writes: [] })
  expect(configuration).toEqual({ staging_root: 'knowledge', held_root: '_held' })
})

test('an empty table is valid and every family has a subject carrying the host publication', () => {
  const publication = {
    target: 'references/rubric.md',
    rendered: '',
    state: 'stale' as const,
    propose: () => undefined
  }
  const session = createKnowledgeGraphSession({
    mode: 'audit',
    repository: process.cwd(),
    userHome: process.cwd(),
    configuration: {},
    packageScriptClaims: [],
    publication
  })
  const families = session.subjects.flatMap(({ families }) => families)
  expect(families).toEqual(['CONFIG', 'CARD', 'CURATE', 'GRAPH', 'DISPATCH', 'RUBRIC'])
  const configuration = session.subjects.find(({ families }) => families.includes('CONFIG'))
  if (!configuration) throw new Error('Missing configuration subject')
  expect(CONFIG.items[0].mechanical.audit.run(configuration.context())[0]?.status).toBe('PASS')
  const rubric = session.subjects.find(({ families }) => families.includes('RUBRIC'))
  if (!rubric) throw new Error('Missing publication subject')
  expect(rubric.context().rubric.publication).toBe(publication)
})
