#!/usr/bin/env bun
/**
 * Run-based behavioural test for `plan-stamp.sh`.
 *
 * Mirrors skills/ki-bootstrap/scripts/link-skills.test.ts's convention: spawnSync the real
 * script against throwaway fixtures rather than a vitest suite, since the script is a hook
 * entry point (stdin in, exit code out) not an importable module.
 *
 * Fixtures must live under the real `~/.claude/plans/` — the script's safety gate requires
 * that literal prefix, so a fixture under os.tmpdir() would be (correctly) rejected.
 */
import { spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), 'plan-stamp.sh')
const PLANS_DIR = join(homedir(), '.claude', 'plans')

let failed = false
function check(label: string, cond: boolean): void {
  if (cond) {
    console.log(`  \x1b[32mok\x1b[0m   ${label}`)
  } else {
    failed = true
    console.log(`  \x1b[31mFAIL\x1b[0m ${label}`)
  }
}

function run(input: string): { code: number; out: string } {
  const res = spawnSync('bash', [SCRIPT], { input, encoding: 'utf8' })
  return { code: res.status ?? 1, out: `${res.stdout ?? ''}${res.stderr ?? ''}` }
}

// ── Fresh plan file: stamped with correct frontmatter, original content preserved ──
const dir = mkdtempSync(join(PLANS_DIR, 'ki-hooktest-'))
try {
  const planFile = join(dir, 'plan.md')
  const original = '# My Plan\n\nDo the thing.\n'
  writeFileSync(planFile, original)

  const sessionId = 'sess-abc123'
  const cwd = '/Users/krisbrown/kis/example-repo'
  const payload = JSON.stringify({
    session_id: sessionId,
    cwd,
    tool_name: 'ExitPlanMode',
    tool_input: { planFilePath: planFile },
  })

  const { code } = run(payload)
  check('fresh plan → exit 0', code === 0)

  const stamped = readFileSync(planFile, 'utf8')
  check('stamped → starts with frontmatter fence', stamped.startsWith('---\n'))
  check('stamped → status: open', /^status: open$/m.test(stamped))
  check('stamped → created: YYYY-MM-DD', /^created: \d{4}-\d{2}-\d{2}$/m.test(stamped))
  check('stamped → cwd matches payload', stamped.includes(`cwd: ${cwd}`))
  check('stamped → original content preserved', stamped.includes(original.trim()))

  // ── Idempotency: re-running against the now-stamped file changes nothing ──
  const { code: code2 } = run(payload)
  check('re-run → exit 0', code2 === 0)
  const stampedAgain = readFileSync(planFile, 'utf8')
  check('re-run → no double frontmatter', stampedAgain === stamped)

  // ── State file recorded ──
  const stateFile = join(PLANS_DIR, '.state', sessionId)
  check('state file created', existsSync(stateFile))
  check('state file contains plan path', readFileSync(stateFile, 'utf8') === planFile)
  rmSync(stateFile, { force: true })
} finally {
  rmSync(dir, { recursive: true, force: true })
}

// ── Safety gate: planFilePath outside ~/.claude/plans/ is refused ──
{
  const evilFile = join('/tmp', `ki-hooktest-evil-${process.pid}.md`)
  try {
    const payload = JSON.stringify({
      session_id: 'sess-evil',
      cwd: '/tmp',
      tool_name: 'ExitPlanMode',
      tool_input: { planFilePath: evilFile },
    })
    const { code } = run(payload)
    check('outside plans dir → exit 0', code === 0)
    check('outside plans dir → file not created', !existsSync(evilFile))
  } finally {
    rmSync(evilFile, { force: true })
  }
}

// ── Safety gate: `../`-traversal escape inside a textual plans-dir prefix is refused ──
// The literal path string starts with `"$HOME/.claude/plans/"`, which a naive string-prefix
// check would accept — but it resolves (via the embedded `..` segments) to a real file
// outside the plans jail. Built by string concatenation, not path.join, so the `..`
// segments survive literally instead of being normalized away before the hook sees them.
{
  const realTarget = join('/tmp', `ki-hooktest-evil2-${process.pid}.md`)
  const originalContent = '# not a plan\n'
  writeFileSync(realTarget, originalContent)
  const smuggledPath = `${PLANS_DIR}/../../../tmp/ki-hooktest-evil2-${process.pid}.md`
  try {
    const payload = JSON.stringify({
      session_id: 'sess-traversal',
      cwd: '/tmp',
      tool_name: 'ExitPlanMode',
      tool_input: { planFilePath: smuggledPath },
    })
    const { code } = run(payload)
    check('traversal-smuggled path → exit 0', code === 0)
    check('traversal-smuggled path → target file untouched', readFileSync(realTarget, 'utf8') === originalContent)
  } finally {
    rmSync(realTarget, { force: true })
  }
}

// ── Missing/empty planFilePath: clean exit, no crash ──
{
  const payload = JSON.stringify({
    session_id: 'sess-empty',
    cwd: '/tmp',
    tool_name: 'ExitPlanMode',
    tool_input: {},
  })
  const { code } = run(payload)
  check('missing planFilePath → exit 0', code === 0)

  const stateFile = join(PLANS_DIR, '.state', 'sess-empty')
  check('missing planFilePath → no state file written', !existsSync(stateFile))
}

if (failed) {
  console.log('\n\x1b[31mplan-stamp.test.ts: failures\x1b[0m')
  process.exit(1)
}
console.log('\n\x1b[32mplan-stamp.test.ts: all checks passed\x1b[0m')
