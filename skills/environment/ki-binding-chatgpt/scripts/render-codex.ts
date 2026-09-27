#!/usr/bin/env bun
/**
 * Purpose: Merge KI-governed MCP servers into Codex CLI configuration.
 * Run: bun scripts/render-codex.ts --help
 * Boundary: --check is read-only; writes are delegated to the native Codex CLI so
 * non-KI configuration remains under that CLI's ownership.
 *
 * This remains a public command because Codex's native writer is the safe merge boundary
 * for a live config that also contains non-KI servers; it is not a rubric-host file draft.
 */

import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'
import { type EnvValue, readSource, type ServerEntry } from './shared/binding.ts'

declare const Bun: { YAML: { parse(input: string): unknown }; TOML: { parse(input: string): unknown } }

const HELP = `Usage: bun scripts/render-codex.ts [options]

Render KI-governed MCP servers into the Codex CLI surface.

Options:
  --check, --dry-run  Report planned Codex changes without writing them.
  --source <path>     Use an explicit mcp-servers.yaml source.
  --json              Emit findings as JSON.
  -h, --help          Show this help and exit.
`
const REF = 'references/standards-codex-binding.md'

type Options = { check: boolean; json: boolean; source?: string; help: boolean; home?: string }
type Level = 'FAIL' | 'WARN' | 'PASS'
type Finding = { level: Level; msg: string; ref: string; file?: string }
type CodexServer = {
  command?: unknown
  args?: unknown
  env?: unknown
  url?: unknown
}
type NativeSnapshot =
  | { transport: 'stdio'; command: string; args: string[]; env: Record<string, string> }
  | { transport: 'streamable_http'; url: string }
export type NativeCodexCommand = (args: readonly string[]) => string
export type RenderCodexOptions = Options & { nativeCommand?: NativeCodexCommand }

const nativeCodexCommand: NativeCodexCommand = (args) =>
  execFileSync('codex', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })

const valueAfter = (argv: readonly string[], index: number, option: string): string => {
  const value = argv[index + 1]
  if (!value || value.startsWith('-')) throw new Error(`${option} requires a value`)
  return value
}

export const parseRenderCodexArgs = (argv: readonly string[]): Options => {
  let check = false
  let json = false
  let source: string | undefined
  let help = false
  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index] as string
    if (argument === '-h' || argument === '--help') help = true
    else if (argument === '--check' || argument === '--dry-run') check = true
    else if (argument === '--json') json = true
    else if (argument === '--source') source = valueAfter(argv, index++, argument)
    else throw new Error(`unknown option: ${argument}`)
  }
  return { check, json, source, help }
}

const sourceEntries = (path: string): readonly ServerEntry[] => {
  const source = readSource(path)
  if (source.kind === 'absent') throw new Error(`source does not exist: ${path}`)
  if (source.kind === 'invalid') throw new Error(`source is invalid: ${source.message}`)
  return source.entries
}

const codexServers = (path: string): Record<string, CodexServer> => {
  if (!existsSync(path)) return {}
  const parsed = Bun.TOML.parse(readFileSync(path, 'utf8')) as { mcp_servers?: unknown }
  return parsed.mcp_servers && typeof parsed.mcp_servers === 'object'
    ? (parsed.mcp_servers as Record<string, CodexServer>)
    : {}
}

const plainEnv = (env: Readonly<Record<string, EnvValue>>): Record<string, string> | null => {
  const values: Record<string, string> = {}
  for (const [key, value] of Object.entries(env)) {
    if (value && typeof value === 'object' && typeof (value as { op?: unknown }).op === 'string') return null
    values[key] = String(value)
  }
  return values
}

const orderedRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object'
    ? Object.fromEntries(
        Object.entries(value as Record<string, unknown>).sort(([left], [right]) => left.localeCompare(right))
      )
    : {}

const sameServer = (entry: ServerEntry, actual: CodexServer | undefined): boolean => {
  if (!actual) return false
  if ('url' in entry) return actual.url === entry.url
  const expectedEnv = plainEnv(entry.env)
  return (
    actual.command === entry.command &&
    JSON.stringify(actual.args ?? []) === JSON.stringify(entry.args) &&
    expectedEnv !== null &&
    JSON.stringify(orderedRecord(actual.env)) === JSON.stringify(orderedRecord(expectedEnv))
  )
}

const resolveEnvValue = (value: EnvValue): string => {
  if (value && typeof value === 'object' && typeof (value as { op?: unknown }).op === 'string')
    return execFileSync('op', ['read', (value as { op: string }).op], { encoding: 'utf8' }).trim()
  return String(value)
}

const addArgs = (entry: ServerEntry): string[] => {
  if ('url' in entry) return ['mcp', 'add', entry.name, '--url', entry.url]
  const args = ['mcp', 'add', entry.name]
  for (const [key, value] of Object.entries(entry.env)) args.push('--env', `${key}=${resolveEnvValue(value)}`)
  args.push('--', entry.command, ...entry.args)
  return args
}

const shownCommand = (entry: ServerEntry): string => {
  if ('url' in entry) return `codex mcp add ${entry.name} --url ${entry.url}`
  const env = Object.keys(entry.env).flatMap((key) => ['--env', `${key}=***`])
  return ['codex', 'mcp', 'add', entry.name, ...env, '--', entry.command, ...entry.args].join(' ')
}

const record = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : null

const strings = (value: unknown): string[] | null =>
  Array.isArray(value) && value.every((item) => typeof item === 'string') ? [...value] : null

const stringRecord = (value: unknown): Record<string, string> | null => {
  const values = record(value)
  if (!values) return null
  if (!Object.values(values).every((item) => typeof item === 'string')) return null
  return Object.fromEntries(Object.entries(values).map(([key, item]) => [key, item as string]))
}

const absentOrEmpty = (value: unknown): boolean =>
  value === undefined ||
  value === null ||
  (Array.isArray(value) && value.length === 0) ||
  (record(value) !== null && Object.keys(record(value) ?? {}).length === 0)

const hasOnly = (value: Record<string, unknown>, allowed: readonly string[]): boolean =>
  Object.keys(value).every((key) => allowed.includes(key))

const nativeSnapshot = (name: string, output: string): NativeSnapshot => {
  let parsed: unknown
  try {
    parsed = JSON.parse(output)
  } catch {
    throw new Error(`native record for ${name} is not JSON`)
  }
  const root = record(parsed)
  const transport = root && record(root.transport)
  if (!root || !transport || root.name !== name || root.enabled !== true || root.disabled_reason !== null)
    throw new Error(`native record for ${name} is not an enabled server`)
  if (
    !absentOrEmpty(root.enabled_tools) ||
    !absentOrEmpty(root.disabled_tools) ||
    !absentOrEmpty(root.startup_timeout_sec) ||
    !absentOrEmpty(root.tool_timeout_sec)
  )
    throw new Error(`native record for ${name} has options this renderer cannot replay`)

  if (transport.type === 'stdio') {
    if (!hasOnly(transport, ['type', 'command', 'args', 'env', 'env_vars', 'cwd']))
      throw new Error(`native record for ${name} has an unsupported stdio option`)
    const args = strings(transport.args)
    const env = transport.env === null ? {} : stringRecord(transport.env)
    if (
      typeof transport.command !== 'string' ||
      !args ||
      !env ||
      !absentOrEmpty(transport.env_vars) ||
      !absentOrEmpty(transport.cwd)
    )
      throw new Error(`native record for ${name} is not replayable stdio`)
    return { transport: 'stdio', command: transport.command, args, env }
  }
  if (transport.type === 'streamable_http') {
    if (!hasOnly(transport, ['type', 'url', 'bearer_token_env_var', 'http_headers', 'env_http_headers']))
      throw new Error(`native record for ${name} has an unsupported HTTP option`)
    if (
      typeof transport.url !== 'string' ||
      !absentOrEmpty(transport.bearer_token_env_var) ||
      !absentOrEmpty(transport.http_headers) ||
      !absentOrEmpty(transport.env_http_headers)
    )
      throw new Error(`native record for ${name} is not replayable HTTP`)
    return { transport: 'streamable_http', url: transport.url }
  }
  throw new Error(`native record for ${name} has an unsupported transport`)
}

const replayArgs = (name: string, snapshot: NativeSnapshot): string[] => {
  if (snapshot.transport === 'streamable_http') return ['mcp', 'add', name, '--url', snapshot.url]
  const args = ['mcp', 'add', name]
  for (const [key, value] of Object.entries(snapshot.env)) args.push('--env', `${key}=${value}`)
  args.push('--', snapshot.command, ...snapshot.args)
  return args
}

const matches = (entry: ServerEntry, snapshot: NativeSnapshot): boolean => {
  if ('url' in entry) return snapshot.transport === 'streamable_http' && snapshot.url === entry.url
  const env = plainEnv(entry.env)
  return (
    snapshot.transport === 'stdio' &&
    snapshot.command === entry.command &&
    JSON.stringify(snapshot.args) === JSON.stringify(entry.args) &&
    env !== null &&
    JSON.stringify(orderedRecord(snapshot.env)) === JSON.stringify(orderedRecord(env))
  )
}

export const runRenderCodex = (options: RenderCodexOptions): number => {
  const home = options.home ?? homedir()
  const canonical = join(process.env.XDG_CONFIG_HOME ?? join(home, '.config'), 'ki', 'mcp-servers.yaml')
  const override = options.source ?? process.env.KI_MCP_SOURCE
  const source = override ? resolve(override) : canonical
  const configPath = join(home, '.codex', 'config.toml')
  const entries = sourceEntries(source)
  const universe = new Set(entries.map((entry) => entry.name))
  const desired = entries.filter((entry) => entry.clients.includes('chatgpt-codex'))
  const actual = codexServers(configPath)
  const toAdd = desired.filter((entry) => !sameServer(entry, actual[entry.name]))
  const desiredNames = new Set(desired.map((entry) => entry.name))
  const toRemove = Object.keys(actual).filter((name) => universe.has(name) && !desiredNames.has(name))
  const findings: Finding[] = []
  const native = options.nativeCommand ?? nativeCodexCommand
  let failed = false
  const add = (level: Level, msg: string): void => {
    findings.push({ level, msg, ref: REF, file: configPath })
  }
  for (const entry of toAdd) {
    if (options.check) add('WARN', `would render \`${entry.name}\` → ${shownCommand(entry)}`)
    else {
      let desiredAdd: string[]
      try {
        desiredAdd = addArgs(entry)
      } catch {
        failed = true
        add('FAIL', `did not render \`${entry.name}\`: canonical entry cannot be passed to the native writer`)
        continue
      }
      let prior: NativeSnapshot | undefined
      let removed = false
      if (actual[entry.name]) {
        try {
          prior = nativeSnapshot(entry.name, native(['mcp', 'get', entry.name, '--json']))
        } catch {
          failed = true
          add('FAIL', `did not replace \`${entry.name}\`: native record is not replayable`)
          continue
        }
      }
      try {
        if (prior) {
          native(['mcp', 'remove', entry.name])
          removed = true
        }
        native(desiredAdd)
        const rendered = nativeSnapshot(entry.name, native(['mcp', 'get', entry.name, '--json']))
        if (!matches(entry, rendered))
          throw new Error(`post-write verification disagrees with the source for ${entry.name}`)
        add('PASS', `rendered \`${entry.name}\` to Codex`)
      } catch {
        failed = true
        if (!prior || !removed) {
          add('FAIL', `did not render \`${entry.name}\`: native replacement command failed`)
          continue
        }
        try {
          native(replayArgs(entry.name, prior))
          add('FAIL', `did not render \`${entry.name}\`; restored its prior native server`)
        } catch {
          add('FAIL', `did not render \`${entry.name}\`; its prior native server could not be restored`)
        }
      }
    }
  }
  for (const name of toRemove) {
    if (options.check) add('WARN', `would remove \`${name}\` → codex mcp remove ${name}`)
    else {
      try {
        native(['mcp', 'remove', name])
        add('PASS', `removed \`${name}\` from Codex`)
      } catch {
        failed = true
        add('FAIL', `did not remove \`${name}\`: native remove command failed`)
      }
    }
  }
  const planned = toAdd.length + toRemove.length
  if (planned === 0) add('PASS', `Codex agrees with the source (${desired.length} server(s) target Codex)`)
  if (options.json)
    process.stdout.write(
      `${JSON.stringify({ concern: 'ki-binding-chatgpt render-codex', target: configPath, source, findings }, null, 2)}\n`
    )
  else
    for (const finding of findings)
      process.stdout.write(`${finding.level} ${finding.file}  ${finding.msg} (${finding.ref})\n`)
  return failed || (options.check && planned > 0) ? 1 : 0
}

export const main = (argv = process.argv.slice(2)): number => {
  try {
    const options = parseRenderCodexArgs(argv)
    if (options.help) {
      process.stdout.write(HELP)
      return 0
    }
    return runRenderCodex(options)
  } catch (error) {
    process.stderr.write(`render-codex: ${error instanceof Error ? error.message : String(error)}\n`)
    return 1
  }
}

if (import.meta.main) process.exitCode = main()
