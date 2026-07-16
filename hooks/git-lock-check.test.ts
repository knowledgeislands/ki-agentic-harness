#!/usr/bin/env bun
/** Run-based safety and behaviour tests for `git-lock-check.sh`. */
import { spawnSync } from 'node:child_process'
import {
  chmodSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), 'git-lock-check.sh')

let failed = false
function check(label: string, condition: boolean): void {
  if (condition) console.log(`  \x1b[32mok\x1b[0m   ${label}`)
  else {
    failed = true
    console.log(`  \x1b[31mFAIL\x1b[0m ${label}`)
  }
}

function command(commandName: string, args: string[], cwd: string): ReturnType<typeof spawnSync> {
  return spawnSync(commandName, args, { cwd, encoding: 'utf8' })
}

function initRepo(root: string): string {
  mkdirSync(root, { recursive: true })
  const result = command('git', ['init', '--quiet'], root)
  if (result.status !== 0) throw new Error(result.stderr)
  return gitDir(root)
}

function gitDir(cwd: string): string {
  const result = command('git', ['rev-parse', '--absolute-git-dir'], cwd)
  if (result.status !== 0) throw new Error(result.stderr)
  return realpathSync(result.stdout.trim())
}

function run(cwd: string, input = '', extraEnv: Record<string, string> = {}): ReturnType<typeof spawnSync> {
  return spawnSync('bash', [SCRIPT], { cwd, input, encoding: 'utf8', env: { ...process.env, ...extraEnv } })
}

function temporaryRoot(label: string): string {
  return mkdtempSync(join(tmpdir(), `ki-git-lock-${label}-`))
}

function processInspectionWrappers(root: string): string {
  const wrappers = join(root, 'process inspection wrappers')
  mkdirSync(wrappers)
  const pgrep = join(wrappers, 'pgrep')
  const lsof = join(wrappers, 'lsof')
  writeFileSync(
    pgrep,
    `#!/usr/bin/env bash
status=\${FAKE_PGREP_STATUS:-0}
[ "$status" = 0 ] || exit "$status"
printf '%s\\n' "\${FAKE_GIT_PID:-4242}"
`
  )
  writeFileSync(
    lsof,
    `#!/usr/bin/env bash
case " $* " in
  *" -d cwd "*) printf 'p%s\\0\\nfcwd\\0n%s\\0\\n' "\${FAKE_GIT_PID:-4242}" "$FAKE_GIT_CWD" ;;
  *) exit "\${FAKE_LSOF_REPO_OPEN:-1}" ;;
esac
`
  )
  chmodSync(pgrep, 0o755)
  chmodSync(lsof, 0o755)
  return wrappers
}

// No repository and a clean repository are both quiet no-ops.
{
  const root = temporaryRoot('clean')
  try {
    const noRepo = run(root, '{ hostile: hook input is ignored }')
    check('outside a repository → exit 0', noRepo.status === 0)
    check('outside a repository → quiet', noRepo.stdout === '' && noRepo.stderr === '')

    initRepo(join(root, 'repo'))
    const clean = run(join(root, 'repo'), 'not json\n')
    check('clean repository → exit 0', clean.status === 0)
    check('clean repository → quiet', clean.stdout === '' && clean.stderr === '')
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

// Regular stale locks are removed from nested cwd, including hostile leaf names.
{
  const root = temporaryRoot('stale')
  try {
    const repo = join(root, 'repo with space')
    const actualGitDir = initRepo(repo)
    const nested = join(repo, 'nested', 'cwd')
    const refDir = join(actualGitDir, 'refs', 'heads', 'odd directory')
    mkdirSync(nested, { recursive: true })
    mkdirSync(refDir, { recursive: true })
    const indexLock = join(actualGitDir, 'index.lock')
    const hostileLock = join(refDir, 'space and\nnewline.lock')
    writeFileSync(indexLock, 'stale')
    writeFileSync(hostileLock, 'stale')
    const wrappers = processInspectionWrappers(root)
    const noGitProcess = { PATH: `${wrappers}:${process.env.PATH ?? ''}`, FAKE_PGREP_STATUS: '1', FAKE_GIT_CWD: repo }

    const first = run(nested, '', noGitProcess)
    check('stale locks → exit 0', first.status === 0)
    check('stale locks → root lock removed', !existsSync(indexLock))
    check('stale locks → newline/space lock removed', !existsSync(hostileLock))
    check('stale locks → one report per lock', first.stdout.split('Removed stale git lock:').length === 3)

    const second = run(nested, '', noGitProcess)
    check('repeat run → idempotent exit 0', second.status === 0)
    check('repeat run → no removal report', second.stdout === '')
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

// Symlink leaves and symlinked directories are neither traversed nor removed.
{
  const root = temporaryRoot('symlink')
  try {
    const repo = join(root, 'repo')
    const actualGitDir = initRepo(repo)
    const outside = join(root, 'outside')
    mkdirSync(outside)
    const target = join(outside, 'target')
    const outsideLock = join(outside, 'outside.lock')
    writeFileSync(target, 'keep target')
    writeFileSync(outsideLock, 'keep outside lock')
    const leaf = join(actualGitDir, 'symlink.lock')
    const directoryLink = join(actualGitDir, 'linked-directory')
    symlinkSync(target, leaf)
    symlinkSync(outside, directoryLink, 'dir')

    const result = run(repo)
    check('symlink cases → exit 0', result.status === 0)
    check('symlink lock leaf → preserved as symlink', lstatSync(leaf).isSymbolicLink())
    check('symlink lock leaf → outside target unchanged', readFileSync(target, 'utf8') === 'keep target')
    check('symlink directory → outside lock unchanged', readFileSync(outsideLock, 'utf8') === 'keep outside lock')
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

// Repository-specific process evidence vetoes deletion; unrelated Git does not.
{
  const root = temporaryRoot('active')
  try {
    const repo = join(root, 'repo')
    const otherRepo = join(root, 'other')
    const actualGitDir = initRepo(repo)
    initRepo(otherRepo)
    const lock = join(actualGitDir, 'index.lock')
    writeFileSync(lock, 'active')
    const wrappers = processInspectionWrappers(root)
    const wrapperEnv = { PATH: `${wrappers}:${process.env.PATH ?? ''}` }

    const whileActive = run(repo, '', { ...wrapperEnv, FAKE_GIT_CWD: realpathSync(repo) })
    check('relevant active Git → exit 0', whileActive.status === 0)
    check('relevant active Git → lock preserved', existsSync(lock))

    const whileUnrelated = run(repo, '', { ...wrapperEnv, FAKE_GIT_CWD: realpathSync(otherRepo) })
    check('unrelated active Git → stale lock removed', whileUnrelated.status === 0 && !existsSync(lock))

    writeFileSync(lock, 'uncertain')
    const inspectionFailure = run(repo, '', { ...wrapperEnv, FAKE_GIT_CWD: realpathSync(otherRepo), FAKE_PGREP_STATUS: '2' })
    check('process enumeration failure → exit 0', inspectionFailure.status === 0)
    check('process enumeration failure → fail-safe lock preservation', existsSync(lock))
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

// Linked worktrees use their own indirection target. A main-worktree run prunes
// linked-worktree and submodule administration directories from its scan.
{
  const root = temporaryRoot('worktree')
  try {
    const main = join(root, 'main repo')
    const commonGitDir = initRepo(main)
    command('git', ['config', 'user.email', 'test@example.invalid'], main)
    command('git', ['config', 'user.name', 'Hook Test'], main)
    writeFileSync(join(main, 'tracked'), 'tracked')
    command('git', ['add', 'tracked'], main)
    const commit = command('git', ['commit', '--quiet', '-m', 'fixture'], main)
    if (commit.status !== 0) throw new Error(commit.stderr)

    const linked = join(root, 'linked worktree')
    const add = command('git', ['worktree', 'add', '--quiet', '--detach', linked], main)
    if (add.status !== 0) throw new Error(add.stderr)
    const linkedGitDir = gitDir(linked)
    const nested = join(linked, 'nested')
    mkdirSync(nested)

    const linkedLock = join(linkedGitDir, 'index.lock')
    const commonLock = join(commonGitDir, 'common-only.lock')
    writeFileSync(linkedLock, 'stale linked')
    writeFileSync(commonLock, 'do not cross worktree boundary')
    const wrappers = processInspectionWrappers(root)

    const result = run(nested, '', {
      PATH: `${wrappers}:${process.env.PATH ?? ''}`,
      FAKE_PGREP_STATUS: '1',
      FAKE_GIT_CWD: realpathSync(linked)
    })
    check('linked worktree → exit 0', result.status === 0)
    check('linked worktree → own gitdir lock removed', !existsSync(linkedLock))
    check('linked worktree → common gitdir lock untouched', existsSync(commonLock))

    writeFileSync(linkedLock, 'do not cross from main')
    const submoduleGitDir = join(commonGitDir, 'modules', 'fixture')
    const submoduleLock = join(submoduleGitDir, 'index.lock')
    mkdirSync(submoduleGitDir, { recursive: true })
    writeFileSync(submoduleLock, 'do not cross into submodule')
    const mainResult = run(main, '', {
      PATH: `${wrappers}:${process.env.PATH ?? ''}`,
      FAKE_PGREP_STATUS: '1'
    })
    check('main worktree → exit 0', mainResult.status === 0)
    check('main worktree → own common-dir lock removed', !existsSync(commonLock))
    check('main worktree → linked-worktree lock untouched', existsSync(linkedLock))
    check('main worktree → submodule gitdir lock untouched', existsSync(submoduleLock))
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

if (failed) {
  console.log('\n\x1b[31mgit-lock-check.test.ts: failures\x1b[0m')
  process.exit(1)
}
console.log('\n\x1b[32mgit-lock-check.test.ts: all checks passed\x1b[0m')
