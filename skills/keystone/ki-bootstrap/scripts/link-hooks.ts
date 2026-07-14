#!/usr/bin/env bun
/**
 * ki-bootstrap — install the harness's global hook pair into `~/.claude/`.
 *
 * Plan-file lifecycle (`plan-stamp.sh` / `plan-sync.sh`) is inherently personal/global —
 * it operates on Claude Code's own `~/.claude/plans/` scratch files, not any one repo —
 * so unlike the project-local linkers this installs into the home directory and merge-
 * patches `~/.claude/settings.json` directly, rather than a consuming repo's own
 * `.claude/settings.json`.
 *
 * Self-locating: invoked through its global symlink (or directly from the harness),
 * `import.meta.url` resolves to its real path inside the harness, from which the
 * sibling hook sources are found.
 *
 * Usage:
 *   bun link-hooks.ts
 *   --dry-run    print what would change, touch nothing
 *   --check      audit only (no mutation): symlinks + settings.json patch match expected; exits non-zero on FAIL
 */

import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readlinkSync,
  realpathSync,
  renameSync,
  rmSync,
  symlinkSync,
  writeFileSync
} from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// ── Self-location: find the harness hooks/ root through the (possibly symlinked) script path ──
const SELF = realpathSync(fileURLToPath(import.meta.url))
// .../skills/keystone/ki-bootstrap/scripts/link-hooks.ts → up to the harness root, then hooks
const HARNESS_ROOT = resolve(dirname(SELF), '..', '..', '..', '..')
const HOOKS_SOURCE_ROOT = join(HARNESS_ROOT, 'hooks')

const HOOK_NAMES = ['plan-stamp.sh', 'plan-sync.sh']

const CLAUDE_HOOKS_DIR = join(homedir(), '.claude', 'hooks')
const SETTINGS_PATH = join(homedir(), '.claude', 'settings.json')

// ── ANSI ──
const RED = '\x1b[31m'
const YELLOW = '\x1b[33m'
const GREEN = '\x1b[32m'
const DIM = '\x1b[2m'
const RESET = '\x1b[0m'

interface HookPair {
  matcher: string
  command: string
}

const HOOK_PAIRS: HookPair[] = [
  { matcher: 'ExitPlanMode', command: '$HOME/.claude/hooks/plan-stamp.sh' },
  { matcher: 'TodoWrite', command: '$HOME/.claude/hooks/plan-sync.sh' }
]

// ── Helpers ──
function readText(path: string): string {
  return existsSync(path) ? readFileSync(path, 'utf8') : ''
}

function isSymlink(p: string): boolean {
  try {
    return lstatSync(p).isSymbolicLink()
  } catch {
    return false
  }
}

// ── Symlink step ──
function cmdLinkSymlinks(dryRun: boolean): void {
  if (!existsSync(CLAUDE_HOOKS_DIR)) {
    console.log(`${DIM}creating ${CLAUDE_HOOKS_DIR}${RESET}`)
    if (!dryRun) mkdirSync(CLAUDE_HOOKS_DIR, { recursive: true })
  }

  for (const name of HOOK_NAMES) {
    const source = join(HOOKS_SOURCE_ROOT, name)
    const linkPath = join(CLAUDE_HOOKS_DIR, name)
    const rel = relative(CLAUDE_HOOKS_DIR, source)
    if (isSymlink(linkPath) && resolve(dirname(linkPath), readlinkSync(linkPath)) === resolve(source)) {
      console.log(`${DIM}ok    ${name}${RESET}`)
      continue
    }
    if (existsSync(linkPath) && !isSymlink(linkPath)) {
      console.log(`${YELLOW}skip  ${name}${RESET} ${DIM}(a real file is in the way)${RESET}`)
      continue
    }
    if (!dryRun) {
      if (isSymlink(linkPath)) rmSync(linkPath)
      symlinkSync(rel, linkPath, 'file')
    }
    console.log(`${GREEN}link  ${RESET}${name} -> ${DIM}${rel}${RESET}`)
  }
}

// ── Settings JSON parsing (shared) ──
function parseSettings(): Record<string, unknown> | undefined {
  const raw = readText(SETTINGS_PATH)
  if (!raw) return {}
  try {
    return JSON.parse(raw)
  } catch (err) {
    console.log(`${RED}FAIL  ${RESET}${SETTINGS_PATH} is not valid JSON: ${(err as Error).message}`)
    return undefined
  }
}

// ── Settings-patch step ──
function cmdPatchSettings(dryRun: boolean): number {
  const data = parseSettings()
  if (!data) return 1
  if (typeof data.hooks !== 'object' || data.hooks === null) data.hooks = {}
  const hooks = data.hooks as Record<string, unknown>
  if (!Array.isArray(hooks.PostToolUse)) hooks.PostToolUse = []
  const postToolUse = hooks.PostToolUse as Array<{ matcher: string; hooks: Array<{ type: string; command: string; timeout: number }> }>

  let changed = false
  for (const pair of HOOK_PAIRS) {
    const entry = postToolUse.find((e) => e.matcher === pair.matcher)
    if (entry) {
      if (!Array.isArray(entry.hooks)) entry.hooks = []
      const hasCommand = entry.hooks.some((h) => h.command === pair.command)
      if (hasCommand) {
        console.log(`${DIM}ok    ${pair.matcher} -> ${pair.command}${RESET}`)
        continue
      }
      entry.hooks.push({ type: 'command', command: pair.command, timeout: 5 })
      changed = true
      console.log(`${GREEN}link  ${RESET}${pair.matcher} -> ${DIM}${pair.command}${RESET}`)
    } else {
      postToolUse.push({ matcher: pair.matcher, hooks: [{ type: 'command', command: pair.command, timeout: 5 }] })
      changed = true
      console.log(`${GREEN}link  ${RESET}${pair.matcher} -> ${DIM}${pair.command}${RESET}`)
    }
  }

  if (!changed) {
    console.log(`${DIM}ok    ~/.claude/settings.json already patched${RESET}`)
    return 0
  }
  if (dryRun) return 0

  const tmpPath = `${SETTINGS_PATH}.tmp-${process.pid}`
  writeFileSync(tmpPath, `${JSON.stringify(data, null, 2)}\n`)
  renameSync(tmpPath, SETTINGS_PATH)
  return 0
}

// ── Check (audit only) ──
function cmdCheck(): number {
  let ok = true

  for (const name of HOOK_NAMES) {
    const source = join(HOOKS_SOURCE_ROOT, name)
    const linkPath = join(CLAUDE_HOOKS_DIR, name)
    if (!isSymlink(linkPath)) {
      console.log(`${YELLOW}WARN  ${RESET}missing hook symlink: ${name}`)
      ok = false
      continue
    }
    const dest = resolve(dirname(linkPath), readlinkSync(linkPath))
    if (dest !== resolve(source)) {
      console.log(`${YELLOW}WARN  ${RESET}${name} symlink points elsewhere: ${dest}`)
      ok = false
      continue
    }
    console.log(`${DIM}PASS  ${name} linked${RESET}`)
  }

  const data = parseSettings()
  if (!data) return 1
  const postToolUse = (data.hooks as Record<string, unknown> | undefined)?.PostToolUse
  const list: Array<{ matcher: string; hooks?: Array<{ command: string }> }> = Array.isArray(postToolUse) ? postToolUse : []
  for (const pair of HOOK_PAIRS) {
    const entry = list.find((e) => e.matcher === pair.matcher)
    const present = Array.isArray(entry?.hooks) && entry.hooks.some((h) => h.command === pair.command)
    if (!present) {
      console.log(`${YELLOW}WARN  ${RESET}missing PostToolUse hook: ${pair.matcher} -> ${pair.command}`)
      ok = false
    } else {
      console.log(`${DIM}PASS  ${pair.matcher} -> ${pair.command}${RESET}`)
    }
  }

  console.log(ok ? `\n  ${GREEN}PASS${RESET}` : `\n  ${RED}FAIL${RESET}`)
  return ok ? 0 : 1
}

// ── Entry ──
const argv = process.argv.slice(2)
const dryRun = argv.includes('--dry-run')
const checkOnly = argv.includes('--check')

console.log(
  `\n  ${DIM}hooks:${RESET} ${HOOK_NAMES.join(', ')}   ${DIM}source:${RESET} ${HOOKS_SOURCE_ROOT}   ${DIM}target:${RESET} ${CLAUDE_HOOKS_DIR} + ${SETTINGS_PATH}\n`
)

if (checkOnly) {
  process.exit(cmdCheck())
}
cmdLinkSymlinks(dryRun)
const patchStatus = cmdPatchSettings(dryRun)
if (patchStatus !== 0) process.exit(patchStatus)
if (dryRun) console.log(`\n  ${YELLOW}(dry run — nothing changed)${RESET}`)
