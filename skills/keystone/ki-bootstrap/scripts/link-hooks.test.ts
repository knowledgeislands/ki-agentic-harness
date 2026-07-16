#!/usr/bin/env bun
/** Run-based tests for mixed-event global hook installation. */
import { spawnSync } from 'node:child_process'
import {
  chmodSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readlinkSync,
  rmSync,
  symlinkSync,
  unlinkSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), 'link-hooks.ts')
const HARNESS_ROOT = resolve(dirname(SCRIPT), '..', '..', '..', '..')
const HOOKS_ROOT = join(HARNESS_ROOT, 'hooks')
const DECLARATIONS = [
  { name: 'plan-stamp.sh', event: 'PostToolUse', matcher: 'ExitPlanMode', timeout: 5 },
  { name: 'plan-sync.sh', event: 'PostToolUse', matcher: 'TodoWrite', timeout: 5 },
  { name: 'git-lock-check.sh', event: 'Stop', matcher: '*', timeout: 10 }
]

let failed = false
function check(label: string, condition: boolean): void {
  if (condition) console.log(`  \x1b[32mok\x1b[0m   ${label}`)
  else {
    failed = true
    console.log(`  \x1b[31mFAIL\x1b[0m ${label}`)
  }
}

function environment(): { root: string; home: string; settings: string; hooks: string } {
  const root = mkdtempSync(join(tmpdir(), 'ki-link-hooks-'))
  const home = join(root, 'home')
  const claude = join(home, '.claude')
  mkdirSync(claude, { recursive: true })
  return { root, home, settings: join(claude, 'settings.json'), hooks: join(claude, 'hooks') }
}

function run(home: string, ...args: string[]): ReturnType<typeof spawnSync> {
  return spawnSync('bun', [SCRIPT, ...args], {
    encoding: 'utf8',
    env: { ...process.env, HOME: home }
  })
}

function settings(path: string): Record<string, unknown> {
  return JSON.parse(readFileSync(path, 'utf8')) as Record<string, unknown>
}

function registration(data: Record<string, unknown>, event: string, matcher: string): unknown[] {
  const hooks = data.hooks as Record<string, unknown> | undefined
  const entries = Array.isArray(hooks?.[event]) ? (hooks[event] as unknown[]) : []
  const entry = entries.find(
    (candidate) => typeof candidate === 'object' && candidate !== null && (candidate as { matcher?: unknown }).matcher === matcher
  ) as { hooks?: unknown } | undefined
  return Array.isArray(entry?.hooks) ? entry.hooks : []
}

// Dry-run reports the complete operation without creating the target tree.
{
  const env = environment()
  try {
    rmSync(join(env.home, '.claude'), { recursive: true })
    const result = run(env.home, '--dry-run')
    check('dry-run → success', result.status === 0)
    check('dry-run → no target tree', !existsSync(join(env.home, '.claude')))
    check(
      'dry-run → names every hook',
      DECLARATIONS.every(({ name }) => result.stdout.includes(name))
    )
  } finally {
    rmSync(env.root, { recursive: true, force: true })
  }
}

// Install converges three symlinks and mixed-event settings while preserving
// unrelated settings, handlers, and matcher entries.
{
  const env = environment()
  try {
    const seed = {
      theme: 'dark',
      hooks: {
        PostToolUse: [{ matcher: 'Bash', hooks: [{ type: 'command', command: '/keep/post.sh', timeout: 7 }] }],
        Stop: [{ matcher: '*', hooks: [{ type: 'command', command: '/keep/stop.sh', timeout: 60 }] }]
      }
    }
    writeFileSync(env.settings, `${JSON.stringify(seed, null, 2)}\n`)
    chmodSync(env.settings, 0o600)

    const first = run(env.home)
    check('install → success', first.status === 0)
    for (const declaration of DECLARATIONS) {
      const link = join(env.hooks, declaration.name)
      check(`${declaration.name} → symlinked`, lstatSync(link).isSymbolicLink())
      check(`${declaration.name} → canonical source`, resolve(dirname(link), readlinkSync(link)) === join(HOOKS_ROOT, declaration.name))
    }

    const installed = settings(env.settings)
    check('settings → existing private mode preserved', (lstatSync(env.settings).mode & 0o777) === 0o600)
    check('settings → unrelated top-level key preserved', installed.theme === 'dark')
    check('settings → unrelated PostToolUse matcher preserved', registration(installed, 'PostToolUse', 'Bash').length === 1)
    check(
      'settings → existing Stop handler preserved',
      registration(installed, 'Stop', '*').some((handler) => (handler as { command?: unknown }).command === '/keep/stop.sh')
    )
    for (const declaration of DECLARATIONS) {
      const command = `$HOME/.claude/hooks/${declaration.name}`
      const handlers = registration(installed, declaration.event, declaration.matcher)
      check(
        `${declaration.event}(${declaration.matcher}) → exact ${declaration.name} handler`,
        handlers.some(
          (handler) =>
            typeof handler === 'object' &&
            handler !== null &&
            (handler as { type?: unknown }).type === 'command' &&
            (handler as { command?: unknown }).command === command &&
            (handler as { timeout?: unknown }).timeout === declaration.timeout
        )
      )
    }

    const afterFirst = readFileSync(env.settings, 'utf8')
    const second = run(env.home)
    check('re-run → success', second.status === 0)
    check('re-run → settings byte-stable', readFileSync(env.settings, 'utf8') === afterFirst)
    check('check → success after install', run(env.home, '--check').status === 0)

    const drifted = settings(env.settings)
    const stopHandler = registration(drifted, 'Stop', '*').find(
      (handler) => (handler as { command?: unknown }).command === '$HOME/.claude/hooks/git-lock-check.sh'
    ) as { timeout: number }
    stopHandler.timeout = 1
    writeFileSync(env.settings, `${JSON.stringify(drifted, null, 2)}\n`)
    check('check → fails on registration drift', run(env.home, '--check').status !== 0)
    check('install → repairs owned registration drift', run(env.home).status === 0 && run(env.home, '--check').status === 0)

    const gitLockLink = join(env.hooks, 'git-lock-check.sh')
    unlinkSync(gitLockLink)
    writeFileSync(gitLockLink, 'user-owned\n')
    check(
      'install → fails without replacing a real file',
      run(env.home).status !== 0 && readFileSync(gitLockLink, 'utf8') === 'user-owned\n'
    )
    check('check → rejects a real file in place of symlink', run(env.home, '--check').status !== 0)
  } finally {
    rmSync(env.root, { recursive: true, force: true })
  }
}

// Invalid JSON is rejected before any filesystem mutation.
{
  const env = environment()
  try {
    const invalid = '{not json\n'
    writeFileSync(env.settings, invalid)
    const result = run(env.home)
    check('invalid settings → non-zero', result.status !== 0)
    check('invalid settings → bytes preserved', readFileSync(env.settings, 'utf8') === invalid)
    check('invalid settings → no hook directory created', !existsSync(env.hooks))
  } finally {
    rmSync(env.root, { recursive: true, force: true })
  }
}

// Valid JSON with the wrong top-level shape is rejected before mutation.
for (const [label, value] of [
  ['array', '[]\n'],
  ['null', 'null\n'],
  ['string', '"settings"\n'],
  ['boolean', 'true\n'],
  ['number', '42\n']
] as const) {
  const env = environment()
  try {
    writeFileSync(env.settings, value)
    const result = run(env.home)
    check(`${label} settings → non-zero`, result.status !== 0)
    check(`${label} settings → bytes preserved`, readFileSync(env.settings, 'utf8') === value)
    check(`${label} settings → no hook directory created`, !existsSync(env.hooks))
  } finally {
    rmSync(env.root, { recursive: true, force: true })
  }
}

// A blocking real file prevents registration rather than activating an
// executable the harness does not own.
{
  const env = environment()
  try {
    mkdirSync(env.hooks)
    const blocking = join(env.hooks, 'git-lock-check.sh')
    writeFileSync(blocking, 'user-owned\n')
    writeFileSync(env.settings, '{}\n')
    const before = readFileSync(env.settings, 'utf8')
    const result = run(env.home)
    check('blocking real file → non-zero', result.status !== 0)
    check('blocking real file → settings bytes preserved', readFileSync(env.settings, 'utf8') === before)
    check('blocking real file → executable preserved', readFileSync(blocking, 'utf8') === 'user-owned\n')
  } finally {
    rmSync(env.root, { recursive: true, force: true })
  }
}

// Duplicate matcher entries converge to one owned handler without disturbing
// unrelated handlers in either entry.
{
  const env = environment()
  try {
    const duplicateSettings = {
      hooks: {
        Stop: [
          { matcher: '*', hooks: [{ type: 'command', command: '/keep/first.sh', timeout: 1 }] },
          {
            matcher: '*',
            hooks: [
              { type: 'command', command: '/keep/second.sh', timeout: 2 },
              { type: 'command', command: '$HOME/.claude/hooks/git-lock-check.sh', timeout: 1 },
              { type: 'command', command: '$HOME/.claude/hooks/git-lock-check.sh', timeout: 10 }
            ]
          }
        ]
      }
    }
    writeFileSync(env.settings, `${JSON.stringify(duplicateSettings, null, 2)}\n`)
    check('duplicate matcher entries → install success', run(env.home).status === 0)
    const converged = settings(env.settings)
    const stopEntries = ((converged.hooks as Record<string, unknown>).Stop as Array<{ hooks: unknown[] }>).flatMap((entry) => entry.hooks)
    const owned = stopEntries.filter((handler) => (handler as { command?: unknown }).command === '$HOME/.claude/hooks/git-lock-check.sh')
    check('duplicate matcher entries → one owned handler', owned.length === 1)
    check(
      'duplicate matcher entries → unrelated handlers preserved',
      stopEntries.some((handler) => (handler as { command?: unknown }).command === '/keep/first.sh') &&
        stopEntries.some((handler) => (handler as { command?: unknown }).command === '/keep/second.sh')
    )
    check('duplicate matcher entries → check succeeds', run(env.home, '--check').status === 0)
  } finally {
    rmSync(env.root, { recursive: true, force: true })
  }
}

// Symlinked settings are rejected without replacing the link or target.
{
  const env = environment()
  try {
    const target = join(env.root, 'settings-target.json')
    writeFileSync(target, '{}\n')
    symlinkSync(target, env.settings)
    const result = run(env.home)
    check('symlinked settings → non-zero', result.status !== 0)
    check('symlinked settings → link preserved', lstatSync(env.settings).isSymbolicLink())
    check('symlinked settings → target preserved', readFileSync(target, 'utf8') === '{}\n')
    check('symlinked settings → no hook directory created', !existsSync(env.hooks))
  } finally {
    rmSync(env.root, { recursive: true, force: true })
  }
}

// A dangling link is replaced, but its outside target is never created or touched.
{
  const env = environment()
  try {
    mkdirSync(env.hooks)
    const outside = join(env.root, 'outside-target')
    symlinkSync(outside, join(env.hooks, 'plan-stamp.sh'))
    check('dangling symlink → repaired', run(env.home).status === 0)
    check('dangling symlink → outside target untouched', !existsSync(outside))
  } finally {
    rmSync(env.root, { recursive: true, force: true })
  }
}

if (failed) {
  console.log('\n\x1b[31mlink-hooks.test.ts: failures\x1b[0m')
  process.exit(1)
}
console.log('\n\x1b[32mlink-hooks.test.ts: all checks passed\x1b[0m')
