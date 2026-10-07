/** Read-only discovery of the Capital's registry under `Streams/Projects/` and `Streams/Initiatives/`. */
import { existsSync, lstatSync, readdirSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { parseStrictYaml as parseYaml } from './strict-yaml.ts'

export type ProjectRegistry = {
  readonly root: string
  readonly projects: ReadonlyMap<string, string | undefined>
  readonly initiatives: ReadonlySet<string>
  /** Set when Initiative slugs still come from the retired `Streams/Projects/Initiatives.md` index. */
  readonly legacyInitiativesIndex: boolean
}
export type RegistryLookup = { readonly registry: ProjectRegistry } | { readonly unavailable: string }

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const PROJECTS_DIRECTORY = join('Streams', 'Projects')
const INITIATIVES_DIRECTORY = join('Streams', 'Initiatives')
const INDEX_NOTES = new Set(['Projects.md', 'Initiatives.md'])
const TOML = (globalThis as unknown as { Bun: { TOML: { parse(text: string): unknown } } }).Bun.TOML

const table = (value: unknown): Record<string, unknown> | undefined =>
  typeof value === 'object' && value !== null && !Array.isArray(value) ? (value as Record<string, unknown>) : undefined

/** The `[skills]` table of a checkout's `.ki.toml`, or undefined when it is absent or unreadable. */
const skillsTable = (root: string): Record<string, unknown> | undefined => {
  const config = join(root, '.ki.toml')
  if (!existsSync(config)) return undefined
  try {
    return table(table(TOML.parse(readFileSync(config, 'utf8')))?.skills)
  } catch {
    return undefined
  }
}

const repoTable = (root: string): Record<string, unknown> | undefined => table(skillsTable(root)?.['ki-repo'])

/** The local ki registry: `$KI_STATE_HOME`, else `$XDG_STATE_HOME/ki`, else `~/.local/state/ki`. */
export const kiRegistryPath = (environment: NodeJS.ProcessEnv = process.env): string => {
  if (environment.KI_STATE_HOME) return join(environment.KI_STATE_HOME, 'registry.toml')
  if (environment.XDG_STATE_HOME) return join(environment.XDG_STATE_HOME, 'ki', 'registry.toml')
  return join(homedir(), '.local', 'state', 'ki', 'registry.toml')
}

/** The local ki registry's repository table, or the reason it cannot be read. */
const registeredRepositories = (
  environment: NodeJS.ProcessEnv
): { readonly repositories: Record<string, unknown> } | { readonly unavailable: string } => {
  const registryFile = kiRegistryPath(environment)
  if (!existsSync(registryFile)) return { unavailable: `the local ki registry ${registryFile} is missing` }
  try {
    return { repositories: table(table(TOML.parse(readFileSync(registryFile, 'utf8')))?.repositories) ?? {} }
  } catch {
    return { unavailable: `the local ki registry ${registryFile} cannot be parsed` }
  }
}

const capitalRoot = (repository: string, environment: NodeJS.ProcessEnv): string | { unavailable: string } => {
  const own = repoTable(repository)
  const capital = own?.capital
  if (typeof capital !== 'string' || !capital) return { unavailable: 'the repository declares no ki-repo capital' }
  if (own?.repository === capital) return repository
  const registered = registeredRepositories(environment)
  if ('unavailable' in registered) return registered
  const found = Object.values(registered.repositories).flatMap((entry) => {
    const path = table(entry)?.path
    if (typeof path !== 'string') return []
    const declared = repoTable(path)
    return declared?.repository === capital && declared.capital === capital ? [path] : []
  })
  if (found.length > 1) return { unavailable: `the capital ${capital} has ambiguous registered checkouts` }
  return found[0] ?? { unavailable: `no local checkout of the capital ${capital} is registered` }
}

/** Resolve the same Capital handle used by CLI territory selection, never a prefixed Capital's registry-key alias. */
const territoryRoot = (territory: string, environment: NodeJS.ProcessEnv): string | { unavailable: string } => {
  const registered = registeredRepositories(environment)
  if ('unavailable' in registered) return registered
  const capitals: { key: string; path: string; identity: string; handle: string }[] = []
  for (const [key, entry] of Object.entries(registered.repositories)) {
    const path = table(entry)?.path
    if (typeof path !== 'string') continue
    const declared = repoTable(path)
    if (typeof declared?.repository !== 'string' || declared.repository !== declared.capital) continue
    const prefix = declared.territory_prefix
    if (prefix !== undefined && (typeof prefix !== 'string' || !/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(prefix)))
      return { unavailable: `registered Capital '${key}' has an invalid territory_prefix` }
    capitals.push({ key, path, identity: declared.repository, handle: typeof prefix === 'string' ? prefix : key })
  }
  const collisions = capitals.filter((candidate, index) =>
    capitals.some((other, otherIndex) => index !== otherIndex && candidate.handle === other.handle)
  )
  if (collisions.length)
    return { unavailable: `territory handle '${collisions[0]?.handle}' is ambiguous in the local ki registry` }
  const found = capitals.filter(({ handle }) => handle === territory)
  const [capital] = found
  if (found.length === 1 && capital) {
    if (capitals.filter(({ identity }) => identity === capital.identity).length !== 1)
      return { unavailable: `territory '${territory}' has ambiguous registered Capital identity` }
    return capital.path
  }
  if (registered.repositories[territory] !== undefined)
    return { unavailable: `territory '${territory}' is not a registered Capital handle` }
  return { unavailable: `territory '${territory}' is not in the local ki registry` }
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

const isDirectory = (path: string): boolean => existsSync(path) && lstatSync(path).isDirectory()

/**
 * Registry notes inside a registry folder, by name and text: each regular Markdown note directly inside it, and the
 * folder note `<slug>/<slug>.md` of a registry note that holds a `ki-design-loop` design folder.
 */
const notes = (directory: string | undefined): [string, string][] =>
  directory === undefined
    ? []
    : readdirSync(directory, { withFileTypes: true }).flatMap((entry): [string, string][] => {
        if (entry.isFile() && entry.name.endsWith('.md'))
          return [[entry.name, readFileSync(join(directory, entry.name), 'utf8')]]
        const folderNote = join(directory, entry.name, `${entry.name}.md`)
        if (entry.isDirectory() && existsSync(folderNote) && lstatSync(folderNote).isFile())
          return [[`${entry.name}.md`, readFileSync(folderNote, 'utf8')]]
        return []
      })

/** Reads one Capital's registry folders, or reports why they are absent. */
const readRegistry = (root: string): RegistryLookup => {
  const projectsDirectory = join(root, PROJECTS_DIRECTORY)
  const initiativesDirectory = join(root, INITIATIVES_DIRECTORY)
  const hasProjects = isDirectory(projectsDirectory)
  const hasInitiatives = isDirectory(initiativesDirectory)
  if (!hasProjects && !hasInitiatives)
    return { unavailable: `the capital has no ${PROJECTS_DIRECTORY}/ or ${INITIATIVES_DIRECTORY}/ registry` }
  const projects = new Map<string, string | undefined>()
  const initiatives = new Set<string>()
  let legacyInitiativesIndex = false
  for (const [name, text] of notes(hasProjects ? projectsDirectory : undefined)) {
    const values = frontmatter(text)
    if (name === 'Initiatives.md') {
      // Retired index: still read, with a warning.
      legacyInitiativesIndex = true
      const declared = Array.isArray(values?.initiatives) ? values.initiatives : []
      for (const slug of declared) if (typeof slug === 'string' && SLUG_RE.test(slug)) initiatives.add(slug)
      for (const match of text.matchAll(/^Slug `([a-z0-9]+(?:-[a-z0-9]+)*)`\./gm)) initiatives.add(match[1])
      continue
    }
    if (INDEX_NOTES.has(name) || values?.note_type !== 'streams/project') continue
    if (typeof values.slug !== 'string' || !SLUG_RE.test(values.slug)) continue
    const initiative = typeof values.initiative === 'string' ? values.initiative : undefined
    projects.set(values.slug, initiative)
    if (initiative) initiatives.add(initiative)
  }
  for (const [name, text] of notes(hasInitiatives ? initiativesDirectory : undefined)) {
    const values = frontmatter(text)
    if (INDEX_NOTES.has(name) || values?.note_type !== 'streams/initiative') continue
    if (typeof values.slug === 'string' && SLUG_RE.test(values.slug)) initiatives.add(values.slug)
  }
  return { registry: { root, projects, initiatives, legacyInitiativesIndex } }
}

/** Resolves the repository's own Capital registry; any unavailable step is reported once by the caller, never as a failure. */
export const loadProjectRegistry = (
  repository: string,
  environment: NodeJS.ProcessEnv = process.env
): RegistryLookup => {
  const root = capitalRoot(repository, environment)
  return typeof root === 'string' ? readRegistry(root) : root
}

/** Resolves the named territory handle through registered Capitals' declared prefixes or prefix-less registry keys. */
export const loadTerritoryRegistry = (
  territory: string,
  environment: NodeJS.ProcessEnv = process.env
): RegistryLookup => {
  const root = territoryRoot(territory, environment)
  return typeof root === 'string' ? readRegistry(root) : root
}

/** Canonical Capital whose territory must use the existing strict area-map enforcement. */
export const ENFORCING_CAPITAL = 'https://github.com/knowledgeislands/ki-arcadia-principal'

/** Unresolvable Capitals warn; canonical territory_members, never handles or Agora rosters, determine enforcement. */
export const isEnforcingTerritoryRepository = (
  repository: string,
  environment: NodeJS.ProcessEnv = process.env
): boolean => {
  const identity = repoTable(repository)?.repository
  const root = capitalRoot(repository, environment)
  if (typeof identity !== 'string' || typeof root !== 'string') return false
  const capital = repoTable(root)
  const members = Array.isArray(capital?.territory_members) ? capital.territory_members : []
  return (
    capital?.repository === ENFORCING_CAPITAL && capital.capital === ENFORCING_CAPITAL && members.includes(identity)
  )
}

export type RegistryReference = { readonly territory?: string; readonly slug: string }

const TERRITORY_RE = /^[a-z0-9][a-z0-9._-]*$/

/** Splits `<territory>/<slug>` or a bare `<slug>`; undefined when the value is neither. */
export const parseRegistryReference = (value: string): RegistryReference | undefined => {
  const parts = value.split('/')
  if (parts.length === 1) return SLUG_RE.test(value) ? { slug: value } : undefined
  const [territory, slug] = parts
  return parts.length === 2 && TERRITORY_RE.test(territory) && SLUG_RE.test(slug) ? { territory, slug } : undefined
}
