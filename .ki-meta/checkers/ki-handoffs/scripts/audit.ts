#!/usr/bin/env bun
/**
 * Mechanical auditor for the Knowledge Islands handoffs standard.
 *
 *   bun scripts/audit.ts <dir>      (default: .)
 *
 * Handoffs ride on a host artifact — a thematic plan file (ki-repo-roadmap)
 * in a non-KB repository, or a stream proposal's Checklist (ki-kb-streams) in a
 * KB. This checker adds only the delegation-readiness delta: it scans the target
 * for artifacts that opt in with
 * `handoff: true` frontmatter and checks the opt-in marker contract. Run the host
 * artifact's audit (ki-repo-roadmap / ki-kb-streams) separately for structure.
 *
 * Mechanical half (opt-in contract): a valid `tier`, a decisions-locked-vs-escalate
 * section, and a readiness marker. Judgment half (doctrine): surfaced as ADVISORY.
 *
 * Output is grouped by severity; exit code is non-zero iff any FAIL.
 * No dependencies — Node/Bun builtins only; no cross-skill imports.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { basename, dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  type CheckerFinding,
  checkerReporterExitCode,
  emitCheckerReporter,
  judgmentFindingsFromRubric
} from './vendored/ki-skills/checker-reporter.ts'

// Unified severity ladder — shared by every KI checker (enforcement-framework §2).
type Level = 'FAIL' | 'WARN' | 'POLISH' | 'ADVISORY' | 'INFO' | 'NA' | 'PASS'
const RUBRIC = 'references/rubric.md'
const findings: CheckerFinding[] = []
const add = (level: Level, code: string, message: string, ref?: string, file?: string): void => {
  findings.push({ type: 'M', level, code, message, ref, file })
}

function localRubricPath(): string {
  const scriptDir = dirname(fileURLToPath(import.meta.url))
  const skillRoot = basename(scriptDir) === 'scripts' ? dirname(scriptDir) : scriptDir
  return join(skillRoot, 'references', 'rubric.md')
}

const rawTarget = process.argv[2] ?? '.'
const target = resolve(rawTarget)
if (!existsSync(target)) {
  add('FAIL', 'HAND-1', `Requested audit path does not exist: ${rawTarget}`, 'references/standards.md')
  findings.push(...judgmentFindingsFromRubric(localRubricPath(), RUBRIC))
  emitCheckerReporter({ mode: 'audit', concern: 'handoffs', target, findings })
  process.exit(checkerReporterExitCode(findings))
}

const VALID_TIERS = new Set(['haiku', 'sonnet', 'opus'])
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', '.ki-meta', '.attic', '.claude'])

// ── discover markdown files under the target ────────────────────────────────────
function walk(dir: string, out: string[]): void {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (!SKIP_DIRS.has(e.name)) walk(join(dir, e.name), out)
    } else if (e.isFile() && e.name.endsWith('.md')) {
      out.push(join(dir, e.name))
    }
  }
}

const files: string[] = []
if (statSync(target).isDirectory()) walk(target, files)
else files.push(target)

// ── check each opted-in artifact against the marker contract ────────────────────
for (const path of files) {
  const content = readFileSync(path, 'utf8')
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/)
  if (!fmMatch) continue
  const fm: Record<string, string> = {}
  for (const line of fmMatch[1].split('\n')) {
    const m = line.match(/^([a-zA-Z-]+):\s*(.*)$/)
    if (m)
      fm[m[1]] = m[2]
        .trim()
        .replace(/\s+#.*$/, '')
        .replace(/^['"]|['"]$/g, '')
  }
  if (fm.handoff !== 'true') continue
  const rel = relative(target, path) || path
  const body = content.slice(fmMatch[0].length)

  // HAND-1: valid tier
  if (!fm.tier) add('FAIL', 'HAND-1', `handoff artifact missing 'tier' (one of haiku | sonnet | opus)`, 'references/standards.md', rel)
  else if (!VALID_TIERS.has(fm.tier))
    add('FAIL', 'HAND-1', `tier '${fm.tier}' not one of haiku | sonnet | opus`, 'references/standards.md', rel)

  // HAND-2: decisions section naming both locked and escalate
  const hasDecisionsHeading = /^#{2,}\s+.*decisions/im.test(body)
  const namesLocked = /locked/i.test(body)
  const namesEscalate = /escalate/i.test(body)
  if (!hasDecisionsHeading) add('FAIL', 'HAND-2', `no decisions section (a '## Decisions' heading)`, 'references/standards.md', rel)
  else if (!(namesLocked && namesEscalate))
    add(
      'FAIL',
      'HAND-2',
      `decisions section must distinguish 'locked' from 'escalate' (both labels present)`,
      'references/standards.md',
      rel
    )

  // HAND-3: readiness marker
  const hasReadiness = 'readiness' in fm || /^#{2,}\s+readiness/im.test(body) || /\[[ xX]\]\s*readiness test/i.test(body)
  if (!hasReadiness)
    add(
      'WARN',
      'HAND-3',
      `no readiness marker (readiness: frontmatter, a '## Readiness' heading, or a 'Readiness test' checkbox)`,
      'references/standards.md',
      rel
    )
}

findings.push(...judgmentFindingsFromRubric(localRubricPath(), RUBRIC))
emitCheckerReporter({ mode: 'audit', concern: 'handoffs', target, findings })
process.exit(checkerReporterExitCode(findings))
