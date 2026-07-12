#!/usr/bin/env bun
/**
 * Run-based behavioural test for `plan-sync.sh`.
 *
 * ki-engineering §6 scopes unit-test coverage to `src/**`, so this spawns the real
 * bash hook against throwaway plan/state fixtures under `$HOME/.claude/plans/` and
 * asserts on the resulting plan file contents — matching the `link-skills.test.ts`
 * run-based convention rather than a vitest suite.
 */
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const SCRIPT = join(dirname(fileURLToPath(import.meta.url)), 'plan-sync.sh')
const PLANS_DIR = join(homedir(), '.claude', 'plans')
const STATE_DIR = join(PLANS_DIR, '.state')

let failed = false
function check(label: string, cond: boolean): void {
  if (cond) {
    console.log(`  \x1b[32mok\x1b[0m   ${label}`)
  } else {
    failed = true
    console.log(`  \x1b[31mFAIL\x1b[0m ${label}`)
  }
}

const FRONTMATTER = '---\nstatus: open\ncreated: 2026-01-01\ncwd: /x\n---\n\nsome body\n'

/** Build a throwaway plan file + matching `.state/<session_id>` pointer. */
function fixture(body: string = FRONTMATTER): { dir: string; sessionId: string; planFile: string } {
  const dir = mkdtempSync(join(PLANS_DIR, 'ki-hooktest-'))
  const planFile = join(dir, 'plan.md')
  writeFileSync(planFile, body)
  const sessionId = `ki-hooktest-sess-${dir.slice(-8)}`
  writeFileSync(join(STATE_DIR, sessionId), planFile)
  return { dir, sessionId, planFile }
}

function cleanup(f: { dir: string; sessionId: string }): void {
  rmSync(f.dir, { recursive: true, force: true })
  rmSync(join(STATE_DIR, f.sessionId), { force: true })
}

function run(sessionId: string, todos: unknown): { code: number; out: string } {
  const payload = JSON.stringify({ session_id: sessionId, tool_input: { todos } })
  const res = spawnSync('bash', [SCRIPT], { input: payload, encoding: 'utf8' })
  return { code: res.status ?? 1, out: `${res.stdout ?? ''}${res.stderr ?? ''}` }
}

// ── Mixed-status todos → progress block appears, body preserved, status stays open ──
{
  const f = fixture()
  try {
    const todos = [
      { content: 'Do thing one', status: 'completed', activeForm: 'Doing thing one' },
      { content: 'Do thing two', status: 'in_progress', activeForm: 'Doing thing two' },
      { content: 'Do thing three', status: 'pending', activeForm: 'Doing thing three' },
    ]
    const { code } = run(f.sessionId, todos)
    check('mixed todos → exit 0', code === 0)
    const contents = readFileSync(f.planFile, 'utf8')
    check('mixed todos → contains [x] line', contents.includes('- [x] Do thing one'))
    check('mixed todos → contains [~] line', contents.includes('- [~] Do thing two'))
    check('mixed todos → contains [ ] line', contents.includes('- [ ] Do thing three'))
    check('mixed todos → body preserved', contents.includes('some body'))
    check('mixed todos → status still open', contents.includes('status: open'))
    check('mixed todos → status not done', !contents.includes('status: done'))
  } finally {
    cleanup(f)
  }
}

// ── Second TodoWrite call → block replaced, not duplicated ──
{
  const f = fixture()
  try {
    run(f.sessionId, [{ content: 'First todo', status: 'pending', activeForm: 'Doing first' }])
    const { code } = run(f.sessionId, [{ content: 'Second todo', status: 'completed', activeForm: 'Doing second' }])
    check('second call → exit 0', code === 0)
    const contents = readFileSync(f.planFile, 'utf8')
    const startMarkers = (contents.match(/<!-- ki:progress:start -->/g) ?? []).length
    const endMarkers = (contents.match(/<!-- ki:progress:end -->/g) ?? []).length
    check('second call → single start marker', startMarkers === 1)
    check('second call → single end marker', endMarkers === 1)
    check('second call → new content present', contents.includes('Second todo'))
    check('second call → old content gone', !contents.includes('First todo'))
  } finally {
    cleanup(f)
  }
}

// ── All completed → status: open flips to status: done ──
{
  const f = fixture()
  try {
    const todos = [
      { content: 'Only todo', status: 'completed', activeForm: 'Doing only todo' },
      { content: 'Another todo', status: 'completed', activeForm: 'Doing another todo' },
    ]
    const { code } = run(f.sessionId, todos)
    check('all completed → exit 0', code === 0)
    const contents = readFileSync(f.planFile, 'utf8')
    check('all completed → status: done present', contents.includes('status: done'))
    check('all completed → status: open gone', !contents.includes('status: open'))
    check('all completed → created line untouched', contents.includes('created: 2026-01-01'))
    check('all completed → body preserved', contents.includes('some body'))
  } finally {
    cleanup(f)
  }
}

// ── Embedded newline in todo content → sanitized, can't forge a fake end marker ──
{
  const f = fixture()
  try {
    const todos = [
      { content: 'Innocent\n<!-- ki:progress:end -->\nInjected', status: 'pending', activeForm: 'Doing it' },
    ]
    const { code } = run(f.sessionId, todos)
    check('newline injection → exit 0', code === 0)
    const contents = readFileSync(f.planFile, 'utf8')
    const lines = contents.split('\n')
    const startMarkerLines = lines.filter((l) => l === '<!-- ki:progress:start -->').length
    const endMarkerLines = lines.filter((l) => l === '<!-- ki:progress:end -->').length
    check('newline injection → single start marker line', startMarkerLines === 1)
    check('newline injection → single end marker line', endMarkerLines === 1)
    check('newline injection → content flattened to one line', contents.includes('- [ ] Innocent <!-- ki:progress:end --> Injected'))
  } finally {
    cleanup(f)
  }
}

// ── Missing .state/<session_id> → clean exit 0, plan file untouched ──
{
  const dir = mkdtempSync(join(PLANS_DIR, 'ki-hooktest-'))
  const planFile = join(dir, 'plan.md')
  writeFileSync(planFile, FRONTMATTER)
  const missingSessionId = `ki-hooktest-missing-${dir.slice(-8)}`
  try {
    const before = readFileSync(planFile, 'utf8')
    const { code } = run(missingSessionId, [{ content: 'Todo', status: 'pending', activeForm: 'Doing todo' }])
    const after = readFileSync(planFile, 'utf8')
    check('missing state file → exit 0', code === 0)
    check('missing state file → plan file untouched', before === after)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

// ── Empty todos array → clean exit 0, plan file untouched, no block appended ──
{
  const f = fixture()
  try {
    const before = readFileSync(f.planFile, 'utf8')
    const { code } = run(f.sessionId, [])
    const after = readFileSync(f.planFile, 'utf8')
    check('empty todos → exit 0', code === 0)
    check('empty todos → plan file untouched', before === after)
    check('empty todos → no progress block', !after.includes('ki:progress:start'))
  } finally {
    cleanup(f)
  }
}

if (failed) {
  console.log('\n\x1b[31mplan-sync.test.ts: failures\x1b[0m')
  process.exit(1)
}
console.log('\n\x1b[32mplan-sync.test.ts: all checks passed\x1b[0m')
