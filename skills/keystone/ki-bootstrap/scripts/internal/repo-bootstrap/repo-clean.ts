#!/usr/bin/env bun
/** Safely remove only manifest-proven repository bootstrap output. */
import { createHash } from 'node:crypto'
import { lstatSync, readdirSync, readFileSync, realpathSync, rmdirSync, unlinkSync, writeFileSync } from 'node:fs'
import { basename, dirname, join, relative, resolve } from 'node:path'
import { isGeneratedRuntimeSkillCopy } from './project-skill-publisher.ts'
import { runtimeSkillsDir, supportedRuntimes } from './runtime-paths.ts'

type Kind = 'directory' | 'file'
type Snapshot = { path: string; kind: Kind; dev: number; ino: number; bytes?: Buffer }
type Removal = { path: string; label: string; tree: Snapshot[] }

const META = '.ki-meta'
const MANIFEST = 'manifest.json'

function snapshot(path: string): Snapshot {
  const stat = lstatSync(path)
  if (stat.isSymbolicLink() || (!stat.isDirectory() && !stat.isFile())) throw new Error(`unsafe generated path: ${path}`)
  return {
    path,
    kind: stat.isDirectory() ? 'directory' : 'file',
    dev: stat.dev,
    ino: stat.ino,
    ...(stat.isFile() ? { bytes: readFileSync(path) } : {})
  }
}

function same(expected: Snapshot, path = expected.path): boolean {
  try {
    const actual = snapshot(path)
    return (
      actual.kind === expected.kind &&
      actual.dev === expected.dev &&
      actual.ino === expected.ino &&
      (expected.bytes === undefined || actual.bytes?.equals(expected.bytes) === true)
    )
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

function ownedMeta(target: string): Removal | undefined {
  const meta = join(target, META)
  try {
    const root = snapshot(meta)
    if (root.kind !== 'directory') throw new Error(`${META} must be a real directory`)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return undefined
    throw error
  }
  const manifest = join(meta, MANIFEST)
  let files: Record<string, string>
  try {
    const parsed = JSON.parse(regularText(manifest, `${META}/${MANIFEST}`)) as { ref?: unknown; files?: unknown }
    if (typeof parsed.ref !== 'string' || !parsed.files || typeof parsed.files !== 'object' || Array.isArray(parsed.files))
      throw new Error('invalid manifest shape')
    files = parsed.files as Record<string, string>
  } catch (error) {
    throw new Error(`cannot prove ${META} ownership: ${(error as Error).message}`)
  }
  const expectedFiles = new Map<string, string>()
  const expectedDirectories = new Set<string>()
  for (const [path, hash] of Object.entries(files)) {
    if (!path.startsWith(`${META}/`) || path === `${META}/${MANIFEST}` || !/^[a-f0-9]{64}$/.test(hash))
      throw new Error(`cannot prove ${META} ownership: unsafe manifest entry ${path}`)
    expectedFiles.set(path.slice(META.length + 1), hash)
    let parent = dirname(path.slice(META.length + 1))
    while (parent !== '.') {
      expectedDirectories.add(parent)
      parent = dirname(parent)
    }
  }
  const tree = walk(meta)
  const actualFiles = new Set<string>()
  for (const item of tree) {
    const rel = relative(meta, item.path)
    if (rel === '') continue
    if (item.kind === 'file') {
      if (rel === MANIFEST) continue
      const expected = expectedFiles.get(rel)
      if (
        !expected ||
        createHash('sha256')
          .update(item.bytes ?? Buffer.alloc(0))
          .digest('hex') !== expected
      )
        throw new Error(`cannot prove ${META} ownership: unexpected or changed file ${join(META, rel)}`)
      actualFiles.add(rel)
      continue
    }
    if (!expectedDirectories.has(rel)) throw new Error(`cannot prove ${META} ownership: unexpected directory ${join(META, rel)}`)
  }
  if (actualFiles.size !== expectedFiles.size || [...expectedFiles].some(([path]) => !actualFiles.has(path)))
    throw new Error(`cannot prove ${META} ownership: manifest payload is incomplete`)
  return { path: meta, label: META, tree }
}

function runtimeRemovals(target: string, config: string): Removal[] {
  const removals: Removal[] = []
  for (const runtime of supportedRuntimes(config)) {
    const root = join(target, runtimeSkillsDir(runtime))
    let names: string[]
    try {
      names = readdirSync(root).sort()
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') continue
      throw error
    }
    for (const name of names) {
      const path = join(root, name)
      let entry: Snapshot
      try {
        entry = snapshot(path)
      } catch {
        console.log(`skip    ${runtimeSkillsDir(runtime)}/${name} (not a regular generated payload)`)
        continue
      }
      if (entry.kind !== 'directory' || !isGeneratedRuntimeSkillCopy(path, name)) continue
      removals.push({ path, label: `${runtimeSkillsDir(runtime)}/${name}`, tree: walk(path) })
    }
  }
  return removals
}

function assertUnchanged(removal: Removal): void {
  if (!removal.tree.every((item) => same(item))) throw new Error(`${removal.label} changed while CLEAN was preparing`)
}

function removeTree(removal: Removal): void {
  assertUnchanged(removal)
  for (const item of [...removal.tree].sort((a, b) => b.path.length - a.path.length)) {
    if (!same(item)) throw new Error(`${removal.label} changed during CLEAN`)
    if (item.kind === 'file') unlinkSync(item.path)
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
  console.log('\nRemove only manifest-proven .ki-meta output and unchanged generated runtime skill copies.')
}

export function runRepositoryClean(argv = process.argv.slice(2)): number {
  if (argv.includes('--help') || argv.includes('-h')) {
    usage()
    return 0
  }
  const dryRun = argv.includes('--dry-run')
  const values = argv.filter((value) => !value.startsWith('-'))
  if (values.length > 1) throw new Error('CLEAN accepts at most one target')
  const target = targetRoot(values[0] ?? '.')
  const config = regularText(join(target, '.ki-config.toml'), '.ki-config.toml')
  const meta = ownedMeta(target)
  const removals = [...(meta ? [meta] : []), ...runtimeRemovals(target, config)]
  for (const removal of removals) assertUnchanged(removal)
  if (process.env.NODE_ENV === 'test' && process.env.KI_BOOTSTRAP_TEST_CLEAN_MUTATE === '1' && meta)
    writeFileSync(join(meta.path, MANIFEST), `${readFileSync(join(meta.path, MANIFEST), 'utf8')}\n`)
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

if (import.meta.main) {
  try {
    process.exit(runRepositoryClean())
  } catch (error) {
    console.error(`FAIL  CLEAN: ${(error as Error).message}`)
    process.exit(1)
  }
}
