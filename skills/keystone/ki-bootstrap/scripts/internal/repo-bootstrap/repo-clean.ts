#!/usr/bin/env bun
/** Safely remove only manifest-proven repository bootstrap output. */
import { createHash } from 'node:crypto'
import { lstatSync, readdirSync, readFileSync, readlinkSync, realpathSync, rmdirSync, unlinkSync, writeFileSync } from 'node:fs'
import { basename, dirname, isAbsolute, join, relative, resolve } from 'node:path'
import { resolveHarnessSource, sourceHarnessSkill } from './harness-source.ts'
import { isGeneratedRuntimeSkillCopy, isLocalKiSelfRuntimeProjection, isRuntimeSkillLinkToSource } from './project-skill-publisher.ts'
import { declaredSkills } from './resolve.ts'
import { runtimeSkillsDir, supportedRuntimes } from './runtime-paths.ts'

type Kind = 'directory' | 'file' | 'link'
type Snapshot = { path: string; kind: Kind; dev: number; ino: number; bytes?: Buffer; target?: string; entries?: string[] }
type Removal = { path: string; label: string; tree: Snapshot[] }

const KI = '.ki'
const MANIFEST = 'manifest.json'
const GENERATED_ROOTS = ['bin', 'bootstrap'] as const

function snapshot(path: string): Snapshot {
  const stat = lstatSync(path)
  if (!stat.isSymbolicLink() && !stat.isDirectory() && !stat.isFile()) throw new Error(`unsafe generated path: ${path}`)
  return {
    path,
    kind: stat.isSymbolicLink() ? 'link' : stat.isDirectory() ? 'directory' : 'file',
    dev: stat.dev,
    ino: stat.ino,
    ...(stat.isFile() ? { bytes: readFileSync(path) } : {}),
    ...(stat.isSymbolicLink() ? { target: readlinkSync(path) } : {}),
    ...(stat.isDirectory() ? { entries: readdirSync(path).sort() } : {})
  }
}

function same(expected: Snapshot, path = expected.path): boolean {
  try {
    const actual = snapshot(path)
    return (
      actual.kind === expected.kind &&
      actual.dev === expected.dev &&
      actual.ino === expected.ino &&
      (expected.bytes === undefined || actual.bytes?.equals(expected.bytes) === true) &&
      (expected.target === undefined || actual.target === expected.target) &&
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

function contained(root: string, path: string): boolean {
  const rel = relative(root, path)
  return rel === '' || (rel !== '..' && !rel.startsWith('../') && !rel.startsWith('..\\'))
}

function sourceHarnessLink(target: string, path: string, value: string): boolean {
  if (!value || isAbsolute(value)) return false
  try {
    const resolved = realpathSync(resolve(dirname(path), value))
    const root = realpathSync(target)
    return [join(root, 'skills'), join(root, 'agents')].some((sourceRoot) => {
      try {
        return contained(realpathSync(sourceRoot), resolved)
      } catch {
        return false
      }
    })
  } catch {
    return false
  }
}

function regularText(path: string, label: string): string {
  const entry = snapshot(path)
  if (entry.kind !== 'file' || !entry.bytes) throw new Error(`${label} must be a regular file: ${path}`)
  return entry.bytes.toString('utf8')
}

function walk(root: string): Snapshot[] {
  const rows: Snapshot[] = []
  const visit = (path: string): void => {
    const current = snapshot(path)
    rows.push(current)
    if (current.kind === 'directory') for (const name of readdirSync(path).sort()) visit(join(path, name))
  }
  visit(root)
  return rows
}

function ownedGeneratedState(target: string): Removal[] {
  const ki = join(target, KI)
  try {
    const root = snapshot(ki)
    if (root.kind !== 'directory') throw new Error(`${KI} must be a real directory`)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return []
    throw error
  }
  const manifest = join(ki, MANIFEST)
  const generatedPresent = GENERATED_ROOTS.some((root) => {
    try {
      return snapshot(join(ki, root)).kind === 'directory'
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return false
      throw error
    }
  })
  if (!generatedPresent) {
    try {
      snapshot(manifest)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return []
      throw error
    }
  }
  let files: Record<string, string>
  let links: Record<string, string>
  try {
    const parsed = JSON.parse(regularText(manifest, `${KI}/${MANIFEST}`)) as { ref?: unknown; files?: unknown; links?: unknown }
    if (typeof parsed.ref !== 'string' || !parsed.files || typeof parsed.files !== 'object' || Array.isArray(parsed.files))
      throw new Error('invalid manifest shape')
    files = parsed.files as Record<string, string>
    if (parsed.links !== undefined && (typeof parsed.links !== 'object' || parsed.links === null || Array.isArray(parsed.links)))
      throw new Error('invalid manifest links')
    links = (parsed.links ?? {}) as Record<string, string>
  } catch (error) {
    throw new Error(`cannot prove ${KI} generated ownership: ${(error as Error).message}`)
  }
  const expectedFiles = new Map<string, string>()
  const expectedLinks = new Map<string, string>()
  const expectedDirectories = new Set<string>()
  for (const [path, hash] of Object.entries(files)) {
    if (!path.startsWith(`${KI}/`) || path === `${KI}/${MANIFEST}` || !/^[a-f0-9]{64}$/.test(hash))
      throw new Error(`cannot prove ${KI} generated ownership: unsafe manifest entry ${path}`)
    const relativePath = path.slice(KI.length + 1)
    if (!GENERATED_ROOTS.some((root) => relativePath === root || relativePath.startsWith(`${root}/`)))
      throw new Error(`cannot prove ${KI} generated ownership: manifest entry escapes generated roots ${path}`)
    expectedFiles.set(relativePath, hash)
    let parent = dirname(relativePath)
    while (parent !== '.') {
      expectedDirectories.add(parent)
      parent = dirname(parent)
    }
  }
  for (const [path, value] of Object.entries(links)) {
    if (!path.startsWith(`${KI}/`) || !value || typeof value !== 'string')
      throw new Error(`cannot prove ${KI} generated ownership: unsafe link entry ${path}`)
    const relativePath = path.slice(KI.length + 1)
    if (!GENERATED_ROOTS.some((root) => relativePath === root || relativePath.startsWith(`${root}/`)))
      throw new Error(`cannot prove ${KI} generated ownership: link escapes generated roots ${path}`)
    if (expectedFiles.has(relativePath) || expectedLinks.has(relativePath))
      throw new Error(`cannot prove ${KI} generated ownership: duplicate manifest entry ${path}`)
    expectedLinks.set(relativePath, value)
    let parent = dirname(relativePath)
    while (parent !== '.') {
      expectedDirectories.add(parent)
      parent = dirname(parent)
    }
  }
  const tree = GENERATED_ROOTS.flatMap((root) => {
    const path = join(ki, root)
    try {
      return walk(path)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return []
      throw error
    }
  })
  const actualFiles = new Set<string>()
  const actualLinks = new Set<string>()
  for (const item of tree) {
    const rel = relative(ki, item.path)
    if (item.kind === 'file') {
      if (rel === MANIFEST) continue
      const expected = expectedFiles.get(rel)
      if (
        !expected ||
        createHash('sha256')
          .update(item.bytes ?? Buffer.alloc(0))
          .digest('hex') !== expected
      )
        throw new Error(`cannot prove ${KI} generated ownership: unexpected or changed file ${join(KI, rel)}`)
      actualFiles.add(rel)
      continue
    }
    if (item.kind === 'link') {
      const expected = expectedLinks.get(rel)
      if (!expected || item.target !== expected || !sourceHarnessLink(target, item.path, expected))
        throw new Error(`cannot prove ${KI} generated ownership: unexpected or unsafe link ${join(KI, rel)}`)
      actualLinks.add(rel)
      continue
    }
    if (!expectedDirectories.has(rel)) throw new Error(`cannot prove ${KI} generated ownership: unexpected directory ${join(KI, rel)}`)
  }
  if (
    actualFiles.size !== expectedFiles.size ||
    [...expectedFiles].some(([path]) => !actualFiles.has(path)) ||
    actualLinks.size !== expectedLinks.size ||
    [...expectedLinks].some(([path]) => !actualLinks.has(path))
  )
    throw new Error(`cannot prove ${KI} generated ownership: manifest payload is incomplete`)
  return [
    ...GENERATED_ROOTS.filter((root) => tree.some((item) => relative(ki, item.path) === root)).map((root) => ({
      path: join(ki, root),
      label: `${KI}/${root}`,
      tree: walk(join(ki, root))
    })),
    { path: manifest, label: `${KI}/${MANIFEST}`, tree: [snapshot(manifest)] }
  ]
}

function runtimeRoot(target: string, runtime: string): string | undefined {
  let current = target
  for (const part of runtimeSkillsDir(runtime).split('/')) {
    current = join(current, part)
    try {
      if (snapshot(current).kind !== 'directory') throw new Error(`managed runtime path must be a real directory: ${current}`)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return undefined
      throw error
    }
  }
  return current
}

function runtimeRemovals(target: string, config: string, strict = false): Removal[] {
  const removals: Removal[] = []
  const expected = new Set(declaredSkills(config).filter((skill) => skill !== 'ki-bootstrap'))
  const localKiSelfSource = join(target, KI, 'self', 'skill')
  const harness = /^\[ki-harness\][ \t]*$/m.test(config) ? resolveHarnessSource(target) : undefined
  for (const runtime of supportedRuntimes(config)) {
    const root = runtimeRoot(target, runtime)
    if (!root) continue
    let names: string[]
    names = readdirSync(root).sort()
    for (const name of names) {
      const path = join(root, name)
      let entry: Snapshot
      try {
        entry = snapshot(path)
      } catch {
        console.log(`skip    ${runtimeSkillsDir(runtime)}/${name} (not a regular generated payload)`)
        continue
      }
      const generated = entry.kind === 'directory' && isGeneratedRuntimeSkillCopy(path, name)
      const sourceLink = Boolean(harness?.skills.has(name) && isRuntimeSkillLinkToSource(path, sourceHarnessSkill(harness, name)))
      const localProjection = name === 'ki-self' && isLocalKiSelfRuntimeProjection(path, localKiSelfSource)
      if (generated || (strict && (sourceLink || localProjection))) {
        removals.push({ path, label: `${runtimeSkillsDir(runtime)}/${name}`, tree: walk(path) })
        continue
      }
      if (strict && (expected.has(name) || name === 'ki-self'))
        throw new Error(`cannot prove repository runtime payload ownership: ${runtimeSkillsDir(runtime)}/${name}`)
    }
  }
  return removals
}

function uninstallConfigRemoval(target: string, config: string): Removal {
  let parsed: Record<string, unknown>
  try {
    parsed = (globalThis as unknown as { Bun: { TOML: { parse(text: string): unknown } } }).Bun.TOML.parse(config) as Record<
      string,
      unknown
    >
  } catch {
    throw new Error('cannot prove repository declaration ownership: .ki-config.toml is not valid TOML')
  }
  if (
    !Object.keys(parsed).length ||
    Object.entries(parsed).some(
      ([key, value]) => !/^ki-[A-Za-z0-9_-]+$/.test(key) || typeof value !== 'object' || value === null || Array.isArray(value)
    )
  )
    throw new Error('cannot prove repository declaration ownership: .ki-config.toml contains non-KI configuration')
  const path = join(target, '.ki-config.toml')
  return { path, label: '.ki-config.toml', tree: [snapshot(path)] }
}

function assertUnchanged(removal: Removal): void {
  if (!removal.tree.every((item) => same(item))) throw new Error(`${removal.label} changed while CLEAN was preparing`)
}

function removeTree(removal: Removal): void {
  assertUnchanged(removal)
  for (const item of [...removal.tree].sort((a, b) => b.path.length - a.path.length)) {
    if (item.kind === 'directory' ? !sameIdentity(item) : !same(item)) throw new Error(`${removal.label} changed during CLEAN`)
    if (item.kind === 'file' || item.kind === 'link') unlinkSync(item.path)
    else rmdirSync(item.path)
  }
}

function targetRoot(value: string): string {
  const target = resolve(value)
  const resolved = realpathSync(target)
  const root = snapshot(resolved)
  if (root.kind !== 'directory' || basename(resolved) === '') throw new Error(`target must be a real directory: ${value}`)
  return resolved
}

function usage(): void {
  console.log('Usage: repo-clean.ts [target] [--dry-run]')
  console.log('\nRemove only manifest-proven .ki generated output and unchanged generated runtime skill copies.')
}

function repositoryOptions(argv: string[], operation: string): { dryRun: boolean; target: string } {
  let dryRun = false
  let target: string | undefined
  for (const value of argv) {
    if (value === '--dry-run') {
      if (dryRun) throw new Error(`${operation} accepts --dry-run at most once`)
      dryRun = true
    } else if (value.startsWith('-')) throw new Error(`${operation} does not recognise option: ${value}`)
    else if (target) throw new Error(`${operation} accepts at most one target`)
    else target = value
  }
  return { dryRun, target: targetRoot(target ?? '.') }
}

export function runRepositoryClean(argv = process.argv.slice(2)): number {
  if (argv.includes('--help') || argv.includes('-h')) {
    usage()
    return 0
  }
  const { dryRun, target } = repositoryOptions(argv, 'CLEAN')
  const config = regularText(join(target, '.ki-config.toml'), '.ki-config.toml')
  const generated = ownedGeneratedState(target)
  const removals = [...generated, ...runtimeRemovals(target, config)]
  for (const removal of removals) assertUnchanged(removal)
  if (process.env.NODE_ENV === 'test' && process.env.KI_BOOTSTRAP_TEST_CLEAN_MUTATE === '1' && generated.length)
    writeFileSync(join(target, KI, MANIFEST), `${readFileSync(join(target, KI, MANIFEST), 'utf8')}\n`)
  for (const removal of removals) assertUnchanged(removal)
  if (dryRun) {
    for (const removal of removals) console.log(`remove  ${removal.label}`)
    console.log('dry run — nothing changed')
    return 0
  }
  for (const removal of removals) removeTree(removal)
  console.log(`CLEAN complete — removed ${removals.length} generated path${removals.length === 1 ? '' : 's'}`)
  return 0
}

export function runRepositoryUninstall(argv = process.argv.slice(2)): number {
  if (argv.includes('--help') || argv.includes('-h')) {
    console.log('Usage: repo-uninstall.ts [target] [--dry-run]')
    console.log('\nEnd repository adoption by removing only proven KI-generated state and a sole-purpose KI declaration.')
    return 0
  }
  const { dryRun, target } = repositoryOptions(argv, 'repository UNINSTALL')
  const config = regularText(join(target, '.ki-config.toml'), '.ki-config.toml')
  const removals = [...ownedGeneratedState(target), ...runtimeRemovals(target, config, true), uninstallConfigRemoval(target, config)]
  for (const removal of removals) assertUnchanged(removal)
  if (dryRun) {
    for (const removal of removals) console.log(`remove  ${removal.label}`)
    console.log('dry run — nothing changed')
    return 0
  }
  for (const removal of removals) removeTree(removal)
  console.log(`repository UNINSTALL complete — removed ${removals.length} KI-owned path${removals.length === 1 ? '' : 's'}`)
  return 0
}

if (import.meta.main) {
  try {
    process.exit(runRepositoryClean())
  } catch (error) {
    console.error(`FAIL  CLEAN: ${(error as Error).message}`)
    process.exit(1)
  }
}
