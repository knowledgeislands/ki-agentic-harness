#!/usr/bin/env bun
/**
 * ki-bootstrap — install the harness's global hooks into `~/.claude/`.
 *
 * These hooks are inherently personal/global: they operate on Claude Code's own state
 * or guard every repository on the machine. Unlike project-local linkers, this installs
 * into the home directory and merge-patches `~/.claude/settings.json` directly.
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
  chmodSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readlinkSync,
  realpathSync,
  renameSync,
  rmSync,
  statSync,
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

const CLAUDE_HOOKS_DIR = join(homedir(), '.claude', 'hooks')
const SETTINGS_PATH = join(homedir(), '.claude', 'settings.json')

// ── ANSI ──
const RED = '\x1b[31m'
const YELLOW = '\x1b[33m'
const GREEN = '\x1b[32m'
const DIM = '\x1b[2m'
const RESET = '\x1b[0m'

interface HookDeclaration {
  name: string
  event: string
  matcher: string
  command: string
  timeout: number
}

const HOOKS: HookDeclaration[] = [
  {
    name: 'plan-stamp.sh',
    event: 'PostToolUse',
    matcher: 'ExitPlanMode',
    command: '$HOME/.claude/hooks/plan-stamp.sh',
    timeout: 5
  },
  {
    name: 'plan-sync.sh',
    event: 'PostToolUse',
    matcher: 'TodoWrite',
    command: '$HOME/.claude/hooks/plan-sync.sh',
    timeout: 5
  },
  {
    name: 'git-lock-check.sh',
    event: 'Stop',
    matcher: '*',
    command: '$HOME/.claude/hooks/git-lock-check.sh',
    timeout: 10
  }
]
const HOOK_NAMES = HOOKS.map((hook) => hook.name)

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
function cmdLinkSymlinks(dryRun: boolean): boolean {
  let ok = true
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
      console.log(`${RED}FAIL  ${name}${RESET} ${DIM}(a real file is in the way)${RESET}`)
      ok = false
      continue
    }
    if (!dryRun) {
      if (isSymlink(linkPath)) rmSync(linkPath)
      symlinkSync(rel, linkPath, 'file')
    }
    console.log(`${GREEN}link  ${RESET}${name} -> ${DIM}${rel}${RESET}`)
  }
  return ok
}

// ── Settings JSON parsing (shared) ──
function parseSettings(): Record<string, unknown> | undefined {
  if (isSymlink(SETTINGS_PATH)) {
    console.log(`${RED}FAIL  ${RESET}${SETTINGS_PATH} must not be a symlink`)
    return undefined
  }
  try {
    if (existsSync(SETTINGS_PATH) && !lstatSync(SETTINGS_PATH).isFile()) {
      console.log(`${RED}FAIL  ${RESET}${SETTINGS_PATH} must be a regular file`)
      return undefined
    }
    const raw = readText(SETTINGS_PATH)
    if (!raw) return {}
    const data: unknown = JSON.parse(raw)
    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
      console.log(`${RED}FAIL  ${RESET}${SETTINGS_PATH} must contain a JSON object`)
      return undefined
    }
    return data as Record<string, unknown>
  } catch (err) {
    console.log(`${RED}FAIL  ${RESET}${SETTINGS_PATH} is not valid JSON: ${(err as Error).message}`)
    return undefined
  }
}

// ── Settings-patch step ──
function cmdPatchSettings(data: Record<string, unknown>, dryRun: boolean): number {
  if (typeof data.hooks !== 'object' || data.hooks === null || Array.isArray(data.hooks)) data.hooks = {}
  const hooks = data.hooks as Record<string, unknown>

  let changed = false
  for (const hook of HOOKS) {
    if (!Array.isArray(hooks[hook.event])) hooks[hook.event] = []
    const eventEntries = hooks[hook.event] as unknown[]
    const matchingEntries = eventEntries.filter(
      (candidate): candidate is { matcher: string; hooks?: unknown } =>
        typeof candidate === 'object' && candidate !== null && (candidate as { matcher?: unknown }).matcher === hook.matcher
    )
    let entry = matchingEntries[0]
    let handler: Record<string, unknown> | undefined
    for (const candidateEntry of matchingEntries) {
      if (!Array.isArray(candidateEntry.hooks)) continue
      const candidate = candidateEntry.hooks.find(
        (item): item is Record<string, unknown> =>
          typeof item === 'object' && item !== null && (item as { command?: unknown }).command === hook.command
      )
      if (candidate) {
        entry = candidateEntry
        handler = candidate
        break
      }
    }

    if (!entry) {
      entry = { matcher: hook.matcher, hooks: [] }
      eventEntries.push(entry)
      changed = true
    }
    if (!Array.isArray(entry.hooks)) {
      entry.hooks = []
      changed = true
    }
    const handlers = entry.hooks as unknown[]
    if (!handler) {
      handler = { type: 'command', command: hook.command, timeout: hook.timeout }
      handlers.push(handler)
      changed = true
    } else if (handler.type !== 'command' || handler.timeout !== hook.timeout) {
      handler.type = 'command'
      handler.timeout = hook.timeout
      changed = true
    }

    for (const candidateEntry of matchingEntries) {
      if (!Array.isArray(candidateEntry.hooks)) continue
      const before = candidateEntry.hooks.length
      const filteredHandlers = candidateEntry.hooks.filter(
        (candidate) =>
          candidate === handler ||
          typeof candidate !== 'object' ||
          candidate === null ||
          (candidate as { command?: unknown }).command !== hook.command
      )
      candidateEntry.hooks = filteredHandlers
      if (filteredHandlers.length !== before) changed = true
    }
    console.log(`${changed ? `${GREEN}link  ${RESET}` : `${DIM}ok    `}${hook.event}(${hook.matcher}) -> ${DIM}${hook.command}${RESET}`)
  }

  if (!changed) {
    console.log(`${DIM}ok    ~/.claude/settings.json already patched${RESET}`)
    return 0
  }
  if (dryRun) return 0

  const tmpPath = `${SETTINGS_PATH}.tmp-${process.pid}`
  const settingsMode = existsSync(SETTINGS_PATH) ? statSync(SETTINGS_PATH).mode & 0o777 : 0o600
  let createdTemp = false
  try {
    writeFileSync(tmpPath, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx', mode: 0o600 })
    createdTemp = true
    chmodSync(tmpPath, settingsMode)
    renameSync(tmpPath, SETTINGS_PATH)
  } catch (error) {
    if (createdTemp && existsSync(tmpPath) && !isSymlink(tmpPath)) rmSync(tmpPath)
    throw error
  }
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
  const hooks = data.hooks as Record<string, unknown> | undefined
  for (const hook of HOOKS) {
    const eventEntries = hooks?.[hook.event]
    const list: unknown[] = Array.isArray(eventEntries) ? eventEntries : []
    const matchingEntries = list.filter(
      (candidate): candidate is { matcher: string; hooks?: unknown } =>
        typeof candidate === 'object' && candidate !== null && (candidate as { matcher?: unknown }).matcher === hook.matcher
    )
    const ownedHandlers = matchingEntries
      .flatMap((entry) => (Array.isArray(entry.hooks) ? entry.hooks : []))
      .filter(
        (candidate) => typeof candidate === 'object' && candidate !== null && (candidate as { command?: unknown }).command === hook.command
      )
    const present =
      ownedHandlers.length === 1 &&
      (ownedHandlers[0] as { type?: unknown }).type === 'command' &&
      (ownedHandlers[0] as { timeout?: unknown }).timeout === hook.timeout
    if (!present) {
      console.log(`${YELLOW}WARN  ${RESET}missing ${hook.event} hook: ${hook.matcher} -> ${hook.command}`)
      ok = false
    } else {
      console.log(`${DIM}PASS  ${hook.event}(${hook.matcher}) -> ${hook.command}${RESET}`)
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
const settings = parseSettings()
if (!settings) process.exit(1)
if (!cmdLinkSymlinks(dryRun)) process.exit(1)
const patchStatus = cmdPatchSettings(settings, dryRun)
if (patchStatus !== 0) process.exit(patchStatus)
if (dryRun) console.log(`\n  ${YELLOW}(dry run — nothing changed)${RESET}`)
