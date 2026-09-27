import { afterEach, expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { RubricItem } from '../../shared/rubric.ts'
import type { CodexContext } from '../contexts/agents.ts'
import catalogue from './index.ts'

const temporary: string[] = []
afterEach(() => {
  temporary.splice(0).forEach((directory) => {
    rmSync(directory, { recursive: true, force: true })
  })
})
const fixture = (): string => {
  const repository = mkdtempSync(join(tmpdir(), 'ki-subagents-chatgpt-'))
  temporary.push(repository)
  mkdirSync(join(repository, '.codex', 'agents'), { recursive: true })
  writeFileSync(
    join(repository, '.codex', 'agents', 'reviewer.toml'),
    'name = "reviewer"\ndescription = "Reviews a bounded change."\ndeveloper_instructions = "Read evidence first."\n'
  )
  return repository
}
const contextFor = (repository: string, file: string): CodexContext =>
  catalogue
    .createSession({ mode: 'audit', repository, userHome: tmpdir(), configuration: {} })
    .subjects.find((subject) => subject.subject === `.codex/agents/${file}.toml`)
    ?.context() as CodexContext
const items = catalogue.families.flatMap((family) => family.items as readonly RubricItem<unknown>[])
const item = (code: string) =>
  items.find((candidate) => candidate.code === code) as RubricItem<CodexContext> | undefined
test('the Codex adapter owns TOML mechanics and a publication only', () =>
  expect(items.map((candidate) => candidate.code)).toEqual(['CODEX-1', 'CODEX-2', 'CODEX-3', 'CODEX-4', 'RUBRIC-1']))
test('malformed TOML fails closed', () => {
  const repository = fixture()
  writeFileSync(join(repository, '.codex', 'agents', 'broken.toml'), 'name = [\n')
  const context = contextFor(repository, 'broken')
  expect(item('CODEX-1')?.mechanical?.audit.run(context)[0]?.status).toBe('VIOLATION')
  expect(item('CODEX-2')?.mechanical?.audit.run(context)[0]?.status).toBe('NOT_APPLICABLE')
})
test('missing required fields and unsupported keys fail', () => {
  const repository = fixture()
  writeFileSync(
    join(repository, '.codex', 'agents', 'bad.toml'),
    'name = "bad"\ndescription = ""\nunsupported = true\n'
  )
  const context = contextFor(repository, 'bad')
  expect(item('CODEX-2')?.mechanical?.audit.run(context)[0]?.status).toBe('VIOLATION')
  expect(item('CODEX-3')?.mechanical?.audit.run(context)[0]?.status).toBe('VIOLATION')
})
test('duplicate names fail without a write proposal', () => {
  const repository = fixture()
  writeFileSync(
    join(repository, '.codex', 'agents', 'other.toml'),
    'name = "reviewer"\ndescription = "Other"\ndeveloper_instructions = "Body"\n'
  )
  const session = catalogue.createSession({ mode: 'conform', repository, userHome: tmpdir(), configuration: {} })
  const context = session.subjects
    .find((subject) => subject.subject === '.codex/agents/reviewer.toml')
    ?.context() as CodexContext
  expect(item('CODEX-4')?.mechanical?.audit.run(context)[0]?.status).toBe('VIOLATION')
  expect(session.proposal().writes).toEqual([])
})
