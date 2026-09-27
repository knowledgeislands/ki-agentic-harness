import { type Dirent, lstatSync, readdirSync, readFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import type { RubricContextOptions, RubricPublicationContext, RubricSession } from '../../shared/rubric.ts'

export type CodexDefinition = { file: string; values: ReadonlyMap<string, unknown>; parseError: string | null }
export type CodexContext = {
  rubric: RubricPublicationContext
  definition: CodexDefinition | null
  definitions: readonly CodexDefinition[]
  unsafePath: string | null
  rootState: 'absent' | 'physical' | 'unsafe'
}
const state = (path: string): 'missing' | 'file' | 'directory' | 'unsafe' => {
  try {
    const entry = lstatSync(path)
    return entry.isSymbolicLink() ? 'unsafe' : entry.isFile() ? 'file' : entry.isDirectory() ? 'directory' : 'unsafe'
  } catch (error) {
    return (error as NodeJS.ErrnoException).code === 'ENOENT' ? 'missing' : 'unsafe'
  }
}
const parse = (file: string): CodexDefinition => {
  const text = readFileSync(file, 'utf8')
  try {
    const value = Bun.TOML.parse(text)
    return value && typeof value === 'object' && !Array.isArray(value)
      ? { file, values: new Map(Object.entries(value)), parseError: null }
      : { file, values: new Map(), parseError: 'TOML root must be a table.' }
  } catch (error) {
    return { file, values: new Map(), parseError: error instanceof Error ? error.message : 'TOML could not be parsed.' }
  }
}
export const createCodexSession = ({
  mode: _mode,
  repository,
  publication
}: RubricContextOptions): RubricSession<CodexContext> => {
  const root = resolve(repository)
  const agentRoot = join(root, '.codex', 'agents')
  const raw = state(agentRoot)
  const rootState = raw === 'missing' ? 'absent' : raw === 'directory' ? 'physical' : 'unsafe'
  const files: string[] = []
  const unsafe: string[] = []
  const walk = (directory: string, depth: number): void => {
    if (depth > 12) {
      unsafe.push(relative(root, directory))
      return
    }
    let entries: Dirent[]
    try {
      entries = readdirSync(directory, { withFileTypes: true })
    } catch {
      unsafe.push(relative(root, directory))
      return
    }
    for (const entry of entries) {
      const path = join(directory, entry.name)
      const entryState = state(path)
      if (entryState === 'directory') walk(path, depth + 1)
      else if (entryState === 'file' && entry.name.endsWith('.toml')) files.push(path)
      else if (entryState === 'unsafe') unsafe.push(relative(root, path))
    }
  }
  if (rootState === 'physical') walk(agentRoot, 0)
  else if (rootState === 'unsafe') unsafe.push('.codex/agents')
  const definitions: CodexDefinition[] = []
  for (const file of files.sort()) {
    try {
      definitions.push(parse(file))
    } catch {
      unsafe.push(relative(root, file))
    }
  }
  const context = (definition: CodexDefinition | null, unsafePath: string | null): CodexContext => ({
    rubric: { publication },
    definition,
    definitions,
    unsafePath,
    rootState
  })
  const subjects = definitions.map((definition) => ({
    families: ['CODEX'],
    context: () => context(definition, null),
    subject: relative(root, definition.file)
  }))
  for (const unsafePath of [...new Set(unsafe)].sort())
    subjects.push({ families: ['CODEX'], context: () => context(null, unsafePath), subject: unsafePath })
  if (!subjects.length)
    subjects.push({ families: ['CODEX'], context: () => context(null, null), subject: '.codex/agents' })
  subjects.push({ families: ['RUBRIC'], context: () => context(null, null), subject: root })
  return { subjects, proposal: () => ({ writes: [] }) }
}
