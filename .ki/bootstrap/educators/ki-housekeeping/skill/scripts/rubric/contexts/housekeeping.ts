import { existsSync, lstatSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { basename, join, resolve } from 'node:path'
import type { ConformOutcome, RubricOutcomes } from '../../vendored/ki-skills/rubric.ts'

export const VALID_TYPES = new Set(['user', 'feedback', 'project', 'reference'])
export const INDEX_FILE = 'MEMORY.md'
export type MemoryFrontmatter = Record<string, unknown>
export type MemoryFile = { file: string; content: string; frontmatter: MemoryFrontmatter | null }

const runtimePaths: Record<string, string> = {
  'claude-code': '.claude/skills/ki-self/SKILL.md',
  codex: '.agents/skills/ki-self/SKILL.md'
}

export const slugifyRepoPath = (absolutePath: string): string => absolutePath.replace(/[/.]/g, '-')
export const resolveMemoryDir = (repo: string): string => join(homedir(), '.claude', 'projects', slugifyRepoPath(resolve(repo)), 'memory')

export const parseFrontmatter = (content: string): MemoryFrontmatter | null => {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return null
  const output: Record<string, unknown> = {}
  let currentKey: string | null = null
  for (const line of match[1].split('\n')) {
    const topLevel = line.match(/^([a-zA-Z_]+):\s*(.*)$/)
    if (topLevel) {
      currentKey = topLevel[1]
      const value = topLevel[2].trim()
      output[currentKey] = value === '' ? {} : value.replace(/^["']|["']$/g, '')
      continue
    }
    const nested = line.match(/^\s+([a-zA-Z_]+):\s*(.*)$/)
    if (nested && currentKey && typeof output[currentKey] === 'object') {
      ;(output[currentKey] as Record<string, string>)[nested[1]] = nested[2].trim().replace(/^["']|["']$/g, '')
    }
  }
  return output
}

const declaredSupportedRuntimes = (repoRoot: string): string[] | null => {
  const configPath = join(repoRoot, '.ki-config.toml')
  if (!existsSync(configPath)) return null
  const match = readFileSync(configPath, 'utf8').match(/^supported_runtimes\s*=\s*\[([^\]]*)\]/m)
  if (!match) return null
  const runtimes = [...match[1].matchAll(/["']([^"']+)["']/g)].map((entry) => entry[1] as string)
  return runtimes.length > 0 ? runtimes : null
}

export type HousekeepingRubricContext = {
  repoRoot: string
  repoName: string
  memoryDir: string
  memoryExists: boolean
  memoryFiles: readonly MemoryFile[]
  index: string | null
  declaredRuntimes: readonly string[] | null
  runtimePayload: (runtime: string) => { path: string; state: 'missing' | 'invalid' | 'present'; content?: string } | null
  appendUnindexed: () => RubricOutcomes<ConformOutcome>
  alignNames: () => RubricOutcomes<ConformOutcome>
}

export const createHousekeepingContext = ({
  repoRoot,
  memoryDir,
  dryRun
}: {
  repoRoot: string
  memoryDir: string
  dryRun: boolean
}): HousekeepingRubricContext => {
  const absoluteRepo = resolve(repoRoot)
  const absoluteMemory = resolve(memoryDir)
  const memoryExists = existsSync(absoluteMemory)
  const markdownFiles = memoryExists ? readdirSync(absoluteMemory).filter((file) => file.endsWith('.md')) : []
  const memoryFiles = markdownFiles
    .filter((file) => file !== INDEX_FILE)
    .sort()
    .map((file) => {
      const content = readFileSync(join(absoluteMemory, file), 'utf8')
      return { file, content, frontmatter: parseFrontmatter(content) }
    })
  const index = markdownFiles.includes(INDEX_FILE) ? readFileSync(join(absoluteMemory, INDEX_FILE), 'utf8') : null
  const runtimePayload = (runtime: string) => {
    const path = runtimePaths[runtime]
    if (!path) return null
    const absolutePath = join(absoluteRepo, path)
    if (!existsSync(absolutePath)) return { path, state: 'missing' as const }
    const stat = lstatSync(absolutePath)
    if (!stat.isFile() || stat.isSymbolicLink()) return { path, state: 'invalid' as const }
    return { path, state: 'present' as const, content: readFileSync(absolutePath, 'utf8') }
  }
  const outcomes = <Result>(values: Result[]): RubricOutcomes<Result> => values as unknown as RubricOutcomes<Result>
  return {
    repoRoot: absoluteRepo,
    repoName: basename(absoluteRepo),
    memoryDir: absoluteMemory,
    memoryExists,
    memoryFiles,
    index,
    declaredRuntimes: declaredSupportedRuntimes(absoluteRepo),
    runtimePayload,
    alignNames: () => {
      if (!memoryExists)
        return [
          { status: 'NOT_APPLICABLE', message: 'No memory directory for this repo yet — nothing to conform.', subject: absoluteMemory }
        ]
      const results: ConformOutcome[] = []
      for (const memory of memoryFiles) {
        if (!memory.frontmatter) continue
        const expected = memory.file.replace(/\.md$/, '')
        if (memory.frontmatter.name === expected) continue
        const block = memory.content.match(/^---\n([\s\S]*?)\n---/)
        if (!block) continue
        const replacement =
          typeof memory.frontmatter.name === 'string'
            ? block[1].replace(/^name:\s*.*$/m, `name: ${expected}`)
            : `name: ${expected}\n${block[1]}`
        if (!dryRun) writeFileSync(join(absoluteMemory, memory.file), memory.content.replace(block[0], `---\n${replacement}\n---`))
        results.push({ status: 'FIXED', message: `${dryRun ? 'Would set' : 'Set'} name to '${expected}'.`, subject: memory.file })
      }
      return results.length > 0
        ? outcomes(results)
        : [{ status: 'PASS', message: 'No frontmatter name fields to fix.', subject: absoluteMemory }]
    },
    appendUnindexed: () => {
      if (!memoryExists)
        return [
          { status: 'NOT_APPLICABLE', message: 'No memory directory for this repo yet — nothing to conform.', subject: absoluteMemory }
        ]
      if (index === null)
        return [{ status: 'NOT_APPLICABLE', message: 'MEMORY.md is missing; author the index manually.', subject: INDEX_FILE }]
      const indexed = new Set([...index.matchAll(/\]\(([^)]+\.md)\)/g)].map((match) => match[1] as string))
      const lines: string[] = []
      const results: ConformOutcome[] = []
      for (const memory of memoryFiles) {
        if (indexed.has(memory.file)) continue
        const title =
          typeof memory.frontmatter?.name === 'string' && memory.frontmatter.name
            ? memory.frontmatter.name
            : memory.file.replace(/\.md$/, '')
        const description =
          typeof memory.frontmatter?.description === 'string' && memory.frontmatter.description.trim()
            ? memory.frontmatter.description.trim()
            : '(no description — see file)'
        lines.push(`- [${title}](${memory.file}) — ${description}`)
        results.push({
          status: 'FIXED',
          message: `${dryRun ? 'Would append' : 'Appended'} index entry — ${description}`,
          subject: memory.file
        })
      }
      if (lines.length > 0 && !dryRun)
        writeFileSync(join(absoluteMemory, INDEX_FILE), `${index.replace(/\n*$/, '\n')}${lines.join('\n')}\n`)
      return results.length > 0
        ? outcomes(results)
        : [{ status: 'PASS', message: 'Every memory file is already indexed.', subject: INDEX_FILE }]
    }
  }
}
