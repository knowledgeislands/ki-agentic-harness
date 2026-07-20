import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import type { ConformOutcome, RubricOutcomes } from '../../vendored/ki-skills/rubric.ts'

const SKIP_DIRECTORIES = new Set(['node_modules', '.git', 'dist', '.ki', '.attic', '.claude'])

export type HandoffArtifact = {
  path: string
  subject: string
  content: string
  frontmatterBlock: string
  frontmatterMatch: string
  frontmatter: Readonly<Record<string, string>>
  body: string
}

export type HandoffsRubricContext = {
  target: string
  targetExists: boolean
  dryRun: boolean
  artifacts: readonly HandoffArtifact[]
  addReadinessMarker: (artifact: HandoffArtifact) => RubricOutcomes<ConformOutcome>
}

const parseFrontmatter = (block: string): Record<string, string> => {
  const frontmatter: Record<string, string> = {}
  for (const line of block.split('\n')) {
    const match = line.match(/^([a-zA-Z-]+):\s*(.*)$/)
    if (!match) continue
    frontmatter[match[1] as string] = (match[2] as string)
      .trim()
      .replace(/\s+#.*$/, '')
      .replace(/^['"]|['"]$/g, '')
  }
  return frontmatter
}

const discoverMarkdown = (target: string): string[] => {
  if (!existsSync(target)) return []
  if (statSync(target).isFile()) return [target]
  const files: string[] = []
  const walk = (directory: string): void => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (!SKIP_DIRECTORIES.has(entry.name)) walk(join(directory, entry.name))
      } else if (entry.isFile() && entry.name.endsWith('.md')) files.push(join(directory, entry.name))
    }
  }
  walk(target)
  return files.sort()
}

const readOptedInArtifact = (target: string, path: string): HandoffArtifact | null => {
  const content = readFileSync(path, 'utf8')
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return null
  const frontmatterBlock = match[1] as string
  const frontmatter = parseFrontmatter(frontmatterBlock)
  if (frontmatter.handoff !== 'true') return null
  return {
    path,
    subject: relative(target, path) || path,
    content,
    frontmatterBlock,
    frontmatterMatch: match[0],
    frontmatter,
    body: content.slice(match[0].length)
  }
}

export const hasDecisionsHeading = (artifact: HandoffArtifact): boolean => /^#{2,}\s+.*decisions/im.test(artifact.body)
export const namesLocked = (artifact: HandoffArtifact): boolean => /locked/i.test(artifact.body)
export const namesEscalate = (artifact: HandoffArtifact): boolean => /escalate/i.test(artifact.body)
export const hasReadinessMarker = (artifact: HandoffArtifact): boolean =>
  'readiness' in artifact.frontmatter || /^#{2,}\s+readiness/im.test(artifact.body) || /\[[ xX]\]\s*readiness test/i.test(artifact.body)

export const createHandoffsContext = (targetArgument: string, dryRun: boolean): HandoffsRubricContext => {
  const target = resolve(targetArgument)
  const targetExists = existsSync(target)
  const artifacts = targetExists
    ? discoverMarkdown(target)
        .map((path) => readOptedInArtifact(target, path))
        .filter((artifact): artifact is HandoffArtifact => artifact !== null)
    : []
  return {
    target,
    targetExists,
    dryRun,
    artifacts,
    addReadinessMarker: (artifact) => {
      if (hasReadinessMarker(artifact)) return [{ status: 'PASS', message: 'Readiness marker is present.', subject: artifact.subject }]
      if (!dryRun)
        writeFileSync(
          artifact.path,
          artifact.content.replace(artifact.frontmatterMatch, `---\n${artifact.frontmatterBlock}\nreadiness: pending\n---`)
        )
      return [
        {
          status: 'FIXED',
          message: `${dryRun ? 'Would add' : 'Added'} readiness: pending (the cold-agent test is not yet recorded).`,
          subject: artifact.subject
        }
      ]
    }
  }
}
