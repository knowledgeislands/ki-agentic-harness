import { readFileSync } from 'node:fs'
import { basename, join } from 'node:path'
import { frontmatterBlock, frontmatterLine, frontmatterScalar } from './frontmatter.ts'
import { listMarkdownFiles } from './skill-files.ts'

type BunYamlRuntime = { Bun: { YAML: { parse: (source: string) => unknown } } }

export type FootprintRow = { kind: 'description' | 'body' | 'reference'; path: string; tokens: number }

export const estimateTokens = (source: string): number => Math.round(source.length / 4)

const frontmatterDescription = (frontmatter: string | null): string => {
  if (!frontmatter) return ''
  try {
    const parsed = (globalThis as typeof globalThis & BunYamlRuntime).Bun.YAML.parse(frontmatter)
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) && typeof (parsed as Record<string, unknown>).description === 'string'
      ? ((parsed as Record<string, unknown>).description as string)
      : ''
  } catch {
    return frontmatterScalar(frontmatterLine(frontmatter, 'description') ?? 'description:', 'description')
  }
}

export const createFootprint = (skillDir: string): { rows: FootprintRow[]; total: number } => {
  const content = readFileSync(join(skillDir, 'SKILL.md'), 'utf8')
  const frontmatter = frontmatterBlock(content)
  const description = frontmatterDescription(frontmatter)
  const body = content.slice((content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/) || [''])[0].length)
  const rows: FootprintRow[] = [
    { kind: 'description', path: 'SKILL.md:description', tokens: estimateTokens(description) },
    { kind: 'body', path: 'SKILL.md:body', tokens: estimateTokens(body) }
  ]
  for (const file of listMarkdownFiles(skillDir)) {
    if (basename(file) === 'SKILL.md') continue
    rows.push({ kind: 'reference', path: file.slice(skillDir.length + 1), tokens: estimateTokens(readFileSync(file, 'utf8')) })
  }
  return { rows, total: rows.reduce((total, row) => total + row.tokens, 0) }
}
