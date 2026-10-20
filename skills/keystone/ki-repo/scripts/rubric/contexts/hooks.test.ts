import { afterEach, expect, test } from 'bun:test'
import { execFileSync } from 'node:child_process'
import { chmodSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { hookEvidence } from './hooks.ts'

const roots: string[] = []

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
})

const repository = (): string => {
  const root = mkdtempSync(join(tmpdir(), 'ki-repo-hooks-'))
  roots.push(root)
  execFileSync('git', ['init', '--quiet', root])
  return root
}

const git = (root: string, ...args: string[]): void => {
  execFileSync('git', ['-C', root, ...args], { stdio: 'ignore' })
}

const FRAMED = `#!/bin/sh
root="$(git rev-parse --show-toplevel)" || exit 1
if ! command -v ki >/dev/null 2>&1; then
  echo "pre-commit: the ki CLI is not on PATH; install it, then commit again." >&2
  echo "pre-commit: do not bypass with --no-verify; a gate that cannot run is unknown, not a pass." >&2
  exit 1
fi
ki repo audit --repo "$root" --staged || exit 1
`

const addHook = (root: string, mode = 0o755, name = 'pre-commit', source = '#!/bin/sh\nki repo audit\n'): void => {
  mkdirSync(join(root, '.githooks'), { recursive: true })
  writeFileSync(join(root, '.githooks', name), source)
  chmodSync(join(root, '.githooks', name), mode)
  git(root, 'add', `.githooks/${name}`)
}

const local = {}

test('HOOK-1 warns without a committed hook and HOOK-2 has nothing to bind', () => {
  const evidence = hookEvidence(repository(), local)
  expect(evidence.hook1[0]?.status).toBe('VIOLATION')
  expect(evidence.hook1[0]?.message).toContain('no committed .githooks/pre-commit')
  expect(evidence.hook2[0]?.status).toBe('NOT_APPLICABLE')
})

test('HOOK-1 rejects an untracked, non-executable or unsafe hook', () => {
  const untracked = repository()
  mkdirSync(join(untracked, '.githooks'))
  writeFileSync(join(untracked, '.githooks', 'pre-commit'), '#!/bin/sh\n')
  expect(hookEvidence(untracked, local).hook1[0]?.message).toContain('is not tracked')

  const plain = repository()
  addHook(plain, 0o644)
  expect(hookEvidence(plain, local).hook1[0]?.message).toContain('without executable mode')

  const linked = repository()
  mkdirSync(join(linked, '.githooks'))
  writeFileSync(join(linked, 'gate.sh'), '#!/bin/sh\n')
  symlinkSync(join(linked, 'gate.sh'), join(linked, '.githooks', 'pre-commit'))
  expect(hookEvidence(linked, local).hook1[0]?.message).toContain('not a safe regular file')
})

test('an executable tracked hook passes HOOK-1 and HOOK-2 names the exact binding step until bound', () => {
  const root = repository()
  addHook(root)
  const unbound = hookEvidence(root, local)
  expect(unbound.hook1[0]?.status).toBe('PASS')
  expect(unbound.hook2[0]?.status).toBe('VIOLATION')
  expect(unbound.hook2[0]?.message).toContain('git config core.hooksPath .githooks')

  git(root, 'config', 'core.hooksPath', '.husky/_')
  expect(hookEvidence(root, local).hook2[0]?.message).toContain('".husky/_"')

  git(root, 'config', 'core.hooksPath', '.githooks')
  expect(hookEvidence(root, local).hook2[0]?.status).toBe('PASS')
})

test('HOOK-2 is not applicable in CI without a local binding, but still judges a wrong one', () => {
  const root = repository()
  addHook(root)
  expect(hookEvidence(root, { CI: 'true' }).hook2[0]?.status).toBe('NOT_APPLICABLE')
  git(root, 'config', 'core.hooksPath', 'elsewhere')
  expect(hookEvidence(root, { CI: 'true' }).hook2[0]?.status).toBe('VIOLATION')
})

test('HOOK-2 reads a worktree-scoped override from the audited working tree', () => {
  const root = repository()
  addHook(root)
  git(root, '-c', 'user.name=t', '-c', 'user.email=t@example.com', 'commit', '--quiet', '-m', 'test: hook')
  git(root, 'config', 'core.hooksPath', '.githooks')
  const worktree = join(mkdtempSync(join(tmpdir(), 'ki-repo-hooks-worktree-')), 'linked')
  roots.push(worktree)
  git(root, 'worktree', 'add', '--quiet', worktree)
  expect(hookEvidence(worktree, local).hook2[0]?.status).toBe('PASS')
  git(root, 'config', 'extensions.worktreeConfig', 'true')
  git(worktree, 'config', '--worktree', 'core.hooksPath', '.husky/_')
  expect(hookEvidence(worktree, local).hook2[0]?.message).toContain("Husky's retired binding")
  expect(hookEvidence(root, local).hook2[0]?.status).toBe('PASS')
})

test('HOOK-3 requires a commit-msg hook only in a package-backed repository', () => {
  const bare = repository()
  expect(hookEvidence(bare, local).hook3[0]?.status).toBe('NOT_APPLICABLE')

  const packaged = repository()
  writeFileSync(join(packaged, 'package.json'), '{}\n')
  expect(hookEvidence(packaged, local).hook3[0]?.message).toContain('no committed .githooks/commit-msg')
  addHook(packaged, 0o644, 'commit-msg', FRAMED)
  expect(hookEvidence(packaged, local).hook3[0]?.message).toContain('without executable mode')
  addHook(packaged, 0o755, 'commit-msg', FRAMED)
  git(packaged, 'update-index', '--chmod=+x', '.githooks/commit-msg')
  expect(hookEvidence(packaged, local).hook3[0]?.status).toBe('PASS')
})

test('HOOK-4 requires the refusal frame before the first command and never a bypass', () => {
  const root = repository()
  expect(hookEvidence(root, local).hook4[0]?.status).toBe('NOT_APPLICABLE')
  addHook(root)
  expect(hookEvidence(root, local).hook4[0]?.message).toContain('must refuse when a required tool is missing')

  addHook(root, 0o755, 'pre-commit', FRAMED)
  expect(hookEvidence(root, local).hook4[0]?.status).toBe('PASS')

  addHook(root, 0o755, 'pre-commit', FRAMED.replace('#!/bin/sh', '#!/bin/bash'))
  expect(hookEvidence(root, local).hook4[0]?.message).toContain('must start with `#!/bin/sh`')

  addHook(root, 0o755, 'pre-commit', `${FRAMED}echo "retry with git commit --no-verify"\n`)
  expect(hookEvidence(root, local).hook4[0]?.message).toContain('suggests `--no-verify`')

  addHook(root, 0o755, 'pre-commit', FRAMED)
  addHook(root, 0o755, 'commit-msg', '#!/bin/sh\ncommitlint --edit "$1" || exit 1\n')
  const outcomes = hookEvidence(root, local).hook4
  expect(outcomes.map((outcome) => outcome.status)).toEqual(['PASS', 'VIOLATION'])
  expect(outcomes[1]?.subject).toBe('.githooks/commit-msg')
})

test('HOOK-4 requires a refusal test for every external tool, conditional branches included', () => {
  const root = repository()
  addHook(
    root,
    0o755,
    'pre-commit',
    `${FRAMED}if git diff --cached --quiet -- '*.ts'; then :; else tsc --noEmit || exit 1; fi\n`
  )
  expect(hookEvidence(root, local).hook4[0]?.message).toContain('calls `tsc` without testing for it')

  const listed = FRAMED.replace(
    'if ! command -v ki >/dev/null 2>&1; then',
    'for tool in ki tsc; do\n  if ! command -v "$tool" >/dev/null 2>&1; then missing="$missing $tool"; fi\ndone\nif [ -n "$missing" ]; then'
  )
  const helpers = `staged() { git diff --cached --name-only; }\nif staged | grep -q '\\.ts$'; then tsc --noEmit || exit 1; fi\nscripts/check --quiet || exit 1\necho "run \`bun install\` first" >&2\n`
  addHook(root, 0o755, 'pre-commit', `${listed}${helpers}`)
  expect(hookEvidence(root, local).hook4[0]?.status).toBe('PASS')
})

test('HOOK-5 names every Husky remnant and passes once Husky is gone', () => {
  const root = repository()
  expect(hookEvidence(root, local).hook5[0]?.status).toBe('PASS')

  writeFileSync(
    join(root, 'package.json'),
    JSON.stringify({
      scripts: { prepare: 'husky && git config core.hooksPath .githooks' },
      devDependencies: { husky: '^9.1.7' }
    })
  )
  mkdirSync(join(root, '.husky', '_'), { recursive: true })
  writeFileSync(join(root, '.husky', 'pre-commit'), 'bunx lint-staged || exit 1\n')
  git(root, 'add', '.husky/pre-commit')
  addHook(root, 0o755, 'pre-commit', `${FRAMED}sh "$root/.husky/pre-commit" "$@" || exit 1\n`)
  const messages = hookEvidence(root, local).hook5.map((outcome) => outcome.message)
  expect(messages).toEqual([
    'tracked Husky files remain: .husky/pre-commit',
    'package.json still declares `husky`',
    'prepare calls Husky; use `git config core.hooksPath .githooks`',
    '.githooks/pre-commit delegates to .husky/; move the hook content into it',
    'untracked .husky/_ is left from a Husky install; remove it'
  ])
  expect(hookEvidence(root, { CI: 'true' }).hook5).toHaveLength(4)
})
