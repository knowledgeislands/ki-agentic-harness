import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { basename, join, resolve } from 'node:path'
import type { ConformOutcome, RubricOutcomes } from '../../vendored/ki-skills/rubric.ts'

export type AgentFrontmatter = {
  keys: ReadonlyMap<string, string>
  present: ReadonlySet<string>
  raw: string | null
}

export type AgentDefinition = {
  file: string
  stem: string
  content: string
  frontmatter: AgentFrontmatter
  name: string | undefined
  description: string | undefined
  body: string
}

export type AgentsRubricContext = {
  roots: readonly string[]
  missingRoots: readonly string[]
  agents: readonly AgentDefinition[]
  dryRun: boolean
  alignName: (agent: AgentDefinition) => RubricOutcomes<ConformOutcome>
}

const stripQuotes = (value: string): string => {
  const trimmed = value.trim()
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) return trimmed.slice(1, -1)
  return trimmed
}

const parseFrontmatter = (content: string): AgentFrontmatter => {
  const keys = new Map<string, string>()
  const present = new Set<string>()
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return { keys, present, raw: null }

  const block = match[1] as string
  const lines = block.split(/\r?\n/)
  let index = 0
  while (index < lines.length) {
    const line = lines[index] as string
    if (line.trim() === '' || line.trimStart().startsWith('#')) {
      index++
      continue
    }
    const keyValue = line.match(/^([A-Za-z0-9_-]+):(.*)$/)
    if (!keyValue) {
      index++
      continue
    }
    const key = keyValue[1] as string
    const remainder = (keyValue[2] as string).trim()
    present.add(key)
    if (
      remainder === '>' ||
      remainder === '|' ||
      remainder.startsWith('> ') ||
      remainder.startsWith('| ') ||
      /^[>|][-+]?\d*\s*$/.test(remainder)
    ) {
      const folded = remainder[0] === '>'
      const collected: string[] = []
      index++
      while (index < lines.length) {
        const continuation = lines[index] as string
        if (continuation.trim() !== '' && !/^\s/.test(continuation)) break
        if (continuation.trim() !== '') collected.push(continuation.trim())
        index++
      }
      keys.set(key, folded ? collected.join(' ') : collected.join('\n'))
      continue
    }
    if (remainder === '') {
      index++
      while (index < lines.length && /^\s+\S/.test(lines[index] as string)) index++
      keys.set(key, '')
      continue
    }
    keys.set(key, stripQuotes(remainder))
    index++
  }
  return { keys, present, raw: block }
}

const bodyAfterFrontmatter = (content: string): string =>
  content.slice((content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/) ?? [''])[0].length)

const readAgent = (file: string): AgentDefinition => {
  const content = readFileSync(file, 'utf8')
  const frontmatter = parseFrontmatter(content)
  return {
    file,
    stem: basename(file).replace(/\.md$/, ''),
    content,
    frontmatter,
    name: frontmatter.keys.get('name'),
    description: frontmatter.keys.get('description'),
    body: bodyAfterFrontmatter(content)
  }
}

const agentsRoot = (path: string): string => {
  if (basename(path) === 'agents') return path
  const candidate = join(path, 'agents')
  return existsSync(candidate) && statSync(candidate).isDirectory() ? candidate : path
}

const discoverAgentFiles = (path: string): string[] => {
  if (!existsSync(path)) return []
  if (statSync(path).isFile()) return path.endsWith('.md') ? [path] : []
  const files: string[] = []
  const walk = (directory: string): void => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (entry.name.startsWith('.') || entry.name === 'node_modules') continue
      const candidate = join(directory, entry.name)
      if (entry.isDirectory() || entry.isSymbolicLink()) {
        try {
          if (statSync(candidate).isDirectory()) walk(candidate)
        } catch {
          // A dangling symlink is outside the agent-definition surface.
        }
      } else if (entry.name.endsWith('.md') && entry.name !== 'README.md') files.push(candidate)
    }
  }
  walk(agentsRoot(path))
  return files.sort()
}

export const relativeLinkTargets = (markdown: string): string[] => {
  const targets: string[] = []
  const expression = /\[[^\]]*\]\(([^)]+)\)/g
  let match: RegExpExecArray | null
  // biome-ignore lint/suspicious/noAssignInExpressions: standard regex-exec loop
  while ((match = expression.exec(markdown)) !== null) {
    let target = (match[1] as string).trim()
    if (target.startsWith('<') && target.endsWith('>')) target = target.slice(1, -1).trim()
    if (/^[a-z]+:\/\//i.test(target) || target.startsWith('mailto:') || target.startsWith('#')) continue
    const hash = target.indexOf('#')
    if (hash !== -1) target = target.slice(0, hash)
    if (target) targets.push(target)
  }
  return targets
}

export const triggerPhrases = (description: string): string[] => {
  const phrases = new Set<string>()
  const expression = /"([^"]{2,})"/g
  let match: RegExpExecArray | null
  // biome-ignore lint/suspicious/noAssignInExpressions: standard regex-exec loop
  while ((match = expression.exec(description)) !== null) {
    const phrase = (match[1] as string).toLowerCase().replace(/\s+/g, ' ').trim()
    if (phrase) phrases.add(phrase)
  }
  return [...phrases]
}

export const stripCode = (markdown: string): string => markdown.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '')

export const createAgentsContext = (roots: readonly string[], dryRun: boolean): AgentsRubricContext => {
  const resolvedRoots = roots.map((root) => resolve(root))
  const files = [...new Set(resolvedRoots.flatMap(discoverAgentFiles))].sort()
  return {
    roots: resolvedRoots,
    missingRoots: resolvedRoots.filter((root) => !existsSync(root)),
    agents: files.map(readAgent),
    dryRun,
    alignName: (agent) => {
      if (!agent.name)
        return [{ status: 'NOT_APPLICABLE', message: 'No name field is available for the filename-alignment fix.', subject: agent.file }]
      if (agent.name === agent.stem) return [{ status: 'PASS', message: 'Filename stem already matches name.', subject: agent.file }]
      if (!dryRun) {
        const lines = agent.content.split(/\r?\n/)
        const nameLine = lines.findIndex((line) => /^name:/.test(line))
        if (nameLine === -1)
          return [{ status: 'NOT_APPLICABLE', message: 'No name field is available for the filename-alignment fix.', subject: agent.file }]
        lines[nameLine] = `name: ${agent.stem}`
        writeFileSync(agent.file, lines.join('\n'))
      }
      return [{ status: 'FIXED', message: `${dryRun ? 'Would rewrite' : 'Rewrote'} name to ${agent.stem}.`, subject: agent.file }]
    }
  }
}
