import { afterEach, expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { RubricItem } from '../../shared/rubric.ts'
import catalogue from './index.ts'

const temporaryDirectories: string[] = []
const items = catalogue.families
  .filter((family) => family.code !== 'RUBRIC')
  .flatMap((family) => family.items as readonly RubricItem<unknown>[])
const familyModules = readdirSync(import.meta.dir)
  .filter((file) => file.endsWith('.ts') && file !== 'index.ts' && !file.endsWith('.test.ts'))
  .sort()

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) rmSync(directory, { recursive: true, force: true })
})

test('the structured catalogue preserves the specifications structural floor', () => {
  expect(catalogue.contract).toBe(1)
  expect(catalogue.name).toBe('ki-repo-specifications')
  expect(catalogue.createSession).toBeFunction()
  expect(catalogue.families.map((family) => family.code)).toEqual(['RUBRIC', 'SPEC', 'SYNC', 'GATE'])
  expect(items.map((item) => item.code)).toEqual([
    'SPEC-1',
    'SPEC-2',
    'SPEC-3',
    'SPEC-J1',
    'SPEC-J2',
    'SYNC-1',
    'GATE-1'
  ])
  expect(items.every((item) => item.sources.includes('standards-specifications.md'))).toBe(true)
})

test('criteria declare complete v1 remediation and review metadata', () => {
  const mechanicalItems = catalogue.families
    .flatMap((family) => family.items as readonly RubricItem<unknown>[])
    .filter((item) => item.mechanical)
  const judgmentItems = items.filter((item) => item.judgment)

  expect(mechanicalItems).toHaveLength(5)
  expect(mechanicalItems.every((item) => item.mechanical?.remediation)).toBe(true)
  expect(judgmentItems).toHaveLength(3)
  for (const item of judgmentItems) {
    expect(item.judgment?.scope).not.toBeEmpty()
    expect(item.judgment?.outcomes.length).toBeGreaterThan(0)
    expect(item.judgment?.guidance).not.toBeEmpty()
  }
})

test('each family module exports one complete family', async () => {
  expect(familyModules).toEqual(['gate.ts', 'publication.ts', 'specifications.ts', 'sync.ts'])
  for (const file of familyModules) {
    const module = (await import(`./${file}`)) as Record<string, unknown>
    expect(Object.keys(module)).toHaveLength(1)
    const family = Object.values(module)[0] as { code?: unknown; items?: unknown }
    expect(typeof family.code).toBe('string')
    expect(Array.isArray(family.items)).toBe(true)
  }
})

test('the session never infers a declaration from detected directories or proposes a write', () => {
  const repository = mkdtempSync(join(tmpdir(), 'ki-repo-specifications-'))
  temporaryDirectories.push(repository)
  writeFileSync(join(repository, '.ki.toml'), '[skills.ki-repo]\n')
  for (const directory of ['proposals', 'specifications', 'schemas']) mkdirSync(join(repository, directory))

  const session = catalogue.createSession({ mode: 'conform', repository, userHome: tmpdir(), configuration: {} })
  const subject = session.subjects[1]
  const context = subject?.context()
  const marker = items.find((item) => item.code === 'SPEC-1')

  expect(subject?.families).toEqual(['SPEC', 'SYNC', 'GATE'])
  expect(subject?.context()).toBe(context)
  expect(marker?.mechanical?.audit.run(context as never)[0]?.status).toBe('NOT_APPLICABLE')
  expect(session.proposal()).toEqual({ writes: [] })
})

test('detected authority directories without a declaration are not applicable', () => {
  const repository = mkdtempSync(join(tmpdir(), 'ki-repo-specifications-unselected-'))
  temporaryDirectories.push(repository)
  writeFileSync(join(repository, '.ki.toml'), '[skills.ki-repo]\n')
  for (const directory of ['proposals', 'specifications', 'schemas']) mkdirSync(join(repository, directory))

  const session = catalogue.createSession({ mode: 'audit', repository, userHome: tmpdir(), configuration: {} })
  const subject = session.subjects[1]
  const marker = items.find((item) => item.code === 'SPEC-1')

  expect(subject?.families).toEqual(['SPEC', 'SYNC', 'GATE'])
  expect(marker?.mechanical?.audit.run(subject?.context() as never)[0]?.status).toBe('NOT_APPLICABLE')
})

test('GATE-1 requires a committed gate to be check-only, with no audit at commit time', () => {
  const repository = mkdtempSync(join(tmpdir(), 'ki-repo-specifications-gate-'))
  temporaryDirectories.push(repository)
  writeFileSync(join(repository, '.ki.toml'), '[skills.ki-repo]\n[skills.ki-repo-specifications]\n')
  const gate = () => {
    const context = catalogue
      .createSession({ mode: 'audit', repository, userHome: tmpdir(), configuration: {} })
      .subjects[1]?.context()
    const family = catalogue.families.find((candidate) => candidate.code === 'GATE')
    return family?.items[0]?.mechanical?.audit.run(family.selectContext(context as never) as never)[0]
  }
  expect(gate()?.status).toBe('NOT_APPLICABLE')

  mkdirSync(join(repository, '.githooks'))
  const hook = join(repository, '.githooks', 'pre-commit')
  writeFileSync(hook, '#!/bin/sh\nki repo audit --skill ki-repo-specifications --staged || exit 1\n')
  expect(gate()?.status).toBe('VIOLATION')
  writeFileSync(hook, '#!/bin/sh\nrumdl check --fix\n')
  expect(gate()?.status).toBe('VIOLATION')
  writeFileSync(hook, '#!/bin/sh\nki repo conform\n')
  expect(gate()?.message).toContain('runs `ki repo conform`')
  writeFileSync(hook, readFileSync(join(import.meta.dir, '../../../assets/githooks/no-package/pre-commit'), 'utf8'))
  expect(gate()?.status).toBe('PASS')
})
