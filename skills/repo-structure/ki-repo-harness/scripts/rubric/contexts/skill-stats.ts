/** Local diagram metrics, not a public skill policy. See GOV-202 for the implementation definitions. */
import { existsSync, lstatSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, extname, join } from 'node:path'
import type { CapabilitySource } from './capability-publication.ts'

export type SkillStats = { rules: number | null; codeBytes: number; references: number }
const CODE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.sh', '.py'])

/** Physical files only: never follow directory or file symlinks. Missing directories are empty. */
const files = (root: string): string[] => {
  if (!existsSync(root) || !lstatSync(root).isDirectory() || lstatSync(root).isSymbolicLink()) return []
  return readdirSync(root, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((entry) => {
      const path = join(root, entry.name)
      return entry.isDirectory() ? files(path) : entry.isFile() ? [path] : []
    })
}

/** Count criterion identities in the accepted generated publication; missing is unavailable, not zero. */
export const publishedRuleCount = (publication: string | undefined): number | null =>
  publication === undefined
    ? null
    : new Set(
        [...publication.matchAll(/^- \*\*([A-Z][A-Z0-9]*(?:-[A-Z0-9]+)*-\d+) \[[^\]\r\n]+\] — /gm)].map(
          (match) => match[1]
        )
      ).size

export const codeBucket = (bytes: number): string =>
  bytes === 0 ? '0' : bytes < 10 * 1024 ? 'S' : bytes < 100 * 1024 ? 'M' : 'L'
export const statsTag = (stats: SkillStats): string =>
  `R${stats.rules ?? '–'} · C${codeBucket(stats.codeBytes)} · F${stats.references}`

/** Read one snapshot for both direct generation and the existing harness audit/conform path. */
export const readSkillStats = (
  repository: string,
  sources: readonly CapabilitySource[]
): ReadonlyMap<string, SkillStats> =>
  new Map(
    sources.map((source) => {
      const root = join(repository, dirname(source.path))
      const references = files(join(root, 'references'))
      const rubric = join(root, 'references/rubric.md')
      return [
        source.path,
        {
          rules: publishedRuleCount(references.includes(rubric) ? readFileSync(rubric, 'utf8') : undefined),
          codeBytes: files(join(root, 'scripts'))
            .filter((path) => CODE_EXTENSIONS.has(extname(path)))
            .reduce((sum, path) => sum + readFileSync(path).byteLength, 0),
          references: references.length
        }
      ]
    })
  )
