import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import {
  physicalFile,
  readSource,
  resolveSource,
  type ServerEntry,
  type SourceState,
  targeted
} from '../../shared/binding.ts'
import type { RubricContextOptions, RubricPublicationContext, RubricSession } from '../../shared/rubric.ts'

type CodexTarget =
  | { kind: 'unavailable'; path: string }
  | { kind: 'invalid'; path: string }
  | { kind: 'valid'; path: string; servers: Readonly<Record<string, Record<string, unknown>>> }
export type CodexBindingContext = {
  rubric: RubricPublicationContext
  source: string
  sourceState: SourceState
  target: CodexTarget
}
declare const Bun: { TOML: { parse(input: string): unknown }; which(command: string): string | null }
const inspect = (path: string): CodexTarget => {
  if (!physicalFile(path)) return { kind: 'unavailable', path }
  try {
    const config = Bun.TOML.parse(readFileSync(path, 'utf8')) as { mcp_servers?: unknown }
    if (!config.mcp_servers || typeof config.mcp_servers !== 'object' || Array.isArray(config.mcp_servers))
      return { kind: 'invalid', path }
    const servers: Record<string, Record<string, unknown>> = {}
    for (const [name, value] of Object.entries(config.mcp_servers as Record<string, unknown>)) {
      if (!value || typeof value !== 'object' || Array.isArray(value)) return { kind: 'invalid', path }
      servers[name] = value as Record<string, unknown>
    }
    return { kind: 'valid', path, servers }
  } catch {
    return { kind: 'invalid', path }
  }
}
const sameEnvironment = (expected: Readonly<Record<string, string | { op: string }>>, actual: unknown): boolean => {
  if (actual !== undefined && (!actual || typeof actual !== 'object' || Array.isArray(actual))) return false
  const received = (actual ?? {}) as Record<string, unknown>
  if (JSON.stringify(Object.keys(received).sort()) !== JSON.stringify(Object.keys(expected).sort())) return false
  return Object.entries(expected).every(([key, value]) =>
    typeof value === 'string' ? received[key] === value : typeof received[key] === 'string' && received[key].length > 0
  )
}
const sameCommand = (expected: string, actual: unknown, home: string): boolean => {
  if (typeof actual !== 'string') return false
  if (expected.includes('/')) return actual === expected
  return (
    actual === expected ||
    actual === Bun.which(expected) ||
    (expected === 'node' && actual === join(home, '.local', 'share', 'mise', 'shims', 'node'))
  )
}
const renderedArgument = (argument: string, home: string): string =>
  argument === '~' ? home : argument.startsWith('~/') ? join(home, argument.slice(2)) : argument
const sameArguments = (expected: readonly string[], actual: unknown, home: string): boolean =>
  Array.isArray(actual) &&
  actual.length === expected.length &&
  expected.every(
    (argument, index) =>
      typeof actual[index] === 'string' &&
      (actual[index] === argument || actual[index] === renderedArgument(argument, home))
  )
const same = (entry: ServerEntry, actual: Record<string, unknown> | undefined, home: string): boolean =>
  'url' in entry
    ? actual?.url === entry.url
    : !!actual &&
      sameCommand(entry.command, actual.command, home) &&
      sameArguments(entry.args, actual.args ?? [], home) &&
      sameEnvironment(entry.env, actual.env)
export const mismatches = (sourceState: SourceState, target: CodexTarget): readonly ServerEntry[] | null =>
  sourceState.kind === 'valid' && target.kind === 'valid'
    ? targeted(sourceState.entries, 'chatgpt-codex').filter(
        (entry) => !same(entry, target.servers[entry.name], dirname(dirname(target.path)))
      )
    : null
export const createCodexBindingSession = ({
  repository,
  userHome,
  publication
}: RubricContextOptions): RubricSession<CodexBindingContext> => {
  const home = resolve(userHome),
    source = resolveSource({ home }),
    context: CodexBindingContext = {
      rubric: { publication },
      source,
      sourceState: readSource(source),
      target: inspect(join(home, '.codex', 'config.toml'))
    }
  return {
    subjects: [
      { families: ['CODEXBIND'], context: () => context, subject: resolve(repository) },
      { families: ['RUBRIC'], context: () => context, subject: resolve(repository) }
    ],
    proposal: () => ({ writes: [] })
  }
}
