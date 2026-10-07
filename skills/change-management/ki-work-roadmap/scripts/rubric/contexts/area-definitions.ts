/** Area-definition check: every declared issuing area is named in the repository's roadmap index. */
import { existsSync, lstatSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Finding } from './roadmap-evidence.ts'

const STANDARD = 'references/standards-repository-roadmaps.md'
const TOML = (globalThis as unknown as { Bun: { TOML: { parse(text: string): unknown } } }).Bun.TOML

/** The index that defines area codes: a KB's roadmap index note, otherwise docs/roadmap/README.md. */
export const AREA_INDEX_PROJECT = join('docs', 'roadmap', 'README.md')
export const AREA_INDEX_KB = join('Streams', 'Roadmap', 'Roadmap.md')

const table = (value: unknown): Record<string, unknown> | undefined =>
  typeof value === 'object' && value !== null && !Array.isArray(value) ? (value as Record<string, unknown>) : undefined

/** Text of the `## Areas` section, up to the next heading of the same or higher level. */
export const areasSection = (text: string): string | undefined => {
  const lines = text.split(/\r?\n/)
  const start = lines.findIndex((line) => /^##\s+Areas\s*$/.test(line))
  if (start < 0) return undefined
  const end = lines.findIndex((line, index) => index > start && /^#{1,2}\s/.test(line))
  return lines.slice(start + 1, end < 0 ? undefined : end).join('\n')
}

/**
 * Warns once per declared area the roadmap index does not name in backticks under `## Areas`.
 * Configuration errors are ROAD-6 failures elsewhere; this check reads only a well-formed code list.
 */
export const inspectAreaDefinitions = (repository: string): readonly Finding[] => {
  let parsed: Record<string, unknown>
  try {
    parsed = TOML.parse(readFileSync(join(repository, '.ki.toml'), 'utf8')) as Record<string, unknown>
  } catch {
    return []
  }
  const skills = table(parsed.skills)
  const areas = table(skills?.['ki-work-roadmap'])?.areas
  if (!Array.isArray(areas) || !areas.length || !areas.every((area) => typeof area === 'string')) return []
  const index = table(skills?.['ki-repo'])?.repo_type === 'kb' ? AREA_INDEX_KB : AREA_INDEX_PROJECT
  const path = join(repository, index)
  const text = existsSync(path) && lstatSync(path).isFile() ? readFileSync(path, 'utf8') : undefined
  const section = text === undefined ? undefined : areasSection(text)
  return (areas as string[])
    .filter((area) => !section?.includes(`\`${area}\``))
    .map((area) => ({
      level: 'WARN' as const,
      area: 'ROAD-6',
      msg: `area '${area}' has no definition; name it in backticks under ## Areas in ${index}`,
      ref: STANDARD,
      file: index
    }))
}
