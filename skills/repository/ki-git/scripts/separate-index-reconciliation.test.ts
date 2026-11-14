import { afterEach, describe, expect, test } from 'bun:test'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, unlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

// Exercises the "After a separate-index commit" sequence in references/standards-git.md.

const roots: string[] = []

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
})

const inheritedEnv = Object.fromEntries(
  Object.entries(process.env).filter(
    ([key]) =>
      ![
        'GIT_DIR',
        'GIT_WORK_TREE',
        'GIT_INDEX_FILE',
        'GIT_TEMPLATE_DIR',
        'GIT_CONFIG_PARAMETERS',
        'GIT_CONFIG_COUNT'
      ].includes(key)
  )
)

const isolatedEnv = {
  ...inheritedEnv,
  GIT_CONFIG_GLOBAL: '/dev/null',
  GIT_CONFIG_NOSYSTEM: '1',
  GIT_OPTIONAL_LOCKS: '0',
  GIT_AUTHOR_NAME: 'Fixture',
  GIT_AUTHOR_EMAIL: 'fixture@example.invalid',
  GIT_COMMITTER_NAME: 'Fixture',
  GIT_COMMITTER_EMAIL: 'fixture@example.invalid'
}

const git = (root: string, args: string[], extraEnv: Record<string, string> = {}): string =>
  execFileSync('git', args, { cwd: root, env: { ...isolatedEnv, ...extraEnv }, encoding: 'utf8' })

const repository = (): string => {
  const root = mkdtempSync(join(tmpdir(), 'ki-git-separate-index-'))
  roots.push(root)
  git(root, ['init', '--quiet'])
  writeFileSync(join(root, 'modified.txt'), 'original\n')
  writeFileSync(join(root, 'gone.txt'), 'to be deleted\n')
  writeFileSync(join(root, 'other.txt'), 'unowned\n')
  git(root, ['add', '--', 'modified.txt', 'gone.txt', 'other.txt'])
  git(root, ['commit', '--quiet', '-m', 'initial'])
  return root
}

type Recorded = { parent: string; entries: Map<string, string> }

const indexEntry = (root: string, path: string): string => git(root, ['ls-files', '--stage', '--', path]).trim()

// Step 1: record the parent and each owned path's ordinary-index entry.
const record = (root: string, paths: string[]): Recorded => ({
  parent: git(root, ['rev-parse', 'HEAD']).trim(),
  entries: new Map(paths.map((path) => [path, indexEntry(root, path)]))
})

const blobAt = (root: string, commit: string, path: string): string | undefined => {
  try {
    return git(root, ['rev-parse', '--verify', '--quiet', `${commit}:${path}`]).trim()
  } catch {
    return undefined
  }
}

// Commits the owned working-file state through a unique temporary index.
const commitThroughTemporaryIndex = (root: string, paths: string[], message: string): void => {
  const env = { GIT_INDEX_FILE: join(root, '.git', 'index.fixture-worker') }
  git(root, ['read-tree', 'HEAD'], env)
  git(root, ['add', '--all', '--', ...paths], env)
  git(root, ['commit', '--quiet', '-m', message], env)
  unlinkSync(env.GIT_INDEX_FILE)
}

type Outcome = { stopped: false } | { stopped: true; reason: string }

// Steps 2 to 5, refusing to change anything on the stop condition.
const reconcile = (root: string, paths: string[], recorded: Recorded): Outcome => {
  const head = git(root, ['rev-parse', 'HEAD']).trim()
  const headParent = git(root, ['rev-parse', 'HEAD^']).trim()
  if (headParent !== recorded.parent)
    return { stopped: true, reason: `HEAD ${head} is not a child of ${recorded.parent}` }
  const committed = git(root, ['diff-tree', '--no-commit-id', '--name-only', '-r', 'HEAD'])
    .trim()
    .split('\n')
    .filter(Boolean)
  const unowned = committed.filter((path) => !paths.includes(path))
  if (unowned.length > 0) return { stopped: true, reason: `commit contains unowned path ${unowned.join(', ')}` }

  for (const path of paths) {
    const observed = indexEntry(root, path)
    const expected = recorded.entries.get(path) ?? ''
    const parentBlob = blobAt(root, recorded.parent, path)
    const matchesParent = parentBlob === undefined ? observed === '' : observed.split(/\s+/)[1] === parentBlob
    if (observed !== expected || !matchesParent) {
      return { stopped: true, reason: `${path}: recorded "${expected}", observed "${observed}"` }
    }
  }

  git(root, ['reset', '--quiet', 'HEAD', '--', ...paths])
  return { stopped: false }
}

const status = (root: string, paths: string[]): string => git(root, ['status', '--short', '--', ...paths])

const owned = ['modified.txt', 'new.txt', 'gone.txt']

const prepareWorkingFiles = (root: string): void => {
  writeFileSync(join(root, 'modified.txt'), 'changed\n')
  writeFileSync(join(root, 'new.txt'), 'created\n')
  unlinkSync(join(root, 'gone.txt'))
}

describe('separate-index reconciliation', () => {
  test('clears the stale ordinary index for modified, new and deleted paths', () => {
    const root = repository()
    prepareWorkingFiles(root)
    const recorded = record(root, owned)

    commitThroughTemporaryIndex(root, owned, 'owned change')

    const before = status(root, owned)
    expect(before).toContain('MM modified.txt')
    expect(before).toContain('D  new.txt')
    expect(before).toContain('AD gone.txt')

    expect(reconcile(root, owned, recorded)).toEqual({ stopped: false })
    expect(status(root, owned)).toBe('')
    expect(readFileSync(join(root, 'modified.txt'), 'utf8')).toBe('changed\n')
    expect(indexEntry(root, 'gone.txt')).toBe('')
  })

  test('stops without touching the index when another writer staged an owned path', () => {
    const root = repository()
    prepareWorkingFiles(root)
    const recorded = record(root, owned)

    // Another writer stages a different blob on the same path, then the owner's working file returns.
    writeFileSync(join(root, 'modified.txt'), 'concurrent\n')
    git(root, ['add', '--', 'modified.txt'])
    writeFileSync(join(root, 'modified.txt'), 'changed\n')

    commitThroughTemporaryIndex(root, owned, 'owned change')

    const indexPath = join(root, '.git', 'index')
    const indexBefore = readFileSync(indexPath)
    const outcome = reconcile(root, owned, recorded)

    expect(outcome.stopped).toBe(true)
    if (outcome.stopped) expect(outcome.reason).toContain('modified.txt')
    expect(readFileSync(indexPath).equals(indexBefore)).toBe(true)
  })

  test('stops when the commit contains an unowned path', () => {
    const root = repository()
    prepareWorkingFiles(root)
    writeFileSync(join(root, 'other.txt'), 'changed by someone else\n')
    const recorded = record(root, owned)

    commitThroughTemporaryIndex(root, [...owned, 'other.txt'], 'captured unowned work')

    const indexPath = join(root, '.git', 'index')
    const indexBefore = readFileSync(indexPath)
    const outcome = reconcile(root, owned, recorded)

    expect(outcome).toEqual({ stopped: true, reason: 'commit contains unowned path other.txt' })
    expect(readFileSync(indexPath).equals(indexBefore)).toBe(true)
  })
})
