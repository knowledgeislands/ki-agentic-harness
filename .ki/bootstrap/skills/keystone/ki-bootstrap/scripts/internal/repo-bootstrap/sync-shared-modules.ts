#!/usr/bin/env bun
/**
 * Materialise frontmatter-declared shared modules in source skills scoped by a
 * command target.  A same-harness consumer links its provider; ordinary source
 * trees copy their own provider payloads.  Vendored `.ki/bootstrap/` remains copies.
 *
 * Internal bootstrap command: bun sync-shared-modules.ts [target] [--check|--dry-run] [--quiet]
 */
import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  readlinkSync,
  realpathSync,
  rmSync,
  symlinkSync
} from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { type HarnessSource, nearestHarnessSource, sourceHarnessSkill } from './harness-source.ts'
import { SKILLS_ROOT } from './resolve.ts'

type SharedModule = { provider: string; module: string }
type SharedModulePayload = { source: string; kind: 'file' | 'directory'; targetName: string }
type SourceSkill = { directory: string; name: string; harness?: HarnessSource; ordinaryRoot?: string }
type SyncOperation = { source: SharedModulePayload; destination: string; consumer: SourceSkill; module: SharedModule; link: boolean }

const args = process.argv.slice(2)
const checkOnly = args.includes('--check')
const dryRun = args.includes('--dry-run')
const quiet = args.includes('--quiet')
const requestedTarget = resolve(args.find((argument) => !argument.startsWith('-')) ?? dirname(SKILLS_ROOT))
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

function regularConfig(path: string): string | undefined {
  const config = join(path, '.ki-config.toml')
  const stat = lstatOrNull(config)
  if (!stat) return undefined
  if (!stat.isFile() || stat.isSymbolicLink()) throw new Error(`repository configuration must be a regular file: ${config}`)
  return readFileSync(config, 'utf8')
}

function isHarnessConfig(config: string | undefined): boolean {
  return /^\[ki-harness\][ \t]*$/m.test(config ?? '')
}

const targetStat = lstatOrNull(requestedTarget)
if (!targetStat?.isDirectory() || targetStat.isSymbolicLink())
  throw new Error(`command target must be a regular directory: ${requestedTarget}`)
const target = realpathSync(requestedTarget)

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

function skillName(directory: string): string | undefined {
  const path = join(directory, 'SKILL.md')
  const skill = lstatOrNull(path)
  if (!skill) return undefined
  if (!skill.isFile() || skill.isSymbolicLink()) throw new Error(`canonical SKILL.md must be a regular file: ${path}`)
  const name =
    flowList(readFileSync(path, 'utf8'), 'name')[0] ??
    readFileSync(path, 'utf8')
      .match(/^name:\s*(.+)$/m)?.[1]
      ?.trim()
  if (!name?.match(/^ki-[A-Za-z0-9_-]+$/)) throw new Error(`canonical SKILL.md must declare an exact ki-* name: ${path}`)
  return name
}

/** Discover only regular source skill directories below this command's scope. */
function skillDirectories(): SourceSkill[] {
  const root = join(target, 'skills')
  const rootStat = lstatOrNull(root)
  if (!rootStat?.isDirectory() || rootStat.isSymbolicLink()) throw new Error(`source skills are unavailable: ${root}`)
  const skills: SourceSkill[] = []
  const visitScoped = (directory: string): void => {
    const stat = lstatOrNull(directory)
    if (!stat?.isDirectory() || stat.isSymbolicLink()) return
    if (directory !== root) {
      const config = regularConfig(directory)
      if (config !== undefined) {
        // A nested ordinary repository is out of this command's source scope.
        // A nested harness is separately scoped: visit only its physical skills.
        if (isHarnessConfig(config)) visitScoped(join(directory, 'skills'))
        return
      }
    }
    const name = skillName(directory)
    if (name) {
      const harness = nearestHarnessSource(directory)
      skills.push({ directory, name, harness, ...(harness ? {} : { ordinaryRoot: target }) })
    }
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (entry.isDirectory()) visitScoped(join(directory, entry.name))
    }
  }
  visitScoped(root)
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

function providerDirectory(consumer: SourceSkill, provider: string, skills: readonly SourceSkill[]): string {
  if (consumer.harness) return sourceHarnessSkill(consumer.harness, provider)
  const candidates = skills.filter((skill) => skill.name === provider && skill.ordinaryRoot === consumer.ordinaryRoot)
  if (candidates.length !== 1) {
    const state = candidates.length === 0 ? 'absent' : 'ambiguous'
    throw new Error(`shared module provider is ${state} from the ordinary source scope: ${provider}`)
  }
  const candidate = candidates[0]
  if (!candidate) throw new Error(`shared module provider is absent from the ordinary source scope: ${provider}`)
  return candidate.directory
}

function payload(providerDirectory: string, provider: string, module: string): SharedModulePayload {
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

function ensureTargetParent(directory: string, module: SharedModule): void {
  let current = join(directory, 'scripts')
  const scripts = lstatOrNull(current)
  if (!scripts) mkdirSync(current)
  else if (!scripts.isDirectory() || scripts.isSymbolicLink()) throw new Error(`unsafe shared module parent: ${current}`)
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

function assertSafeDestinationParents(directory: string, module: SharedModule): void {
  const skill = lstatOrNull(directory)
  if (!skill?.isDirectory() || skill.isSymbolicLink()) throw new Error(`unsafe source skill directory: ${directory}`)
  let current = directory
  for (const part of ['scripts', 'vendored', module.provider]) {
    current = join(current, part)
    const entry = lstatOrNull(current)
    if (entry && (!entry.isDirectory() || entry.isSymbolicLink())) throw new Error(`unsafe shared module parent: ${current}`)
  }
}

function assertReplacementEligible(operation: SyncOperation): void {
  const { source, destination } = operation
  const existing = lstatOrNull(destination)
  if (existing?.isSymbolicLink() && !linkResolvesTo(destination, source.source)) {
    throw new Error(`refusing to replace unfamiliar shared module link: ${destination}`)
  }
  if (existing && !existing.isSymbolicLink() && !samePayload(source.source, destination)) {
    throw new Error(`refusing to replace changed shared module payload: ${destination}`)
  }
}

function preflightOperation(operation: SyncOperation): void {
  assertSafeDestinationParents(operation.consumer.directory, operation.module)
  assertReplacementEligible(operation)
}

function replacePayload(operation: SyncOperation): void {
  const { source, destination, consumer, module, link } = operation
  // Parent validation/creation deliberately precedes removal.  The full static
  // plan has already passed this check; concurrent filesystem replacement still
  // needs directory-FD guards for a complete TOCTOU guarantee.
  ensureTargetParent(consumer.directory, module)
  assertReplacementEligible(operation)
  const existing = lstatOrNull(destination)
  if (existing) rmSync(destination, { recursive: existing.isDirectory() && !existing.isSymbolicLink() })
  if (link) {
    symlinkSync(relative(dirname(destination), source.source), destination, source.kind === 'directory' ? 'dir' : 'file')
    if (!linkResolvesTo(destination, source.source)) throw new Error(`shared module link failed verification: ${destination}`)
    return
  }
  cpSync(source.source, destination, { recursive: source.kind === 'directory' })
  if (!samePayload(source.source, destination)) throw new Error(`shared module copy failed verification: ${destination}`)
}

function undeclaredSourcePayloads(skills: readonly SourceSkill[], expected: ReadonlyMap<string, SharedModulePayload>): string[] {
  const violations: string[] = []
  for (const skill of skills.filter((candidate) => candidate.harness)) {
    const vendored = join(skill.directory, 'scripts', 'vendored')
    const vendoredStat = lstatOrNull(vendored)
    if (!vendoredStat) continue
    if (!vendoredStat.isDirectory() || vendoredStat.isSymbolicLink()) {
      violations.push(`${skill.name}/scripts/vendored (must be a regular directory)`)
      continue
    }
    for (const provider of readdirSync(vendored)) {
      const providerPath = join(vendored, provider)
      const providerStat = lstatOrNull(providerPath)
      const label = `${skill.name}/scripts/vendored/${provider}`
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
const operations: SyncOperation[] = []
const expectedPayloads = new Map<string, SharedModulePayload>()

// Resolve the entire closure before modifying any payload.  In particular, a
// nested/external harness can never fall back to this command's target tree.
for (const consumer of skills) {
  for (const module of sharedDependencies(consumer.directory)) {
    if (module.provider === consumer.name) throw new Error(`${consumer.name} cannot depend on its own shared module`)
    const source = payload(providerDirectory(consumer, module.provider, skills), module.provider, module.module)
    const destination = join(consumer.directory, 'scripts', 'vendored', module.provider, source.targetName)
    expectedPayloads.set(destination, source)
    operations.push({ source, destination, consumer, module, link: consumer.harness !== undefined })
  }
}

// Every target and parent is proven safe before the first mkdir, unlink, copy,
// or symlink.  A later hostile destination therefore leaves earlier consumers
// byte-for-byte unchanged.
for (const operation of operations) preflightOperation(operation)

const drift: string[] = []
for (const operation of operations) {
  const current = operation.link
    ? linkResolvesTo(operation.destination, operation.source.source)
    : samePayload(operation.source.source, operation.destination)
  if (current) continue
  const label = `${operation.consumer.name}/scripts/vendored/${operation.module.provider}/${operation.source.targetName}`
  if (checkOnly) {
    drift.push(label)
    continue
  }
  if (dryRun) {
    if (!quiet) console.log(`${operation.link ? 'link' : 'copy'} ${label}`)
    continue
  }
  replacePayload(operation)
  if (!quiet) console.log(`${operation.link ? 'link' : 'copy'} ${label}`)
}

drift.push(...undeclaredSourcePayloads(skills, expectedPayloads))

if (drift.length) {
  console.error(`shared-module drift: ${drift.join(', ')} — run sync-shared-modules.ts ${target}`)
  process.exit(1)
}

if (!quiet)
  console.log(
    checkOnly
      ? 'shared module payloads are current'
      : `shared module payloads synchronized (${operations.filter((item) => item.link).length ? 'links and copies' : 'copies'})`
  )
