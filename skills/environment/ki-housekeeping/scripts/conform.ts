#!/usr/bin/env bun
/**
 * Apply the two safe memory repairs: align an existing frontmatter name with
 * its filename and append an unindexed memory to MEMORY.md. Canonical JSONL is
 * the only output; `--dry-run` controls writing only.
 */

import { readdir, readFile, stat, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  type CheckerFinding,
  checkerReporterExitCode,
  emitCheckerReporter,
  judgmentFindingsFromRubric
} from './vendored/ki-skills/checker-reporter.ts'

const VALID_TYPES = new Set(['user', 'feedback', 'project', 'reference'])
const INDEX_ENTRY_RE = /^-\s*\[.+\]\(.+\.md\)/
const INDEX_LINK_RE = /\]\(([^)]+\.md)\)/
const MEMORY_FORMAT = 'references/memory-format.md'
const RUBRIC = 'references/rubric.md'

function slugifyRepoPath(absPath: string): string {
  return absPath.replace(/[/.]/g, '-')
}

function resolveMemoryDir(repoArg: string | undefined): string {
  return join(homedir(), '.claude', 'projects', slugifyRepoPath(resolve(repoArg ?? process.cwd())), 'memory')
}

function localRubricPath(): string {
  const scriptDir = dirname(fileURLToPath(import.meta.url))
  const skillRoot = basename(scriptDir) === 'scripts' ? dirname(scriptDir) : scriptDir
  return join(skillRoot, 'references', 'rubric.md')
}

function parseFrontmatter(content: string): Record<string, unknown> | null {
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

async function main(): Promise<void> {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const memoryIndex = args.indexOf('--memory-dir')
  const memoryArg = memoryIndex === -1 ? undefined : args[memoryIndex + 1]
  const repoArg = args.find((arg, index) => !arg.startsWith('-') && args[index - 1] !== '--memory-dir')
  const memoryDir = memoryArg ? resolve(memoryArg) : resolveMemoryDir(repoArg)
  const findings: CheckerFinding[] = []
  const rec = (
    level: 'FAIL' | 'WARN' | 'POLISH' | 'ADVISORY' | 'INFO' | 'NA' | 'PASS',
    code: string,
    message: string,
    ref = MEMORY_FORMAT,
    file?: string
  ): void => {
    findings.push({ type: 'M', level, code, message, ref, file })
  }

  try {
    await stat(memoryDir)
  } catch {
    rec('NA', 'DIR-1', `No memory directory for this repo yet — nothing to conform: ${memoryDir}`, 'references/standards.md', memoryDir)
    findings.push(...judgmentFindingsFromRubric(localRubricPath(), RUBRIC))
    emitCheckerReporter({ mode: 'conform', concern: 'housekeeping', target: memoryDir, findings })
    process.exitCode = checkerReporterExitCode(findings)
    return
  }

  const markdownFiles = (await readdir(memoryDir)).filter((file) => file.endsWith('.md'))
  const indexFile = 'MEMORY.md'
  const memoryFiles = markdownFiles.filter((file) => file !== indexFile).sort()
  let nameFixes = 0
  for (const file of memoryFiles) {
    const path = join(memoryDir, file)
    const content = await readFile(path, 'utf8')
    const match = content.match(/^---\n([\s\S]*?)\n---/)
    if (!match) {
      rec('ADVISORY', 'FM-1', 'No frontmatter block; author name, description, and metadata.type manually.', MEMORY_FORMAT, file)
      continue
    }
    const frontmatter = parseFrontmatter(content)
    const expectedName = file.replace(/\.md$/, '')
    const actualName = frontmatter?.name
    if (actualName === expectedName) continue
    const newBlock =
      typeof actualName === 'string' ? match[1].replace(/^name:\s*.*$/m, `name: ${expectedName}`) : `name: ${expectedName}\n${match[1]}`
    rec('POLISH', 'FM-2', `Set name to '${expectedName}'.`, MEMORY_FORMAT, file)
    if (!dryRun) await writeFile(path, content.replace(match[0], `---\n${newBlock}\n---`))
    nameFixes++

    if (!frontmatter || typeof frontmatter.description !== 'string' || frontmatter.description.trim() === '') {
      rec('ADVISORY', 'FM-3', 'Write a specific, non-empty description manually.', MEMORY_FORMAT, file)
    }
    const metadata = frontmatter?.metadata
    const type = metadata && typeof metadata === 'object' ? (metadata as Record<string, string>).type : undefined
    if (!type || !VALID_TYPES.has(type)) {
      rec('ADVISORY', 'FM-4', `Set metadata.type to one of ${[...VALID_TYPES].join(', ')} manually.`, MEMORY_FORMAT, file)
    }
  }
  if (nameFixes === 0) rec('PASS', 'FM-2', 'No frontmatter name fields to fix.')

  if (!markdownFiles.includes(indexFile)) {
    rec('ADVISORY', 'IDX-1', 'MEMORY.md is missing; author the index manually.', MEMORY_FORMAT, indexFile)
  } else {
    const indexPath = join(memoryDir, indexFile)
    let indexContent = await readFile(indexPath, 'utf8')
    const indexed = new Set<string>()
    for (const line of indexContent.split('\n')) {
      if (!INDEX_ENTRY_RE.test(line)) continue
      const match = line.match(INDEX_LINK_RE)
      if (match) indexed.add(match[1])
    }
    const appendLines: string[] = []
    for (const file of memoryFiles) {
      if (indexed.has(file)) continue
      const frontmatter = parseFrontmatter(await readFile(join(memoryDir, file), 'utf8'))
      const title = typeof frontmatter?.name === 'string' && frontmatter.name ? frontmatter.name : file.replace(/\.md$/, '')
      const description =
        typeof frontmatter?.description === 'string' && frontmatter.description.trim()
          ? frontmatter.description.trim()
          : '(no description — see file)'
      appendLines.push(`- [${title}](${file}) — ${description}`)
      rec('POLISH', 'IDX-3', `Append index entry — ${description}`, MEMORY_FORMAT, file)
      rec('ADVISORY', 'DOC-6', `Move appended ${file} to its correct semantic position in MEMORY.md.`, RUBRIC, indexFile)
    }
    if (appendLines.length === 0) rec('PASS', 'IDX-3', 'Every memory file is already indexed.')
    else if (!dryRun) {
      indexContent = `${indexContent.replace(/\n*$/, '\n')}${appendLines.join('\n')}\n`
      await writeFile(indexPath, indexContent)
    }
  }

  findings.push(...judgmentFindingsFromRubric(localRubricPath(), RUBRIC))
  emitCheckerReporter({ mode: 'conform', concern: 'housekeeping', target: memoryDir, findings })
  process.exitCode = checkerReporterExitCode(findings)
}

main().catch((error) => {
  const target = resolve(process.argv.slice(2).find((arg) => !arg.startsWith('-')) ?? '.')
  emitCheckerReporter({
    mode: 'conform',
    concern: 'housekeeping',
    target,
    findings: [{ type: 'M', level: 'FAIL', code: 'DIR-1', message: `Conform failed: ${String(error)}`, ref: 'references/standards.md' }]
  })
  process.exitCode = 1
})
