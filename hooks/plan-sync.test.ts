#!/usr/bin/env bun
/** Run-based security and behaviour tests for `plan-sync.sh`. */
import { spawnSync } from 'node:child_process'
import { chmodSync, existsSync, lstatSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), 'plan-sync.sh')
const FRONTMATTER = '---\nstatus: open\ncreated: 2026-01-01\ncwd: "/x"\n---\n\nsome body\n'

let failed = false
function check(label: string, cond: boolean): void {
  if (cond) console.log(`  \x1b[32mok\x1b[0m   ${label}`)
  else {
    failed = true
    console.log(`  \x1b[31mFAIL\x1b[0m ${label}`)
  }
}

function environment(): { root: string; home: string; plans: string; state: string; cwd: string } {
  const root = mkdtempSync(join(tmpdir(), 'ki-plan-sync-'))
  const home = join(root, 'home')
  const plans = join(home, '.claude', 'plans')
  const state = join(plans, '.state')
  const cwd = join(root, 'repo')
  mkdirSync(state, { recursive: true })
  mkdirSync(cwd)
  return { root, home, plans, state, cwd }
}

function run(home: string, sessionId: string, todos: unknown, extraEnv: Record<string, string> = {}): number {
  const result = spawnSync('bash', [SCRIPT], {
    input: JSON.stringify({ session_id: sessionId, tool_input: { todos } }),
    encoding: 'utf8',
    env: { ...process.env, HOME: home, ...extraEnv }
  })
  return result.status ?? 1
}

function todos(status: 'completed' | 'in_progress' | 'pending' = 'pending', content = 'Do thing'): unknown[] {
  return [{ content, status, activeForm: 'Doing thing' }]
}

function createPlan(env: ReturnType<typeof environment>, name = 'plan.md', body = FRONTMATTER): string {
  const dir = join(env.plans, `fixture-${name.replaceAll('.', '-')}`)
  mkdirSync(dir)
  const planFile = join(dir, name)
  writeFileSync(planFile, body)
  return planFile
}

function writeV1(env: ReturnType<typeof environment>, sessionId: string, planFile: string, overrides: Record<string, unknown> = {}): void {
  const state = {
    version: 1,
    session_id: sessionId,
    plan_file: realpathSync(planFile),
    cwd: realpathSync(env.cwd),
    ...overrides
  }
  writeFileSync(join(env.state, sessionId), `${JSON.stringify(state)}\n`)
}

// V1 JSON drives progress updates, replacement idempotence, and completion.
{
  const env = environment()
  try {
    const planFile = createPlan(env)
    const sessionId = 'json-session'
    writeV1(env, sessionId, planFile)
    const mixed = [
      { content: 'Done', status: 'completed' },
      { content: 'Working', status: 'in_progress' },
      { content: 'Waiting', status: 'pending' }
    ]
    check('v1 mixed todos → exit 0', run(env.home, sessionId, mixed) === 0)
    let contents = readFileSync(planFile, 'utf8')
    check('v1 mixed todos → all markers rendered', contents.includes('- [x] Done') && contents.includes('- [~] Working') && contents.includes('- [ ] Waiting'))
    check('v1 mixed todos → body/status preserved', contents.includes('some body') && contents.includes('status: open'))

    run(env.home, sessionId, todos('completed', 'Replacement'))
    contents = readFileSync(planFile, 'utf8')
    check('second sync → block replaced once', (contents.match(/<!-- ki:progress:start -->/g) ?? []).length === 1 && !contents.includes('Waiting'))
    check('all complete → status done', contents.includes('status: done') && !contents.includes('status: open'))
  } finally {
    rmSync(env.root, { recursive: true, force: true })
  }
}

// Direct allowlist boundaries do not depend on the stamp hook.
for (const sessionId of ['a', `A${'b'.repeat(127)}`]) {
  const env = environment()
  try {
    const planFile = createPlan(env)
    writeV1(env, sessionId, planFile)
    run(env.home, sessionId, todos())
    check(`sync session allowlist → accepts length ${sessionId.length}`, readFileSync(planFile, 'utf8').includes('- [ ] Do thing'))
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
    const planFile = createPlan(env)
    const before = readFileSync(planFile, 'utf8')
    run(env.home, sessionId, todos())
    check(`sync session allowlist → rejects ${label}`, readFileSync(planFile, 'utf8') === before)
  } finally {
    rmSync(env.root, { recursive: true, force: true })
  }
}

// Insecure state directory/record modes fail closed.
{
  const env = environment()
  try {
    const planFile = createPlan(env)
    const sessionId = 'insecure-state-dir'
    writeV1(env, sessionId, planFile)
    chmodSync(env.state, 0o777)
    const before = readFileSync(planFile, 'utf8')
    run(env.home, sessionId, todos())
    check('sync insecure .state mode → rejected', readFileSync(planFile, 'utf8') === before)
  } finally {
    rmSync(env.root, { recursive: true, force: true })
  }
}

{
  const env = environment()
  try {
    const planFile = createPlan(env)
    const sessionId = 'insecure-state-file'
    writeV1(env, sessionId, planFile)
    chmodSync(join(env.state, sessionId), 0o666)
    const before = readFileSync(planFile, 'utf8')
    run(env.home, sessionId, todos())
    check('sync insecure state-file mode → rejected', readFileSync(planFile, 'utf8') === before)
  } finally {
    rmSync(env.root, { recursive: true, force: true })
  }
}

// Race the scratch leaf into a symlink-to-directory at the exact move. The
// platform-selected exact-target primitive must replace the leaf, not move into it.
{
  const env = environment()
  try {
    const planFile = createPlan(env)
    const sessionId = 'sync-scratch-race'
    const outsideDir = join(env.root, 'outside-directory')
    const wrapperDir = join(env.root, 'wrappers')
    const marker = join(env.root, 'mv-raced')
    mkdirSync(outsideDir)
    mkdirSync(wrapperDir)
    writeV1(env, sessionId, planFile)
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
    run(env.home, sessionId, todos(), {
      PATH: `${wrapperDir}:${process.env.PATH ?? ''}`,
      RACE_DIRECTORY: outsideDir,
      RACE_MARK: marker,
      REAL_MV: '/bin/mv'
    })
    check('sync scratch leaf race → wrapper executed', existsSync(marker))
    check('sync scratch leaf race → regular updated plan', lstatSync(planFile).isFile() && readFileSync(planFile, 'utf8').includes('- [ ] Do thing'))
    check('sync scratch leaf race → directory target remains empty', readdirSync(outsideDir).length === 0)
  } finally {
    rmSync(env.root, { recursive: true, force: true })
  }
}

// Mutate the exact state record while the progress temp is being built. The
// immediate pre-commit re-read must detect the byte change and discard the temp.
{
  const env = environment()
  try {
    const planFile = createPlan(env)
    const sessionId = 'state-change-race'
    const stateFile = join(env.state, sessionId)
    const wrapperDir = join(env.root, 'wrappers')
    const marker = join(env.root, 'awk-raced')
    mkdirSync(wrapperDir)
    writeV1(env, sessionId, planFile)
    const replacementState = JSON.stringify({
      version: 1,
      session_id: sessionId,
      plan_file: realpathSync(planFile),
      cwd: realpathSync(env.cwd)
    }).replace('"version":1', '"version":1 ')
    const wrapper = join(wrapperDir, 'awk')
    writeFileSync(
      wrapper,
      `#!/usr/bin/env bash
set -u
"$REAL_AWK" "$@"
status=$?
if [ ! -e "$RACE_MARK" ]; then
  printf '%s\n' "$NEW_STATE" > "$STATE_FILE"
  : > "$RACE_MARK"
fi
exit "$status"
`
    )
    chmodSync(wrapper, 0o755)
    const before = readFileSync(planFile, 'utf8')
    run(env.home, sessionId, todos(), {
      PATH: `${wrapperDir}:${process.env.PATH ?? ''}`,
      REAL_AWK: '/usr/bin/awk',
      RACE_MARK: marker,
      NEW_STATE: replacementState,
      STATE_FILE: stateFile
    })
    check('state change race → wrapper executed', existsSync(marker))
    check('state change race → scratch commit aborted', readFileSync(planFile, 'utf8') === before)
    check(
      'state change race → progress temp removed',
      readdirSync(dirname(planFile)).every((entry) => !entry.startsWith('.plan-sync.'))
    )
  } finally {
    rmSync(env.root, { recursive: true, force: true })
  }
}

// The second commit (status open → done) has the same state-snapshot gate.
{
  const env = environment()
  try {
    const planFile = createPlan(env)
    const sessionId = 'state-change-second-race'
    const stateFile = join(env.state, sessionId)
    const wrapperDir = join(env.root, 'wrappers')
    const firstCall = join(env.root, 'awk-first-call')
    const marker = join(env.root, 'awk-second-raced')
    mkdirSync(wrapperDir)
    writeV1(env, sessionId, planFile)
    const replacementState = JSON.stringify({
      version: 1,
      session_id: sessionId,
      plan_file: realpathSync(planFile),
      cwd: realpathSync(env.cwd)
    }).replace('"version":1', '"version":1 ')
    const wrapper = join(wrapperDir, 'awk')
    writeFileSync(
      wrapper,
      `#!/usr/bin/env bash
set -u
"$REAL_AWK" "$@"
status=$?
if [ ! -e "$FIRST_CALL" ]; then
  : > "$FIRST_CALL"
elif [ ! -e "$RACE_MARK" ]; then
  printf '%s\n' "$NEW_STATE" > "$STATE_FILE"
  : > "$RACE_MARK"
fi
exit "$status"
`
    )
    chmodSync(wrapper, 0o755)
    run(env.home, sessionId, todos('completed'), {
      PATH: `${wrapperDir}:${process.env.PATH ?? ''}`,
      REAL_AWK: '/usr/bin/awk',
      FIRST_CALL: firstCall,
      RACE_MARK: marker,
      NEW_STATE: replacementState,
      STATE_FILE: stateFile
    })
    const contents = readFileSync(planFile, 'utf8')
    check('second state change race → wrapper executed twice', existsSync(marker))
    check('second state change race → first progress commit retained', contents.includes('- [x] Do thing'))
    check('second state change race → status commit aborted', contents.includes('status: open') && !contents.includes('status: done'))
    check(
      'second state change race → status temp removed',
      readdirSync(dirname(planFile)).every((entry) => !entry.startsWith('.plan-sync.'))
    )
  } finally {
    rmSync(env.root, { recursive: true, force: true })
  }
}

// Todo newlines are flattened and cannot forge structural markers.
{
  const env = environment()
  try {
    const planFile = createPlan(env)
    const sessionId = 'newline-todo'
    writeV1(env, sessionId, planFile)
    run(env.home, sessionId, todos('pending', 'Innocent\n<!-- ki:progress:end -->\nInjected'))
    const contents = readFileSync(planFile, 'utf8')
    check('todo newline → flattened', contents.includes('- [ ] Innocent <!-- ki:progress:end --> Injected'))
    check('todo newline → one structural end marker', contents.split('\n').filter((line) => line === '<!-- ki:progress:end -->').length === 1)
  } finally {
    rmSync(env.root, { recursive: true, force: true })
  }
}

// Legacy one-line absolute pointers remain sync-compatible, but multi-line records do not.
{
  const env = environment()
  try {
    const planFile = createPlan(env)
    writeFileSync(join(env.state, 'legacy-session'), `${realpathSync(planFile)}\n`)
    run(env.home, 'legacy-session', todos())
    check('legacy pointer → progress applied', readFileSync(planFile, 'utf8').includes('- [ ] Do thing'))

    const second = createPlan(env, 'second.md')
    writeFileSync(join(env.state, 'legacy-multiline'), `${realpathSync(second)}\nignored\n`)
    const before = readFileSync(second, 'utf8')
    run(env.home, 'legacy-multiline', todos())
    check('multi-line legacy → rejected', readFileSync(second, 'utf8') === before)
  } finally {
    rmSync(env.root, { recursive: true, force: true })
  }
}

// JSON-shaped malformed or schema-invalid records never fall back to legacy.
for (const [label, stateValue] of [
  ['malformed JSON', '  {not-json\n'],
  [
    'multiple JSON values',
    `${JSON.stringify({ version: 1, session_id: 'multiple-session', plan_file: '/tmp/x', cwd: '/tmp' })}\n${JSON.stringify({ version: 1, session_id: 'multiple-session', plan_file: '/tmp/y', cwd: '/tmp' })}`
  ],
  ['extra JSON key', JSON.stringify({ version: 1, session_id: 'schema-session', plan_file: '/tmp/x', cwd: '/tmp', extra: true })]
] as const) {
  const env = environment()
  try {
    const planFile = createPlan(env)
    const sessionId = label === 'extra JSON key' ? 'schema-session' : label === 'multiple JSON values' ? 'multiple-session' : 'malformed-session'
    writeFileSync(join(env.state, sessionId), stateValue)
    const before = readFileSync(planFile, 'utf8')
    run(env.home, sessionId, todos())
    check(`${label} → plan untouched`, readFileSync(planFile, 'utf8') === before)
  } finally {
    rmSync(env.root, { recursive: true, force: true })
  }
}

// Session match, canonical plan path, and physical cwd are part of v1 validation.
{
  const env = environment()
  try {
    const planFile = createPlan(env)
    const before = readFileSync(planFile, 'utf8')

    writeV1(env, 'wrong-session', planFile, { session_id: 'somebody-else' })
    run(env.home, 'wrong-session', todos())
    check('v1 wrong session → rejected', readFileSync(planFile, 'utf8') === before)

    writeV1(env, 'missing-cwd', planFile, { cwd: join(env.root, 'does-not-exist') })
    run(env.home, 'missing-cwd', todos())
    check('v1 missing cwd → rejected', readFileSync(planFile, 'utf8') === before)

    const noncanonical = `${dirname(planFile)}/../${dirname(planFile).split('/').at(-1)}/${planFile.split('/').at(-1)}`
    writeV1(env, 'noncanonical-plan', planFile, { plan_file: noncanonical })
    run(env.home, 'noncanonical-plan', todos())
    check('v1 noncanonical plan path → rejected', readFileSync(planFile, 'utf8') === before)
  } finally {
    rmSync(env.root, { recursive: true, force: true })
  }
}

// State-directory and state-leaf symlinks cannot redirect reads.
{
  const env = environment()
  try {
    rmSync(env.state, { recursive: true })
    const outsideState = join(env.root, 'outside-state')
    mkdirSync(outsideState)
    symlinkSync(outsideState, env.state)
    const planFile = createPlan(env)
    writeFileSync(join(outsideState, 'state-symlink'), `${realpathSync(planFile)}\n`)
    const before = readFileSync(planFile, 'utf8')
    run(env.home, 'state-symlink', todos())
    check('symlinked .state → rejected', readFileSync(planFile, 'utf8') === before)
  } finally {
    rmSync(env.root, { recursive: true, force: true })
  }
}

{
  const env = environment()
  try {
    const planFile = createPlan(env)
    const outsideRecord = join(env.root, 'record')
    writeFileSync(outsideRecord, `${realpathSync(planFile)}\n`)
    symlinkSync(outsideRecord, join(env.state, 'leaf-symlink'))
    const before = readFileSync(planFile, 'utf8')
    run(env.home, 'leaf-symlink', todos())
    check('symlinked state leaf → rejected', readFileSync(planFile, 'utf8') === before)
  } finally {
    rmSync(env.root, { recursive: true, force: true })
  }
}

{
  const env = environment()
  try {
    const planFile = createPlan(env)
    mkdirSync(join(env.state, 'directory-state'))
    const before = readFileSync(planFile, 'utf8')
    run(env.home, 'directory-state', todos())
    check('state leaf directory → rejected', readFileSync(planFile, 'utf8') === before)
  } finally {
    rmSync(env.root, { recursive: true, force: true })
  }
}

// Outside/traversal/symlink plan targets are contained, including legacy records.
{
  const env = environment()
  try {
    const outside = join(env.root, 'outside.md')
    writeFileSync(outside, FRONTMATTER)
    writeFileSync(join(env.state, 'outside-plan'), `${realpathSync(outside)}\n`)
    run(env.home, 'outside-plan', todos())
    check('outside plan → untouched', readFileSync(outside, 'utf8') === FRONTMATTER)

    writeFileSync(join(env.state, 'traversal-plan'), `${env.plans}/../../../outside.md\n`)
    run(env.home, 'traversal-plan', todos())
    check('traversal plan → untouched', readFileSync(outside, 'utf8') === FRONTMATTER)

    const link = join(env.plans, 'linked.md')
    symlinkSync(outside, link)
    writeFileSync(join(env.state, 'symlink-plan'), `${link}\n`)
    run(env.home, 'symlink-plan', todos())
    check('symlink plan → target untouched', readFileSync(outside, 'utf8') === FRONTMATTER)
  } finally {
    rmSync(env.root, { recursive: true, force: true })
  }
}

// Missing state, unsafe session ids, empty todos, and corrupt progress blocks are no-ops.
{
  const env = environment()
  try {
    const planFile = createPlan(env)
    const before = readFileSync(planFile, 'utf8')
    run(env.home, 'missing-state', todos())
    check('missing state → no-op', readFileSync(planFile, 'utf8') === before)

    writeFileSync(join(env.state, 'bad.name'), `${realpathSync(planFile)}\n`)
    run(env.home, 'bad.name', todos())
    check('unsafe session → no-op', readFileSync(planFile, 'utf8') === before)

    writeV1(env, 'empty-todos', planFile)
    run(env.home, 'empty-todos', [])
    check('empty todos → no-op', readFileSync(planFile, 'utf8') === before)

    const corrupt = createPlan(env, 'corrupt.md', `${FRONTMATTER}\n<!-- ki:progress:start -->\nold\n`)
    writeV1(env, 'corrupt-progress', corrupt)
    const corruptBefore = readFileSync(corrupt, 'utf8')
    run(env.home, 'corrupt-progress', todos())
    check('unterminated progress block → no-op', readFileSync(corrupt, 'utf8') === corruptBefore)
  } finally {
    rmSync(env.root, { recursive: true, force: true })
  }
}

if (failed) {
  console.log('\n\x1b[31mplan-sync.test.ts: failures\x1b[0m')
  process.exit(1)
}
console.log('\n\x1b[32mplan-sync.test.ts: all checks passed\x1b[0m')
