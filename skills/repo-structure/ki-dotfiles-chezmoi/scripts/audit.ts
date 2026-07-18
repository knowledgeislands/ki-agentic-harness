#!/usr/bin/env bun
/**
 * Mechanical auditor for the chezmoi dotfiles-management standard.
 *
 *   bun scripts/audit.ts <repo-path>
 *
 * Mechanical half: four real, self-contained filesystem checks (CHEZMOI-1, CHEZMOI-2, BIN-1,
 * GIT-1) — see references/rubric.md. No package.json / ki-engineering dependency.
 *
 * Judgment half: surfaces the [J] criteria from references/rubric.md as ADVISORY
 * findings. These cannot be automated — a reader must assess them.
 *
 * The checker collects domain findings only. Its locally vendored canonical
 * checker reporter emits JSONL; the aggregate owns human presentation.
 */
import { existsSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  type CheckerFinding,
  checkerReporterExitCode,
  emitCheckerReporter,
  judgmentFindingsFromRubric
} from './vendored/ki-skills/checker-reporter.ts'

// Unified severity ladder — shared by every KI checker (checker-contract.md).
type Level = 'FAIL' | 'WARN' | 'POLISH' | 'ADVISORY' | 'INFO' | 'NA' | 'PASS'
const findings: CheckerFinding[] = []
const add = (level: Level, code: string, message: string, ref?: string, file?: string): void => {
  findings.push({ type: 'M', level, code, message, ...(ref ? { ref } : {}), ...(file ? { file } : {}) })
}

const repo = resolve(process.argv.find((arg, index) => index > 1 && !arg.startsWith('-')) ?? '.')
const RUBRIC = 'references/rubric.md'
const rubricPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'references', 'rubric.md')
if (!existsSync(repo) || !statSync(repo).isDirectory()) {
  const invalidTarget: CheckerFinding[] = [
    {
      type: 'M',
      level: 'FAIL',
      code: 'CHEZMOI-1',
      message: 'audit target is not an existing directory',
      ref: 'references/standards.md',
      file: repo
    }
  ]
  invalidTarget.push(...judgmentFindingsFromRubric(rubricPath, RUBRIC))
  emitCheckerReporter({ mode: 'audit', concern: 'dotfiles-chezmoi', target: repo, findings: invalidTarget })
  process.exit(checkerReporterExitCode(invalidTarget))
}
const at = (...p: string[]) => join(repo, ...p)
const has = (...p: string[]) => existsSync(at(...p))

function walk(dir: string, onFile: (path: string) => void, skip: (name: string) => boolean): void {
  let entries: string[]
  try {
    entries = readdirSync(dir)
  } catch {
    return
  }
  for (const entry of entries) {
    if (skip(entry)) continue
    const full = join(dir, entry)
    const st = statSync(full)
    if (st.isDirectory()) walk(full, onFile, skip)
    else onFile(full)
  }
}

const SKIP_DIRS = new Set(['.git', 'node_modules', '.ki-meta', '.claude'])

// ── CHEZMOI-1: .chezmoiignore present ─────────────────────────────────────────
if (has('.chezmoiignore')) {
  add('PASS', 'CHEZMOI-1', 'managed ignore file is present', 'references/standards.md', '.chezmoiignore')
} else {
  add(
    'FAIL',
    'CHEZMOI-1',
    'managed ignore file is missing — run CONFORM to scaffold an empty one',
    'references/standards.md',
    '.chezmoiignore'
  )
}

// ── CHEZMOI-2: .chezmoidata/.chezmoitemplates present iff .tmpl files exist ──
let hasTmplFiles = false
walk(
  repo,
  (path) => {
    if (path.endsWith('.tmpl')) hasTmplFiles = true
  },
  (name) => SKIP_DIRS.has(name)
)
if (!hasTmplFiles) {
  add('NA', 'CHEZMOI-2', 'no .tmpl files in tree — .chezmoidata/.chezmoitemplates check not applicable')
} else if (has('.chezmoidata') || has('.chezmoitemplates')) {
  add('PASS', 'CHEZMOI-2', '.chezmoidata/ or .chezmoitemplates/ present alongside .tmpl files', 'references/standards.md')
} else {
  add(
    'WARN',
    'CHEZMOI-2',
    '.tmpl files exist but neither .chezmoidata/ nor .chezmoitemplates/ is present — templating may be ad hoc rather than using the shared-data/shared-partial shape',
    'references/standards.md'
  )
}

// ── BIN-1: bin/ executable-prefix conformance ─────────────────────────────────
if (has('bin')) {
  let anyBinFile = false
  for (const entry of readdirSync(at('bin'))) {
    const full = at('bin', entry)
    if (statSync(full).isDirectory()) continue // subsystem dirs (e.g. bin/env/) checked separately, not flattened here
    anyBinFile = true
    // Recognized chezmoi source-attribute prefixes — bin/ commonly holds executable_
    // scripts, but symlink_/private_/dot_ etc. are equally legitimate chezmoi attributes
    // for a file living under bin/; only a file with none of these is worth a WARN.
    const RECOGNIZED_PREFIXES = ['executable_', 'symlink_', 'private_', 'readonly_', 'dot_', 'create_', 'modify_']
    const prefix = RECOGNIZED_PREFIXES.find((p) => entry.startsWith(p))
    if (prefix) {
      add('PASS', 'BIN-1', `follows the ${prefix} naming convention`, 'references/standards.md', `bin/${entry}`)
    } else {
      add(
        'WARN',
        'BIN-1',
        'no recognized chezmoi source-attribute prefix — confirm this is intentionally unmanaged (e.g. a README)',
        'references/standards.md',
        `bin/${entry}`
      )
    }
  }
  if (!anyBinFile) add('NA', 'BIN-1', 'bin/ exists but contains no direct files to check')
} else {
  add('NA', 'BIN-1', 'no bin/ directory in tree')
}

// ── GIT-1: no stray .git/*.lock files ─────────────────────────────────────────
const lockCandidates = ['.git/index.lock', '.git/HEAD.lock', '.git/config.lock', '.git/packed-refs.lock']
const strayLocks: string[] = lockCandidates.filter((p) => has(p))
if (has('.git', 'refs')) {
  walk(
    at('.git', 'refs'),
    (path) => {
      if (path.endsWith('.lock')) strayLocks.push(path.slice(repo.length + 1))
    },
    () => false
  )
}
if (!has('.git')) {
  add('NA', 'GIT-1', 'no .git directory — not a git repo')
} else if (strayLocks.length) {
  for (const lock of strayLocks) add('FAIL', 'GIT-1', `stray git lock file present: ${lock}`, 'references/standards.md', lock)
} else {
  add('PASS', 'GIT-1', 'no stray .git/*.lock files', 'references/standards.md')
}

findings.push(...judgmentFindingsFromRubric(rubricPath, RUBRIC))
emitCheckerReporter({ mode: 'audit', concern: 'dotfiles-chezmoi', target: repo, findings })
process.exitCode = checkerReporterExitCode(findings)
