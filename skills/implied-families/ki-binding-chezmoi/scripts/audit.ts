#!/usr/bin/env bun
/**
 * ki-binding-chezmoi — audit the chezmoi render path for the KI MCP binding.
 *
 *   bun scripts/audit.ts [chezmoi-repo] [--source <path>]
 *
 * This is a COMPOSITION checker (ADR-KI-HARNESS-SKILLS-004, composition-for-backends corollary).
 * It does not fork the shared
 * modes; it runs its two composed siblings in sequence as SUBPROCESSES (never a cross-skill
 * import, so each stays valid standalone — ADR-KI-HARNESS-SKILLS-004) and then adds its own
 * render-path delta:
 *
 *   1. ki-dotfiles-chezmoi audit <chezmoi-repo>   — the chezmoi source repo is conventional.
 *   2. ki-binding audit [--source <path>]         — each surface agrees with the single source.
 *   3. BINDCHEZ-* delta                           — the chezmoi source repo actually carries the
 *                                                   MCP source data + the render template, and a
 *                                                   `chezmoi apply` would produce the surfaces
 *                                                   ki-binding audits.
 *
 * The composed siblings own their own criteria; this checker only owns the BINDCHEZ delta
 * (see references/standards.md / references/rubric.md). Exit code is
 * non-zero iff any FAIL (a composed sibling FAIL folds up as a FAIL here). No cross-skill
 * imports — Node/Bun builtins only (checker-contract.md).
 */
import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, realpathSync, statSync } from 'node:fs'
import { homedir } from 'node:os'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  type CheckerFinding,
  checkerReporterExitCode,
  emitCheckerReporter,
  judgmentFindingsFromRubric
} from './vendored/ki-skills/checker-reporter.ts'

// Unified severity ladder — shared by every KI checker (checker-contract.md).
const findings: CheckerFinding[] = []
const add = (level: CheckerFinding['level'], code: string, message: string, ref?: string, file?: string): void =>
  void findings.push({ type: 'M', level, code, message, ref, file })

const STD = 'references/standards.md'

// ── Self-location: find the harness skills/ root through the (possibly symlinked) script path ──
const SELF = realpathSync(fileURLToPath(import.meta.url))
// .../skills/<cluster>/ki-binding-chezmoi/scripts/audit.ts → up to .../skills
const SKILLS_ROOT = resolve(dirname(SELF), '..', '..', '..')

// ── Args ──
const argv = process.argv.slice(2)
const opt = (name: string): string | undefined => {
  const i = argv.indexOf(name)
  return i >= 0 ? argv[i + 1] : undefined
}
const VALUE_OPTS = new Set(['--source'])
const positional = argv.find((a, i) => !a.startsWith('-') && !VALUE_OPTS.has(argv[i - 1] ?? ''))
const sourceOverride = opt('--source')

// The chezmoi source repo that renders the surfaces. Default: the conventional chezmoi source dir,
// honouring $XDG_DATA_HOME (chezmoi itself resolves its source dir this way).
const CHEZMOI_REPO = positional ? resolve(positional) : join(process.env.XDG_DATA_HOME ?? join(homedir(), '.local', 'share'), 'chezmoi')

// ── Compose sibling audits as subprocesses (not imports) ──
// Each sibling emits canonical JSONL; fold its final summary record into one
// composition finding while retaining each checker's standalone boundary.
function findSkillScript(skill: string): string | undefined {
  // Skills live under skills/<cluster>/<skill>/ — search each cluster subfolder rather than
  // assume a flat layout (skills/ was reorganised into cluster subfolders, ADR-KI-HARNESS-SKILLS-006).
  for (const cluster of readdirSync(SKILLS_ROOT, { withFileTypes: true })) {
    if (!cluster.isDirectory()) continue
    const candidate = join(SKILLS_ROOT, cluster.name, skill, 'scripts', 'audit.ts')
    if (existsSync(candidate)) return candidate
  }
  return undefined
}

function composeAudit(skill: string, scriptArgs: string[], criterion: string): void {
  const script = findSkillScript(skill)
  if (!script) {
    add(
      'INFO',
      criterion,
      `composed ${skill} checker not found — sibling audit skipped`,
      STD,
      join(SKILLS_ROOT, '*', skill, 'scripts', 'audit.ts')
    )
    return
  }
  const r = spawnSync('bun', [script, ...scriptArgs], { encoding: 'utf8' })
  let summary: { fail?: number; warn?: number } | null = null
  try {
    const rows = (r.stdout ?? '')
      .trim()
      .split(/\r?\n/)
      .map((line) => JSON.parse(line) as { record?: string; summary?: { fail?: number; warn?: number } })
    summary = rows.findLast((row) => row.record === 'summary')?.summary ?? null
  } catch {
    summary = null
  }
  if (summary === null) {
    add('INFO', criterion, `composed ${skill} audit could not run to completion (exit ${r.status}) — run it directly`, STD)
    return
  }
  const fail = summary.fail ?? 0
  const warn = summary.warn ?? 0
  if (fail > 0) add('FAIL', criterion, `composed ${skill} audit reported ${fail} FAIL — run /${skill} CONFORM`, STD)
  else if (warn > 0) add('WARN', criterion, `composed ${skill} audit reported ${warn} WARN — run /${skill} CONFORM`, STD)
  else add('PASS', criterion, `composed ${skill} audit clean`, STD)
}

// BINDCHEZ-1a — the chezmoi repo is conventional (composes ki-dotfiles-chezmoi).
if (existsSync(CHEZMOI_REPO)) composeAudit('ki-dotfiles-chezmoi', [CHEZMOI_REPO], 'BINDCHEZ-1')
else
  add(
    'INFO',
    'BINDCHEZ-1',
    `chezmoi source repo not present at ${CHEZMOI_REPO} — render-repo checks skipped (pass a path)`,
    STD,
    CHEZMOI_REPO
  )

// BINDCHEZ-2 — each surface agrees with the single source (composes ki-binding).
composeAudit('ki-binding', sourceOverride ? ['--source', sourceOverride] : [], 'BINDCHEZ-2')

// ── Render-path delta (BINDCHEZ-3/4/5) — only meaningful once the chezmoi repo is present ──
function walk(dir: string, onFile: (path: string) => void, depth = 0): void {
  if (depth > 6) return
  let entries: string[]
  try {
    entries = readdirSync(dir)
  } catch {
    return
  }
  for (const entry of entries) {
    if (entry === '.git' || entry === 'node_modules') continue
    const full = join(dir, entry)
    let st: ReturnType<typeof statSync>
    try {
      st = statSync(full)
    } catch {
      continue
    }
    if (st.isDirectory()) walk(full, onFile, depth + 1)
    else onFile(full)
  }
}

if (existsSync(CHEZMOI_REPO)) {
  // BINDCHEZ-3 — the chezmoi source repo carries the MCP source data, either as the legacy
  // `.chezmoidata/*mcp*` data-merge file, or as a plain managed source file applied verbatim to
  // the canonical XDG path (inverted pattern, e.g. dot_config/ki/mcp-servers.yaml).
  const dataDir = join(CHEZMOI_REPO, '.chezmoidata')
  let dataFile: string | null = null
  let dataPattern: 'data-merge' | 'inverted' | null = null
  if (existsSync(dataDir)) {
    for (const e of readdirSync(dataDir))
      if (/mcp/i.test(e) && /\.(ya?ml|toml|json)$/.test(e)) {
        dataFile = join('.chezmoidata', e)
        dataPattern = 'data-merge'
      }
  }
  if (!dataFile) {
    walk(CHEZMOI_REPO, (p) => {
      if (dataFile) return
      if (/mcp-servers\.ya?ml$/i.test(basename(p)) && !p.endsWith('.tmpl')) {
        dataFile = p.slice(CHEZMOI_REPO.length + 1)
        dataPattern = 'inverted'
      }
    })
  }
  if (dataFile) add('PASS', 'BINDCHEZ-3', `chezmoi repo carries the MCP source data (${dataFile}, ${dataPattern} pattern)`, STD, dataFile)
  else add('WARN', 'BINDCHEZ-3', 'No MCP source data was found in either supported render pattern.', STD, '.chezmoidata')

  // BINDCHEZ-4 — the render template partial exists (`mcp-servers-json`).
  let templateFile: string | null = null
  walk(CHEZMOI_REPO, (p) => {
    if (/mcp-servers-json/i.test(basename(p))) templateFile = p.slice(CHEZMOI_REPO.length + 1)
  })
  if (templateFile) add('PASS', 'BINDCHEZ-4', `render template present (${templateFile})`, STD, templateFile)
  else
    add(
      'WARN',
      'BINDCHEZ-4',
      'no `mcp-servers-json` render template found in the chezmoi repo — surfaces cannot be rendered from the source',
      STD
    )

  // BINDCHEZ-5 — the template is wired to at least one surface target `.tmpl`.
  let wired: string | null = null
  walk(CHEZMOI_REPO, (p) => {
    if (!p.endsWith('.tmpl')) return
    try {
      if (/mcp-servers-json/i.test(readFileSync(p, 'utf8'))) wired = p.slice(CHEZMOI_REPO.length + 1)
    } catch {
      /* unreadable — skip */
    }
  })
  if (wired) add('PASS', 'BINDCHEZ-5', `render template is wired into a surface target (${wired})`, STD, wired)
  else
    add(
      'WARN',
      'BINDCHEZ-5',
      'no `.tmpl` target references `mcp-servers-json` — the template exists but no surface is rendered through it',
      STD
    )
}

findings.push(...judgmentFindingsFromRubric(join(dirname(fileURLToPath(import.meta.url)), '..', 'references', 'rubric.md')))
emitCheckerReporter({ mode: 'audit', concern: 'binding-chezmoi', target: CHEZMOI_REPO, findings })
process.exit(checkerReporterExitCode(findings))
