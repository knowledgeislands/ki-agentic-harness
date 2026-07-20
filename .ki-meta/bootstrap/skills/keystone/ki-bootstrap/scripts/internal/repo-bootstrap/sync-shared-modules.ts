#!/usr/bin/env bun
/**
 * Materialise frontmatter-declared shared modules in a harness's source skills.
 * Harnesses link their local payloads to canonical providers; all vendored
 * `.ki-meta/` payloads remain regular-file copies.
 *
 * Internal bootstrap command: bun sync-shared-modules.ts [target] [--check|--dry-run] [--quiet]
 */
import { cpSync, existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, readlinkSync, rmSync, symlinkSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { SKILLS_ROOT } from './resolve.ts'

type SharedModule = { provider: string; module: string }
type SharedModulePayload = { source: string; kind: 'file' | 'directory'; targetName: string }

const args = process.argv.slice(2)
const checkOnly = args.includes('--check')
const dryRun = args.includes('--dry-run')
const quiet = args.includes('--quiet')
const target = resolve(args.find((argument) => !argument.startsWith('-')) ?? dirname(SKILLS_ROOT))
const HARNESS_MARKER = /^\[ki-harness\][ \t]*$/m
const SHARED_MODULE = /^(ki-[A-Za-z0-9_-]+):([A-Za-z0-9_-]+)$/

if (checkOnly && dryRun) throw new Error('--check and --dry-run cannot be combined')
if (args.some((argument) => !['--check', '--dry-run', '--quiet'].includes(argument) && argument.startsWith('-'))) {
  throw new Error('usage: sync-shared-modules.ts [target] [--check|--dry-run] [--quiet]')
}

function lstatOrNull(path: string): ReturnType<typeof lstatSync> | null {
  try {
    return lstatSync(path)
  } catch {
    return null
  }
}

function sourceHarness(): boolean {
  try {
    return HARNESS_MARKER.test(readFileSync(join(target, '.ki-config.toml'), 'utf8'))
  } catch {
    return false
  }
}

function flowList(content: string, key: string): string[] {
  const frontmatter = content.match(/^---\s*\n([\s\S]*?)\n---/)
  const line = frontmatter?.[1].split(/\r?\n/).find((candidate) => candidate.startsWith(`${key}:`))
  if (!line) return []
  const value = line
    .replace(new RegExp(`^${key}:\\s*`), '')
    .trim()
    .replace(/^\[/, '')
    .replace(/\]$/, '')
    .trim()
  return value
    ? value
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean)
    : []
}

function skillDirectories(): Map<string, string> {
  const root = join(target, 'skills')
  if (lstatOrNull(root)?.isDirectory() !== true) throw new Error(`harness source skills are unavailable: ${root}`)
  const skills = new Map<string, string>()
  const candidates = [root]
  for (const category of readdirSync(root)) {
    const path = join(root, category)
    if (lstatOrNull(path)?.isDirectory()) candidates.push(...readdirSync(path).map((name) => join(path, name)))
  }
  for (const directory of candidates) {
    if (lstatOrNull(directory)?.isDirectory() !== true) continue
    const skill = join(directory, 'SKILL.md')
    if (lstatOrNull(skill)?.isFile() !== true) continue
    const name =
      flowList(readFileSync(skill, 'utf8'), 'name')[0] ??
      readFileSync(skill, 'utf8')
        .match(/^name:\s*(.+)$/m)?.[1]
        ?.trim()
    if (!name?.startsWith('ki-')) continue
    if (skills.has(name)) throw new Error(`harness source defines duplicate skill: ${name}`)
    skills.set(name, directory)
  }
  return skills
}

function sharedDependencies(directory: string): SharedModule[] {
  return flowList(readFileSync(join(directory, 'SKILL.md'), 'utf8'), 'ki-shared-dependencies').map((value) => {
    const match = value.match(SHARED_MODULE)
    if (!match) throw new Error(`invalid ki-shared-dependencies entry in ${directory}: ${value}`)
    return { provider: match[1] as string, module: match[2] as string }
  })
}

function sharedModules(directory: string): string[] {
  return flowList(readFileSync(join(directory, 'SKILL.md'), 'utf8'), 'ki-shared-modules')
}

function assertSafeTree(path: string): void {
  const stat = lstatSync(path)
  if (stat.isSymbolicLink() || (!stat.isFile() && !stat.isDirectory())) throw new Error(`unsafe shared module source: ${path}`)
  if (stat.isDirectory()) for (const entry of readdirSync(path)) assertSafeTree(join(path, entry))
}

function payload(provider: string, module: string, skills: ReadonlyMap<string, string>): SharedModulePayload {
  const providerDirectory = skills.get(provider)
  if (!providerDirectory) throw new Error(`shared module provider is absent from the harness source: ${provider}`)
  if (!sharedModules(providerDirectory).includes(module)) throw new Error(`${provider} does not declare shared module: ${module}`)
  const modules = join(providerDirectory, 'scripts', 'shared')
  const file = join(modules, `${module}.ts`)
  const directory = join(modules, module)
  const filePresent = existsSync(file)
  const directoryPresent = existsSync(directory)
  if (filePresent === directoryPresent)
    throw new Error(`shared module payload is ${filePresent ? 'ambiguous' : 'missing'}: ${provider}:${module}`)
  const source = filePresent ? file : directory
  assertSafeTree(source)
  return { source, kind: filePresent ? 'file' : 'directory', targetName: filePresent ? `${module}.ts` : module }
}

function linkResolvesTo(destination: string, source: string): boolean {
  try {
    return lstatSync(destination).isSymbolicLink() && resolve(dirname(destination), readlinkSync(destination)) === resolve(source)
  } catch {
    return false
  }
}

function samePayload(left: string, right: string): boolean {
  const leftStat = lstatOrNull(left)
  const rightStat = lstatOrNull(right)
  if (
    !leftStat ||
    !rightStat ||
    leftStat.isSymbolicLink() ||
    rightStat.isSymbolicLink() ||
    leftStat.isDirectory() !== rightStat.isDirectory()
  )
    return false
  if (leftStat.isFile()) return readFileSync(left).equals(readFileSync(right))
  const leftNames = readdirSync(left).sort()
  const rightNames = readdirSync(right).sort()
  return (
    JSON.stringify(leftNames) === JSON.stringify(rightNames) && leftNames.every((name) => samePayload(join(left, name), join(right, name)))
  )
}

function ensureTargetParent(skill: string, module: SharedModule, skills: ReadonlyMap<string, string>): void {
  const skillDirectory = skills.get(skill)
  if (!skillDirectory) throw new Error(`harness source skill is absent: ${skill}`)
  let current = join(skillDirectory, 'scripts')
  for (const part of ['vendored', module.provider]) {
    current = join(current, part)
    const existing = lstatOrNull(current)
    if (!existing) {
      mkdirSync(current)
      continue
    }
    if (!existing.isDirectory() || existing.isSymbolicLink()) throw new Error(`unsafe shared module parent: ${current}`)
  }
}

function replacePayload(
  source: SharedModulePayload,
  destination: string,
  skill: string,
  module: SharedModule,
  link: boolean,
  skills: ReadonlyMap<string, string>
): void {
  const existing = lstatOrNull(destination)
  if (existing?.isSymbolicLink() && !linkResolvesTo(destination, source.source)) {
    throw new Error(`refusing to replace unfamiliar shared module link: ${destination}`)
  }
  if (existing && !existing.isSymbolicLink() && !samePayload(source.source, destination)) {
    throw new Error(`refusing to replace changed shared module payload: ${destination}`)
  }
  if (existing) rmSync(destination, { recursive: existing.isDirectory() && !existing.isSymbolicLink() })
  ensureTargetParent(skill, module, skills)
  if (link) {
    symlinkSync(relative(dirname(destination), source.source), destination, source.kind === 'directory' ? 'dir' : 'file')
    if (!linkResolvesTo(destination, source.source)) throw new Error(`shared module link failed verification: ${destination}`)
    return
  }
  cpSync(source.source, destination, { recursive: source.kind === 'directory' })
  if (!samePayload(source.source, destination)) throw new Error(`shared module copy failed verification: ${destination}`)
}

function undeclaredSourcePayloads(
  skills: ReadonlyMap<string, string>,
  expected: ReadonlyMap<string, SharedModulePayload>
): string[] {
  const violations: string[] = []
  for (const [skill, directory] of skills) {
    const vendored = join(directory, 'scripts', 'vendored')
    const vendoredStat = lstatOrNull(vendored)
    if (!vendoredStat) continue
    if (!vendoredStat.isDirectory() || vendoredStat.isSymbolicLink()) {
      violations.push(`${skill}/scripts/vendored (must be a regular directory)`)
      continue
    }
    for (const provider of readdirSync(vendored)) {
      const providerPath = join(vendored, provider)
      const providerStat = lstatOrNull(providerPath)
      const label = `${skill}/scripts/vendored/${provider}`
      if (!providerStat?.isDirectory() || providerStat.isSymbolicLink()) {
        violations.push(`${label} (must be a regular provider directory)`)
        continue
      }
      for (const payloadName of readdirSync(providerPath)) {
        const payloadPath = join(providerPath, payloadName)
        if (!expected.has(payloadPath)) violations.push(`${label}/${payloadName} (undeclared source-vendored payload)`)
      }
    }
  }
  return violations
}

const skills = skillDirectories()
const link = sourceHarness()
const drift: string[] = []
const expectedPayloads = new Map<string, SharedModulePayload>()
for (const [skill, directory] of skills) {
  for (const module of sharedDependencies(directory)) {
    if (module.provider === skill) throw new Error(`${skill} cannot depend on its own shared module`)
    const source = payload(module.provider, module.module, skills)
    const destination = join(directory, 'scripts', 'vendored', module.provider, source.targetName)
    expectedPayloads.set(destination, source)
    const current = link ? linkResolvesTo(destination, source.source) : samePayload(source.source, destination)
    if (current) continue
    const label = `${skill}/scripts/vendored/${module.provider}/${source.targetName}`
    if (checkOnly) {
      drift.push(label)
      continue
    }
    if (dryRun) {
      if (!quiet) console.log(`${link ? 'link' : 'copy'} ${label}`)
      continue
    }
    replacePayload(source, destination, skill, module, link, skills)
    if (!quiet) console.log(`${link ? 'link' : 'copy'} ${label}`)
  }
}

if (link) drift.push(...undeclaredSourcePayloads(skills, expectedPayloads))

if (drift.length) {
  console.error(`shared-module drift: ${drift.join(', ')} — run sync-shared-modules.ts ${target}`)
  process.exit(1)
}

if (!quiet)
  console.log(checkOnly ? 'shared module payloads are current' : `shared module payloads synchronized (${link ? 'links' : 'copies'})`)
