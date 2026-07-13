#!/usr/bin/env bun
/**
 * ki-binding — audit that every run surface agrees with the single source.
 *
 * The single source is a plain `mcpServers:` YAML — one list where each entry declares a
 * `clients:` set naming the surfaces it targets. Its canonical, tool-neutral home is
 * `~/.config/ki/mcp-servers.yaml`, owned by no one dotfiles manager. A renderer (chezmoi on
 * the maintainer's machine, or any tool that reads this file) applies it to Claude Code,
 * Claude Desktop, and the mcporter proxy. This checker reads the source directly — it does
 * not require any particular renderer to be installed — compares each surface against it,
 * and reports drift on the unified severity ladder.
 *
 * It is READ-ONLY: it never writes a surface config (that is the renderer's job — edit the
 * source, then re-render, e.g. `chezmoi apply`). See references/binding-standard.md for the model.
 *
 * Usage:
 *   bun audit.ts [project]            audit surfaces; [project] scopes the skill half
 *   --check                                   audit only; exit non-zero on FAIL (WARN never fails)
 *   --source <path>                           override the source (else $KI_MCP_SOURCE, else first default that exists)
 *   --json                                    emit findings as JSON
 */

import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, realpathSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// This script runs under Bun (shebang); tsc types are node-only, so declare the one Bun global used.
declare const Bun: { YAML: { parse(input: string): unknown } }

// ── Self-location: find the harness skills/ root through the (possibly symlinked) script path ──
const SELF = realpathSync(fileURLToPath(import.meta.url))
// .../skills/environment/ki-binding/scripts/audit.ts → up to .../skills
const SKILLS_ROOT = resolve(dirname(SELF), '..', '..')

const HOME = homedir()

// ── Source candidates ──
// The canonical, tool-neutral home is `~/.config/ki/mcp-servers.yaml` (XDG). chezmoi is one
// *renderer* that reads the source and applies it to surfaces — its legacy data path stays as a
// transitional fallback so an un-migrated machine keeps auditing until its renderer is repointed
// at the canonical file. Project-local `.ki/mcps.yaml` is the last default. Explicit `--source`
// or `$KI_MCP_SOURCE` win over all of these.
const XDG_CONFIG = process.env.XDG_CONFIG_HOME ?? join(HOME, '.config')
const CANONICAL_SOURCE = join(XDG_CONFIG, 'ki', 'mcp-servers.yaml')
const LEGACY_CHEZMOI_SOURCE = join(HOME, '.local', 'share', 'chezmoi', '.chezmoidata', 'mcps.yaml')
const PROJECT_LOCAL_SOURCE = join(process.cwd(), '.ki', 'mcps.yaml')
const inferBackend = (p: string): 'chezmoi' | 'plain' => (p.includes('chezmoi') ? 'chezmoi' : 'plain')
const RECOGNISED = new Set(['code', 'desktop', 'mcporter', 'cowork'])

// The file-editable, chezmoi-rendered surfaces this checker compares against the source.
const SURFACES: Array<{ token: string; label: string; path: string }> = [
  { token: 'code', label: 'Claude Code', path: join(HOME, '.claude.json') },
  { token: 'desktop', label: 'Claude Desktop', path: join(HOME, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json') },
  { token: 'mcporter', label: 'mcporter', path: join(HOME, '.mcporter', 'mcporter.json') }
]

// ── ANSI ──
const RED = '\x1b[31m'
const YELLOW = '\x1b[33m'
const GREEN = '\x1b[32m'
const DIM = '\x1b[2m'
const RESET = '\x1b[0m'

type Severity = 'FAIL' | 'WARN' | 'PASS' | 'INFO'
interface Finding {
  severity: Severity
  criterion: string
  message: string
  // Cited-finding fields: `ref` points at the standard a criterion is judged against,
  // `file` names the surface/source config a file-scoped finding concerns. Both optional —
  // an aggregate finding (spanning many files) carries neither.
  ref?: string
  file?: string
}

// The standard every BIND criterion is judged against — the shared `ref` pointer, kept
// identical to conform.ts so the same criterion cites the same (area, ref) in both surfaces.
const BIND_REF = 'references/binding-standard.md'

interface ServerEntry {
  name: string
  clients?: string[]
  url?: string
  command?: string
}

// ── Args ──
const argv = process.argv.slice(2)
const flag = (name: string): boolean => argv.includes(name)
const opt = (name: string): string | undefined => {
  const i = argv.indexOf(name)
  return i >= 0 ? argv[i + 1] : undefined
}
const CHECK = flag('--check')
const JSON_OUT = flag('--json')
// Resolve the source: explicit `--source`/`$KI_MCP_SOURCE` win; otherwise the first default
// that exists, canonical-first. Falls back to the canonical path so a not-found error names it.
const sourceOverride = opt('--source') ?? process.env.KI_MCP_SOURCE
const SOURCE = sourceOverride
  ? resolve(sourceOverride)
  : ([CANONICAL_SOURCE, LEGACY_CHEZMOI_SOURCE, PROJECT_LOCAL_SOURCE].find((p) => existsSync(p)) ?? CANONICAL_SOURCE)
const BACKEND = inferBackend(SOURCE)
const project = argv.find((a, i) => !a.startsWith('--') && argv[i - 1] !== '--source')

// ── Helpers ──
function readJson(path: string): Record<string, unknown> | null {
  if (!existsSync(path)) return null
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as Record<string, unknown>
  } catch {
    return null
  }
}

function mcpServerKeys(cfg: Record<string, unknown> | null): Set<string> {
  const m = cfg?.mcpServers
  return m && typeof m === 'object' ? new Set(Object.keys(m as Record<string, unknown>)) : new Set()
}

// ── Load & validate the single source (BIND-2) ──
if (!existsSync(SOURCE)) {
  process.stderr.write(
    `${RED}error${RESET} single source not found: ${SOURCE}\n  create it at the canonical path, or point elsewhere with --source <path> / $KI_MCP_SOURCE.\n`
  )
  process.exit(2)
}

let entries: ServerEntry[]
try {
  const parsed = Bun.YAML.parse(readFileSync(SOURCE, 'utf8')) as { mcpServers?: ServerEntry[] }
  if (!parsed || !Array.isArray(parsed.mcpServers)) throw new Error('no mcpServers list')
  entries = parsed.mcpServers
} catch (e) {
  process.stderr.write(`${RED}error${RESET} could not parse source ${SOURCE}: ${(e as Error).message}\n`)
  process.exit(2)
}

const findings: Finding[] = []
const add = (severity: Severity, criterion: string, message: string, ref?: string, file?: string): void =>
  void findings.push({ severity, criterion, message, ref, file })

// BIND-2 — structural validity of the source.
const universe = new Set<string>()
for (const [i, e] of entries.entries()) {
  const where = e.name ? `"${e.name}"` : `entry #${i}`
  if (!e.name) add('WARN', 'BIND-2', `${where} has no \`name\``, BIND_REF, SOURCE)
  else universe.add(e.name)
  const clients = e.clients ?? []
  if (clients.length === 0) add('WARN', 'BIND-2', `${where} has an empty \`clients\` — targets no surface`, BIND_REF, SOURCE)
  for (const c of clients) if (!RECOGNISED.has(c)) add('WARN', 'BIND-2', `${where} names unrecognised surface \`${c}\``, BIND_REF, SOURCE)
}
if (!findings.some((f) => f.criterion === 'BIND-2'))
  add('PASS', 'BIND-2', `source valid — ${entries.length} servers, all with a name and recognised clients`, BIND_REF, SOURCE)

// BIND-1 — each file-editable surface renders exactly the servers whose clients names it.
for (const s of SURFACES) {
  const expected = new Set([...universe].filter((n) => entries.find((e) => e.name === n)?.clients?.includes(s.token)))
  const cfg = readJson(s.path)
  if (cfg === null) {
    add('INFO', 'BIND-1', `${s.label} config not present or unreadable — surface not audited`, BIND_REF, s.path)
    continue
  }
  const presentAll = mcpServerKeys(cfg)
  const present = new Set([...presentAll].filter((n) => universe.has(n))) // KI-governed only
  const missing = [...expected].filter((n) => !present.has(n)).sort()
  const stray = [...present].filter((n) => !expected.has(n)).sort()
  if (missing.length === 0 && stray.length === 0) {
    add('PASS', 'BIND-1', `${s.label} agrees with the source (${expected.size} servers)`, BIND_REF, s.path)
  } else {
    if (missing.length)
      add(
        'WARN',
        'BIND-1',
        `${s.label} missing ${missing.length}: ${missing.join(', ')} — source targets \`${s.token}\` but surface lacks them`,
        BIND_REF,
        s.path
      )
    if (stray.length)
      add(
        'WARN',
        'BIND-1',
        `${s.label} stray ${stray.length}: ${stray.join(', ')} — present but source does not target \`${s.token}\``,
        BIND_REF,
        s.path
      )
  }
}

// BIND-4 — Cowork agreement: the KI plugin is registered + toggled in every workspace.
// v1 ships a skills+agents plugin (no servers port into the sandbox), so this checks the
// plugin enablement in cowork_settings.json rather than server rendering. Any server that
// nonetheless declares `cowork` is surfaced separately, since servers are deferred.
const COWORK_MARKETPLACE = 'ki-plugins'
const COWORK_PLUGIN_KEY = `knowledge-islands@${COWORK_MARKETPLACE}`
const COWORK_REPO = 'knowledgeislands/ki-plugins'
const coworkBase = join(HOME, 'Library', 'Application Support', 'Claude', 'local-agent-mode-sessions')

function findCoworkSettings(dir: string, depth = 0): string[] {
  if (!existsSync(dir) || depth > 4) return []
  const out: string[] = []
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'cowork_settings.json' && e.isFile()) out.push(join(dir, e.name))
    else if (e.isDirectory() && e.name !== 'cowork_plugins') out.push(...findCoworkSettings(join(dir, e.name), depth + 1))
  }
  return out
}

const coworkFiles = findCoworkSettings(coworkBase)
if (coworkFiles.length === 0) {
  add('INFO', 'BIND-4', 'no cowork_settings.json found — Cowork surface not present on this machine', BIND_REF, coworkBase)
} else {
  const unconformed: string[] = []
  for (const path of coworkFiles) {
    const cfg = readJson(path)
    const enabled = (cfg?.enabledPlugins ?? {}) as Record<string, unknown>
    const markets = (cfg?.extraKnownMarketplaces ?? {}) as Record<string, unknown>
    const on = enabled[COWORK_PLUGIN_KEY] === true
    const registered = (markets[COWORK_MARKETPLACE] as { source?: { repo?: string } })?.source?.repo === COWORK_REPO
    if (!(on && registered)) unconformed.push(path)
  }
  if (unconformed.length === 0)
    add('PASS', 'BIND-4', `Cowork agrees — ${COWORK_PLUGIN_KEY} registered + enabled in all ${coworkFiles.length} workspace(s)`, BIND_REF)
  else
    add(
      'WARN',
      'BIND-4',
      `Cowork: ${COWORK_PLUGIN_KEY} not registered/enabled in ${unconformed.length}/${coworkFiles.length} workspace(s) — run conform.ts (then relaunch Cowork)`,
      BIND_REF
    )
}

const coworkServers = [...universe].filter((n) => entries.find((e) => e.name === n)?.clients?.includes('cowork')).sort()
if (coworkServers.length > 0)
  add(
    'WARN',
    'BIND-4',
    `${coworkServers.length} server(s) declare \`cowork\` but MCP servers are deferred (host-local, not sandbox-portable): ${coworkServers.join(', ')} — skills+agents port, servers need separate work`,
    BIND_REF
  )

// BIND-3 — compose ki-bootstrap --check for the project's skill half.
const bootstrap = join(SKILLS_ROOT, 'ki-bootstrap', 'scripts', 'link-skills.ts')
if (!project) {
  add('INFO', 'BIND-3', 'no [project] given — skill half (ki-bootstrap) not audited; pass a repo path to include it', BIND_REF)
} else if (!existsSync(bootstrap)) {
  add('INFO', 'BIND-3', 'ki-bootstrap checker not found — skill half not audited', BIND_REF, bootstrap)
} else {
  const r = spawnSync('bun', [bootstrap, resolve(project), '--check'], { encoding: 'utf8' })
  const ok = r.status === 0
  add(
    ok ? 'PASS' : 'WARN',
    'BIND-3',
    `ki-bootstrap --check on ${project} ${ok ? 'clean' : `reported findings (exit ${r.status}) — run ki:skills:link:project`}`,
    BIND_REF,
    resolve(project)
  )
}

// ── Report ──
if (JSON_OUT) {
  // The pinned checker-contract `--json` wrapper: { concern, target, generatedAt,
  // summary, findings }, each finding { level, area, msg }, summary carrying all seven
  // lowercase ladder keys present even at zero.
  const summary = { fail: 0, warn: 0, polish: 0, advisory: 0, info: 0, na: 0, pass: 0 }
  for (const f of findings) summary[f.severity.toLowerCase() as keyof typeof summary]++
  const wrapper = {
    concern: 'binding',
    target: project ? resolve(project) : SOURCE,
    generatedAt: new Date().toISOString(),
    summary,
    findings: findings.map((f) => ({ level: f.severity, area: f.criterion, msg: f.message, ref: f.ref, file: f.file }))
  }
  process.stdout.write(`${JSON.stringify(wrapper)}\n`)
} else {
  const colour: Record<Severity, string> = { FAIL: RED, WARN: YELLOW, PASS: GREEN, INFO: DIM }
  process.stdout.write(
    `\n${DIM}ki-binding — cross-surface audit${RESET}\n${DIM}source: ${SOURCE} (${BACKEND} backend)${RESET}\n${'─'.repeat(60)}\n`
  )
  for (const f of findings) {
    const loc = f.file ? ` ${DIM}${f.file}${RESET}` : ''
    const cite = f.ref ? ` ${DIM}(${f.ref})${RESET}` : ''
    process.stdout.write(`  ${colour[f.severity]}${f.severity.padEnd(4)}${RESET} ${DIM}${f.criterion}${RESET}${loc}  ${f.message}${cite}\n`)
  }
  const n = (s: Severity): number => findings.filter((f) => f.severity === s).length
  process.stdout.write(`${'─'.repeat(60)}\n  FAIL=${n('FAIL')} WARN=${n('WARN')} PASS=${n('PASS')} INFO=${n('INFO')}\n`)
  if (n('FAIL') + n('WARN') > 0)
    process.stdout.write('→ to address: run /ki-binding CONFORM   (judgment criteria: references/audit-rubric.md)\n')
}

// WARN never fails the run; only a hard FAIL does (rubric: all BIND criteria are WARN).
process.exit(CHECK && findings.some((f) => f.severity === 'FAIL') ? 1 : 0)
