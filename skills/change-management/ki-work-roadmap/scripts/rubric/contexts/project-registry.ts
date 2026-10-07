/** Read-only discovery of the Capital's Project registry under `Streams/Projects/`. */
import { existsSync, lstatSync, readdirSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { parseStrictYaml as parseYaml } from './strict-yaml.ts'

export type ProjectRegistry = {
  readonly root: string
  readonly projects: ReadonlyMap<string, string | undefined>
  readonly initiatives: ReadonlySet<string>
}
export type RegistryLookup = { readonly registry: ProjectRegistry } | { readonly unavailable: string }

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const PROJECTS_DIRECTORY = join('Streams', 'Projects')
const INDEX_NOTES = new Set(['Projects.md', 'Initiatives.md'])
const TOML = (globalThis as unknown as { Bun: { TOML: { parse(text: string): unknown } } }).Bun.TOML

const table = (value: unknown): Record<string, unknown> | undefined =>
  typeof value === 'object' && value !== null && !Array.isArray(value) ? (value as Record<string, unknown>) : undefined

const repoTable = (root: string): Record<string, unknown> | undefined => {
  const config = join(root, '.ki.toml')
  if (!existsSync(config)) return undefined
  try {
    return table(table(table(TOML.parse(readFileSync(config, 'utf8')))?.skills)?.['ki-repo'])
  } catch {
    return undefined
  }
}

/** The local ki registry: `$KI_STATE_HOME`, else `$XDG_STATE_HOME/ki`, else `~/.local/state/ki`. */
export const kiRegistryPath = (environment: NodeJS.ProcessEnv = process.env): string => {
  if (environment.KI_STATE_HOME) return join(environment.KI_STATE_HOME, 'registry.toml')
  if (environment.XDG_STATE_HOME) return join(environment.XDG_STATE_HOME, 'ki', 'registry.toml')
  return join(homedir(), '.local', 'state', 'ki', 'registry.toml')
}

const capitalRoot = (repository: string, environment: NodeJS.ProcessEnv): string | { unavailable: string } => {
  const own = repoTable(repository)
  const capital = own?.capital
  if (typeof capital !== 'string' || !capital) return { unavailable: 'the repository declares no ki-repo capital' }
  if (own?.repository === capital) return repository
  const registryFile = kiRegistryPath(environment)
  if (!existsSync(registryFile)) return { unavailable: `the local ki registry ${registryFile} is missing` }
  let repositories: Record<string, unknown> | undefined
  try {
    repositories = table(table(TOML.parse(readFileSync(registryFile, 'utf8')))?.repositories)
  } catch {
    return { unavailable: `the local ki registry ${registryFile} cannot be parsed` }
  }
  for (const entry of Object.values(repositories ?? {})) {
    const values = table(entry)
    if (values?.repository !== capital || typeof values.path !== 'string') continue
    if (repoTable(values.path)?.repository === capital) return values.path
  }
  return { unavailable: `no local checkout of the capital ${capital} is registered` }
}

const frontmatter = (text: string): Record<string, unknown> | undefined => {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!match) return undefined
  try {
    return table(parseYaml(match[1]))
  } catch {
    return undefined
  }
}

/** Resolves the Capital's registry; any unavailable step is reported once by the caller, never as a failure. */
export const loadProjectRegistry = (
  repository: string,
  environment: NodeJS.ProcessEnv = process.env
): RegistryLookup => {
  const root = capitalRoot(repository, environment)
  if (typeof root !== 'string') return root
  const directory = join(root, PROJECTS_DIRECTORY)
  if (!existsSync(directory) || !lstatSync(directory).isDirectory())
    return { unavailable: `the capital has no ${PROJECTS_DIRECTORY}/ registry` }
  const projects = new Map<string, string | undefined>()
  const initiatives = new Set<string>()
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue
    const text = readFileSync(join(directory, entry.name), 'utf8')
    const values = frontmatter(text)
    if (entry.name === 'Initiatives.md') {
      const declared = Array.isArray(values?.initiatives) ? values.initiatives : []
      for (const slug of declared) if (typeof slug === 'string' && SLUG_RE.test(slug)) initiatives.add(slug)
      for (const match of text.matchAll(/^Slug `([a-z0-9]+(?:-[a-z0-9]+)*)`\./gm)) initiatives.add(match[1])
      continue
    }
    if (INDEX_NOTES.has(entry.name) || values?.note_type !== 'streams/project') continue
    if (typeof values.slug !== 'string' || !SLUG_RE.test(values.slug)) continue
    const initiative = typeof values.initiative === 'string' ? values.initiative : undefined
    projects.set(values.slug, initiative)
    if (initiative) initiatives.add(initiative)
  }
  return { registry: { root, projects, initiatives } }
}
