import { expect, test } from 'bun:test'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createPrincipalSession } from '../contexts/principal.ts'
import catalogue from './index.ts'

test('the principal catalogue has the expected native contract', () => {
  expect(catalogue.contract).toBe(1)
  expect(catalogue.name).toBe('ki-repo-kb-principal')
  expect(catalogue.families.map((family) => family.code)).toEqual(['RUBRIC', 'PRINCIPAL'])
  expect(catalogue.families[1]?.items.map((item) => item.code)).toEqual([
    'PRINCIPAL-1',
    'PRINCIPAL-2',
    'PRINCIPAL-3',
    'PRINCIPAL-4',
    'PRINCIPAL-5'
  ])
  const territorialReview = catalogue.families[1]?.items.slice(2, 4) ?? []
  expect(territorialReview).toHaveLength(2)
  for (const item of territorialReview) {
    expect(item.mechanical).toBeUndefined()
    expect(item.judgment?.scope).toBeTruthy()
    expect(item.judgment?.prompt).toBeTruthy()
    expect(item.judgment?.outcomes).toContain('owner decision required')
    expect(item.sources[0]).toStartWith('standards-principal.md#')
  }
  for (const family of catalogue.families) {
    for (const item of family.items) {
      if (!item.mechanical) continue
      expect(item.mechanical.remediation.class).not.toBe('')
      if (item.mechanical.conform) expect(item.mechanical.remediation.class).toBe('automatic')
    }
  }
})

test('the principal checker distinguishes a missing surface from a complete one', () => {
  const repository = mkdtempSync(join(tmpdir(), 'ki-repo-kb-principal-rubric-'))
  const session = catalogue.createSession({ mode: 'audit', repository, userHome: tmpdir(), configuration: {} })
  const context = session.subjects[1]?.context()
  const family = catalogue.families[1]

  expect(context).toMatchObject({
    missing: expect.arrayContaining(['Admin/MEMORY.md']),
    empty: [],
    enactmentAnchor: false
  })

  for (const path of [
    'Admin/MEMORY.md',
    'Admin/Governance/Charter.md',
    'Admin/Governance/Known Lands.md',
    'Admin/Governance/Conventions/Conventions.md',
    'Admin/Operations/Processes/Enactment Process.md'
  ]) {
    mkdirSync(join(repository, path, '..'), { recursive: true })
    writeFileSync(join(repository, path), '# Record\n\nLocal structural orientation.\n')
  }
  writeFileSync(
    join(repository, 'AGENTS.md'),
    '# Guidance\n\nSubstantive changes to Admin, Pillars, and Resources must use the Enactment Process through Streams/Roadmap.\n'
  )

  const complete = catalogue
    .createSession({ mode: 'audit', repository, userHome: tmpdir(), configuration: {} })
    .subjects[1]?.context()
  const principal = family?.selectContext(complete as never) as {
    missing: readonly string[]
    empty: readonly string[]
    enactmentAnchor: boolean
  }
  expect(principal.missing).toEqual([])
  expect(principal.empty).toEqual([])
  expect(principal.enactmentAnchor).toBe(true)
})

test('empty structural entries and keyword-only orientation do not pass', () => {
  const repository = mkdtempSync(join(tmpdir(), 'ki-repo-kb-principal-empty-'))
  for (const path of [
    'Admin/MEMORY.md',
    'Admin/Governance/Charter.md',
    'Admin/Governance/Known Lands.md',
    'Admin/Governance/Conventions/Conventions.md',
    'Admin/Operations/Processes/Enactment Process.md'
  ]) {
    mkdirSync(join(repository, path, '..'), { recursive: true })
    writeFileSync(join(repository, path), '\n')
  }
  writeFileSync(join(repository, 'AGENTS.md'), 'Use the Enactment Process.\n')
  const context = catalogue
    .createSession({ mode: 'audit', repository, userHome: tmpdir(), configuration: {} })
    .subjects[1]?.context() as { empty: readonly string[]; enactmentAnchor: boolean }

  expect(context.empty).toHaveLength(5)
  expect(context.enactmentAnchor).toBe(false)
})

const scaffoldPath = '+/_ACQUIRED/README.md'
const scaffoldTemplate = readFileSync(new URL('../../../assets/templates/acquired/README.md', import.meta.url), 'utf8')
const scaffoldCriterion = catalogue.families[1].items.find((item) => item.code === 'PRINCIPAL-5')
const principalSession = (repository: string, mode: 'audit' | 'conform') =>
  createPrincipalSession({ repository, mode, userHome: tmpdir(), configuration: {} })
const principalContext = (session: ReturnType<typeof principalSession>) => {
  const subject = session.subjects[1]
  if (!subject) throw new Error('Missing principal subject')
  return subject.context()
}
const auditScaffold = (session: ReturnType<typeof principalSession>) =>
  scaffoldCriterion?.mechanical?.audit.run(principalContext(session))
const conformScaffold = (session: ReturnType<typeof principalSession>) =>
  scaffoldCriterion?.mechanical?.conform?.run(principalContext(session))

test('missing scaffold audit is read-only and conform proposes only its exact README', () => {
  const repository = mkdtempSync(join(tmpdir(), 'principal-scaffold-missing-'))
  const audit = principalSession(repository, 'audit')
  expect(principalContext(audit).acquired.state).toBe('missing')
  expect(auditScaffold(audit)).toMatchObject([{ status: 'VIOLATION', subject: scaffoldPath }])
  conformScaffold(audit)
  expect(audit.proposal()).toEqual({ writes: [] })
  const conform = principalSession(repository, 'conform')
  expect(conform.proposal()).toEqual({ writes: [] })
  conformScaffold(conform)
  conformScaffold(conform)
  expect(conform.proposal()).toEqual({ writes: [{ path: scaffoldPath, content: scaffoldTemplate, create: true }] })
  expect(existsSync(join(repository, '+'))).toBe(false)
})

test('canonical scaffold passes and conform stays idempotent', () => {
  const repository = mkdtempSync(join(tmpdir(), 'principal-scaffold-canonical-'))
  mkdirSync(join(repository, '+/_ACQUIRED'), { recursive: true })
  writeFileSync(join(repository, scaffoldPath), scaffoldTemplate)
  const session = principalSession(repository, 'conform')
  expect(principalContext(session).acquired.state).toBe('canonical')
  expect(auditScaffold(session)).toMatchObject([{ status: 'PASS' }])
  conformScaffold(session)
  expect(session.proposal()).toEqual({ writes: [] })
})

test.each(['', '# Local replacement\n', scaffoldTemplate.replaceAll('\n', '\r\n'), `${scaffoldTemplate}\0`])(
  'drifted scaffold is restored byte exactly without reading or changing packets (%#)',
  (content) => {
    const repository = mkdtempSync(join(tmpdir(), 'principal-scaffold-drift-'))
    const delivery = join(repository, '+/_ACQUIRED/delivery/package')
    mkdirSync(delivery, { recursive: true })
    const original = Buffer.from([0, 255, 13, 10, 42])
    writeFileSync(join(delivery, 'original.bin'), original)
    // A packet symlink is deliberately not traversed by the scaffold checker.
    symlinkSync(join(repository, 'absent-packet-target'), join(delivery, 'unread-link'))
    writeFileSync(join(repository, scaffoldPath), content)
    const session = principalSession(repository, 'conform')
    expect(principalContext(session).acquired.state).toBe('drifted')
    expect(auditScaffold(session)).toMatchObject([{ status: 'VIOLATION' }])
    conformScaffold(session)
    expect(session.proposal()).toEqual({ writes: [{ path: scaffoldPath, content: scaffoldTemplate }] })
    expect(readFileSync(join(repository, scaffoldPath), 'utf8')).toBe(content)
    expect(readFileSync(join(delivery, 'original.bin'))).toEqual(original)
    // Simulate host publication in this disposable fixture only.
    for (const write of session.proposal().writes) writeFileSync(join(repository, write.path), write.content)
    expect(auditScaffold(principalSession(repository, 'audit'))).toMatchObject([{ status: 'PASS' }])
    expect(readFileSync(join(delivery, 'original.bin'))).toEqual(original)
  }
)

test.each(['+', '+/_ACQUIRED', scaffoldPath])('unsafe path %s is never proposed for repair', (unsafePath) => {
  for (const kind of ['symlink', 'dangling', 'wrong-type']) {
    const repository = mkdtempSync(join(tmpdir(), 'principal-scaffold-unsafe-'))
    const path = join(repository, unsafePath)
    mkdirSync(join(path, '..'), { recursive: true })
    const external = mkdtempSync(join(tmpdir(), 'principal-scaffold-external-'))
    const sentinel = join(external, 'sentinel')
    writeFileSync(sentinel, 'untouched')
    if (kind === 'wrong-type') {
      if (unsafePath === scaffoldPath) mkdirSync(path)
      else writeFileSync(path, 'not a directory')
    } else
      symlinkSync(
        kind === 'dangling' ? join(external, 'absent') : unsafePath === scaffoldPath ? sentinel : external,
        path
      )
    const session = principalSession(repository, 'conform')
    expect(principalContext(session).acquired.state).toBe('unsafe')
    expect(auditScaffold(session)).toMatchObject([{ status: 'VIOLATION' }])
    conformScaffold(session)
    expect(session.proposal()).toEqual({ writes: [] })
    expect(readFileSync(sentinel, 'utf8')).toBe('untouched')
  }
})
