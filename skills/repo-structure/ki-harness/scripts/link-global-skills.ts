#!/usr/bin/env bun
/**
 * Deliberately link the harness's small user-global process-skill set to this
 * local checkout. This is a harness-authoring convenience, not installation:
 * the public user installer always publishes regular, self-contained copies.
 */

import { existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, readlinkSync, renameSync, rmSync, symlinkSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const GLOBAL_SKILLS = ['ki-bootstrap', 'ki-delegate', 'ki-next', 'ki-plan', 'ki-recap'] as const
const MARKER = '.ki-user-installed-skill.json'
const RUNTIMES = {
  'claude-code': { home: '.claude', skills: join('.claude', 'skills') },
  codex: { home: '.agents', skills: join('.agents', 'skills') }
} as const
type Runtime = keyof typeof RUNTIMES
type Options = { home: string; runtimes: Runtime[]; check: boolean; dryRun: boolean }

const self = fileURLToPath(import.meta.url)
const harnessRoot = resolve(dirname(self), '..', '..', '..', '..')
const skillsRoot = join(harnessRoot, 'skills')

function usage(): never {
  console.error('usage: bun link-global-skills.ts [--runtime <claude-code|codex>]... [--home <dir>] [--check|--dry-run]')
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

function localCheckout(path: string): boolean {
  try {
    const stat = lstatSync(path)
    return !stat.isSymbolicLink() && (stat.isDirectory() || stat.isFile())
  } catch {
    return false
  }
}

function ownedCopy(path: string, skill: string): boolean {
  try {
    const marker = JSON.parse(readFileSync(join(path, MARKER), 'utf8')) as Record<string, unknown>
    return marker.skill === skill
  } catch {
    return false
  }
}

function skillIndex(): Map<string, string> {
  const index = new Map<string, string>()
  for (const cluster of readdirSync(skillsRoot)) {
    const clusterPath = join(skillsRoot, cluster)
    if (!regularDirectory(clusterPath)) continue
    if (regularDirectory(clusterPath) && existsSync(join(clusterPath, 'SKILL.md'))) index.set(cluster, clusterPath)
    for (const skill of readdirSync(clusterPath)) {
      const path = join(clusterPath, skill)
      if (regularDirectory(path) && existsSync(join(path, 'SKILL.md'))) index.set(skill, path)
    }
  }
  return index
}

function parse(): Options {
  const runtimes: Runtime[] = []
  let home = homedir()
  let check = false
  let dryRun = false
  const args = process.argv.slice(2)
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]
    if (arg === '--check') check = true
    else if (arg === '--dry-run') dryRun = true
    else if (arg === '--home' || arg === '--runtime') {
      const value = args[++index]
      if (!value) usage()
      if (arg === '--home') home = resolve(value)
      else if (value in RUNTIMES) runtimes.push(value as Runtime)
      else usage()
    } else usage()
  }
  if (check && dryRun) usage()
  return { home, runtimes: [...new Set(runtimes)], check, dryRun }
}

function detectedRuntimes(home: string): Runtime[] {
  return (Object.keys(RUNTIMES) as Runtime[]).filter((runtime) => regularDirectory(join(home, RUNTIMES[runtime].home)))
}

function linkSkill(source: string, destination: string, skill: string, options: Options): boolean {
  let existing: ReturnType<typeof lstatSync> | undefined
  try {
    existing = lstatSync(destination)
  } catch {
    // Absent is the expected initial state.
  }
  if (options.check) {
    if (!existing) {
      console.error(`missing development link: ${destination}`)
      return false
    }
    if (!existing.isSymbolicLink()) {
      console.error(`not a development link: ${destination}`)
      return false
    }
    if (resolve(dirname(destination), readlinkSync(destination)) !== source) {
      console.error(`development link points elsewhere: ${destination}`)
      return false
    }
    console.log(`linked ${skill} → ${destination}`)
    return true
  }
  if (existing?.isDirectory() && !existing.isSymbolicLink() && !ownedCopy(destination, skill)) {
    console.error(`refusing to replace unmanaged global skill payload: ${destination}`)
    return false
  }
  if (existing && !existing.isDirectory() && !existing.isSymbolicLink()) {
    console.error(`refusing to replace unmanaged global skill entry: ${destination}`)
    return false
  }
  if (options.dryRun) {
    console.log(`${existing ? 'would replace' : 'would link'} ${skill} → ${destination}`)
    return true
  }

  mkdirSync(dirname(destination), { recursive: true, mode: 0o700 })
  const staged = join(dirname(destination), `.${skill}.ki-development-link-${process.pid}`)
  const backup = join(dirname(destination), `.${skill}.ki-development-link-backup-${process.pid}`)
  try {
    symlinkSync(source, staged, 'dir')
    if (existing) renameSync(destination, backup)
    renameSync(staged, destination)
    if (existsSync(backup)) rmSync(backup, { recursive: true, force: true })
    console.log(`${existing ? 'replaced' : 'linked'} ${skill} → ${destination}`)
    return true
  } catch (error) {
    rmSync(staged, { recursive: true, force: true })
    if (existsSync(backup) && !existsSync(destination)) renameSync(backup, destination)
    throw error
  }
}

function main(): number {
  const options = parse()
  if (!localCheckout(join(harnessRoot, '.git'))) throw new Error(`development links require a local Git checkout: ${harnessRoot}`)
  if (!regularDirectory(options.home)) throw new Error(`home must be a real directory: ${options.home}`)
  const sources = skillIndex()
  for (const skill of GLOBAL_SKILLS) if (!sources.has(skill)) throw new Error(`required global skill is missing: ${skill}`)
  const runtimes = options.runtimes.length ? options.runtimes : detectedRuntimes(options.home)
  if (!runtimes.length) throw new Error(`no supported runtime was detected below ${options.home}; pass --runtime to force one`)

  let ok = true
  for (const runtime of runtimes) {
    const runtimeHome = join(options.home, RUNTIMES[runtime].home)
    if (!regularDirectory(runtimeHome)) {
      if (!options.runtimes.length) throw new Error(`runtime home must be a real directory: ${runtimeHome}`)
      if (options.check) throw new Error(`runtime home is absent: ${runtimeHome}`)
      if (!options.dryRun) mkdirSync(runtimeHome, { recursive: true, mode: 0o700 })
    }
    console.log(`[${runtime}]`)
    for (const skill of GLOBAL_SKILLS)
      ok = linkSkill(sources.get(skill) as string, join(options.home, RUNTIMES[runtime].skills, skill), skill, options) && ok
  }
  return ok ? 0 : 1
}

try {
  process.exit(main())
} catch (error) {
  console.error(`error: ${(error as Error).message}`)
  process.exit(1)
}
