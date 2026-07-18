#!/usr/bin/env bun
/**
 * Normalize the unambiguous handoff marker only: missing readiness becomes
 * `readiness: pending`. Every run emits canonical checker-reporter JSONL;
 * `--dry-run` controls writes, never output shape.
 */

import { readdir, readFile, stat, writeFile } from 'node:fs/promises'
import { basename, dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  type CheckerFinding,
  checkerReporterExitCode,
  emitCheckerReporter,
  judgmentFindingsFromRubric
} from './vendored/ki-skills/checker-reporter.ts'

const VALID_TIERS = new Set(['haiku', 'sonnet', 'opus'])
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', '.ki-meta', '.attic', '.claude'])
const RUBRIC = 'references/rubric.md'
const STANDARD = 'references/standards.md'
const findings: CheckerFinding[] = []

function rec(level: 'FAIL' | 'WARN' | 'POLISH' | 'ADVISORY' | 'INFO' | 'NA' | 'PASS', code: string, message: string, file?: string): void {
  findings.push({ type: 'M', level, code, message, ref: STANDARD, file })
}

function localRubricPath(): string {
  const scriptDir = dirname(fileURLToPath(import.meta.url))
  const skillRoot = basename(scriptDir) === 'scripts' ? dirname(scriptDir) : scriptDir
  return join(skillRoot, 'references', 'rubric.md')
}

async function walk(directory: string, output: string[]): Promise<void> {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory() && !SKIP_DIRS.has(entry.name)) await walk(path, output)
    else if (entry.isFile() && entry.name.endsWith('.md')) output.push(path)
  }
}

function parseFrontmatter(body: string): Record<string, string> {
  const frontmatter: Record<string, string> = {}
  for (const line of body.split('\n')) {
    const match = line.match(/^([a-zA-Z-]+):\s*(.*)$/)
    if (!match) continue
    frontmatter[match[1]] = match[2]
      .trim()
      .replace(/\s+#.*$/, '')
      .replace(/^['"]|['"]$/g, '')
  }
  return frontmatter
}

async function main(): Promise<void> {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const target = resolve(args.find((arg) => !arg.startsWith('-')) ?? '.')

  try {
    await stat(target)
  } catch {
    rec('FAIL', 'HAND-1', `Requested conform path does not exist: ${target}`)
    findings.push(...judgmentFindingsFromRubric(localRubricPath(), RUBRIC))
    emitCheckerReporter({ mode: 'conform', concern: 'handoffs', target, findings })
    process.exitCode = checkerReporterExitCode(findings)
    return
  }

  const files: string[] = []
  if ((await stat(target)).isDirectory()) await walk(target, files)
  else files.push(target)
  files.sort()

  let optedIn = 0
  let readinessFixes = 0
  for (const path of files) {
    const content = await readFile(path, 'utf8')
    const match = content.match(/^---\n([\s\S]*?)\n---/)
    if (!match) continue
    const frontmatter = parseFrontmatter(match[1])
    if (frontmatter.handoff !== 'true') continue
    optedIn++
    const file = relative(target, path) || path
    const body = content.slice(match[0].length)

    if (!frontmatter.tier) {
      rec('ADVISORY', 'HAND-1', 'Add tier: haiku, sonnet, or opus — choose the cheapest tier the specification makes safe.', file)
    } else if (!VALID_TIERS.has(frontmatter.tier)) {
      rec('ADVISORY', 'HAND-1', `Set tier '${frontmatter.tier}' to haiku, sonnet, or opus.`, file)
    }

    const hasDecisions = /^#{2,}\s+.*decisions/im.test(body)
    const hasLocked = /locked/i.test(body)
    const hasEscalate = /escalate/i.test(body)
    if (!hasDecisions) {
      rec('ADVISORY', 'HAND-2', 'Add a Decisions section that separates locked decisions from escalations.', file)
    } else if (!(hasLocked && hasEscalate)) {
      rec('ADVISORY', 'HAND-2', "Name both 'locked' and 'escalate' in the Decisions section.", file)
    }

    const hasReadiness = 'readiness' in frontmatter || /^#{2,}\s+readiness/im.test(body) || /\[[ xX]\]\s*readiness test/i.test(body)
    if (!hasReadiness) {
      rec('POLISH', 'HAND-3', 'Added readiness: pending (the cold-agent test is not yet recorded).', file)
      if (!dryRun) await writeFile(path, content.replace(match[0], `---\n${match[1]}\nreadiness: pending\n---`))
      readinessFixes++
    }
  }

  if (optedIn === 0) rec('INFO', 'scope', 'No handoff-opted-in artifacts (handoff: true) — nothing to conform.')
  else if (readinessFixes === 0) rec('PASS', 'HAND-3', 'Readiness markers already present — nothing to fix.')

  findings.push(...judgmentFindingsFromRubric(localRubricPath(), RUBRIC))
  emitCheckerReporter({ mode: 'conform', concern: 'handoffs', target, findings })
  process.exitCode = checkerReporterExitCode(findings)
}

main().catch((error) => {
  const target = resolve(process.argv.slice(2).find((arg) => !arg.startsWith('-')) ?? '.')
  emitCheckerReporter({
    mode: 'conform',
    concern: 'handoffs',
    target,
    findings: [{ type: 'M', level: 'FAIL', code: 'HAND-1', message: `Conform failed: ${String(error)}`, ref: STANDARD }]
  })
  process.exitCode = 1
})
