#!/usr/bin/env bun
/**
 * Install the small user-global Knowledge Islands process-skill payload.
 *
 * This is the mechanical implementation behind the public `user-install.sh`
 * route. It has one write boundary: the selected runtime's user skill directory
 * and, for Claude Code, the durable hook namespace. Repository bootstrap and
 * runtime settings are intentionally outside that boundary.
 */

import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const CORE_SKILLS = ['ki-bootstrap', 'ki-delegate', 'ki-next', 'ki-plan', 'ki-recap'] as const
const MARKER = '.ki-user-installed-skill.json'
const SCHEMA = 1
const SELF = fileURLToPath(import.meta.url)
const HARNESS_ROOT = resolve(dirname(SELF), '..', '..', '..', '..', '..')
const RUNTIME_SKILL_DIR: Record<string, string> = {
  'claude-code': join('.claude', 'skills'),
  codex: join('.agents', 'skills')
}

type Runtime = keyof typeof RUNTIME_SKILL_DIR
type Options = {
  source: string
  hooksSource: string
  home: string
  ref: string
  runtimes: Runtime[]
  dryRun: boolean
  check: boolean
}

function usage(): never {
  console.error(
    'usage: bun user-install.ts [--source <skills-dir>] [--hooks-source <hooks-dir>] [--home <dir>] [--ref <ref>] [--runtime <claude-code|codex>]... [--dry-run|--check]'
  )
  process.exit(2)
}

function regularDirectory(path: string): boolean {
  try {
    const stat = lstatSync(path)
    return stat.isDirectory() && !stat.isSymbolicLink()
  } catch {
    return false
  }
}

function regularFile(path: string): boolean {
  try {
    const stat = lstatSync(path)
    return stat.isFile() && !stat.isSymbolicLink()
  } catch {
    return false
  }
}

function skillIndex(source: string): Map<string, string> {
  const index = new Map<string, string>()
  for (const cluster of readdirSync(source)) {
    const clusterPath = join(source, cluster)
    if (!regularDirectory(clusterPath)) continue
    const direct = join(clusterPath, 'SKILL.md')
    if (regularFile(direct)) {
      index.set(cluster, clusterPath)
      continue
    }
    for (const name of readdirSync(clusterPath)) {
      const candidate = join(clusterPath, name)
      if (regularDirectory(candidate) && regularFile(join(candidate, 'SKILL.md'))) index.set(name, candidate)
    }
  }
  return index
}

function treeHash(path: string): string {
  const rows: string[] = []
  const walk = (current: string, prefix: string): void => {
    for (const name of readdirSync(current).sort()) {
      if (name === MARKER && current === path) continue
      const absolute = join(current, name)
      const relative = prefix ? join(prefix, name) : name
      const stat = lstatSync(absolute)
      if (stat.isSymbolicLink()) throw new Error(`skill payload must not contain symlinks: ${absolute}`)
      if (stat.isDirectory()) {
        rows.push(`d ${relative} ${stat.mode & 0o7777}`)
        walk(absolute, relative)
      } else if (stat.isFile()) {
        rows.push(`f ${relative} ${stat.mode & 0o7777} ${createHash('sha256').update(readFileSync(absolute)).digest('hex')}`)
      } else throw new Error(`skill payload has unsafe entry: ${absolute}`)
    }
  }
  walk(path, '')
  return createHash('sha256').update(rows.join('\n')).digest('hex')
}

function markerMatches(destination: string, skill: string, sourceHash: string): boolean {
  try {
    const marker = JSON.parse(readFileSync(join(destination, MARKER), 'utf8')) as Record<string, unknown>
    return (
      marker.schema === SCHEMA &&
      marker.skill === skill &&
      marker.source_hash === sourceHash &&
      typeof marker.integrity === 'string' &&
      marker.integrity === treeHash(destination)
    )
  } catch {
    return false
  }
}

function ownedSkill(destination: string, skill: string): boolean {
  try {
    const marker = JSON.parse(readFileSync(join(destination, MARKER), 'utf8')) as Record<string, unknown>
    return marker.schema === SCHEMA && marker.skill === skill
  } catch {
    return false
  }
}

function parse(): Options {
  let source = join(HARNESS_ROOT, 'skills')
  let hooksSource = join(HARNESS_ROOT, 'hooks')
  let home = homedir()
  let ref = 'main'
  const runtimes: Runtime[] = []
  let dryRun = false
  let check = false
  const args = process.argv.slice(2)
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]
    if (arg === '--dry-run') dryRun = true
    else if (arg === '--check') check = true
    else if (arg === '--source' || arg === '--hooks-source' || arg === '--home' || arg === '--ref' || arg === '--runtime') {
      const value = args[++index]
      if (!value) usage()
      if (arg === '--source') source = resolve(value)
      else if (arg === '--hooks-source') hooksSource = resolve(value)
      else if (arg === '--home') home = resolve(value)
      else if (arg === '--ref') ref = value
      else {
        if (!(value in RUNTIME_SKILL_DIR)) usage()
        runtimes.push(value as Runtime)
      }
    } else usage()
  }
  if (dryRun && check) usage()
  return { source, hooksSource, home, ref, runtimes: [...new Set(runtimes.length ? runtimes : ['claude-code'])], dryRun, check }
}

function publishSkill(source: string, root: string, skill: string, dryRun: boolean): boolean {
  const sourceHash = treeHash(source)
  const destination = join(root, skill)
  if (regularDirectory(destination) && markerMatches(destination, skill, sourceHash)) return true
  const existing = (() => {
    try {
      return lstatSync(destination)
    } catch {
      return undefined
    }
  })()
  if (existing && !existing.isSymbolicLink() && !ownedSkill(destination, skill)) {
    throw new Error(`refusing to replace unmanaged global skill payload: ${destination}`)
  }
  if (dryRun) {
    console.log(`would install ${skill} → ${destination}`)
    return true
  }
  mkdirSync(root, { recursive: true, mode: 0o700 })
  const stagingRoot = mkdtempSync(join(root, '.ki-user-install-'))
  const staged = join(stagingRoot, skill)
  const backup = join(root, `.${skill}.ki-user-install-backup-${process.pid}`)
  let renamed = false
  try {
    cpSync(source, staged, { recursive: true, dereference: true, preserveTimestamps: true })
    writeFileSync(
      join(staged, MARKER),
      `${JSON.stringify({ schema: SCHEMA, skill, source_hash: sourceHash, integrity: treeHash(staged) })}\n`,
      { mode: 0o600 }
    )
    if (existing) renameSync(destination, backup)
    renameSync(staged, destination)
    renamed = true
    if (existsSync(backup)) rmSync(backup, { recursive: true, force: true })
    console.log(`installed ${skill} → ${destination}`)
    return true
  } catch (error) {
    if (renamed) rmSync(destination, { recursive: true, force: true })
    if (existsSync(backup)) renameSync(backup, destination)
    throw error
  } finally {
    rmSync(stagingRoot, { recursive: true, force: true })
  }
}

function installHooks(options: Options): boolean {
  const installer = join(import.meta.dirname, 'install-claude-hook-payload.ts')
  const args = [
    installer,
    '--source',
    options.hooksSource,
    '--home',
    options.home,
    '--ref',
    options.ref,
    ...(options.check ? ['--check'] : []),
    ...(options.dryRun ? ['--dry-run'] : [])
  ]
  const result = spawnSync('bun', args, { stdio: 'inherit' })
  return result.status === 0
}

function main(): number {
  const options = parse()
  if (!regularDirectory(options.source)) throw new Error(`skills source must be a real directory: ${options.source}`)
  if (!regularDirectory(options.home)) throw new Error(`home must be a real directory: ${options.home}`)
  const index = skillIndex(options.source)
  for (const skill of CORE_SKILLS) if (!index.has(skill)) throw new Error(`required global skill is missing from source: ${skill}`)
  let ok = true
  for (const runtime of options.runtimes) {
    const root = join(options.home, RUNTIME_SKILL_DIR[runtime])
    for (const skill of CORE_SKILLS) ok = publishSkill(index.get(skill) as string, root, skill, options.dryRun) && ok
  }
  if (options.runtimes.includes('claude-code')) ok = installHooks(options) && ok
  return ok ? 0 : 1
}

try {
  process.exit(main())
} catch (error) {
  console.error(`error: ${(error as Error).message}`)
  process.exit(1)
}
