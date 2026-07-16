#!/usr/bin/env bun
/**
 * Durable Claude Code hook-payload installer.
 *
 * This is deliberately separate from bootstrap.ts: its source may be a disposable
 * GitHub tarball, while the installed hooks must survive after that tree is gone.
 */
import { createHash } from 'node:crypto'
import {
  closeSync,
  constants,
  fchmodSync,
  fstatSync,
  linkSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  openSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmdirSync,
  rmSync,
  unlinkSync,
  writeFileSync
} from 'node:fs'
import { homedir } from 'node:os'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const SELF = fileURLToPath(import.meta.url)
const HARNESS_ROOT = resolve(dirname(SELF), '..', '..', '..', '..')
const NAMES = ['plan-stamp.sh', 'plan-sync.sh', 'git-lock-check.sh'] as const
const REPOSITORY = 'knowledgeislands/ki-agentic-harness'
const SCHEMA = 1

type JsonObject = Record<string, unknown>
type StatNumber = number | bigint
type Snapshot = { dev: StatNumber; ino: StatNumber; mode: StatNumber; size: StatNumber; mtimeMs: StatNumber }
type Created = { path: string; identity: Snapshot }
type Stat = NonNullable<ReturnType<typeof lstatSync>>

function fail(message: string): never {
  throw new Error(message)
}

function lstat(path: string): Stat | undefined {
  try {
    return lstatSync(path)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return undefined
    throw error
  }
}

function snapshot(path: string): Snapshot | undefined {
  const entry = lstat(path)
  if (!entry) return undefined
  if (entry.isSymbolicLink()) fail(`${path} must not be a symlink`)
  return { dev: entry.dev, ino: entry.ino, mode: entry.mode, size: entry.size, mtimeMs: entry.mtimeMs }
}

function sameSnapshot(path: string, expected: Snapshot | undefined): boolean {
  try {
    const actual = snapshot(path)
    if (!actual || !expected) return actual === expected
    return Boolean(
      actual.dev === expected.dev &&
        actual.ino === expected.ino &&
        actual.mode === expected.mode &&
        actual.size === expected.size &&
        actual.mtimeMs === expected.mtimeMs
    )
  } catch {
    return false
  }
}

function sameIdentity(path: string, expected: Snapshot | undefined): boolean {
  try {
    const actual = snapshot(path)
    return Boolean(actual && expected && actual.dev === expected.dev && actual.ino === expected.ino && actual.mode === expected.mode)
  } catch {
    return false
  }
}

function identityFromStat(entry: ReturnType<typeof fstatSync>): Snapshot {
  return { dev: entry.dev, ino: entry.ino, mode: entry.mode, size: entry.size, mtimeMs: entry.mtimeMs }
}

function permissions(entry: Stat): number {
  return typeof entry.mode === 'bigint' ? Number(entry.mode & 0o777n) : entry.mode & 0o777
}

function removeCreatedFile(created: Created): void {
  if (sameIdentity(created.path, created.identity)) rmSync(created.path, { force: true })
}

function removeCreatedDirectory(created: Created): void {
  if (!sameIdentity(created.path, created.identity)) return
  try {
    rmdirSync(created.path)
  } catch {
    // A concurrent replacement or unexpected child is deliberately retained.
  }
}

function writeCreatedFile(path: string, content: string | Buffer, mode: number): Created {
  const descriptor = openSync(path, 'wx', mode)
  const created = { path, identity: identityFromStat(fstatSync(descriptor)) }
  try {
    writeFileSync(descriptor, content)
    fchmodSync(descriptor, mode)
    return created
  } catch (error) {
    closeSync(descriptor)
    removeCreatedFile(created)
    throw error
  } finally {
    try {
      closeSync(descriptor)
    } catch {
      // The catch branch already closed after a failed publication.
    }
  }
}

function requireDirectory(path: string): void {
  const entry = lstat(path)
  if (entry && (!entry.isDirectory() || entry.isSymbolicLink())) fail(`${path} must be a real directory`)
}

function requireFile(path: string, expectedMode?: number): Buffer {
  let descriptor: number
  try {
    descriptor = openSync(path, constants.O_RDONLY | constants.O_NOFOLLOW)
  } catch {
    fail(`${path} must be a regular non-symlink file`)
  }
  try {
    const before = fstatSync(descriptor)
    if (!before.isFile()) fail(`${path} must be a regular non-symlink file`)
    if (expectedMode !== undefined && permissions(before) !== expectedMode) fail(`${path} must have mode ${expectedMode.toString(8)}`)
    const bytes = readFileSync(descriptor)
    const after = fstatSync(descriptor)
    const first = identityFromStat(before)
    const last = identityFromStat(after)
    if (
      first.dev !== last.dev ||
      first.ino !== last.ino ||
      first.mode !== last.mode ||
      first.size !== last.size ||
      first.mtimeMs !== last.mtimeMs
    )
      fail(`${path} changed while it was being read`)
    return bytes
  } finally {
    closeSync(descriptor)
  }
}

function sha256(bytes: Buffer): string {
  return createHash('sha256').update(bytes).digest('hex')
}

function payloadId(files: Map<string, Buffer>): string {
  const hash = createHash('sha256')
  for (const name of NAMES) {
    const bytes = files.get(name)
    if (!bytes) fail(`missing hook source: ${name}`)
    hash.update(name)
    hash.update('\0')
    hash.update(String(bytes.length))
    hash.update('\0')
    hash.update(bytes)
    hash.update('\0')
  }
  return hash.digest('hex')
}

function isObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function manifestFor(id: string, ref: string, files: Map<string, Buffer>): JsonObject {
  return {
    schema: SCHEMA,
    repository: REPOSITORY,
    requested_ref: ref,
    payload_id: id,
    hooks: NAMES.map((name) => ({ name, sha256: sha256(files.get(name) as Buffer), mode: '0755' }))
  }
}

function storedPayload(path: string, id: string): Map<string, Buffer> | undefined {
  try {
    const dir = lstat(path)
    const before = snapshot(path)
    if (!dir || !before || dir.isSymbolicLink() || !dir.isDirectory() || permissions(dir) !== 0o700) return undefined
    const expectedEntries = [...NAMES, 'manifest.json'].sort().join(',')
    if (readdirSync(path).sort().join(',') !== expectedEntries) return undefined
    const manifestPath = join(path, 'manifest.json')
    const manifest = JSON.parse(requireFile(manifestPath, 0o600).toString('utf8')) as JsonObject
    if (
      !isObject(manifest) ||
      Object.keys(manifest).sort().join(',') !== 'hooks,payload_id,repository,requested_ref,schema' ||
      manifest.schema !== SCHEMA ||
      manifest.repository !== REPOSITORY ||
      manifest.payload_id !== id ||
      typeof manifest.requested_ref !== 'string' ||
      manifest.requested_ref.length === 0 ||
      !Array.isArray(manifest.hooks) ||
      manifest.hooks.length !== NAMES.length
    )
      return undefined
    const rows = new Map<string, JsonObject>()
    for (const row of manifest.hooks) {
      if (!isObject(row) || Object.keys(row).sort().join(',') !== 'mode,name,sha256' || typeof row.name !== 'string' || rows.has(row.name))
        return undefined
      rows.set(row.name, row)
    }
    const stored = new Map<string, Buffer>()
    for (const name of NAMES) {
      const row = rows.get(name)
      if (!isObject(row) || row.mode !== '0755') return undefined
      const bytes = requireFile(join(path, name), 0o755)
      if (row.sha256 !== sha256(bytes)) return undefined
      stored.set(name, bytes)
    }
    return sameSnapshot(path, before) && payloadId(stored) === id ? stored : undefined
  } catch {
    return undefined
  }
}

function validPayload(path: string, id: string, files: Map<string, Buffer>): boolean {
  const stored = storedPayload(path, id)
  return Boolean(stored && NAMES.every((name) => stored.get(name)?.equals(files.get(name) as Buffer)))
}

function activeManifest(id: string): JsonObject {
  return { schema: SCHEMA, repository: REPOSITORY, payload_id: id }
}

function activePayloadId(namespace: string): string | undefined {
  try {
    const namespaceBefore = snapshot(namespace)
    const namespaceEntry = lstat(namespace)
    if (!namespaceBefore || !namespaceEntry) return undefined
    if (!namespaceEntry.isDirectory() || permissions(namespaceEntry) !== 0o700) return undefined
    const path = join(namespace, 'active.json')
    const active = JSON.parse(requireFile(path, 0o600).toString('utf8')) as JsonObject
    if (
      !isObject(active) ||
      Object.keys(active).sort().join(',') !== 'payload_id,repository,schema' ||
      active.schema !== SCHEMA ||
      active.repository !== REPOSITORY ||
      typeof active.payload_id !== 'string' ||
      !/^[a-f0-9]{64}$/.test(active.payload_id) ||
      !storedPayload(join(namespace, active.payload_id), active.payload_id) ||
      !sameSnapshot(namespace, namespaceBefore)
    )
      return undefined
    return active.payload_id
  } catch {
    return undefined
  }
}

function publishActive(namespace: string, id: string): void {
  const path = join(namespace, 'active.json')
  const existing = lstat(path)
  const current = activePayloadId(namespace)
  if (existing && !current) fail(`${path} exists but is not a valid installer-owned active pointer`)
  if (current === id) return

  const before = existing ? snapshot(path) : undefined
  const previous = before ? requireFile(path, 0o600) : undefined
  const temporary = join(namespace, `.active-${process.pid}-${Math.random().toString(16).slice(2)}`)
  let created: Created | undefined
  let published: Snapshot | undefined
  try {
    created = writeCreatedFile(temporary, `${JSON.stringify(activeManifest(id), null, 2)}\n`, 0o600)
    if (!sameIdentity(temporary, created.identity) || !sameSnapshot(path, before)) fail(`${path} changed before active payload publication`)
    if (!before) {
      linkSync(temporary, path)
      unlinkSync(temporary)
      created = undefined
    } else {
      // POSIX has no no-clobber replacement primitive for an existing regular file.
      // The snapshot check plus post-publication validation bounds the same-UID race.
      renameSync(temporary, path)
      created = undefined
    }
    published = snapshot(path)
    if (!published) fail(`${path} disappeared after active payload publication`)
    if (process.env.KI_HOOKS_TEST_FAIL_AFTER_ACTIVE === '1') fail('injected active-pointer validation failure')
    if (activePayloadId(namespace) !== id) fail(`${path} failed post-publication validation`)
  } catch (error) {
    if (published && sameIdentity(path, published)) {
      if (previous) {
        const rollback = join(namespace, `.active-rollback-${process.pid}-${Math.random().toString(16).slice(2)}`)
        let restored: Created | undefined
        try {
          restored = writeCreatedFile(rollback, previous, 0o600)
          if (!sameIdentity(path, published) || !sameIdentity(rollback, restored.identity))
            fail(`${path} changed before active payload rollback`)
          renameSync(rollback, path)
          restored = undefined
        } finally {
          if (restored) removeCreatedFile(restored)
        }
      } else {
        unlinkSync(path)
      }
    }
    throw error
  } finally {
    if (created) removeCreatedFile(created)
  }
}

function withInstallationLock<T>(namespace: string, action: () => T): T {
  const lock = join(namespace, '.installer.lock')
  if (lstat(lock)) fail(`${lock} already exists; another installation may be running`)
  mkdirSync(lock, { mode: 0o700 })
  const identity = snapshot(lock)
  if (!identity) fail(`${lock} disappeared during creation`)
  try {
    return action()
  } finally {
    removeCreatedDirectory({ path: lock, identity })
  }
}

function mkdirOwned(path: string): void {
  const entry = lstat(path)
  if (entry) {
    if (entry.isSymbolicLink() || !entry.isDirectory()) fail(`${path} blocks hook installation`)
    return
  }
  mkdirSync(path, { mode: 0o700 })
}

function requirePrivateDirectory(path: string): void {
  const entry = lstat(path)
  if (!entry || entry.isSymbolicLink() || !entry.isDirectory() || permissions(entry) !== 0o700)
    fail(`${path} must be an installer-owned mode 700 directory`)
}

function writePayload(namespace: string, target: string, id: string, ref: string, files: Map<string, Buffer>): void {
  if (validPayload(target, id, files)) return
  if (lstat(target)) fail(`${target} exists but is not a valid owned payload`)
  const lock = `${target}.lock`
  if (lstat(lock)) fail(`${lock} already exists; another installation may be running`)
  mkdirSync(lock, { mode: 0o700 })
  const lockIdentity = snapshot(lock)
  if (!lockIdentity) fail(`${lock} disappeared during creation`)
  let stage: Created | undefined
  const stagedFiles: Created[] = []
  let published: Created | undefined
  let publishedFiles: Created[] = []
  try {
    const stagePath = mkdtempSync(join(namespace, '.install-'))
    const stageIdentity = snapshot(stagePath)
    if (!stageIdentity) fail(`${stagePath} disappeared during creation`)
    stage = { path: stagePath, identity: stageIdentity }
    for (const name of NAMES) {
      stagedFiles.push(writeCreatedFile(join(stage.path, name), files.get(name) as Buffer, 0o755))
    }
    stagedFiles.push(
      writeCreatedFile(join(stage.path, 'manifest.json'), `${JSON.stringify(manifestFor(id, ref, files), null, 2)}\n`, 0o600)
    )
    if (process.env.KI_HOOKS_TEST_FAIL_STAGE === '1') fail('injected staging failure')
    if (lstat(target)) fail(`${target} appeared during publication`)
    if (!sameIdentity(lock, lockIdentity) || !sameIdentity(stage.path, stage.identity))
      fail('publication staging changed during installation')
    renameSync(stage.path, target)
    published = { path: target, identity: stage.identity }
    publishedFiles = stagedFiles.map((created) => ({ path: join(target, basename(created.path)), identity: created.identity }))
    stage = undefined
    if (process.env.KI_HOOKS_TEST_FAIL_AFTER_PAYLOAD === '1') fail('injected post-publication validation failure')
    if (!validPayload(target, id, files)) fail(`${target} failed post-publication validation`)
  } catch (error) {
    for (const created of publishedFiles.toReversed()) removeCreatedFile(created)
    if (published) removeCreatedDirectory(published)
    throw error
  } finally {
    if (stage) {
      for (const created of stagedFiles.toReversed()) removeCreatedFile(created)
      removeCreatedDirectory(stage)
    }
    removeCreatedDirectory({ path: lock, identity: lockIdentity })
  }
}

function usage(): never {
  console.error('usage: bun install-hooks.ts [--source <hooks-dir>] [--home <dir>] [--ref <ref>] [--dry-run|--check]')
  process.exit(2)
}

function main(): number {
  let source = join(HARNESS_ROOT, 'hooks')
  let home = homedir()
  let ref = 'main'
  let dryRun = false
  let check = false
  const args = process.argv.slice(2)
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]
    if (arg === '--dry-run') dryRun = true
    else if (arg === '--check') check = true
    else if (arg === '--source' || arg === '--home' || arg === '--ref') {
      const value = args[++index]
      if (!value) usage()
      if (arg === '--source') source = resolve(value)
      else if (arg === '--home') home = resolve(value)
      else ref = value
    } else usage()
  }
  if (dryRun && check) usage()

  requireDirectory(source)
  requireDirectory(home)
  const files = new Map(NAMES.map((name) => [name, requireFile(join(source, name))]))
  const id = payloadId(files)
  const claude = join(home, '.claude')
  const hooks = join(claude, 'hooks')
  const namespace = join(hooks, 'knowledgeislands', 'ki-agentic-harness')
  const target = join(namespace, id)
  for (const path of [claude, hooks, join(hooks, 'knowledgeislands'), namespace, target]) requireDirectory(path)

  if (check) {
    const ok = validPayload(target, id, files) && activePayloadId(namespace) === id
    console.log(ok ? `PASS hook payload ${id} is active` : `FAIL hook payload ${id} is absent, inactive, or drifted`)
    return ok ? 0 : 1
  }
  if (dryRun) {
    console.log(`would install hook payload ${id} from ${source} under ${namespace}`)
    return 0
  }
  mkdirOwned(claude)
  mkdirOwned(hooks)
  mkdirOwned(join(hooks, 'knowledgeislands'))
  mkdirOwned(namespace)
  requirePrivateDirectory(namespace)
  withInstallationLock(namespace, () => {
    const active = join(namespace, 'active.json')
    if (lstat(active) && !activePayloadId(namespace)) fail(`${active} exists but is not a valid installer-owned active pointer`)
    writePayload(namespace, target, id, ref, files)
    publishActive(namespace, id)
  })
  console.log(`installed durable Claude hook payload: ${id}`)
  return 0
}

try {
  process.exit(main())
} catch (error) {
  console.error(`error: ${(error as Error).message}`)
  process.exit(1)
}
