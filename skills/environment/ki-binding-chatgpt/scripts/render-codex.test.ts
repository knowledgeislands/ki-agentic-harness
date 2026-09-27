import { afterEach, expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { type NativeCodexCommand, parseRenderCodexArgs, runRenderCodex } from './render-codex.ts'

const temporaryDirectories: string[] = []
afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) rmSync(directory, { recursive: true, force: true })
})

const stdioSource = `mcpServers:
  - name: ki-example
    clients: [chatgpt-codex]
    command: node
    args: [server.js]
`
const urlSource = `mcpServers:
  - name: ki-example
    clients: [chatgpt-codex]
    url: https://example.invalid/mcp
    transports: { chatgpt-codex: streamable_http }
`

const fixture = (config: string, sourceContents = stdioSource): { home: string; source: string } => {
  const home = mkdtempSync(join(tmpdir(), 'ki-binding-chatgpt-'))
  temporaryDirectories.push(home)
  mkdirSync(join(home, '.codex'), { recursive: true })
  writeFileSync(join(home, '.codex', 'config.toml'), config)
  const source = join(home, 'mcp-servers.yaml')
  writeFileSync(source, sourceContents)
  return { home, source }
}

const stdioRecord = (
  args = ['server.js'],
  env: Record<string, string> | null = null,
  extras: Record<string, unknown> = {}
): string =>
  JSON.stringify({
    name: 'ki-example',
    enabled: true,
    disabled_reason: null,
    transport: { type: 'stdio', command: 'node', args, env, env_vars: null, cwd: null, ...extras },
    enabled_tools: [],
    disabled_tools: [],
    startup_timeout_sec: null,
    tool_timeout_sec: null
  })

const urlRecord = (url: string): string =>
  JSON.stringify({
    name: 'ki-example',
    enabled: true,
    disabled_reason: null,
    transport: { type: 'streamable_http', url, bearer_token_env_var: null, http_headers: null, env_http_headers: null },
    enabled_tools: [],
    disabled_tools: [],
    startup_timeout_sec: null,
    tool_timeout_sec: null
  })

const scriptedNative = (responses: Array<string | Error>): { calls: string[][]; native: NativeCodexCommand } => {
  const calls: string[][] = []
  return {
    calls,
    native: (args) => {
      calls.push([...args])
      const response = responses.shift()
      if (response instanceof Error) throw response
      if (response === undefined) throw new Error('unexpected native command')
      return response
    }
  }
}

const capture = (run: () => number): { result: number; output: string } => {
  let output = ''
  const original = process.stdout.write
  process.stdout.write = ((chunk: string | Uint8Array) => {
    output += typeof chunk === 'string' ? chunk : Buffer.from(chunk).toString('utf8')
    return true
  }) as typeof process.stdout.write
  try {
    return { result: run(), output }
  } finally {
    process.stdout.write = original
  }
}

const options = (home: string, source: string, nativeCommand: NativeCodexCommand) => ({
  check: false,
  json: false,
  help: false,
  home,
  source,
  nativeCommand
})

test('the Codex renderer has strict help and argument handling', () => {
  expect(parseRenderCodexArgs(['--help']).help).toBe(true)
  expect(parseRenderCodexArgs(['--dry-run']).check).toBe(true)
  expect(() => parseRenderCodexArgs(['--source'])).toThrow('requires a value')
  expect(() => parseRenderCodexArgs(['extra'])).toThrow('unknown option')
})

test('check mode is clean when the Codex surface agrees', () => {
  const { home, source } = fixture(`[mcp_servers.ki-example]
command = "node"
args = ["server.js"]
`)
  expect(runRenderCodex({ check: true, json: true, source, help: false, home })).toBe(0)
})

test('check mode reports drift without invoking Codex', () => {
  const { home, source } = fixture('')
  const { calls, native } = scriptedNative([])
  expect(runRenderCodex({ check: true, json: true, source, help: false, home, nativeCommand: native })).toBe(1)
  expect(calls).toEqual([])
})

test('adds a missing server then verifies the native record', () => {
  const { home, source } = fixture('')
  const { calls, native } = scriptedNative(['', stdioRecord()])
  expect(runRenderCodex(options(home, source, native))).toBe(0)
  expect(calls).toEqual([
    ['mcp', 'add', 'ki-example', '--', 'node', 'server.js'],
    ['mcp', 'get', 'ki-example', '--json']
  ])
})

test('captures, replaces, and verifies a replayable stdio server', () => {
  const { home, source } = fixture(`[mcp_servers.ki-example]
command = "node"
args = ["old.js"]
`)
  const { calls, native } = scriptedNative([stdioRecord(['old.js']), '', '', stdioRecord()])
  expect(runRenderCodex(options(home, source, native))).toBe(0)
  expect(calls).toEqual([
    ['mcp', 'get', 'ki-example', '--json'],
    ['mcp', 'remove', 'ki-example'],
    ['mcp', 'add', 'ki-example', '--', 'node', 'server.js'],
    ['mcp', 'get', 'ki-example', '--json']
  ])
})

test('restores a captured server after an add failure without reporting its environment values', () => {
  const { home, source } = fixture(`[mcp_servers.ki-example]
command = "node"
args = ["old.js"]
`)
  const { calls, native } = scriptedNative([
    stdioRecord(['old.js'], { TOKEN: 'top-secret' }),
    '',
    new Error('add failed'),
    ''
  ])
  const { result, output } = capture(() => runRenderCodex(options(home, source, native)))
  expect(result).toBe(1)
  expect(calls).toEqual([
    ['mcp', 'get', 'ki-example', '--json'],
    ['mcp', 'remove', 'ki-example'],
    ['mcp', 'add', 'ki-example', '--', 'node', 'server.js'],
    ['mcp', 'add', 'ki-example', '--env', 'TOKEN=top-secret', '--', 'node', 'old.js']
  ])
  expect(output).toContain('restored its prior native server')
  expect(output).not.toContain('top-secret')
})

test('reports a failed restore without exposing native command details', () => {
  const { home, source } = fixture(`[mcp_servers.ki-example]
command = "node"
args = ["old.js"]
`)
  const { native } = scriptedNative([
    stdioRecord(['old.js'], { TOKEN: 'top-secret' }),
    '',
    new Error('add failed'),
    new Error('restore failed')
  ])
  const { result, output } = capture(() => runRenderCodex(options(home, source, native)))
  expect(result).toBe(1)
  expect(output).toContain('could not be restored')
  expect(output).not.toContain('top-secret')
  expect(output).not.toContain('restore failed')
})

test('restores after post-write verification fails', () => {
  const { home, source } = fixture(`[mcp_servers.ki-example]
command = "node"
args = ["old.js"]
`)
  const { calls, native } = scriptedNative([stdioRecord(['old.js']), '', '', stdioRecord(['wrong.js']), ''])
  const { result, output } = capture(() => runRenderCodex(options(home, source, native)))
  expect(result).toBe(1)
  expect(calls.at(-1)).toEqual(['mcp', 'add', 'ki-example', '--', 'node', 'old.js'])
  expect(output).toContain('restored its prior native server')
})

test('stops before remove when the prior record has an unreplayable native option', () => {
  const { home, source } = fixture(`[mcp_servers.ki-example]
command = "node"
args = ["old.js"]
`)
  const { calls, native } = scriptedNative([stdioRecord(['old.js'], null, { cwd: '/private' })])
  const { result, output } = capture(() => runRenderCodex(options(home, source, native)))
  expect(result).toBe(1)
  expect(calls).toEqual([['mcp', 'get', 'ki-example', '--json']])
  expect(output).toContain('native record is not replayable')
})

test('captures, replaces, and verifies the supported URL server shape', () => {
  const { home, source } = fixture(
    `[mcp_servers.ki-example]
url = "https://old.invalid/mcp"
`,
    urlSource
  )
  const { calls, native } = scriptedNative([
    urlRecord('https://old.invalid/mcp'),
    '',
    '',
    urlRecord('https://example.invalid/mcp')
  ])
  expect(runRenderCodex(options(home, source, native))).toBe(0)
  expect(calls).toEqual([
    ['mcp', 'get', 'ki-example', '--json'],
    ['mcp', 'remove', 'ki-example'],
    ['mcp', 'add', 'ki-example', '--url', 'https://example.invalid/mcp'],
    ['mcp', 'get', 'ki-example', '--json']
  ])
})
