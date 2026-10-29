import { expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { markedBlock } from '../skills/change-management/ki-coordination/scripts/generate/index.ts'

const script = resolve(import.meta.dir, 'coordinator-reminder.sh')
const line = markedBlock(
  readFileSync(resolve(import.meta.dir, '../skills/change-management/ki-coordination/references/standards-coordination.md'), 'utf8'),
  'source',
  'hook-line'
).body
const pointer = markedBlock(
  readFileSync(resolve(import.meta.dir, '../skills/change-management/ki-coordination/references/standards-coordination.md'), 'utf8'),
  'source',
  'hook-pointer'
).body
const root = mkdtempSync(join(tmpdir(), 'ki-coordinator-reminder-'))
const coordinating = join(root, 'capital')
const undeclared = join(root, 'undeclared')
const ordinary = join(root, 'ordinary')
mkdirSync(join(coordinating, '+', '_CHECKPOINTS'), { recursive: true })
mkdirSync(join(coordinating, 'Streams', 'Projects'), { recursive: true })
writeFileSync(join(coordinating, '.ki.toml'), '[skills.ki-repo]\nrepository = "capital"\n\n[skills.ki-delegation]\n\n[skills.ki-coordination]\n\n[skills.ki-work-package]\n')
spawnSync('git', ['init', '--quiet'], { cwd: coordinating })
// Checkpoints without the declaration: the signal is the `[skills.ki-coordination]` table, not `+/_CHECKPOINTS/`.
mkdirSync(join(undeclared, '+', '_CHECKPOINTS'), { recursive: true })
writeFileSync(join(undeclared, '.ki.toml'), '[skills.ki-repo]\nrepository = "undeclared"\n\n[skills.ki-work-package]\n')
spawnSync('git', ['init', '--quiet'], { cwd: undeclared })
mkdirSync(ordinary, { recursive: true })

process.on('exit', () => rmSync(root, { recursive: true, force: true }))

interface Outcome {
  readonly status: number | null
  readonly stdout: string
  readonly context?: string
  readonly event?: string
}

const run = (input: string, extraEnv: Record<string, string> = {}, hook = script): Outcome => {
  const env: Record<string, string> = { ...(process.env as Record<string, string>), ...extraEnv }
  delete env.KI_AGENT_RUN
  delete env.CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS
  // The suite may itself run inside Claude Code; the runtime split is driven per test.
  delete env.CLAUDECODE
  Object.assign(env, extraEnv)
  const result = spawnSync('bash', [hook], { input, encoding: 'utf8', env, cwd: ordinary })
  const stdout = result.stdout ?? ''
  if (stdout.trim() === '') return { status: result.status, stdout }
  const parsed = JSON.parse(stdout) as { hookSpecificOutput: { hookEventName: string; additionalContext: string } }
  return {
    status: result.status,
    stdout,
    context: parsed.hookSpecificOutput.additionalContext,
    event: parsed.hookSpecificOutput.hookEventName
  }
}

const claudePrompt = (cwd: string, prompt = 'Where are we?'): string =>
  JSON.stringify({
    session_id: 'abc123',
    transcript_path: join(root, 'transcript.jsonl'),
    cwd,
    permission_mode: 'default',
    hook_event_name: 'UserPromptSubmit',
    prompt
  })

const codexPrompt = (cwd: string): string =>
  JSON.stringify({
    session_id: 'thread-1',
    transcript_path: join(root, 'rollout.jsonl'),
    cwd,
    hook_event_name: 'UserPromptSubmit',
    model: 'gpt-6.1-sol',
    permission_mode: 'default',
    prompt: 'Status?'
  })

const sessionStart = (cwd: string, source: string): string =>
  JSON.stringify({ session_id: 'abc123', transcript_path: join(root, 't.jsonl'), cwd, hook_event_name: 'SessionStart', source })

test('a Claude Code owner message in coordinating work gets the one line', () => {
  const outcome = run(claudePrompt(coordinating))
  expect(outcome.status).toBe(0)
  expect(outcome.event).toBe('UserPromptSubmit')
  expect(outcome.context).toBe(line)
})

test('a Codex owner message in coordinating work gets the same line', () => {
  const outcome = run(codexPrompt(coordinating))
  expect(outcome.status).toBe(0)
  expect(outcome.event).toBe('UserPromptSubmit')
  expect(outcome.context).toBe(line)
})

test('a subdirectory of a coordinating checkout still counts', () => {
  const outcome = run(claudePrompt(join(coordinating, 'Streams', 'Projects')))
  expect(outcome.status).toBe(0)
  expect(outcome.context).toBe(line)
})

test('a checkout holding checkpoints but not declaring ki-coordination gets nothing', () => {
  const outcome = run(claudePrompt(undeclared))
  expect(outcome.status).toBe(0)
  expect(outcome.stdout).toBe('')
  expect(run(claudePrompt(join(undeclared, '+', '_CHECKPOINTS'))).stdout).toBe('')
})

test('an ordinary interactive session gets nothing', () => {
  const outcome = run(claudePrompt(ordinary))
  expect(outcome.status).toBe(0)
  expect(outcome.stdout).toBe('')
})

test('a background child carrying the run marker gets nothing under either runtime', () => {
  const outcome = run(claudePrompt(coordinating), { KI_AGENT_RUN: 'ways-of-working', CLAUDECODE: '1' })
  expect(outcome.status).toBe(0)
  expect(outcome.stdout).toBe('')
  expect(run(codexPrompt(coordinating), { KI_AGENT_RUN: 'ways-of-working' })).toEqual({ status: 0, stdout: '' })
  expect(run(sessionStart(coordinating, 'compact'), { KI_AGENT_RUN: 'ways-of-working', CLAUDECODE: '1' })).toEqual({ status: 0, stdout: '' })
})

test('a Claude child from an older launcher is recognised by its print-mode ceiling', () => {
  const outcome = run(claudePrompt(coordinating), { CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS: '0' })
  expect(outcome.status).toBe(0)
  expect(outcome.stdout).toBe('')
})

test('the post-compaction session start injects the re-anchoring pointer', () => {
  const outcome = run(sessionStart(coordinating, 'compact'), { CLAUDECODE: '1' })
  expect(outcome.status).toBe(0)
  expect(outcome.event).toBe('SessionStart')
  expect(outcome.context).toBe(pointer)
  expect(run(sessionStart(coordinating, 'compact')).context).toBe(pointer)
})

test('other session starts and other events stay silent', () => {
  expect(run(sessionStart(coordinating, 'startup')).stdout).toBe('')
  expect(run(sessionStart(coordinating, 'resume')).stdout).toBe('')
  const other = JSON.stringify({ hook_event_name: 'PreToolUse', cwd: coordinating, tool_name: 'Bash' })
  expect(run(other).stdout).toBe('')
})

test('malformed, empty or cwd-less input fails open without blocking', () => {
  expect(run('{not json')).toEqual({ status: 0, stdout: '' })
  expect(run('')).toEqual({ status: 0, stdout: '' })
  const missingCwd = JSON.stringify({ hook_event_name: 'UserPromptSubmit', cwd: join(root, 'gone') })
  expect(run(missingCwd)).toEqual({ status: 0, stdout: '' })
})

test.each([0, 1, 6])('unknown selection ignores %s stale packages and reads no package or method history', (count) => {
  const checkout = join(root, `unknown-${count}`)
  mkdirSync(checkout)
  writeFileSync(join(checkout, '.ki.toml'), '[skills.ki-coordination]\n')
  const states = ['with-worker', 'with-supervisor', 'on-hold', 'finished', 'with-worker', 'with-worker']
  for (let index = 0; index < count; index++) {
    const folder = join(checkout, '+/_WORK', `ki.reg.stale-${index}`)
    mkdirSync(folder, { recursive: true })
    writeFileSync(join(folder, 'work.md'), `---\nlevel: ${index ? 'project' : 'regular'}\n---\n`)
    writeFileSync(join(folder, 'state.md'), `---\nstate: ${states[index]}\nmethod_read: stale\n---\n`)
  }
  // Bash records executed commands, including substitutions and expanded globs.
  // No command may enumerate/read packages or inspect method Git history.
  const trace = join(root, `unknown-${count}.trace`)
  const bashEnv = join(root, `unknown-${count}.bash-env`)
  writeFileSync(bashEnv, `set -T\ntrap 'printf "%s\\n" "$BASH_COMMAND" >> "$HOOK_TRACE"' DEBUG\n`)
  const env = { BASH_ENV: bashEnv, HOOK_TRACE: trace }
  for (const input of [claudePrompt(checkout), codexPrompt(checkout)]) {
    expect(run(input, env)).toEqual({ status: 0, stdout: `${JSON.stringify({hookSpecificOutput: {hookEventName: 'UserPromptSubmit', additionalContext: line}})}\n`, context: line, event: 'UserPromptSubmit' })
  }
  expect(run(sessionStart(checkout, 'compact'), env).context).toBe(pointer)
  expect(readFileSync(trace, 'utf8')).not.toMatch(/_WORK|method_read|git .*log|rev-parse --verify|awk/)
  expect(line.length).toBeLessThan(300)
  expect(pointer.length).toBeLessThan(350)
  expect(run(claudePrompt(checkout), { KI_AGENT_RUN: 'run' }).stdout).toBe('')
})

test.each(['null', '[]', '42', '"text"', '{"hook_event_name":{}}', '{"hook_event_name":"UserPromptSubmit","cwd":{}}'])('unusable payload %s stays silent', (input) => {
  expect(run(input)).toEqual({ status: 0, stdout: '' })
})
