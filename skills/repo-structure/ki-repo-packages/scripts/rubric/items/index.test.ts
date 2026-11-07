import { afterEach, expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { AuditOutcome, RubricFamily } from '../../shared/rubric.ts'
import { createPackagesSession, type PackagesContext, publishesSyncParagraph } from '../contexts/packages.ts'
import catalogue from './index.ts'

const temporaryDirectories: string[] = []
afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) rmSync(directory, { recursive: true, force: true })
})

const SYNC = `## The sync rule

> \`packages/demo/\` is a vendored copy at the release in \`demo-lock.json\`. Never edit it here.
> Re-vendor with \`sync\`; \`verify\` fails the build on any local edit; \`drift\` shows what changed, to accept
> with \`sync\` or reject with \`defer\`.
`

const fixture = (): string => {
  const repository = mkdtempSync(join(tmpdir(), 'ki-repo-packages-'))
  temporaryDirectories.push(repository)
  mkdirSync(join(repository, 'packages', 'demo'), { recursive: true })
  mkdirSync(join(repository, 'apps', 'workbench'), { recursive: true })
  writeFileSync(join(repository, 'packages', 'demo', 'package.json'), '{"name":"demo","version":"1.2.0"}\n')
  writeFileSync(join(repository, 'packages', 'demo', 'tsconfig.json'), '{"compilerOptions":{"checkJs":true}}\n')
  writeFileSync(join(repository, 'CHANGELOG.md'), '# Changelog\n\n## Unreleased\n\n## 1.2.0\n\n- Added.\n')
  writeFileSync(join(repository, 'AGENTS.md'), `# Working here\n\n${SYNC}`)
  return repository
}

const run = (repository: string, configuration: Record<string, unknown> = { package: 'demo' }) => {
  const session = createPackagesSession({
    mode: 'audit',
    repository,
    userHome: tmpdir(),
    configuration,
    packageScriptClaims: []
  })
  const context = session.subjects[0]?.context() as PackagesContext
  const outcomes = new Map<string, readonly AuditOutcome[]>()
  for (const family of catalogue.families as readonly RubricFamily<PackagesContext, PackagesContext>[])
    for (const item of family.items)
      if (item.mechanical) outcomes.set(item.code, item.mechanical.audit.run(family.selectContext(context)))
  return { context, session, statuses: (code: string) => outcomes.get(code)?.map((outcome) => outcome.status) }
}

test('the catalogue declares its families and criteria in order', () => {
  expect(catalogue.contract).toBe(1)
  expect(catalogue.name).toBe('ki-repo-packages')
  expect(catalogue.families.map((family) => family.code)).toEqual(['CONFIG', 'PKG', 'RUBRIC'])
  const codes = catalogue.families.flatMap((family) => (family.items as readonly { code: string }[]).map((i) => i.code))
  expect(codes).toEqual([
    'CONFIG-1',
    'CONFIG-2',
    'PKG-1',
    'PKG-2',
    'PKG-3',
    'PKG-4',
    'PKG-5',
    'PKG-6',
    'PKG-J1',
    'PKG-J2',
    'PKG-J3',
    'PKG-J4',
    'RUBRIC-1'
  ])
})

test('a conforming package repository passes every mechanical criterion and proposes nothing', () => {
  const { statuses, session } = run(fixture())
  for (const code of ['CONFIG-1', 'CONFIG-2', 'PKG-1', 'PKG-2', 'PKG-3', 'PKG-4', 'PKG-5', 'PKG-6'])
    expect(statuses(code)).toEqual(['PASS'])
  expect(session.proposal()).toEqual({ writes: [] })
})

test('a missing or unset package fails CONFIG-1 and leaves the package checks not applicable', () => {
  const repository = fixture()
  expect(run(repository, {}).statuses('CONFIG-1')).toEqual(['VIOLATION'])
  expect(run(repository, { package: '../demo' }).context.packageState).toBe('invalid')
  const missing = run(repository, { package: 'absent' })
  expect(missing.statuses('CONFIG-1')).toEqual(['VIOLATION'])
  for (const code of ['PKG-1', 'PKG-2', 'PKG-4', 'PKG-5']) expect(missing.statuses(code)).toEqual(['NOT_APPLICABLE'])
  expect(run(repository, { package: 'demo', profile: 'x' }).statuses('CONFIG-2')).toEqual(['VIOLATION'])
})

test('drift in the version, changelog, workbench, tsconfig and register is reported', () => {
  const repository = fixture()
  writeFileSync(join(repository, 'CHANGELOG.md'), '# Changelog\n\n## 1.1.0\n')
  writeFileSync(join(repository, 'packages', 'demo', 'tsconfig.json'), '{"extends":"../../tsconfig.json"}\n')
  writeFileSync(join(repository, 'consumers.json5'), '{}\n')
  rmSync(join(repository, 'apps', 'workbench'), { recursive: true })
  const { statuses } = run(repository)
  expect(statuses('PKG-2')).toEqual(['VIOLATION'])
  expect(statuses('PKG-3')).toEqual(['VIOLATION'])
  expect(statuses('PKG-5')).toEqual(['VIOLATION'])
  expect(statuses('PKG-6')).toEqual(['VIOLATION'])
  writeFileSync(join(repository, 'packages', 'demo', 'package.json'), '{"name":"demo"}\n')
  expect(run(repository).statuses('PKG-1')).toEqual(['VIOLATION'])
})

test('the sync paragraph must be one quotation naming the path and all four tools', () => {
  expect(publishesSyncParagraph(SYNC, 'demo')).toBe(true)
  expect(publishesSyncParagraph(SYNC, 'other')).toBe(false)
  expect(publishesSyncParagraph(SYNC.replaceAll('> ', ''), 'demo')).toBe(false)
  expect(publishesSyncParagraph(SYNC.replace('`defer`', 'reject'), 'demo')).toBe(false)
})
