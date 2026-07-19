/**
 * Shared runtime-path and `.gitignore` helpers for ki-bootstrap's project publishers.
 *
 * The linkers create relative symlinks under `.claude/skills/` / `.claude/agents/`
 * and keep those generated paths gitignored; these helpers are the gitignore side.
 * ki-bootstrap writes no `package.json` — the `ki:*` convenience keys are
 * ki-engineering's to wire, as sugar over the vendored `.ki-meta/bin/*` wrappers.
 */

import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const TOML = (globalThis as unknown as { Bun: { TOML: { parse(text: string): unknown } } }).Bun.TOML

export function readText(path: string): string {
  return existsSync(path) ? readFileSync(path, 'utf8') : ''
}

// ── Multi-runtime support resolution ─────────────────────────────────────────
// A repo declares which agent runtimes it installs skills/agents for via
// `[ki-repo] supported_runtimes = [...]` — a repo-wide fact, not a harness-structure
// detail. It is required: a repo's support surface must be explicit, never inferred
// from a directory that happens to exist. Parsing is table-aware so a lookalike key
// in another table or a multiline string cannot redirect runtime installation.
// Discovery paths differ per runtime: Claude Code reads `.claude/`, OpenAI Codex
// CLI reads `.agents/` (the runtime feature-coverage matrix, SDR-KI-HARNESS-002).
const KNOWN_RUNTIMES = ['claude-code', 'codex'] as const

export function supportedRuntimes(kiConfigText: string): string[] {
  let document: Record<string, unknown>
  try {
    document = TOML.parse(kiConfigText) as Record<string, unknown>
  } catch {
    throw new Error('.ki-config.toml must be valid TOML before runtime payloads can be published')
  }
  const repo = document['ki-repo']
  if (!repo || typeof repo !== 'object' || Array.isArray(repo)) throw new Error('[ki-repo] must declare supported_runtimes')
  const runtimes = (repo as Record<string, unknown>).supported_runtimes
  if (!Array.isArray(runtimes) || runtimes.length === 0 || runtimes.some((runtime) => typeof runtime !== 'string'))
    throw new Error('[ki-repo] supported_runtimes must be a non-empty array of runtime names')
  const list = runtimes as string[]
  const unknown = list.filter((runtime) => !KNOWN_RUNTIMES.includes(runtime as (typeof KNOWN_RUNTIMES)[number]))
  if (unknown.length)
    throw new Error(`[ki-repo] supported_runtimes names unknown runtime(s): ${unknown.join(', ')} (known: ${KNOWN_RUNTIMES.join(', ')})`)
  if (new Set(list).size !== list.length) throw new Error('[ki-repo] supported_runtimes must not repeat a runtime')
  return list
}

// Where each runtime discovers project-local SKILLS. Unknown runtime → throw
// (fail loud rather than silently install into a guessed path).
export function runtimeSkillsDir(runtime: string): string {
  const map: Record<string, string> = {
    'claude-code': join('.claude', 'skills'),
    codex: join('.agents', 'skills')
  }
  const dir = map[runtime]
  if (!dir) throw new Error(`unsupported runtime "${runtime}" — no known skills path (expected one of: ${Object.keys(map).join(', ')})`)
  return dir
}

// Where each runtime discovers project-local AGENTS. Claude Code uses Markdown+YAML
// under `.claude/agents/`; Codex uses TOML under `~/.codex/agents/` with a different
// field shape (name/description/developer_instructions) — a generator, not a symlink,
// and not yet built (the open subagent-format item in SDR-KI-HARNESS-002). Codex is
// therefore intentionally absent here: the explicit development agent linker surfaces a clear "unsupported
// pending format spike" message for it rather than guess a path.
export function runtimeAgentsDir(runtime: string): string {
  const map: Record<string, string> = {
    'claude-code': join('.claude', 'agents')
  }
  const dir = map[runtime]
  if (!dir)
    throw new Error(
      `supported runtime "${runtime}" has no project-local agents path yet — Codex subagents are TOML under ~/.codex/agents/ (a generator, not a symlink), pending the format spike (SDR-KI-HARNESS-002)`
    )
  return dir
}

export function gitignoresPath(gitignore: string, path: string): boolean {
  const escaped = path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const patterns = [new RegExp(`^${escaped}/?$`), new RegExp(`^${escaped}/\\*$`)]
  return gitignore.split(/\r?\n/).some((line) => patterns.some((pattern) => pattern.test(line.trim())))
}
