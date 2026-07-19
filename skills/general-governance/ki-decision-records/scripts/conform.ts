#!/usr/bin/env bun
/**
 * Mechanical CONFORM for the ki-decision-records standard — fixes the subset of
 * audit.ts's findings that are unambiguous and reversible, leaving every
 * judgment item as a canonical advisory finding.
 *
 * Scope: a single target repo (default cwd), matching the house conform shape
 * (conform.ts, conform.ts) — `bun conform.ts .` / `ki:decision-records:conform`.
 * KB-vs-code detection, decisions-dir resolution, index-file resolution, the DR
 * filename regex are kept in lockstep with audit.ts (same source of truth,
 * copied rather than imported so each script stays valid standalone per the
 * composition-only rule).
 *
 *   bun scripts/conform.ts [path]   # default: cwd
 *   --dry-run                       # report the pending writes, mutate nothing
 *
 * The checker always emits canonical JSONL. Each action becomes a typed mechanical
 * finding; rubric judgment criteria are explicit advisory findings. `--dry-run`
 * governs writing only.
 *
 * Fixes:
 *   - Index entries (INDEX-2): a DR file present on disk with no entry in the
 *     index (README.md in a code repo, Decisions.md in a KB) gets one APPENDED
 *     to the end of the index — existing entries and their order are never
 *     touched. The operator then decides its correct reading-order position.
 *
 * Deliberately NEVER touches (judgment):
 *   - FM-0 / FM-4 / FM-5 and TYPE-FIT-1 — frontmatter and filename classification
 *     need a human decision. A mismatched decision_type might mean that metadata
 *     is wrong or that the canonical record ID needs renaming; this script must
 *     not choose by overwriting either side.
 *   - FM-3 (`type` field wrong/missing), BODY-1/3/4 (heading, date, required
 *     sections), FILENAME-2 (serial collisions), INDEX-3 (dangling index entry),
 *     INDEX-8 (out-of-order serials) — all prose/authoring or reordering
 *     decisions, never auto-fixed here.
 *   - Where within the index an appended entry belongs — never guessed by this script.
 *
 * Zero npm dependencies (bun + node stdlib only). Exit code is non-zero only on
 * an unrecoverable error (decisions dir not found); findings/fixes never fail the run.
 */

import { readdir, readFile, stat, writeFile } from 'node:fs/promises'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  type CheckerFinding,
  type CheckerLevel,
  checkerReporterExitCode,
  emitCheckerReporter,
  judgmentFindingsFromRubric
} from './vendored/ki-skills/checker-reporter.ts'

const DR_FILENAME_RE = /^(SDR|PDR|ADR|DDR|XDR|ODR|GDR|RDR|KDR)-([A-Z][A-Z0-9]*(?:-[A-Z][A-Z0-9]*)*)(-(\d{3,}))(-[a-z0-9-]+)?\.md$/
const ID_IN_ITEM = /^\s*(?:\d+\.|[-*])\s+.*?([A-Z]+DR-[A-Z][A-Z0-9-]+-\d{3,})/
const CODE_DIR = 'docs/decisions'
const KB_DIR = 'Admin/Governance/Decisions'

async function findKiConfig(startDir: string): Promise<string | null> {
  let dir = resolve(startDir)
  for (let i = 0; i < 10; i++) {
    const candidate = join(dir, '.ki-config.toml')
    try {
      await stat(candidate)
      return candidate
    } catch {
      const parent = dirname(dir)
      if (parent === dir) return null
      dir = parent
    }
  }
  return null
}

async function detectKbMode(baseDir: string): Promise<boolean> {
  const configPath = await findKiConfig(baseDir)
  if (!configPath) return false
  const content = await readFile(configPath, 'utf8')
  if (/^\s*repo_type\s*=\s*["']kb["']/m.test(content)) return true
  if (/^\[ki-kb\]/m.test(content)) return true
  return false
}

async function resolveDecisionsDir(target: string): Promise<{ dir: string; kbMode: boolean }> {
  const kbMode = await detectKbMode(target)
  for (const candidate of kbMode ? [KB_DIR, CODE_DIR] : [CODE_DIR, KB_DIR]) {
    try {
      const dir = join(target, candidate)
      await stat(dir)
      return { dir, kbMode }
    } catch {
      // not this one — try the next default
    }
  }
  return { dir: join(target, kbMode ? KB_DIR : CODE_DIR), kbMode }
}

// Every criterion traces to the one reference doc, kept identical to audit.ts.
const REF = 'references/rubric.md'
function localRubricPath(): string {
  const scriptDir = dirname(fileURLToPath(import.meta.url))
  const skillRoot = basename(scriptDir) === 'scripts' ? dirname(scriptDir) : scriptDir
  return join(skillRoot, 'references', 'rubric.md')
}

const RUBRIC_PATH = localRubricPath()

// ── entry ──
async function main() {
  const argv = process.argv.slice(2)
  const dryRun = argv.includes('--dry-run')
  const target = resolve(argv.find((a) => !a.startsWith('-')) ?? '.')

  const findings: CheckerFinding[] = []
  const rec = (level: CheckerLevel, code: string, message: string, file?: string, ref: string = REF): void => {
    findings.push({ type: 'M', level, code, message, ref, file })
  }

  const { dir: resolvedDir, kbMode } = await resolveDecisionsDir(target)

  try {
    await stat(resolvedDir)
  } catch {
    rec('FAIL', 'INDEX-1', 'Decision records directory is not present.', resolvedDir)
    findings.push(...judgmentFindingsFromRubric(RUBRIC_PATH, REF))
    emitCheckerReporter({ mode: 'conform', concern: 'decision-records', target, findings })
    process.exitCode = checkerReporterExitCode(findings)
    return
  }

  const entries = await readdir(resolvedDir)
  const drFiles = entries.filter((f) => DR_FILENAME_RE.test(f)).sort()
  const indexFile = kbMode ? 'Decisions.md' : 'README.md'
  const hasIndex = entries.includes(indexFile)
  const indexPath = join(resolvedDir, indexFile)
  let indexContent = hasIndex ? await readFile(indexPath, 'utf8') : ''

  const indexedIds = new Set<string>()
  for (const line of indexContent.split('\n')) {
    const idMatch = line.match(ID_IN_ITEM)
    if (idMatch) indexedIds.add(idMatch[1])
  }

  // ── append missing index entries ──
  if (!hasIndex) {
    rec('ADVISORY', 'INDEX-1', 'index file missing entirely; author it by hand', indexFile)
  } else {
    let appended = 0
    const appendLines: string[] = []
    for (const file of drFiles) {
      const match = DR_FILENAME_RE.exec(file)
      if (!match) continue
      const prefix = match[1]
      const scopeKey = match[2]
      const serial = match[4]
      const drId = `${prefix}-${scopeKey}-${serial}`
      if (indexedIds.has(drId)) continue

      const filePath = join(resolvedDir, file)
      const content = await readFile(filePath, 'utf8')
      const body = content.replace(/^---\n[\s\S]*?\n---\n/, '')
      const headingMatch = body.match(/^#\s+([A-Z]+DR-[A-Z][A-Z0-9-]+-\d{3,}):\s+(.+)$/m)
      const title = headingMatch ? headingMatch[2].trim() : '(title unknown — see file)'

      appendLines.push(`- [${drId}](${file}) — ${title}`)
      rec(
        'POLISH',
        'INDEX-2',
        `${dryRun ? 'would append' : 'appended'} index entry for ${drId} — ${title} (then move to reading-order position)`,
        indexFile
      )
      appended++
    }
    if (appended === 0) {
      rec('PASS', 'INDEX-2', 'every DR file already has an index entry', indexFile)
    } else if (!dryRun) {
      indexContent = `${indexContent.replace(/\n*$/, '\n')}${appendLines.join('\n')}\n`
      await writeFile(indexPath, indexContent)
    }
  }

  findings.push(...judgmentFindingsFromRubric(RUBRIC_PATH, REF))

  emitCheckerReporter({ mode: 'conform', concern: 'decision-records', target, findings })
  process.exitCode = checkerReporterExitCode(findings)
}

main().catch((err) => {
  const target = resolve(process.argv.slice(2).find((arg) => !arg.startsWith('--')) ?? '.')
  const findings: CheckerFinding[] = [
    { type: 'M', level: 'FAIL', code: 'INDEX-1', message: `Checker could not conform the decision records: ${String(err)}`, ref: REF }
  ]
  emitCheckerReporter({ mode: 'conform', concern: 'decision-records', target, findings })
  process.exitCode = checkerReporterExitCode(findings)
})
