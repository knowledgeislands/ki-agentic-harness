import { afterEach, expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { readSource, type ServerEntry } from '../../shared/binding.ts'
import type { RubricFamily } from '../../shared/rubric.ts'
import { type BindingRubricContext, createBindingSession, mcporterMatches } from '../contexts/binding.ts'
import catalogue from './index.ts'

const temporaryDirectories: string[] = []
const originalMcpSource = process.env.KI_MCP_SOURCE
const originalMcporterConfig = process.env.MCPORTER_CONFIG
const originalXdgConfigHome = process.env.XDG_CONFIG_HOME

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) rmSync(directory, { recursive: true, force: true })
  if (originalMcpSource === undefined) delete process.env.KI_MCP_SOURCE
  else process.env.KI_MCP_SOURCE = originalMcpSource
  if (originalMcporterConfig === undefined) delete process.env.MCPORTER_CONFIG
  else process.env.MCPORTER_CONFIG = originalMcporterConfig
  if (originalXdgConfigHome === undefined) delete process.env.XDG_CONFIG_HOME
  else process.env.XDG_CONFIG_HOME = originalXdgConfigHome
})
test('the portable catalogue publishes the host-owned rubric criterion', () => {
  expect(catalogue.name).toBe('ki-binding')
  expect(catalogue.families.map((family) => family.code)).toEqual(['BIND', 'RUBRIC'])
  expect(catalogue.families[0]?.items.map((item) => item.code)).toEqual(['BIND-1', 'BIND-2', 'BIND-J1', 'BIND-J2'])
  expect(catalogue.families[1]?.items.map((item) => item.code)).toEqual(['RUBRIC-1'])
})

test('criteria declare complete v1 remediation and review metadata', () => {
  const bind = catalogue.families[0]
  const publication = catalogue.families[1]
  const mechanicalItems = [...(bind?.items ?? []), ...(publication?.items ?? [])].filter((item) => item.mechanical)
  const judgment = bind?.items.find((item) => item.code === 'BIND-J1')?.judgment

  expect(mechanicalItems).toHaveLength(3)
  expect(mechanicalItems.every((item) => item.mechanical?.remediation)).toBe(true)
  expect(judgment?.scope).not.toBeEmpty()
  expect(judgment?.outcomes.length).toBeGreaterThan(0)
  expect(judgment?.guidance).not.toBeEmpty()
})
test('the session compares a selected mcporter target against canonical definitions', () => {
  const repository = mkdtempSync(join(tmpdir(), 'ki-binding-repository-'))
  const userHome = mkdtempSync(join(tmpdir(), 'ki-binding-home-'))
  temporaryDirectories.push(repository, userHome)
  mkdirSync(join(userHome, '.config', 'ki'), { recursive: true })
  writeFileSync(
    join(userHome, '.config', 'ki', 'mcp-servers.yaml'),
    'mcpServers:\n  - name: ki-example\n    clients: [mcporter]\n    command: node\n'
  )
  const target = join(userHome, 'mcporter.json')
  writeFileSync(target, '{"mcpServers":{"ki-example":{"command":"node","args":[]}}}\n')
  delete process.env.KI_MCP_SOURCE
  process.env.MCPORTER_CONFIG = target
  process.env.XDG_CONFIG_HOME = join(userHome, '.config')
  const context = createBindingSession({
    mode: 'audit',
    repository,
    userHome,
    configuration: {}
  }).subjects[0]?.context() as BindingRubricContext
  expect(context.mcporter).toMatchObject({ kind: 'valid', path: target })
  const family = catalogue.families[0] as RubricFamily<BindingRubricContext, BindingRubricContext>
  expect(family.items[0]?.mechanical?.audit.run(context)[0]?.status).toBe('PASS')
})

test('the session honours an explicit MCP source override', () => {
  const repository = mkdtempSync(join(tmpdir(), 'ki-binding-repository-'))
  const userHome = mkdtempSync(join(tmpdir(), 'ki-binding-home-'))
  temporaryDirectories.push(repository, userHome)
  const source = join(userHome, 'mcp-servers.yaml')
  writeFileSync(source, 'mcpServers:\n  - name: ki-example\n    clients: [mcporter]\n    command: node\n')
  process.env.KI_MCP_SOURCE = source

  const context = createBindingSession({
    mode: 'audit',
    repository,
    userHome,
    configuration: {}
  }).subjects[0]?.context() as BindingRubricContext

  expect(context.source).toBe(source)
  expect(context.sourceState).toMatchObject({ kind: 'valid' })
})
test('the closed schema rejects misplaced or unsupported fields and missing URL client transport', () => {
  const repository = mkdtempSync(join(tmpdir(), 'ki-binding-repository-'))
  const userHome = mkdtempSync(join(tmpdir(), 'ki-binding-home-'))
  temporaryDirectories.push(repository, userHome)
  const source = join(userHome, 'mcp-servers.yaml')
  process.env.KI_MCP_SOURCE = source
  writeFileSync(
    source,
    'mcpServers:\n  - name: ki-url\n    clients: [chatgpt-codex]\n    url: https://example.invalid/mcp\n'
  )
  let context = createBindingSession({
    mode: 'audit',
    repository,
    userHome,
    configuration: {}
  }).subjects[0]?.context() as BindingRubricContext
  expect(context.sourceState).toMatchObject({ kind: 'invalid', message: expect.stringContaining('transport') })
  writeFileSync(
    source,
    'mcpServers:\n  - name: ki-stdio\n    clients: [mcporter]\n    command: node\n    headers: {}\n'
  )
  context = createBindingSession({
    mode: 'audit',
    repository,
    userHome,
    configuration: {}
  }).subjects[0]?.context() as BindingRubricContext
  expect(context.sourceState).toMatchObject({ kind: 'invalid', message: expect.stringContaining('stdio fields') })
  writeFileSync(
    source,
    'mcpServers:\n  - name: ki-stdio\n    clients: [mcporter]\n    command: node\n    unknown: true\n'
  )
  context = createBindingSession({
    mode: 'audit',
    repository,
    userHome,
    configuration: {}
  }).subjects[0]?.context() as BindingRubricContext
  expect(context.sourceState).toMatchObject({ kind: 'invalid', message: expect.stringContaining('unsupported field') })
  writeFileSync(
    source,
    'mcpServers:\n  - name: ki-url\n    clients: [mcporter]\n    url: https://example.invalid/mcp\n    transports:\n      mcporter: http\n    lifecycle: forever\n'
  )
  context = createBindingSession({
    mode: 'audit',
    repository,
    userHome,
    configuration: {}
  }).subjects[0]?.context() as BindingRubricContext
  expect(context.sourceState).toMatchObject({ kind: 'invalid', message: expect.stringContaining('lifecycle') })
  writeFileSync(
    source,
    'mcpServers:\n  - name: ki-url\n    clients: [mcporter]\n    url: https://example.invalid/mcp\n    transports:\n      mcporter: http\n    headers:\n      Authorization:\n        op: vault/item/field\n'
  )
  context = createBindingSession({
    mode: 'audit',
    repository,
    userHome,
    configuration: {}
  }).subjects[0]?.context() as BindingRubricContext
  expect(context.sourceState).toMatchObject({ kind: 'invalid', message: expect.stringContaining('headers') })
})
test('definitions accept typed headers and bounded lifecycle overrides', () => {
  const repository = mkdtempSync(join(tmpdir(), 'ki-binding-repository-'))
  const userHome = mkdtempSync(join(tmpdir(), 'ki-binding-home-'))
  temporaryDirectories.push(repository, userHome)
  const source = join(userHome, 'mcp-servers.yaml')
  process.env.KI_MCP_SOURCE = source
  writeFileSync(
    source,
    'mcpServers:\n  - name: ki-url\n    clients: [mcporter]\n    url: https://example.invalid/mcp\n    transports:\n      mcporter: http\n    headers:\n      Authorization:\n        op: op://vault/item/field\n      X-Literal: literal-value\n    lifecycle: ephemeral\n  - name: ki-stdio\n    clients: [mcporter]\n    command: node\n    lifecycle: keep-alive\n'
  )
  const context = createBindingSession({
    mode: 'audit',
    repository,
    userHome,
    configuration: {}
  }).subjects[0]?.context() as BindingRubricContext
  expect(context.sourceState).toMatchObject({
    kind: 'valid',
    entries: [
      {
        headers: { Authorization: { op: 'op://vault/item/field' }, 'X-Literal': 'literal-value' },
        lifecycle: 'ephemeral'
      },
      {
        lifecycle: 'keep-alive'
      }
    ]
  })
})
test('a YAML source accepts oauth auth on a URL entry for several clients', () => {
  const repository = mkdtempSync(join(tmpdir(), 'ki-binding-repository-'))
  const userHome = mkdtempSync(join(tmpdir(), 'ki-binding-home-'))
  temporaryDirectories.push(repository, userHome)
  const source = join(userHome, 'mcp-servers.yaml')
  process.env.KI_MCP_SOURCE = source
  writeFileSync(
    source,
    'mcpServers:\n  - name: ki-url\n    clients: [mcporter, claude-code]\n    url: https://example.invalid/mcp\n    transports:\n      mcporter: http\n      claude-code: http\n    auth: oauth\n'
  )
  const context = createBindingSession({
    mode: 'audit',
    repository,
    userHome,
    configuration: {}
  }).subjects[0]?.context() as BindingRubricContext
  expect(context.sourceState).toMatchObject({ kind: 'valid', entries: [{ name: 'ki-url', auth: 'oauth' }] })
})
test('mcporter comparison keeps an absent source auth absent', () => {
  const entry: ServerEntry = {
    name: 'ki-url',
    clients: ['mcporter'],
    url: 'https://example.invalid/mcp',
    transports: { mcporter: 'http' }
  }
  expect(mcporterMatches(entry, { url: 'https://example.invalid/mcp' })).toBe(true)
  expect(mcporterMatches(entry, { url: 'https://example.invalid/mcp', auth: 'oauth' })).toBe(false)
})
test('BIND-1 compares OAuth markers on a baseUrl mcporter target', () => {
  const repository = mkdtempSync(join(tmpdir(), 'ki-binding-repository-'))
  const userHome = mkdtempSync(join(tmpdir(), 'ki-binding-home-'))
  temporaryDirectories.push(repository, userHome)
  const source = join(userHome, 'mcp-servers.yaml')
  const target = join(userHome, 'mcporter.json')
  process.env.KI_MCP_SOURCE = source
  process.env.MCPORTER_CONFIG = target
  writeFileSync(
    source,
    'mcpServers:\n  - name: ki-url\n    clients: [mcporter]\n    url: https://example.invalid/mcp\n    transports:\n      mcporter: http\n    auth: oauth\n'
  )
  const family = catalogue.families[0] as RubricFamily<BindingRubricContext, BindingRubricContext>
  const bind1 = (): unknown => {
    const context = createBindingSession({
      mode: 'audit',
      repository,
      userHome,
      configuration: {}
    }).subjects[0]?.context() as BindingRubricContext
    return family.items[0]?.mechanical?.audit?.run(context)
  }
  writeFileSync(
    target,
    JSON.stringify({ mcpServers: { 'ki-url': { baseUrl: 'https://example.invalid/mcp', auth: 'oauth' } } })
  )
  expect(bind1()).toEqual([expect.objectContaining({ status: 'PASS' })])
  writeFileSync(target, JSON.stringify({ mcpServers: { 'ki-url': { baseUrl: 'https://example.invalid/mcp' } } }))
  expect(bind1()).toEqual([expect.objectContaining({ status: 'VIOLATION' })])
  writeFileSync(
    target,
    JSON.stringify({ mcpServers: { 'ki-url': { baseUrl: 'https://example.invalid/mcp', auth: 'token' } } })
  )
  expect(bind1()).toEqual([expect.objectContaining({ status: 'VIOLATION' })])
})
test('mcporter comparison verifies resolved headers and explicit lifecycle overrides', () => {
  const entry: ServerEntry = {
    name: 'ki-url',
    clients: ['mcporter'],
    url: 'https://example.invalid/mcp',
    transports: { mcporter: 'http' },
    headers: { Authorization: { op: 'op://vault/item/field' } },
    lifecycle: 'ephemeral'
  }
  expect(
    mcporterMatches(entry, {
      url: 'https://example.invalid/mcp',
      headers: { Authorization: 'resolved-secret' },
      lifecycle: 'ephemeral'
    })
  ).toBe(true)
  expect(
    mcporterMatches(entry, {
      url: 'https://example.invalid/mcp',
      headers: { Authorization: 'resolved-secret' },
      lifecycle: 'keep-alive'
    })
  ).toBe(false)
  expect(mcporterMatches(entry, { url: 'https://example.invalid/mcp', lifecycle: 'ephemeral' })).toBe(false)
})
test('missing selected targets stay unavailable and wrong definitions violate', () => {
  const repository = mkdtempSync(join(tmpdir(), 'ki-binding-repository-'))
  const userHome = mkdtempSync(join(tmpdir(), 'ki-binding-home-'))
  temporaryDirectories.push(repository, userHome)
  const source = join(userHome, 'mcp-servers.yaml')
  process.env.KI_MCP_SOURCE = source
  writeFileSync(source, 'mcpServers:\n  - name: ki-example\n    clients: [mcporter]\n    command: node\n')
  delete process.env.MCPORTER_CONFIG
  const family = catalogue.families[0] as RubricFamily<BindingRubricContext, BindingRubricContext>
  let context = createBindingSession({
    mode: 'audit',
    repository,
    userHome,
    configuration: {}
  }).subjects[0]?.context() as BindingRubricContext
  expect(family.items[0]?.mechanical?.audit.run(context)[0]?.status).toBe('INFO')
  const target = join(userHome, 'mcporter.json')
  writeFileSync(target, '{"mcpServers":{"ki-example":{"command":"bun"}}}\n')
  process.env.MCPORTER_CONFIG = target
  context = createBindingSession({
    mode: 'audit',
    repository,
    userHome,
    configuration: {}
  }).subjects[0]?.context() as BindingRubricContext
  expect(family.items[0]?.mechanical?.audit.run(context)[0]?.status).toBe('VIOLATION')
})
test('family modules export only one complete family', async () => {
  for (const file of readdirSync(import.meta.dir).filter(
    (file) => file.endsWith('.ts') && file !== 'index.ts' && !file.endsWith('.test.ts')
  )) {
    const module = (await import(`./${file}`)) as Record<string, unknown>
    expect(Object.keys(module)).toHaveLength(1)
  }
})

test.each([
  ['URL OAuth', { url: 'https://example.invalid/mcp', transports: { mcporter: 'http' }, auth: 'oauth' }, 'valid'],
  ['command OAuth', { command: 'node', auth: 'oauth' }, 'invalid'],
  [
    'unknown URL auth',
    { url: 'https://example.invalid/mcp', transports: { mcporter: 'http' }, auth: 'bearer' },
    'invalid'
  ]
] as const)('the closed schema checks %s', (_label, definition, kind) => {
  const directory = mkdtempSync(join(tmpdir(), 'ki-binding-auth-'))
  temporaryDirectories.push(directory)
  const source = join(directory, 'mcp-servers.yaml')
  writeFileSync(source, JSON.stringify({ mcpServers: [{ name: 'ki-url', clients: ['mcporter'], ...definition }] }))
  const state = readSource(source)
  expect(state.kind).toBe(kind)
  if (kind === 'valid') expect(state).toMatchObject({ entries: [{ auth: 'oauth' }] })
})

test('mcporter comparison preserves URL OAuth and detects missing or unexpected markers', () => {
  const directory = mkdtempSync(join(tmpdir(), 'ki-binding-auth-'))
  temporaryDirectories.push(directory)
  const target = join(directory, 'mcporter.json')
  const entry = {
    name: 'ki-url',
    clients: ['mcporter'],
    url: 'https://example.invalid/mcp',
    transports: { mcporter: 'http' },
    auth: 'oauth'
  } as const satisfies ServerEntry
  process.env.MCPORTER_CONFIG = target
  const context = () =>
    createBindingSession({
      repository: directory,
      userHome: directory,
      mode: 'audit',
      configuration: {}
    }).subjects[0]?.context() as BindingRubricContext
  writeFileSync(target, JSON.stringify({ mcpServers: { 'ki-url': { url: entry.url, auth: 'oauth' } } }))
  const state = context().mcporter
  expect(state.kind).toBe('valid')
  if (state.kind !== 'valid') throw new Error('expected a valid OAuth target')
  expect(state.servers['ki-url']).toMatchObject({ auth: 'oauth' })
  expect(mcporterMatches(entry, state.servers['ki-url'])).toBe(true)
  expect(mcporterMatches(entry, { url: entry.url })).toBe(false)
  const { auth: _auth, ...withoutAuth } = entry
  expect(mcporterMatches(withoutAuth, state.servers['ki-url'])).toBe(false)
  for (const definition of [
    { url: entry.url, auth: 'bearer' },
    { command: 'node', auth: 'oauth' }
  ]) {
    writeFileSync(target, JSON.stringify({ mcpServers: { 'ki-url': definition } }))
    expect(context().mcporter.kind).toBe('invalid')
  }
})
