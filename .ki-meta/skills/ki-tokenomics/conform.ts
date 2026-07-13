#!/usr/bin/env bun
/**
 * Mechanical CONFORM for the ki-tokenomics standard.
 *
 * Honest normalize-only conform — it applies NO automatic edits. Tokenomics is
 * measurement + judgment: every gap audit.ts can find is either a judgment call
 * (does a heavy CLAUDE.md earn its tokens; is an MCP server actually used; is the
 * model tier proportionate; is Headroom's reversible/cache config optimal) or a
 * trim/choice only a human can make (which prose to lift out, which value to pick
 * for `preferred_model_type`, whether a broken `@import` is a typo or a moved file,
 * whether a cross-repo `headroom:learn` line should be re-learned or pruned). None
 * reduces to a deterministic, reversible rewrite the way (say) a DR's
 * `decision_type` derives from its filename — so there is nothing safe to auto-fix,
 * and this script guesses no trim. It re-runs audit.ts's *detection* (copied, not
 * imported, per the composition-only rule — kept in lockstep) to turn each finding
 * category into a concrete, actionable manual TODO, then points back at AUDIT.
 *
 *   bun scripts/conform.ts [path]   # default: cwd (a project or a KB base)
 *   --dry-run                       # no-op here (this conform never mutates), banner only
 *   --json                          # emit the shared finding wrapper instead of prose
 *
 * Because it writes nothing, every finding it surfaces is a manual/judgment TODO —
 * level ADVISORY on the shared ladder — split into a concrete section (defects the
 * mechanical scan located in this repo) and a judgment section (the [J] rubric). The
 * `--json` wrapper mirrors audit.ts's: { concern, target, generatedAt, summary, findings }.
 *
 * Manual TODOs it surfaces (derived from audit.ts's finding areas):
 *   - SURF-1  broken `@import` in a project CLAUDE.md — concrete path listed; fixing
 *             it (repair the path, or drop the include) is a judgment call.
 *   - TOOL-4  foreign `knowledgeislands/<repo>` line(s) inside the project CLAUDE.md
 *             `headroom:learn` markers — listed; re-learn here or prune (judgment).
 *   - CFG     `.ki-config.toml` [ki-tokenomics] defects: table absent (run INIT),
 *             invalid `headroom`, missing/invalid `preferred_model_type`, unknown keys
 *             (validate-down), non-numeric budgets — the operator picks the value.
 *   - SURF-4 / BUDG / MCP-2/3 / RUN / TOOL-3 pointer TODOs: altitude, budget
 *             overages, MCP-server usefulness, runtime levers, Headroom optimality —
 *             inherently un-scriptable; re-run AUDIT and apply the [J] rubric.
 *
 * Zero npm dependencies (bun + node stdlib only). Exit code is non-zero only on an
 * unrecoverable error (target path unreadable); findings/TODOs never fail the run.
 */

import { existsSync, readFileSync, statSync } from 'node:fs'
import { homedir } from 'node:os'
import { basename, dirname, isAbsolute, join, resolve } from 'node:path'

// ── colour helpers (same style as audit.ts) ──
const C = { reset: '\x1b[0m', dim: '\x1b[2m', green: '\x1b[32m', yellow: '\x1b[33m', red: '\x1b[31m', cyan: '\x1b[36m' }
const paint = (c: string, s: string): string => `${c}${s}${C.reset}`

// ── collect-then-emit harness (mirrors audit.ts / ki-authoring conform) ──
// This conform is NORMALIZE-ONLY: it writes nothing, so every finding is a manual
// or judgment TODO — level ADVISORY (or INFO where merely informational). area is
// the FINE rubric code kept in lockstep with audit.ts; ref the reference-doc
// pointer; file the path a file-scoped TODO concerns. `say` prints the human line
// only outside --json, so a direct run streams prose while the aggregate consumes
// the wrapper.
type Level = 'FAIL' | 'WARN' | 'POLISH' | 'ADVISORY' | 'INFO' | 'NA' | 'PASS'
type Finding = { level: Level; area: string; msg: string; ref?: string; file?: string }
const findings: Finding[] = []
const rec = (level: Level, area: string, msg: string, ref?: string, file?: string): void =>
  void findings.push({ level, area, msg, ref, file })
const RUBRIC = 'references/audit-rubric.md'

// ── kept in lockstep with audit.ts ──
const KI_SECTION = 'ki-tokenomics'
const HEADROOM_VALUES = ['required', 'recommended', 'off'] as const
// Portable, purpose-based model *types* (ADR-KI-HARNESS-009) — kept in lockstep
// with audit.ts. Concrete models per runtime live in docs/guides/prompting/.
const MODEL_TIER_VALUES = ['frontier', 'reasoning', 'standard', 'fast'] as const
const LEGACY_ALIAS_TO_TYPE: Record<string, string> = { fable: 'frontier', opus: 'reasoning', sonnet: 'standard', haiku: 'fast' }
const BUDGET_KEYS = new Set<string>(['claude_md', 'memory_index', 'skills_surface', 'mcp_servers', 'total'])

const readText = (p: string): string | null => {
  try {
    return statSync(p).isFile() ? readFileSync(p, 'utf8') : null
  } catch {
    return null
  }
}
const stripCode = (md: string): string => md.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '')

// ── CLAUDE.md @import resolution (copied from audit.ts) ──
// Only a token that begins with ~ . or / is an import; a bare `@word` is an @mention.
const IMPORT_RE = /(?:^|\s)@(~?[./][^\s)]*)/g
function brokenImports(file: string, seen = new Set<string>(), out: string[] = []): string[] {
  const abs = resolve(file)
  if (seen.has(abs)) return out
  seen.add(abs)
  const text = readText(abs)
  if (text == null) return out
  const base = dirname(abs)
  for (const m of stripCode(text).matchAll(IMPORT_RE)) {
    const raw = m[1] as string
    const dest = raw.startsWith('~/') ? join(homedir(), raw.slice(2)) : isAbsolute(raw) ? raw : resolve(base, raw)
    if (existsSync(dest)) brokenImports(dest, seen, out)
    else if (raw.includes('/') || raw.endsWith('.md')) out.push(raw)
  }
  return out
}

// ── minimal TOML for the [ki-tokenomics] table (copied from audit.ts) ──
type KiConfig = {
  present: boolean
  headroomBad?: string
  modelTierType?: string
  modelTierTypeBad?: string
  legacyModelTier?: string
  bindingBadKeys: string[]
  bindingEmptyKeys: string[]
  unknownKeys: string[]
  badBudgets: string[]
}
function parseKiConfig(text: string): KiConfig {
  const cfg: KiConfig = { present: false, bindingBadKeys: [], bindingEmptyKeys: [], unknownKeys: [], badBudgets: [] }
  let section = ''
  const BUDGETS = `${KI_SECTION}.budgets`
  const BINDINGS = `${KI_SECTION}.model_tier_bindings`
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*$/, '').trim()
    if (!line) continue
    const header = line.match(/^\[(.+)\]$/)
    if (header) {
      section = (header[1] as string).trim()
      if (section === KI_SECTION || section === BUDGETS || section === BINDINGS) cfg.present = true
      continue
    }
    if (section !== KI_SECTION && section !== BUDGETS && section !== BINDINGS) continue
    const eq = line.indexOf('=')
    if (eq === -1) continue
    const key = line.slice(0, eq).trim()
    const val = line
      .slice(eq + 1)
      .trim()
      .replace(/^["']|["']$/g, '')
    if (section === KI_SECTION) {
      if (key === 'headroom') {
        if (!(HEADROOM_VALUES as readonly string[]).includes(val)) cfg.headroomBad = val
      } else if (key === 'preferred_model_type') {
        if ((MODEL_TIER_VALUES as readonly string[]).includes(val)) cfg.modelTierType = val
        else cfg.modelTierTypeBad = val
      } else if (key === 'preferred_model') {
        cfg.legacyModelTier = val // pre-ADR-008 key — conform maps it to preferred_model_type
      } else if (key === 'context_window_tokens') {
        const n = Number(val)
        if (!(Number.isFinite(n) && n > 0)) cfg.badBudgets.push(key)
      } else cfg.unknownKeys.push(key)
    } else if (section === BINDINGS) {
      if (!(MODEL_TIER_VALUES as readonly string[]).includes(key)) cfg.bindingBadKeys.push(key)
      else if (
        val
          .split(',')
          .map((e) => e.trim())
          .filter(Boolean).length === 0
      )
        cfg.bindingEmptyKeys.push(key)
    } else if (!BUDGET_KEYS.has(key)) {
      cfg.unknownKeys.push(key)
    } else {
      const n = Number(val)
      if (!(Number.isFinite(n) && n >= 0)) cfg.badBudgets.push(key)
    }
  }
  return cfg
}

// ── TOOL-4: foreign roots inside the project CLAUDE.md headroom:learn block (copied) ──
function foreignLearnRoots(target: string): { repos: string[]; lines: number } {
  const projClaudeMd = join(target, 'CLAUDE.md')
  const text = existsSync(projClaudeMd) ? (readText(projClaudeMd) ?? '') : ''
  const start = text.indexOf('<!-- headroom:learn:start -->')
  const end = text.indexOf('<!-- headroom:learn:end -->')
  if (start === -1 || end === -1 || end <= start) return { repos: [], lines: 0 }
  const repoName = basename(target)
  const foreign = new Set<string>()
  let foreignLines = 0
  for (const line of text.slice(start, end).split('\n')) {
    const names = [...line.matchAll(/knowledgeislands\/([A-Za-z0-9_-]+)/g)].map((mm) => mm[1]).filter((nm) => nm !== repoName)
    if (names.length > 0) {
      foreignLines++
      for (const nm of names) foreign.add(nm as string)
    }
  }
  return { repos: [...foreign], lines: foreignLines }
}

// ── entry ──
function main(): number {
  const argv = process.argv.slice(2)
  const dryRun = argv.includes('--dry-run')
  const json = argv.includes('--json')
  const target = resolve(argv.find((a) => !a.startsWith('-')) ?? '.')
  const say = (line: string): void => {
    if (!json) console.log(line)
  }

  if (!existsSync(target)) {
    console.error(paint(C.red, `target path not found: ${target}`))
    return 1
  }

  say(paint(C.dim, `target: ${target}${dryRun ? '   (dry run)' : ''}`))
  say(paint(C.dim, 'ki-tokenomics conform is normalize-only — it applies no automatic edits; every gap needs a human trim or choice.\n'))

  // ── manual TODOs (concrete — derived from this repo's state) — all ADVISORY (nothing is written) ──
  say(paint(C.cyan, 'manual TODOs (concrete — from this repo)'))
  let concrete = 0
  const todo = (area: string, msg: string, file?: string): void => {
    concrete++
    rec('ADVISORY', area, msg, RUBRIC, file)
    say(`  ${paint(C.yellow, '-')} [${area}]${file ? ` ${file}` : ''} ${msg}`)
  }

  // ── SURF-1: broken @imports in the project CLAUDE.md (+ AGENTS.md) ──
  for (const name of ['CLAUDE.md', 'AGENTS.md']) {
    const file = join(target, name)
    if (!existsSync(file)) continue
    for (const b of brokenImports(file)) {
      todo('SURF-1', `${name} has an unresolved @import "${b}" (broken include); repair the path or drop the include`, name)
    }
  }

  // ── TOOL-4: foreign headroom:learn roots ──
  const { repos, lines } = foreignLearnRoots(target)
  if (repos.length > 0) {
    todo(
      'TOOL-4',
      `CLAUDE.md headroom:learn block has ${lines} line(s) rooted in other repo(s) (${repos.join(', ')}); re-learn here or prune`,
      'CLAUDE.md'
    )
  }

  // ── CFG: [ki-tokenomics] table defects ──
  const kiText = readText(join(target, '.ki-config.toml'))
  if (kiText == null) {
    todo(
      'CFG-2',
      'no .ki-config.toml at target; a KI repo needs one (see ki-repo), then run INIT to add the [ki-tokenomics] table',
      '.ki-config.toml'
    )
  } else {
    const ki = parseKiConfig(kiText)
    if (!ki.present) {
      todo(
        'CFG-2',
        `no [${KI_SECTION}] table in .ki-config.toml; run \`bun scripts/init.ts\` / \`--init\` to scaffold it, then tune`,
        '.ki-config.toml'
      )
    } else {
      if (ki.headroomBad)
        todo('CFG-1', `headroom = "${ki.headroomBad}" invalid; set one of ${HEADROOM_VALUES.join(' / ')}`, '.ki-config.toml')
      if (ki.legacyModelTier) {
        const mapped = LEGACY_ALIAS_TO_TYPE[ki.legacyModelTier]
        const to = mapped ? `preferred_model_type = "${mapped}"` : `preferred_model_type = "…" (${MODEL_TIER_VALUES.join(' / ')})`
        todo('CFG-4', `preferred_model = "${ki.legacyModelTier}" is the retired Claude-only key; replace it with ${to} (ADR-KI-HARNESS-009)`, '.ki-config.toml')
      } else if (ki.modelTierTypeBad)
        todo('CFG-4', `preferred_model_type = "${ki.modelTierTypeBad}" invalid; set one of ${MODEL_TIER_VALUES.join(' / ')}`, '.ki-config.toml')
      else if (!ki.modelTierType)
        todo(
          'CFG-4',
          `preferred_model_type not declared in [${KI_SECTION}]; add the default type (${MODEL_TIER_VALUES.join(' / ')})`,
          '.ki-config.toml'
        )
      for (const k of ki.bindingBadKeys)
        todo(
          'CFG-5',
          `"${k}" in [${KI_SECTION}.model_tier_bindings] is not a model type; keys must be one of ${MODEL_TIER_VALUES.join(' / ')}`,
          '.ki-config.toml'
        )
      for (const k of ki.bindingEmptyKeys)
        todo(
          'CFG-5',
          `${k} in [${KI_SECTION}.model_tier_bindings] has no non-empty model; give a comma-separated list (e.g. "opus, gpt-5.6-sol")`,
          '.ki-config.toml'
        )
      for (const k of ki.unknownKeys)
        todo(
          'CFG-1',
          `unrecognised key "${k}" in [${KI_SECTION}] (validate-down); remove it or move it to its own table`,
          '.ki-config.toml'
        )
      for (const k of ki.badBudgets)
        todo('CFG-1', `"${k}" has a non-numeric/invalid value in [${KI_SECTION}]; set a number`, '.ki-config.toml')
    }
  }

  if (concrete === 0) say(`  ${paint(C.dim, 'none found by the mechanical scan')}`)

  // ── judgment TODOs — the [J] rubric the script cannot decide, always surfaced (ADVISORY) ──
  say(`\n${paint(C.cyan, 'judgment TODOs (re-run AUDIT, apply the [J] rubric by reading)')}`)
  for (const [area, p] of [
    [
      'SURF-4',
      'does each heavy CLAUDE.md / memory entry EARN its tokens, or restate what the model knows / belong in an on-demand file? Lift it out.'
    ],
    ['BUDG-3', 'any sustained budget overage is either trimmed or a deliberate, recorded decision — not waved-off drift.'],
    [
      'MCP-2',
      'is each configured MCP server actually used here? Disable/scope unused or over-broad servers (keep tool search on); this is usually the biggest lever.'
    ],
    ['RUN-2', 'prompt-cache hits, model tier vs work value, autocompact + sub-agent fan-out, tool-result verbosity.'],
    [
      'TOOL-3',
      'where Headroom is present, confirm the reversible store (CCR) + cache-aligner + output-shaper are set optimally (keys undocumented — judgment).'
    ]
  ] as const) {
    rec('ADVISORY', area, p, RUBRIC)
    say(`  ${paint(C.dim, `- [${area}] ${p}`)}`)
  }

  say(
    `\n${paint(C.dim, 'no edits applied (normalize-only) — make the trims/choices above by hand, then re-run `bun scripts/audit.ts` (or `ki:tokenomics:audit`) to confirm they clear.')}`
  )

  if (json) {
    const n = (l: Level): number => findings.filter((f) => f.level === l).length
    const summary = {
      fail: n('FAIL'),
      warn: n('WARN'),
      polish: n('POLISH'),
      advisory: n('ADVISORY'),
      info: n('INFO'),
      na: n('NA'),
      pass: n('PASS')
    }
    process.stdout.write(JSON.stringify({ concern: 'tokenomics', target, generatedAt: new Date().toISOString(), summary, findings }))
  }
  return 0
}

try {
  process.exit(main())
} catch (err) {
  console.error(`ERROR: ${String(err)}`)
  process.exit(1)
}
