import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import type { ConformOutcome, RubricOutcomes } from '../../vendored/ki-skills/rubric.ts'

const ACTIVITIES_DIRECTORY = 'Admin/Operations/Activities'
const ACTIVITIES_INDEX = 'Activities.md'

export const KNOWN_REALIZATIONS = ['slash-command', 'scheduled-task', 'conversational', 'manual', 'workflow'] as const
export const KNOWN_STATUSES = ['active', 'paused', 'retired'] as const

export type ActivityNote = {
  relative: string
  indexLink: string
  title: string
  frontmatter: Record<string, string> | null
}

export type ActivitiesContext = {
  target: string
  available: boolean
  harness?: string
  dryRun: boolean
  activitiesAvailable: boolean
  indexContent: string
  notes: readonly ActivityNote[]
  ensureIndex: () => RubricOutcomes<ConformOutcome>
  hasHarnessSkill: (name: string) => boolean
}

const isDirectory = (path: string): boolean => existsSync(path) && statSync(path).isDirectory()
const isFile = (path: string): boolean => existsSync(path) && statSync(path).isFile()

const parseFrontmatter = (text: string): Record<string, string> | null => {
  if (!text.startsWith('---')) return null
  const end = text.indexOf('\n---', 3)
  if (end === -1) return null
  const fields: Record<string, string> = {}
  for (const line of text.slice(3, end).split('\n')) {
    const colon = line.indexOf(':')
    if (colon === -1) continue
    const key = line.slice(0, colon).trim()
    const value = line.slice(colon + 1).trim()
    if (key && value) fields[key] = value
  }
  return fields
}

const walkMarkdown = (directory: string, results: string[] = []): string[] => {
  if (!isDirectory(directory)) return results
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) walkMarkdown(path, results)
    else if (entry.name.endsWith('.md')) results.push(path)
  }
  return results
}

const titleFromNote = (text: string, link: string): string => {
  const body = text.replace(/^---\n[\s\S]*?\n---\n/, '')
  return body.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? link.replace(/\.md$/, '')
}

const oneOrMore = <Outcome>(values: readonly Outcome[]): RubricOutcomes<Outcome> => {
  if (values.length === 0) throw new Error('expected one or more rubric outcomes')
  return [values[0], ...values.slice(1)]
}

export const createActivitiesContextFactory = ({
  target,
  harness,
  dryRun = false
}: {
  target: string
  harness?: string
  dryRun?: boolean
}): (() => ActivitiesContext) => {
  const root = resolve(target)
  const resolvedHarness = harness ? resolve(harness) : undefined

  return () => {
    const available = isDirectory(root)
    const activitiesPath = join(root, ACTIVITIES_DIRECTORY)
    const activitiesAvailable = available && isDirectory(activitiesPath)
    const indexPath = join(activitiesPath, ACTIVITIES_INDEX)
    const indexContent = activitiesAvailable && isFile(indexPath) ? readFileSync(indexPath, 'utf8') : ''
    const notes = activitiesAvailable
      ? walkMarkdown(activitiesPath)
          .filter((path) => path !== indexPath)
          .map((path) => {
            const text = readFileSync(path, 'utf8')
            const indexLink = path.slice(activitiesPath.length + 1)
            return {
              relative: path.slice(root.length + 1),
              indexLink,
              title: titleFromNote(text, indexLink),
              frontmatter: parseFrontmatter(text)
            }
          })
      : []

    const ensureIndex = (): RubricOutcomes<ConformOutcome> => {
      if (!available) return [{ status: 'VIOLATION', message: 'conform target is not an existing directory', subject: root }]
      if (!activitiesAvailable)
        return [{ status: 'NOT_APPLICABLE', message: 'no activities directory — nothing to conform', subject: `${ACTIVITIES_DIRECTORY}/` }]
      if (notes.length === 0) return [{ status: 'PASS', message: 'no activity notes found — nothing to index', subject: ACTIVITIES_INDEX }]

      const missing = notes.filter((note) => !indexContent.includes(note.indexLink))
      if (missing.length === 0)
        return [{ status: 'PASS', message: 'every activity note is listed in the index', subject: ACTIVITIES_INDEX }]

      const contents =
        `${indexContent || '# Activities\n\n'}`.replace(/\n*$/, '\n') +
        missing.map((note) => `- [${note.title}](${note.indexLink})`).join('\n') +
        '\n'
      if (!dryRun) writeFileSync(indexPath, contents)
      return oneOrMore(
        missing.map((note) => ({
          status: 'FIXED' as const,
          message: `${dryRun ? 'would append' : 'appended'} index entry for '${note.title}'`,
          subject: ACTIVITIES_INDEX
        }))
      )
    }

    return {
      target: root,
      available,
      harness: resolvedHarness,
      dryRun,
      activitiesAvailable,
      indexContent,
      notes,
      ensureIndex,
      hasHarnessSkill: (name) => Boolean(resolvedHarness && isFile(join(resolvedHarness, 'skills', name, 'SKILL.md')))
    }
  }
}
