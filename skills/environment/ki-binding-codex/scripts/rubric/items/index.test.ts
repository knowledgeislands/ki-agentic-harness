import { afterEach, expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { ServerEntry } from '../../shared/binding.ts'
import type { RubricFamily } from '../../shared/rubric.ts'
import { type CodexBindingContext, createCodexBindingSession, mismatches } from '../contexts/codex.ts'
import catalogue from './index.ts'

const temporaryDirectories: string[] = []
const originalMcpSource = process.env.KI_MCP_SOURCE
afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) rmSync(directory, { recursive: true, force: true })
  if (originalMcpSource === undefined) delete process.env.KI_MCP_SOURCE
  else process.env.KI_MCP_SOURCE = originalMcpSource
})

test('the Codex catalogue is independently complete', () => {
  expect(catalogue.contract).toBe(1)
  expect(catalogue.name).toBe('ki-binding-codex')
  expect(catalogue.families[0]?.items.map((item) => item.code)).toEqual(['CODEXBIND-1', 'CODEXBIND-J1'])
})

test('the Codex criteria expose complete v1 remediation and review metadata', () => {
  const items = catalogue.families[0]?.items ?? []
  const mechanical = items.find((item) => item.code === 'CODEXBIND-1')?.mechanical
  const judgment = items.find((item) => item.code === 'CODEXBIND-J1')?.judgment

  expect(mechanical?.remediation.class).toBe('diagnostic')
  expect(judgment?.scope).not.toBeEmpty()
  expect(judgment?.outcomes.length).toBeGreaterThan(0)
  expect(judgment?.guidance).not.toBeEmpty()
})

test('the Codex target compares complete definitions rather than names', () => {
  const repository = mkdtempSync(join(tmpdir(), 'ki-binding-codex-repository-'))
  const home = mkdtempSync(join(tmpdir(), 'ki-binding-codex-home-'))
  temporaryDirectories.push(repository, home)
  const source = join(home, 'mcp-servers.yaml')
  process.env.KI_MCP_SOURCE = source
  mkdirSync(join(home, '.codex'), { recursive: true })
  writeFileSync(
    source,
    'mcpServers:\n  - name: ki-url\n    clients: [chatgpt-codex]\n    url: https://example.invalid/mcp\n    transports: { chatgpt-codex: streamable_http }\n'
  )
  writeFileSync(join(home, '.codex', 'config.toml'), '[mcp_servers.ki-url]\nurl = "https://wrong.invalid/mcp"\n')
  const context = createCodexBindingSession({
    mode: 'audit',
    repository,
    userHome: home,
    configuration: {}
  }).subjects[0]?.context() as CodexBindingContext
  const family = catalogue.families[0] as RubricFamily<CodexBindingContext, CodexBindingContext>
  expect(family.items[0]?.mechanical?.audit.run(context)[0]?.status).toBe('VIOLATION')
})

const codexMismatches = (
  entry: ServerEntry,
  server: Record<string, unknown>,
  home = '/Users/example',
  extras: Record<string, Record<string, unknown>> = {}
) =>
  mismatches(
    { kind: 'valid', entries: [entry] },
    { kind: 'valid', path: join(home, '.codex', 'config.toml'), servers: { [entry.name]: server, ...extras } }
  )

const codexStdio = (command = 'node'): ServerEntry => ({
  name: 'ki-stdio',
  clients: ['chatgpt-codex'],
  command,
  args: ['~/server.mjs'],
  env: { ACCESS_LEVEL: 'read', TOKEN: { op: 'op://vault/item/field' } }
})

test('the Codex target accepts only the safe rendered stdio projections', () => {
  const home = '/Users/example'
  const entry = codexStdio()
  const commands = new Set(['node', Bun.which('node'), join(home, '.local', 'share', 'mise', 'shims', 'node')])

  for (const command of commands) {
    if (!command) continue
    for (const argument of ['~/server.mjs', join(home, 'server.mjs')]) {
      expect(
        codexMismatches(
          entry,
          {
            command,
            args: [argument],
            env: { ACCESS_LEVEL: 'read', TOKEN: 'resolved-secret' }
          },
          home,
          { unrelated: { command: 'other' } }
        )
      ).toEqual([])
    }
  }
})

test('the Codex target rejects unsafe command, argument, and environment equivalence', () => {
  const home = '/Users/example'
  const entry = codexStdio()
  const command = join(home, '.local', 'share', 'mise', 'shims', 'node')
  const valid = {
    command,
    args: [join(home, 'server.mjs')],
    env: { ACCESS_LEVEL: 'read', TOKEN: 'resolved-secret' }
  }
  const invalid = [
    { ...valid, command: '/wrong/node' },
    { ...valid, args: ['/wrong/server.mjs'] },
    { ...valid, env: { ACCESS_LEVEL: 'write', TOKEN: 'resolved-secret' } },
    { ...valid, env: { ACCESS_LEVEL: 'read' } },
    { ...valid, env: { ACCESS_LEVEL: 'read', TOKEN: 'resolved-secret', EXTRA: 'value' } },
    { ...valid, env: { ACCESS_LEVEL: 'read', TOKEN: '' } }
  ]

  for (const server of invalid) expect(codexMismatches(entry, server, home)).toEqual([entry])
  expect(codexMismatches(codexStdio('./node'), { ...valid, command }, home)).toEqual([codexStdio('./node')])
  expect(
    codexMismatches(
      codexStdio('python'),
      { ...valid, command: join(home, '.local', 'share', 'mise', 'shims', 'python') },
      home
    )
  ).toEqual([codexStdio('python')])
})

test('the Codex target keeps URL comparison exact and ignores unrelated native servers', () => {
  const entry = {
    name: 'ki-url',
    clients: ['chatgpt-codex'],
    url: 'https://example.invalid/mcp',
    transports: { 'chatgpt-codex': 'streamable_http' }
  } as unknown as Extract<ServerEntry, { url: string }>

  expect(
    codexMismatches(entry, { url: entry.url }, '/Users/example', { unrelated: { url: 'https://other.invalid' } })
  ).toEqual([])
  expect(codexMismatches(entry, { url: 'https://wrong.invalid/mcp' })).toEqual([entry])
  expect(
    mismatches(
      { kind: 'valid', entries: [entry] },
      {
        kind: 'valid',
        path: '/Users/example/.codex/config.toml',
        servers: { unrelated: { url: entry.url } }
      }
    )
  ).toEqual([entry])
})
