import { expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { chmodSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const script = resolve(import.meta.dir, 'coordinator-reminder.sh')
const line =
  'Coordinator: do not do the work directly; delegate every unit of work to a detached background agent and stay responsive. Answer this message within one short turn. It does not pre-empt work in flight: do not stop or disturb a running agent unless it names one.'

const root = mkdtempSync(join(tmpdir(), 'ki-coordinator-reminder-'))
const coordinating = join(root, 'capital')
const ordinary = join(root, 'ordinary')
mkdirSync(join(coordinating, '+', '_CHECKPOINTS'), { recursive: true })
mkdirSync(join(coordinating, 'Streams', 'Projects'), { recursive: true })
mkdirSync(ordinary, { recursive: true })
spawnSync('git', ['init', '--quiet'], { cwd: coordinating })

// `ps -o tty=` up the ancestry is the detachment signal; the wrapper fixes it so
// the suite does not depend on whether the test runner itself has a terminal.
// FAKE_TTY answers every process except FAKE_TTY_PID, which answers FAKE_TTY_AT_PID;
// FAKE_PPID is every process's parent.
const wrappers = join(root, 'wrappers')
mkdirSync(wrappers)
writeFileSync(
  join(wrappers, 'ps'),
  `#!/usr/bin/env bash
case " $* " in
  *" tty= "*) if [ "$4" = "\${FAKE_TTY_PID:-}" ]; then printf '%s\\n' "\${FAKE_TTY_AT_PID:-}"; else printf '%s\\n' "\${FAKE_TTY-ttys001}"; fi ;;
  *" ppid= "*) printf '%s\\n' "\${FAKE_PPID:-1}" ;;
  *) exit 1 ;;
esac
`
)
chmodSync(join(wrappers, 'ps'), 0o755)

process.on('exit', () => rmSync(root, { recursive: true, force: true }))

interface Outcome {
  readonly status: number | null
  readonly stdout: string
  readonly context?: string
  readonly event?: string
}

const run = (input: string, extraEnv: Record<string, string> = {}): Outcome => {
  const env: Record<string, string> = { ...(process.env as Record<string, string>), ...extraEnv }
  delete env.KI_AGENT_RUN
  delete env.CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS
  Object.assign(env, extraEnv)
  env.PATH = `${wrappers}:${env.PATH ?? ''}`
  const result = spawnSync('bash', [script], { input, encoding: 'utf8', env, cwd: ordinary })
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

test('a Claude Code owner message in a coordinating thread gets the one line', () => {
  const outcome = run(claudePrompt(coordinating))
  expect(outcome.status).toBe(0)
  expect(outcome.event).toBe('UserPromptSubmit')
  expect(outcome.context).toBe(line)
})

test('a Codex owner message in a coordinating thread gets the same line', () => {
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

test('an ordinary interactive session gets nothing', () => {
  const outcome = run(claudePrompt(ordinary))
  expect(outcome.status).toBe(0)
  expect(outcome.stdout).toBe('')
})

test('a background child carrying the run marker gets nothing', () => {
  const outcome = run(claudePrompt(coordinating), { KI_AGENT_RUN: 'ways-of-working' })
  expect(outcome.status).toBe(0)
  expect(outcome.stdout).toBe('')
})

test('a Claude child from an older launcher is recognised by its print-mode ceiling', () => {
  const outcome = run(claudePrompt(coordinating), { CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS: '0' })
  expect(outcome.status).toBe(0)
  expect(outcome.stdout).toBe('')
})

test('a detached process with no controlling terminal anywhere above it gets nothing', () => {
  for (const tty of ['??', '?', '']) {
    const outcome = run(codexPrompt(coordinating), { FAKE_TTY: tty })
    expect(outcome.status).toBe(0)
    expect(outcome.stdout).toBe('')
  }
  const looping = run(codexPrompt(coordinating), { FAKE_TTY: '??', FAKE_PPID: '4242' })
  expect(looping).toEqual({ status: 0, stdout: '' })
})

test('a hook process started without the terminal finds it on an ancestor', () => {
  const outcome = run(claudePrompt(coordinating), { FAKE_TTY: '??', FAKE_PPID: '4242', FAKE_TTY_PID: '4242', FAKE_TTY_AT_PID: 'ttys001' })
  expect(outcome.status).toBe(0)
  expect(outcome.context).toBe(line)
})

test('the post-compaction session start injects the line again', () => {
  const outcome = run(sessionStart(coordinating, 'compact'))
  expect(outcome.status).toBe(0)
  expect(outcome.event).toBe('SessionStart')
  expect(outcome.context).toBe(line)
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
