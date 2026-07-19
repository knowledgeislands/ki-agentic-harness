import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { basename, extname, join, relative, resolve } from 'node:path'
import type { ConformOutcome, RubricOutcomes } from '../../vendored/ki-skills/rubric.ts'

const INDEX_NOTE = 'Live Artifacts.md'
const DEFAULT_ARTIFACTS_DIR = 'Admin/Operations/Live Artifacts'

const isDirectory = (path: string): boolean => existsSync(path) && statSync(path).isDirectory()
const isFile = (path: string): boolean => existsSync(path) && statSync(path).isFile()

export type ArtifactSource = {
  path: string
  relativePath: string
  stem: string
  htmlPath: string
  text: string
  frontmatter: Readonly<Record<string, string>> | null
  mtimeMs: number
  htmlMtimeMs: number | null
}

export type LiveArtifactsContext = {
  target: string
  artifactsDirectory: string
  artifactsRelativeDirectory: string
  artifactsDirectoryExists: boolean
  indexPath: string
  indexRelativePath: string
  indexText: string | null
  sources: readonly ArtifactSource[]
  htmlPaths: ReadonlySet<string>
  thresholdHours: number
  conformIndex: () => RubricOutcomes<ConformOutcome>
  conformRenders: () => RubricOutcomes<ConformOutcome>
}

const parseFrontmatter = (text: string): Record<string, string> | null => {
  if (!text.startsWith('---')) return null
  const end = text.indexOf('\n---', 3)
  if (end === -1) return null
  const values: Record<string, string> = {}
  for (const line of text.slice(3, end).split('\n')) {
    const colon = line.indexOf(':')
    if (colon === -1) continue
    const key = line.slice(0, colon).trim()
    const value = line.slice(colon + 1).trim()
    if (key && value) values[key] = value
  }
  return values
}

const fixed = (outcomes: ConformOutcome[], pass: string): RubricOutcomes<ConformOutcome> =>
  outcomes.length > 0 ? (outcomes as RubricOutcomes<ConformOutcome>) : [{ status: 'PASS', message: pass }]

export const createLiveArtifactsContext = ({
  target,
  dryRun,
  thresholdHours = 24
}: {
  target: string
  dryRun: boolean
  thresholdHours?: number
}): LiveArtifactsContext => {
  const absolute = resolve(target)
  const artifactsDirectory = join(absolute, DEFAULT_ARTIFACTS_DIR)
  const artifactsDirectoryExists = isDirectory(artifactsDirectory)
  const indexPath = join(artifactsDirectory, INDEX_NOTE)
  const sources = artifactsDirectoryExists
    ? readdirSync(artifactsDirectory)
        .map((name) => join(artifactsDirectory, name))
        .filter((path) => extname(path) === '.md' && basename(path) !== INDEX_NOTE)
        .sort()
        .map((path) => {
          const text = readFileSync(path, 'utf8')
          const htmlPath = join(artifactsDirectory, `${basename(path, '.md')}.html`)
          return {
            path,
            relativePath: relative(absolute, path),
            stem: basename(path, '.md'),
            htmlPath,
            text,
            frontmatter: parseFrontmatter(text),
            mtimeMs: statSync(path).mtimeMs,
            htmlMtimeMs: isFile(htmlPath) ? statSync(htmlPath).mtimeMs : null
          }
        })
    : []
  const htmlPaths = new Set(
    artifactsDirectoryExists
      ? readdirSync(artifactsDirectory)
          .map((name) => join(artifactsDirectory, name))
          .filter((path) => extname(path) === '.html')
      : []
  )
  const indexText = isFile(indexPath) ? readFileSync(indexPath, 'utf8') : null
  const artifactsRelativeDirectory = relative(absolute, artifactsDirectory) || '.'
  return {
    target: absolute,
    artifactsDirectory,
    artifactsRelativeDirectory,
    artifactsDirectoryExists,
    indexPath,
    indexRelativePath: relative(absolute, indexPath),
    indexText,
    sources,
    htmlPaths,
    thresholdHours,
    conformIndex: () => {
      if (!artifactsDirectoryExists)
        return [{ status: 'NOT_APPLICABLE', message: `${DEFAULT_ARTIFACTS_DIR}/ is absent; there are no live artifacts to index.` }]
      if (sources.length === 0) return [{ status: 'NOT_APPLICABLE', message: 'No artifact sources exist to index.' }]
      const entry = (source: ArtifactSource): string => `- [${source.stem}](${basename(source.path)}) — _(description — see manual TODO)_`
      if (indexText === null) {
        const contents = `# Live Artifacts\n\nOperational documents reflecting the current state of the island. Each row is a \`.md\`/\`.html\` pair.\n\n${sources.map(entry).join('\n')}\n`
        if (!dryRun) writeFileSync(indexPath, contents)
        return [
          {
            status: 'FIXED',
            message: `The index note ${dryRun ? 'would be created' : 'was created'} for ${sources.length} source(s).`,
            subject: relative(absolute, indexPath)
          }
        ]
      }
      const missing = sources.filter((source) => !indexText.includes(basename(source.path)) && !indexText.includes(source.stem))
      if (missing.length === 0)
        return [{ status: 'PASS', message: 'Every source is already listed in the index note.', subject: relative(absolute, indexPath) }]
      if (!dryRun) writeFileSync(indexPath, `${indexText.replace(/\n*$/, '\n')}${missing.map(entry).join('\n')}\n`)
      return missing.map((source) => ({
        status: 'FIXED' as const,
        message: `The index entry for ${source.stem} ${dryRun ? 'would be appended' : 'was appended'}.`,
        subject: relative(absolute, indexPath)
      })) as RubricOutcomes<ConformOutcome>
    },
    conformRenders: () => {
      if (!artifactsDirectoryExists)
        return [{ status: 'NOT_APPLICABLE', message: `${DEFAULT_ARTIFACTS_DIR}/ is absent; there are no frontmatter blocks to repair.` }]
      const outcomes: ConformOutcome[] = []
      for (const source of sources) {
        if (!source.frontmatter || source.frontmatter.renders) continue
        const match = source.text.match(/^---\n([\s\S]*?)\n---/)
        if (!match) continue
        if (!dryRun) writeFileSync(source.path, source.text.replace(match[0], `---\n${match[1]}\nrenders: html\n---`))
        outcomes.push({
          status: 'FIXED',
          message: `renders: html ${dryRun ? 'would be added' : 'was added'} to frontmatter.`,
          subject: source.relativePath
        })
      }
      return fixed(outcomes, 'Every frontmatter block already declares renders.')
    }
  }
}
