import { afterEach, describe, expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { RubricContextOptions } from '../../shared/rubric.ts'
import { codexMemoryContext } from './memory.ts'

const roots: string[] = []
const originalCodexHome = process.env.CODEX_HOME
const fixture = (auto_memory?: string): RubricContextOptions => {
  const root = mkdtempSync(join(tmpdir(), 'ki-codex-memory-'))
  roots.push(root)
  const repository = join(root, 'repository')
  const userHome = join(root, 'home')
  mkdirSync(repository)
  mkdirSync(userHome)
  return { mode: 'audit', repository, userHome, configuration: auto_memory ? { auto_memory } : {} }
}
const userConfig = (options: RubricContextOptions, enabled: boolean, trusted = false): void => {
  const home = join(options.userHome, '.codex')
  mkdirSync(home, { recursive: true })
  writeFileSync(
    join(home, 'config.toml'),
    `[features]\nmemories = ${enabled}\n${trusted ? `\n[projects.${JSON.stringify(options.repository)}]\ntrust_level = "trusted"\n` : ''}`
  )
}
const projectConfig = (options: RubricContextOptions, enabled: boolean): void => {
  const directory = join(options.repository, '.codex')
  mkdirSync(directory, { recursive: true })
  writeFileSync(join(directory, 'config.toml'), `[features]\nmemories = ${enabled}\n`)
}
const memoryFile = (options: RubricContextOptions): void => {
  const directory = join(options.userHome, '.codex', 'memories')
  mkdirSync(directory, { recursive: true })
  writeFileSync(join(directory, 'note.md'), 'Existing local memory.\n')
}

afterEach(() => {
  if (originalCodexHome === undefined) delete process.env.CODEX_HOME
  else process.env.CODEX_HOME = originalCodexHome
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
})

describe('Codex local-memory policy', () => {
  test('unset fails even without a store', () => {
    const context = codexMemoryContext(fixture())
    expect(context.declaration[0]?.status).toBe('VIOLATION')
    expect(context.runtime[0]?.status).toBe('PASS')
    expect(context.reconciliation[0]?.status).toBe('PASS')
  })

  test('explicit disabled passes with no memory files', () => {
    const context = codexMemoryContext(fixture('disabled'))
    expect(context.declaration[0]?.status).toBe('PASS')
    expect(context.runtime[0]?.status).toBe('PASS')
    expect(context.reconciliation[0]?.status).toBe('PASS')
  })

  test('disabled warns when selected global store has files', () => {
    const options = fixture('disabled')
    memoryFile(options)
    const context = codexMemoryContext(options)
    expect(context.reconciliation[0]?.status).toBe('VIOLATION')
    expect(context.reconciliation[0]?.message).toContain('reviewed reconciliation')
  })

  test('CODEX_HOME override selects only its own memory directory', () => {
    const options = fixture('disabled')
    memoryFile(options)
    const selected = join(options.userHome, 'selected-codex')
    mkdirSync(selected)
    process.env.CODEX_HOME = selected
    expect(codexMemoryContext(options).reconciliation[0]?.status).toBe('PASS')
    mkdirSync(join(selected, 'memories'))
    writeFileSync(join(selected, 'memories', 'retained.md'), 'Retained memory.\n')
    expect(codexMemoryContext(options).reconciliation[0]?.status).toBe('VIOLATION')
  })

  test('transition warns until closed even without files', () => {
    const context = codexMemoryContext(fixture('transition'))
    expect(context.runtime[0]?.status).toBe('PASS')
    expect(context.reconciliation[0]?.status).toBe('VIOLATION')
  })

  test('enabled requires project-scoped opt-in, not user-wide enablement', () => {
    const options = fixture('enabled')
    userConfig(options, true)
    expect(codexMemoryContext(options).runtime[0]?.status).toBe('VIOLATION')
    projectConfig(options, true)
    expect(codexMemoryContext(options).runtime[0]?.status).toBe('VIOLATION')
    userConfig(options, true, true)
    expect(codexMemoryContext(options).runtime[0]?.status).toBe('PASS')
  })

  test('project disabled setting overrides user enablement', () => {
    const options = fixture('disabled')
    userConfig(options, true, true)
    expect(codexMemoryContext(options).runtime[0]?.status).toBe('VIOLATION')
    projectConfig(options, false)
    expect(codexMemoryContext(options).runtime[0]?.status).toBe('PASS')
  })

  test('symlinked selected store fails closed without following it', () => {
    const options = fixture('disabled')
    const home = join(options.userHome, '.codex')
    mkdirSync(home, { recursive: true })
    symlinkSync(options.repository, join(home, 'memories'))
    expect(codexMemoryContext(options).reconciliation[0]?.status).toBe('VIOLATION')
  })

  test('broken symlinked store still fails closed', () => {
    const options = fixture('disabled')
    const home = join(options.userHome, '.codex')
    mkdirSync(home, { recursive: true })
    symlinkSync(join(options.repository, 'missing'), join(home, 'memories'))
    expect(codexMemoryContext(options).reconciliation[0]?.status).toBe('VIOLATION')
  })

  test('symlinked project configuration is not read as opt-in', () => {
    const options = fixture('enabled')
    userConfig(options, false, true)
    const external = join(options.userHome, 'external')
    mkdirSync(external)
    writeFileSync(join(external, 'config.toml'), '[features]\nmemories = true\n')
    symlinkSync(external, join(options.repository, '.codex'))
    expect(codexMemoryContext(options).runtime[0]?.status).toBe('VIOLATION')
  })
})
