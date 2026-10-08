/**
 * Close-out evidence for the Capital's Project registry: a Project whose records have all finished is due for a
 * close-out assessment before its lead may close it. Open records are counted read-only across every locally
 * registered checkout, so a Project served from another repository is not mistaken for a finished one.
 */
import { existsSync, lstatSync, readdirSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join, relative, resolve } from 'node:path'
import type { StreamsEvidence } from './streams.ts'

const TERMINAL_STATUSES = new Set(['done', 'cancelled'])
const OPEN_LIFECYCLES = new Set(['active', 'paused'])
const CLOSED_LIFECYCLES = new Set(['completed', 'cancelled'])
const ROADMAP_DIRECTORIES = [join('docs', 'roadmap'), join('Streams', 'Roadmap')] as const
const ROADMAP_NON_RECORDS = new Set(['_ISSUES.md', '_IDEAS.md', 'Roadmap.md'])
const CLOSE_OUT_HEADING = /^###\s+Close-out assessment\s*$/m

type ProjectNote = { slug: string; lifecycle: string; assessed: boolean; subject: string }

const table = (value: unknown): Record<string, unknown> | undefined =>
  typeof value === 'object' && value !== null && !Array.isArray(value) ? (value as Record<string, unknown>) : undefined

const directory = (path: string): boolean => existsSync(path) && lstatSync(path).isDirectory()

const frontmatter = (text: string): Record<string, unknown> | undefined => {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(text)
  if (!match) return undefined
  try {
    return table(Bun.YAML.parse(match[1] ?? ''))
  } catch {
    return undefined
  }
}

const repoTable = (root: string): Record<string, unknown> | undefined => {
  const config = join(root, '.ki.toml')
  if (!existsSync(config)) return undefined
  try {
    return table(table(table(Bun.TOML.parse(readFileSync(config, 'utf8')))?.skills)?.['ki-repo'])
  } catch {
    return undefined
  }
}

/** The local ki registry: `$KI_STATE_HOME`, else `$XDG_STATE_HOME/ki`, else `~/.local/state/ki`. */
const registryPath = (environment: NodeJS.ProcessEnv): string => {
  if (environment.KI_STATE_HOME) return join(environment.KI_STATE_HOME, 'registry.toml')
  if (environment.XDG_STATE_HOME) return join(environment.XDG_STATE_HOME, 'ki', 'registry.toml')
  return join(homedir(), '.local', 'state', 'ki', 'registry.toml')
}

/** Registered checkouts by registry key, or undefined when the registry cannot be read. */
const registeredCheckouts = (environment: NodeJS.ProcessEnv): Map<string, string> | undefined => {
  const path = registryPath(environment)
  if (!existsSync(path)) return undefined
  try {
    const repositories = table(table(Bun.TOML.parse(readFileSync(path, 'utf8')))?.repositories) ?? {}
    return new Map(
      Object.entries(repositories).flatMap(([key, entry]): [string, string][] => {
        const checkout = table(entry)?.path
        return typeof checkout === 'string' && directory(checkout) ? [[key, resolve(checkout)]] : []
      })
    )
  } catch {
    return undefined
  }
}

const projectNotes = (root: string, projectsPath: string): ProjectNote[] =>
  readdirSync(projectsPath, { withFileTypes: true })
    .flatMap((entry): string[] => {
      if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'Projects.md')
        return [join(projectsPath, entry.name)]
      const folderNote = join(projectsPath, entry.name, `${entry.name}.md`)
      return entry.isDirectory() && existsSync(folderNote) && lstatSync(folderNote).isFile() ? [folderNote] : []
    })
    .sort()
    .flatMap((path): ProjectNote[] => {
      const text = readFileSync(path, 'utf8')
      const values = frontmatter(text)
      if (values?.note_type !== 'streams/project' || typeof values.slug !== 'string') return []
      const notes = text.split(/^##\s+Notes\s*$/m)[1] ?? ''
      return [
        {
          slug: values.slug,
          lifecycle: typeof values.lifecycle === 'string' ? values.lifecycle : '',
          assessed: CLOSE_OUT_HEADING.test(notes),
          subject: relative(root, path)
        }
      ]
    })

/**
 * Open records per Project slug: bare slugs from the Capital's members, and `<handle>/<slug>` from anywhere, where a
 * handle is the Capital's territory prefix or its registry key.
 */
const openRecords = (checkouts: Iterable<string>, capital: string, handles: readonly string[]): Map<string, number> => {
  const counts = new Map<string, number>()
  for (const checkout of new Set(checkouts)) {
    const member = repoTable(checkout)?.capital === capital
    for (const area of ROADMAP_DIRECTORIES) {
      const path = join(checkout, area)
      if (!directory(path)) continue
      for (const entry of readdirSync(path, { withFileTypes: true })) {
        if (!entry.isFile() || !entry.name.endsWith('.md') || ROADMAP_NON_RECORDS.has(entry.name)) continue
        const values = frontmatter(readFileSync(join(path, entry.name), 'utf8'))
        const project = values?.project
        const status = values?.status
        if (typeof project !== 'string' || (typeof status === 'string' && TERMINAL_STATUSES.has(status))) continue
        const handle = handles.find((candidate) => project.startsWith(`${candidate}/`))
        const slug = handle ? project.slice(handle.length + 1) : member && !project.includes('/') ? project : undefined
        if (slug) counts.set(slug, (counts.get(slug) ?? 0) + 1)
      }
    }
  }
  return counts
}

export const closeOutEvidence = (
  root: string,
  streamsPath: string,
  environment: NodeJS.ProcessEnv = process.env
): StreamsEvidence[] => {
  const projectsPath = join(streamsPath, 'Projects')
  if (!directory(projectsPath)) return [{ level: 'NOT_APPLICABLE', message: 'No Project registry is present.' }]
  const own = repoTable(root)
  const capital = own?.capital
  if (typeof capital !== 'string' || own?.repository !== capital)
    return [
      { level: 'NOT_APPLICABLE', message: 'The base is not a Capital; its territory holds the Project registry.' }
    ]
  const projects = projectNotes(root, projectsPath)
  if (projects.length === 0) return [{ level: 'NOT_APPLICABLE', message: 'No Project notes are present.' }]
  const registered = registeredCheckouts(environment)
  const ownKey = [...(registered ?? [])].find(([, path]) => path === resolve(root))?.[0]
  const handles = [own?.territory_prefix, ownKey].filter((handle): handle is string => typeof handle === 'string')
  const counts = openRecords([resolve(root), ...(registered?.values() ?? [])], capital, handles)
  // Without the registry, records outside the Capital are invisible, so a finished-looking Project is only noted.
  const due = registered ? ('WARN' as const) : ('INFO' as const)
  const findings = projects.flatMap((project): StreamsEvidence[] => {
    const open = counts.get(project.slug) ?? 0
    if (CLOSED_LIFECYCLES.has(project.lifecycle) && !project.assessed)
      return [
        {
          level: 'WARN',
          message: `Project '${project.slug}' is ${project.lifecycle} without a ### Close-out assessment in its ## Notes.`,
          subject: project.subject
        }
      ]
    if (!OPEN_LIFECYCLES.has(project.lifecycle) || open > 0) return []
    return project.assessed
      ? [
          {
            level: 'INFO',
            message: `Project '${project.slug}' has no open records and a close-out assessment; it awaits its lead's close decision.`,
            subject: project.subject
          }
        ]
      : [
          {
            level: due,
            message: `Project '${project.slug}' has no open records: write its close-out assessment in ## Notes, capturing any follow-up as records, or capture its next work.`,
            subject: project.subject
          }
        ]
  })
  return [
    ...findings,
    ...(registered
      ? []
      : [
          {
            level: 'INFO' as const,
            message: `The local ki registry ${registryPath(environment)} is unavailable; only the Capital's own records were counted.`
          }
        ]),
    ...(findings.length
      ? []
      : [{ level: 'PASS' as const, message: 'Every open Project has open records or a close-out assessment.' }])
  ]
}
