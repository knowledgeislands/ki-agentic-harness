#!/usr/bin/env bun
/** End user-level Knowledge Islands adoption without reading repository state. */
import { lstatSync, readdirSync, readFileSync, rmdirSync, unlinkSync } from 'node:fs'
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'
import { isManagedClaudeHookNamespace } from './internal/user-install/install-claude-hook-payload.ts'
import { CORE_USER_SKILLS, isCurrentUserInstalledSkill } from './internal/user-install/user-install.ts'

type Runtime = 'claude-code' | 'codex'
type Snapshot = { path: string; kind: 'directory' | 'file'; dev: number | bigint; ino: number | bigint; bytes?: Buffer; entries?: string[] }
type Removal = { path: string; label: string; tree: Snapshot[] }

const RUNTIME_SKILL_DIR: Record<Runtime, string> = {
  'claude-code': join('.claude', 'skills'),
  codex: join('.agents', 'skills')
}

function entry(path: string): ReturnType<typeof lstatSync> | undefined {
  try {
    return lstatSync(path)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return undefined
    throw error
  }
}

function snapshot(path: string): Snapshot {
  const current = entry(path)
  if (!current || current.isSymbolicLink() || (!current.isDirectory() && !current.isFile()))
    throw new Error(`unsafe user-install path: ${path}`)
  return {
    path,
    kind: current.isDirectory() ? 'directory' : 'file',
    dev: current.dev,
    ino: current.ino,
    ...(current.isFile() ? { bytes: readFileSync(path) } : {}),
    ...(current.isDirectory() ? { entries: readdirSync(path).sort() } : {})
  }
}

function same(expected: Snapshot): boolean {
  try {
    const actual = snapshot(expected.path)
    return (
      actual.kind === expected.kind &&
      actual.dev === expected.dev &&
      actual.ino === expected.ino &&
      (expected.bytes?.equals(actual.bytes ?? Buffer.alloc(0)) ?? true) &&
      (expected.entries === undefined || JSON.stringify(actual.entries) === JSON.stringify(expected.entries))
    )
  } catch {
    return false
  }
}

function sameIdentity(expected: Snapshot): boolean {
  try {
    const actual = snapshot(expected.path)
    return actual.kind === expected.kind && actual.dev === expected.dev && actual.ino === expected.ino
  } catch {
    return false
  }
}

function walk(path: string): Snapshot[] {
  const rows: Snapshot[] = []
  const visit = (current: string): void => {
    const item = snapshot(current)
    rows.push(item)
    if (item.kind === 'directory') for (const name of readdirSync(current).sort()) visit(join(current, name))
  }
  visit(path)
  return rows
}

function remove(removal: Removal): void {
  if (!removal.tree.every(same)) throw new Error(`${removal.label} changed while user UNINSTALL was preparing`)
  for (const item of [...removal.tree].sort((left, right) => right.path.length - left.path.length)) {
    if (item.kind === 'directory' ? !sameIdentity(item) : !same(item)) throw new Error(`${removal.label} changed during user UNINSTALL`)
    if (item.kind === 'file') unlinkSync(item.path)
    else rmdirSync(item.path)
  }
}

function usage(): void {
  console.log('Usage: user-uninstall.ts [--home <dir>] [--runtime <claude-code|codex>]... [--dry-run]')
  console.log('\nRemove only integrity-proven KI global skills and the dedicated KI Claude hook namespace.')
}

function realDirectoryBelow(home: string, relativePath: string): string | undefined {
  let current = home
  for (const part of relativePath.split('/')) {
    current = join(current, part)
    const found = entry(current)
    if (!found) return undefined
    if (found.isSymbolicLink() || !found.isDirectory()) throw new Error(`managed user path must be a real directory: ${current}`)
  }
  return current
}

function main(argv = process.argv.slice(2)): number {
  if (argv.includes('-h') || argv.includes('--help')) {
    usage()
    return 0
  }
  let home = homedir()
  let dryRun = false
  const requested: Runtime[] = []
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index]
    if (argument === '--dry-run') dryRun = true
    else if (argument === '--home' || argument === '--runtime') {
      const value = argv[++index]
      if (!value) throw new Error(`${argument} requires a value`)
      if (argument === '--home') home = resolve(value)
      else if (value === 'claude-code' || value === 'codex') requested.push(value)
      else throw new Error(`unknown runtime: ${value}`)
    } else throw new Error(`unknown argument: ${argument}`)
  }
  const homeEntry = entry(home)
  if (!homeEntry || homeEntry.isSymbolicLink() || !homeEntry.isDirectory()) throw new Error(`home must be a real directory: ${home}`)
  const runtimeHomes: Record<Runtime, string> = { 'claude-code': '.claude', codex: '.agents' }
  const runtimes = [
    ...new Set(
      requested.length
        ? requested
        : (Object.keys(RUNTIME_SKILL_DIR) as Runtime[]).filter((runtime) => entry(join(home, runtimeHomes[runtime])))
    )
  ]
  const removals: Removal[] = []
  for (const runtime of runtimes) {
    const root = realDirectoryBelow(home, RUNTIME_SKILL_DIR[runtime])
    if (!root) continue
    for (const skill of CORE_USER_SKILLS) {
      const path = join(root, skill)
      if (!entry(path)) continue
      if (!isCurrentUserInstalledSkill(path, skill)) throw new Error(`cannot prove user skill ownership: ${path}`)
      removals.push({ path, label: `${RUNTIME_SKILL_DIR[runtime]}/${skill}`, tree: walk(path) })
    }
  }
  if (runtimes.includes('claude-code')) {
    const namespace = join(home, '.claude', 'hooks', 'knowledgeislands', 'ki-agentic-harness')
    if (entry(namespace)) {
      realDirectoryBelow(home, join('.claude', 'hooks', 'knowledgeislands', 'ki-agentic-harness'))
      if (!isManagedClaudeHookNamespace(namespace)) throw new Error(`cannot prove Claude hook namespace ownership: ${namespace}`)
      removals.push({ path: namespace, label: '.claude/hooks/knowledgeislands/ki-agentic-harness', tree: walk(namespace) })
    }
  }
  if (!removals.every((removal) => removal.tree.every(same))) throw new Error('managed user paths changed while UNINSTALL was preparing')
  if (dryRun) {
    for (const removal of removals) console.log(`remove  ${removal.label}`)
    console.log('dry run — nothing changed')
    return 0
  }
  for (const removal of removals) remove(removal)
  console.log(`user UNINSTALL complete — removed ${removals.length} KI-owned path${removals.length === 1 ? '' : 's'}`)
  return 0
}

try {
  process.exit(main())
} catch (error) {
  console.error(`FAIL  user UNINSTALL: ${(error as Error).message}`)
  process.exit(1)
}
