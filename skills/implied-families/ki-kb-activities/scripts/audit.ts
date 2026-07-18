#!/usr/bin/env bun
/**
 * Mechanical checker for Knowledge Islands activity notes.
 *
 *   bun scripts/audit.ts [base-path] [--harness <harness-path>]
 *
 * Checks:
 *   1. Activities.md index exists when activity notes are found.
 *   2. Each activity note with frontmatter has `status` and `realization`.
 *   3. slash-command activities declare a `skill` that exists in the harness.
 *   4. scheduled-task activities declare a `schedule_name` and get an advisory
 *      to verify registration in the external scheduling environment.
 *
 * READ-ONLY. Exit code non-zero on any FAIL.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  type CheckerFinding,
  checkerReporterExitCode,
  emitCheckerReporter,
  judgmentFindingsFromRubric
} from './vendored/ki-skills/checker-reporter.ts'

const KNOWN_REALIZATIONS = ['slash-command', 'scheduled-task', 'conversational', 'manual', 'workflow'] as const
const ACTIVITIES_INDEX = 'Activities.md'
const DEFAULT_ACTIVITIES_DIR = 'Admin/Operations/Activities'

// Every ki-kb-activities criterion is documented in the audit rubric — a single pointer.
const RUBRIC = 'references/rubric.md'

const mk = () => {
  const f: CheckerFinding[] = []
  const push =
    (level: CheckerFinding['level']) =>
    (code: string, message: string, ref?: string, file?: string): void =>
      void f.push({ type: 'M', level, code, message, ref, file })
  return { f, fail: push('FAIL'), warn: push('WARN'), advisory: push('ADVISORY'), note: push('INFO') }
}

const isDir = (p: string) => existsSync(p) && statSync(p).isDirectory()
const isFile = (p: string) => existsSync(p) && statSync(p).isFile()

function parseFrontmatter(text: string): Record<string, string> | null {
  if (!text.startsWith('---')) return null
  const end = text.indexOf('\n---', 3)
  if (end === -1) return null
  const block = text.slice(3, end)
  const out: Record<string, string> = {}
  for (const line of block.split('\n')) {
    const colon = line.indexOf(':')
    if (colon === -1) continue
    const key = line.slice(0, colon).trim()
    const val = line.slice(colon + 1).trim()
    if (key && val) out[key] = val
  }
  return out
}

function walkMd(dir: string): string[] {
  const results: string[] = []
  if (!isDir(dir)) return results
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) results.push(...walkMd(p))
    else if (e.name.endsWith('.md')) results.push(p)
  }
  return results
}

function auditActivities(base: string, harnessPath: string | null) {
  const { f, warn, advisory, note } = mk()

  const activitiesDir = join(base, DEFAULT_ACTIVITIES_DIR)
  if (!isDir(activitiesDir)) {
    return { f }
  }

  const allMd = walkMd(activitiesDir)
  const activityNotes = allMd.filter((p) => !p.endsWith(`/${ACTIVITIES_INDEX}`))
  const indexPath = join(activitiesDir, ACTIVITIES_INDEX)
  const indexRel = `${DEFAULT_ACTIVITIES_DIR}/${ACTIVITIES_INDEX}`

  if (activityNotes.length > 0 && !isFile(indexPath)) {
    warn('ACT-S-1', 'index is absent — create an index listing all activities', RUBRIC, indexRel)
  } else if (activityNotes.length > 0) {
    note('ACT-S-1', `index present (${activityNotes.length} activity note(s) found)`, RUBRIC, indexRel)
  }

  for (const notePath of activityNotes) {
    const rel = notePath.replace(`${base}/`, '')
    const text = readFileSync(notePath, 'utf8')
    const fm = parseFrontmatter(text)
    if (!fm) {
      note('ACT-F-1', 'no frontmatter block — judgment check only', RUBRIC, rel)
      continue
    }

    // ACT-F-1: status
    const status = fm.status
    if (!status) {
      warn('ACT-F-1', "missing required field 'status' (active | paused | retired)", RUBRIC, rel)
    } else if (!['active', 'paused', 'retired'].includes(status)) {
      warn('ACT-F-1', `status '${status}' is not one of active / paused / retired`, RUBRIC, rel)
    }

    // ACT-F-2: realization
    const realization = fm.realization
    if (!realization) {
      warn('ACT-F-2', "missing required field 'realization'", RUBRIC, rel)
      continue
    }

    // ACT-F-3: unknown realization is advisory (open enumeration)
    if (!(KNOWN_REALIZATIONS as readonly string[]).includes(realization)) {
      advisory(
        'ACT-F-3',
        `realization '${realization}' is not in the known list — ensure the agentic environment is documented`,
        RUBRIC,
        rel
      )
    }

    // ACT-R-1/2: slash-command → skill must exist in harness
    if (realization === 'slash-command') {
      const skillName = fm.skill
      if (!skillName) {
        warn('ACT-R-1', "realization 'slash-command' requires a 'skill' field naming the SKILL.md", RUBRIC, rel)
      } else if (harnessPath) {
        const skillFile = join(harnessPath, 'skills', skillName, 'SKILL.md')
        if (!isFile(skillFile)) {
          warn('ACT-R-2', `skill '${skillName}' declared but ${skillFile} not found — create the skill or correct the name`, RUBRIC, rel)
        }
      } else {
        advisory('ACT-R-2', `skill '${skillName}' declared but no harness path provided — pass --harness <path> to verify`, RUBRIC, rel)
      }
    }

    // ACT-R-3/4: scheduled-task → schedule_name + advisory to verify registration
    if (realization === 'scheduled-task') {
      const scheduleName = fm.schedule_name
      if (!scheduleName) {
        warn('ACT-R-3', "realization 'scheduled-task' requires a 'schedule_name' field", RUBRIC, rel)
      } else {
        const env = fm.schedule_env ?? 'the external scheduling system'
        advisory('ACT-R-4', `verify '${scheduleName}' is registered and active in ${env}`, RUBRIC, rel)
      }
    }
  }

  return { f }
}

// ── CLI ──────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
let basePath = '.'
let harnessPath: string | null = null

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--harness' && args[i + 1]) {
    harnessPath = resolve(args[++i] as string)
  } else if (!args[i]?.startsWith('--')) {
    basePath = args[i] as string
  }
}

const base = resolve(basePath)
if (!isDir(base)) {
  const findings: CheckerFinding[] = [
    { type: 'M', level: 'FAIL', code: 'ACT-S-2', message: `Not a directory: ${base}`, ref: RUBRIC },
    ...judgmentFindingsFromRubric(join(dirname(fileURLToPath(import.meta.url)), '..', 'references', 'rubric.md'), RUBRIC)
  ]
  emitCheckerReporter({ mode: 'audit', concern: 'kb-activities', target: base, findings })
  process.exit(checkerReporterExitCode(findings))
}

const { f } = auditActivities(base, harnessPath)
f.push(...judgmentFindingsFromRubric(join(dirname(fileURLToPath(import.meta.url)), '..', 'references', 'rubric.md'), RUBRIC))
emitCheckerReporter({ mode: 'audit', concern: 'kb-activities', target: base, findings: f })
process.exit(checkerReporterExitCode(f))
