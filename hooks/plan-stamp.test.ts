#!/usr/bin/env bun
/** Run-based security and behaviour tests for `plan-stamp.sh`. */
import { spawnSync } from 'node:child_process'
import { chmodSync, existsSync, lstatSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), 'plan-stamp.sh')

let failed = false
function check(label: string, cond: boolean): void {
  if (cond) console.log(`  \x1b[32mok\x1b[0m   ${label}`)
  else {
    failed = true
    console.log(`  \x1b[31mFAIL\x1b[0m ${label}`)
  }
}

function environment(): { root: string; home: string; plans: string; state: string } {
  const root = mkdtempSync(join(tmpdir(), 'ki-plan-stamp-'))
  const home = join(root, 'home')
  const plans = join(home, '.claude', 'plans')
  const state = join(plans, '.state')
  mkdirSync(plans, { recursive: true })
  return { root, home, plans, state }
}

function run(home: string, payload: unknown, extraEnv: Record<string, string> = {}): number {
  const result = spawnSync('bash', [SCRIPT], {
    input: JSON.stringify(payload),
    encoding: 'utf8',
    env: { ...process.env, HOME: home, ...extraEnv }
  })
  return result.status ?? 1
}

function payload(sessionId: string, planFile: string, cwd: string): unknown {
  return {
    session_id: sessionId,
    cwd,
    tool_name: 'ExitPlanMode',
    tool_input: { planFilePath: planFile }
  }
}

// Fresh stamp: exact v1 provenance, JSON/YAML quoting, atomic private state.
{
  const env = environment()
  try {
    const planDir = join(env.plans, 'with space')
    const cwd = join(env.root, 'repo space "quoted":#\nline')
    mkdirSync(planDir)
    mkdirSync(cwd)
    const planFile = join(planDir, 'plan.md')
    const original = '# My Plan\n\nDo the thing.\n'
    writeFileSync(planFile, original)

    const sessionId = 'sess-abc123'
    check('fresh plan → exit 0', run(env.home, payload(sessionId, planFile, cwd)) === 0)
    const stamped = readFileSync(planFile, 'utf8')
    const physicalCwd = realpathSync(cwd)
    const closingFence = stamped.indexOf('\n---\n', 4)
    const frontmatter = Bun.YAML.parse(stamped.slice(4, closingFence)) as Record<string, unknown>
    check('stamp → frontmatter/status/date', stamped.startsWith('---\nstatus: open\n') && /^created: \d{4}-\d{2}-\d{2}$/m.test(stamped))
    check('stamp → frontmatter parses as YAML', closingFence > 4 && frontmatter.status === 'open' && frontmatter.cwd === physicalCwd)
    check('stamp → cwd is one JSON-quoted YAML scalar', stamped.includes(`cwd: ${JSON.stringify(physicalCwd)}\n---\n`))
    check('stamp → hostile cwd cannot add a YAML line', !stamped.includes(`cwd: ${physicalCwd}\n`))
    check('stamp → original content preserved', stamped.includes(original.trim()))

    const stateFile = join(env.state, sessionId)
    const state = JSON.parse(readFileSync(stateFile, 'utf8')) as Record<string, unknown>
    check('state → exact v1 keys', JSON.stringify(Object.keys(state)) === JSON.stringify(['version', 'session_id', 'plan_file', 'cwd']))
    check(
      'state → exact provenance values',
      state.version === 1 && state.session_id === sessionId && state.plan_file === realpathSync(planFile) && state.cwd === physicalCwd
    )
    check('state → private file mode', (lstatSync(stateFile).mode & 0o077) === 0)
    check('state → created directory mode is 0700', (lstatSync(env.state).mode & 0o777) === 0o700)
    check('state → no temporary files remain', JSON.stringify(readdirSync(env.state)) === JSON.stringify([sessionId]))

    const before = readFileSync(planFile, 'utf8')
    check('re-run → exit 0', run(env.home, payload(sessionId, planFile, cwd)) === 0)
    check('re-run → idempotent scratch content', readFileSync(planFile, 'utf8') === before)
    check('re-run → valid state restored', existsSync(stateFile))
  } finally {
    rmSync(env.root, { recursive: true, force: true })
  }
}

// Existing state directories must not be writable by group or other. Current-user
// ownership is also enforced by the hook but cannot be changed in an unprivileged test.
{
  const env = environment()
  try {
    mkdirSync(env.state)
    chmodSync(env.state, 0o777)
    const planFile = join(env.plans, 'plan.md')
    writeFileSync(planFile, '# Plan\n')
    run(env.home, payload('insecure-state-dir', planFile, env.root))
    check('insecure existing .state mode → scratch untouched', readFileSync(planFile, 'utf8') === '# Plan\n')
    check('insecure existing .state mode → no state published', !existsSync(join(env.state, 'insecure-state-dir')))
  } finally {
    rmSync(env.root, { recursive: true, force: true })
  }
}

// Race the scratch destination into a symlink-to-directory at the exact move.
// The selected BSD/GNU no-follow primitive must replace the leaf, never move into it.
{
  const env = environment()
  try {
    const planFile = join(env.plans, 'race-plan.md')
    const outsideDir = join(env.root, 'outside-directory')
    const wrapperDir = join(env.root, 'wrappers')
    const marker = join(env.root, 'mv-raced')
    mkdirSync(outsideDir)
    mkdirSync(wrapperDir)
    writeFileSync(planFile, '# Race Plan\n')
    const wrapper = join(wrapperDir, 'mv')
    writeFileSync(
      wrapper,
      `#!/usr/bin/env bash
set -eu
destination=
for argument in "$@"; do destination=$argument; done
if [ ! -e "$RACE_MARK" ]; then
  rm -f -- "$destination"
  ln -s "$RACE_DIRECTORY" "$destination"
  : > "$RACE_MARK"
fi
exec "$REAL_MV" "$@"
`
    )
    chmodSync(wrapper, 0o755)
    run(env.home, payload('scratch-race', planFile, env.root), {
      PATH: `${wrapperDir}:${process.env.PATH ?? ''}`,
      RACE_DIRECTORY: outsideDir,
      RACE_MARK: marker,
      REAL_MV: '/bin/mv'
    })
    check('scratch leaf race → wrapper executed', existsSync(marker))
    check('scratch leaf race → destination is a regular stamped file', lstatSync(planFile).isFile() && readFileSync(planFile, 'utf8').startsWith('---\n'))
    check('scratch leaf race → directory target remains empty', readdirSync(outsideDir).length === 0)
  } finally {
    rmSync(env.root, { recursive: true, force: true })
  }
}

// Race state publication with a symlink-to-directory leaf. Exclusive hard-link
// publication must fail without creating a file inside or overwriting the leaf.
{
  const env = environment()
  try {
    const sessionId = 'state-publish-race'
    const planFile = join(env.plans, 'state-race.md')
    const outsideDir = join(env.root, 'outside-state-directory')
    const wrapperDir = join(env.root, 'wrappers')
    const marker = join(env.root, 'ln-raced')
    mkdirSync(outsideDir)
    mkdirSync(wrapperDir)
    writeFileSync(planFile, '# State Race\n')
    const wrapper = join(wrapperDir, 'ln')
    writeFileSync(
      wrapper,
      `#!/usr/bin/env bash
set -eu
destination=
for argument in "$@"; do destination=$argument; done
if [ ! -e "$RACE_MARK" ]; then
  "$REAL_LN" -s "$RACE_DIRECTORY" "$destination"
  : > "$RACE_MARK"
fi
exec "$REAL_LN" "$@"
`
    )
    chmodSync(wrapper, 0o755)
    const stateFile = join(env.state, sessionId)
    run(env.home, payload(sessionId, planFile, env.root), {
      PATH: `${wrapperDir}:${process.env.PATH ?? ''}`,
      RACE_DIRECTORY: outsideDir,
      RACE_MARK: marker,
      REAL_LN: '/bin/ln'
    })
    check('state leaf race → wrapper executed', existsSync(marker))
    check('state leaf race → planted leaf not followed', lstatSync(stateFile).isSymbolicLink() && readdirSync(outsideDir).length === 0)
    check('state leaf race → no temporary file remains', readdirSync(env.state).length === 1)
  } finally {
    rmSync(env.root, { recursive: true, force: true })
  }
}

// Allowlist boundaries: one and 128 safe bytes pass; unsafe names fail closed.
for (const sessionId of ['a', `A${'b'.repeat(127)}`]) {
  const env = environment()
  try {
    const planFile = join(env.plans, `${sessionId.length}.md`)
    writeFileSync(planFile, '# Plan\n')
    check(
      `session allowlist → accepts length ${sessionId.length}`,
      run(env.home, payload(sessionId, planFile, env.root)) === 0 && existsSync(join(env.state, sessionId))
    )
  } finally {
    rmSync(env.root, { recursive: true, force: true })
  }
}

for (const [label, sessionId] of [
  ['empty', ''],
  ['dot', '.'],
  ['dot-dot', '..'],
  ['separator', 'bad/name'],
  ['leading underscore', '_bad'],
  ['punctuation', 'bad.name'],
  ['newline', 'bad\nname'],
  ['trailing newline', 'badname\n'],
  ['overlong', `a${'b'.repeat(128)}`]
] as const) {
  const env = environment()
  try {
    const planFile = join(env.plans, 'plan.md')
    writeFileSync(planFile, '# Plan\n')
    run(env.home, payload(sessionId, planFile, env.root))
    check(`session allowlist → rejects ${label}`, readFileSync(planFile, 'utf8') === '# Plan\n' && !existsSync(env.state))
  } finally {
    rmSync(env.root, { recursive: true, force: true })
  }
}

// A safe session is invalidated before a later event can fail plan/cwd validation.
{
  const env = environment()
  try {
    const planFile = join(env.plans, 'plan.md')
    const outside = join(env.root, 'outside.md')
    writeFileSync(planFile, '# Plan\n')
    writeFileSync(outside, '# Outside\n')
    run(env.home, payload('stale-session', planFile, env.root))
    const stateFile = join(env.state, 'stale-session')
    check('stale invalidation fixture → state exists', existsSync(stateFile))
    run(env.home, payload('stale-session', outside, env.root))
    check('rejected stamp → prior state removed', !existsSync(stateFile))
    check('rejected stamp → outside file untouched', readFileSync(outside, 'utf8') === '# Outside\n')
  } finally {
    rmSync(env.root, { recursive: true, force: true })
  }
}

// `.state` may not redirect writes through a symlink.
{
  const env = environment()
  try {
    const outsideState = join(env.root, 'outside-state')
    mkdirSync(outsideState)
    symlinkSync(outsideState, env.state)
    const planFile = join(env.plans, 'plan.md')
    writeFileSync(planFile, '# Plan\n')
    run(env.home, payload('symlink-state', planFile, env.root))
    check('symlinked .state → plan untouched', readFileSync(planFile, 'utf8') === '# Plan\n')
    check('symlinked .state → no escaped write', !existsSync(join(outsideState, 'symlink-state')))
  } finally {
    rmSync(env.root, { recursive: true, force: true })
  }
}

// A leaf symlink is invalidated without following it, then replaced by v1 state.
{
  const env = environment()
  try {
    mkdirSync(env.state)
    const outside = join(env.root, 'outside-state-file')
    writeFileSync(outside, 'do not replace\n')
    symlinkSync(outside, join(env.state, 'leaf-session'))
    const planFile = join(env.plans, 'plan.md')
    writeFileSync(planFile, '# Plan\n')
    run(env.home, payload('leaf-session', planFile, env.root))
    check('state leaf symlink → external target untouched', readFileSync(outside, 'utf8') === 'do not replace\n')
    check('state leaf symlink → replaced by regular v1 state', !lstatSync(join(env.state, 'leaf-session')).isSymbolicLink())
  } finally {
    rmSync(env.root, { recursive: true, force: true })
  }
}

// A directory at the state leaf cannot be invalidated atomically, so stamping stops.
{
  const env = environment()
  try {
    mkdirSync(env.state)
    mkdirSync(join(env.state, 'directory-session'))
    const planFile = join(env.plans, 'plan.md')
    writeFileSync(planFile, '# Plan\n')
    run(env.home, payload('directory-session', planFile, env.root))
    check('state leaf directory → scratch untouched', readFileSync(planFile, 'utf8') === '# Plan\n')
    check('state leaf directory → no nested publish', lstatSync(join(env.state, 'directory-session')).isDirectory())
  } finally {
    rmSync(env.root, { recursive: true, force: true })
  }
}

// Traversal, symlink targets, bad cwd, and missing paths all fail closed.
{
  const env = environment()
  try {
    const outside = join(env.root, 'outside.md')
    writeFileSync(outside, '# Outside\n')
    const smuggled = `${env.plans}/../../../outside.md`
    run(env.home, payload('traversal', smuggled, env.root))
    check('traversal-smuggled path → target untouched', readFileSync(outside, 'utf8') === '# Outside\n')

    const link = join(env.plans, 'linked.md')
    symlinkSync(outside, link)
    run(env.home, payload('plan-symlink', link, env.root))
    check('symlink plan → target untouched', readFileSync(outside, 'utf8') === '# Outside\n')

    const planFile = join(env.plans, 'plan.md')
    writeFileSync(planFile, '# Plan\n')
    run(env.home, payload('bad-cwd', planFile, 'relative/path'))
    check('relative cwd → scratch untouched and no state', readFileSync(planFile, 'utf8') === '# Plan\n' && !existsSync(join(env.state, 'bad-cwd')))

    run(env.home, { session_id: 'missing-plan', cwd: env.root, tool_input: {} })
    check('missing plan path → no state', !existsSync(join(env.state, 'missing-plan')))
  } finally {
    rmSync(env.root, { recursive: true, force: true })
  }
}

if (failed) {
  console.log('\n\x1b[31mplan-stamp.test.ts: failures\x1b[0m')
  process.exit(1)
}
console.log('\n\x1b[32mplan-stamp.test.ts: all checks passed\x1b[0m')
